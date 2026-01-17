import { serializePart } from "shared/parts";
import { floorHeight, storyHeight, wallWidth } from "../constants";
import { Tool, ToolContext } from "./tool";
import { TypedReplicatedStorage } from "shared/types";

const { CreatePartEvent } = game.GetService("ReplicatedStorage") as TypedReplicatedStorage

export class WallTool implements Tool {
    public steps = 1;

    public start(hit: RaycastResult, position: Vector3): ToolContext {
        const part = new Instance("Part")
        part.Name = "Wall"
        part.Anchored = true
        part.Transparency = 0.5
        part.Size = new Vector3(0.1, storyHeight - floorHeight, 0.1)
        part.Position = position.add(new Vector3(0, 0.5, 0))
        part.Archivable = true
        part.Parent = game.Workspace

        return { start: position, previewParts: [part] }
    }

    public heartbeat(_hit: RaycastResult, position: Vector3, _step: number, { start, previewParts: [previewPart] }: ToolContext): void {
        const size = position.sub(start)
        const isX = math.abs(size.X) > math.abs(size.Z)
        const wallSize = new Vector3(
            isX ? size.X : wallWidth,
            storyHeight - floorHeight,
            isX ? wallWidth : size.Z
        )

        previewPart.Size = wallSize.Abs().Max(new Vector3(0.25, 0.25, 0.25))
        previewPart.Position = new Vector3(
            start.X + wallSize.X / 2,
            start.Y + wallSize.Y / 2,
            start.Z + wallSize.Z / 2
        )
    }

    public commit({ previewParts: [previewPart] }: ToolContext): void {
        CreatePartEvent.FireServer(serializePart(previewPart))
        previewPart.Destroy()
    }

    public cancel(): void {}
}