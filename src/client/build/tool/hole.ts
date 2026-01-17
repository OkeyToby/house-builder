import { positionPartAtStart, serializePart } from "shared/parts"
import { Tool, ToolContext } from "./tool"
import { floorHeight, wallWidth } from "../constants"
import { TypedReplicatedStorage } from "shared/types"

const { CutHoleEvent } = game.GetService("ReplicatedStorage") as TypedReplicatedStorage
const collectionService = game.GetService("CollectionService")

interface HoleToolContext extends ToolContext {
    part: BasePart
    normal: Vector3
}

export class HoleTool implements Tool<HoleToolContext> {
    public steps = 1

    public start({ Instance: instance, Normal: normal }: RaycastResult, position: Vector3): HoleToolContext {
        const part = new Instance("Part")
        part.Name = "Wall"
        part.Anchored = true
        part.Transparency = 0.5
        part.Color = new Color3(1.0, 0, 0)
        part.Size = new Vector3(0.1, 0.1, 0.1)
        part.Position = position.add(new Vector3(0, 0.5, 0))
        part.Archivable = true
        part.Parent = game.Workspace

        return {
            start: position,
            previewParts: [part],
            part: instance,
            normal: normal
        }
    }

    public heartbeat(_hit: RaycastResult, position: Vector3, _step: number, { previewParts: [previewPart], start, normal }: HoleToolContext): void {
        const size = position.sub(start)

        if (normal.Abs() === Vector3.yAxis)
            positionPartAtStart(
                previewPart,
                start.sub(new Vector3(0, floorHeight / 2, 0)),
                new Vector3(size.X, floorHeight * 2, size.Z)
            )
        else if (normal.Abs() === Vector3.xAxis)
            positionPartAtStart(
                previewPart,
                start.sub(new Vector3(wallWidth / 2, 0, 0)),
                new Vector3(wallWidth * 2, size.Y, size.Z)
            )
        else positionPartAtStart(
                previewPart,
                start.sub(new Vector3(0, 0, wallWidth / 2)),
                new Vector3(size.X, size.Y, wallWidth * 2)
            )
    }

    public commit({ previewParts: [previewPart], part }: HoleToolContext): void {
        const id = collectionService.GetTags(part).find((tag) => tag.sub(0, 8) === "part-id-")
        previewPart.Destroy()

        if (!id)
            return

        CutHoleEvent.FireServer(string.sub(id, 9), serializePart(previewPart))
    }

    public cancel(): void {}
}