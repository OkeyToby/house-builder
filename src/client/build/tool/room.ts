import { positionPartAtStart, serializePart } from "shared/parts";
import { floorHeight, storyHeight, wallWidth } from "../constants";
import { Tool, ToolContext } from "./tool";
import { TypedReplicatedStorage } from "shared/types";

const { CreatePartEvent } = game.GetService("ReplicatedStorage") as TypedReplicatedStorage

export class RoomTool implements Tool {
    public steps = 1

    public start(hit: RaycastResult, position: Vector3): ToolContext {
        const parts = [];

        for (let i = 0; i < 4; i++) {
            const part = new Instance("Part")
            part.Name = "Wall"
            part.Anchored = true
            part.Transparency = 0.5
            part.Size = new Vector3(0.1, storyHeight - floorHeight, 0.1)
            part.Position = position.add(new Vector3(0, 0.5, 0))
            part.Archivable = true
            part.Parent = game.Workspace

            parts.push(part)
        }

        return { start: position, previewParts: parts }
    }

    public heartbeat(_hit: RaycastResult, position: Vector3, _step: number, { previewParts, start }: ToolContext): void {
        const size = position.sub(start)
        const absSize = size.Abs()
        const min = start.Min(new Vector3(start.X + size.X, start.Y + size.Y, start.Z + size.Z))

        const wallHeight = storyHeight - floorHeight
        const [littleX, bigX, littleZ, bigZ] = previewParts
        const sizeX = new Vector3(absSize.X, wallHeight, wallWidth)
        const sizeZ = new Vector3(wallWidth, wallHeight, absSize.Z - wallWidth)

        positionPartAtStart(littleX, min, sizeX)
        positionPartAtStart(bigX, min.add(new Vector3(0, 0, absSize.Z)), sizeX)
        positionPartAtStart(littleZ, min.add(new Vector3(0, 0, wallWidth)), sizeZ)
        positionPartAtStart(bigZ, min.add(new Vector3(absSize.X - wallWidth, 0, wallWidth)), sizeZ)
    }

    public commit({ previewParts }: ToolContext): void {
        for (const part of previewParts) {
            CreatePartEvent.FireServer(serializePart(part))
            part.Destroy()
        }
    }

    public cancel(): void {}
}