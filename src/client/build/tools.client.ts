import { roundToValue } from "shared/numbers";
import { Tool, ToolContext } from "./tool/tool";
import { WallTool } from "./tool/wall";
import { RoomTool } from "./tool/room";
import { HoleTool } from "./tool/hole";

const replicatedStorage = game.GetService("ReplicatedStorage")
const userInputService = game.GetService("UserInputService")
const { LocalPlayer: player } = game.GetService("Players")
const runService = game.GetService("RunService")

const { RaycastFilterType, PartType, KeyCode, ModifierKey } = Enum
const character = player.Character ?? player.CharacterAdded.Wait()
const toggleBuildMode = replicatedStorage.WaitForChild("ToggleBuildModeEvent") as RemoteEvent

let toolContext: ToolContext | undefined = undefined
let gridSelector: Part | undefined = undefined
let tool: Tool = new RoomTool()
let step = 0

export function getMousePosition(): [RaycastResult, Vector3] | undefined {
    const shiftDown = userInputService.IsKeyDown(KeyCode.LeftShift)
    const mouse = player.GetMouse()
    const ray = mouse.UnitRay

    const parameters = new RaycastParams()
    parameters.FilterType = RaycastFilterType.Exclude
    parameters.AddToFilter(character)
    parameters.AddToFilter(gridSelector!)

    if (toolContext)
        parameters.AddToFilter(toolContext.previewParts)

    const hit = game.Workspace.Raycast(ray.Origin, ray.Direction.mul(1000), parameters)

    if (hit) {
        const { X, Y, Z } = hit.Position
        return [hit, new Vector3(
            shiftDown ? roundToValue(X, 0.5) : math.round(X),
            hit.Normal.Abs() === Vector3.yAxis ? Y : (shiftDown ? roundToValue(Y, 0.5) : math.round(Y)),
            shiftDown ? roundToValue(Z, 0.5) : math.round(Z),
        )]
    }

    return undefined
}

userInputService.InputBegan.Connect((input) => {
    switch (input.KeyCode) {
        case KeyCode.R: {
            tool = input.IsModifierKeyDown(ModifierKey.Shift) ? new WallTool() : new RoomTool()
            break
        }
        case KeyCode.X: {
            tool = new HoleTool()
            break
        }
    }
})

toggleBuildMode.OnClientEvent.Connect((inBuildMode) => {
    if (typeIs(inBuildMode, "boolean") && inBuildMode) {
        gridSelector = new Instance("Part")
        gridSelector.Name = "GridSelector"
        gridSelector.Anchored = true
        gridSelector.Size = new Vector3(0.5, 0.5, 0.5)
        gridSelector.Shape = PartType.Ball
        gridSelector.Color = new Color3(1, 0, 0)
        gridSelector.CanCollide = false
        gridSelector.Parent = game.Workspace
    } else {
        if (gridSelector) {
            gridSelector.Destroy()
            gridSelector = undefined
        }

        if (toolContext) {
            for (const part of toolContext.previewParts)
                part.Destroy()

            toolContext = undefined
            step = 0
        }
    }
})

runService.Heartbeat.Connect(() => {
    if (!player.HasTag("BuildMode") || !gridSelector)
        return

    const result = getMousePosition()
    
    if (!result)
        return

    const [hit, position] = result
    gridSelector.CFrame = new CFrame(position)

    if (toolContext)
        tool.heartbeat(hit, position, step, toolContext)
})

player.GetMouse().Button1Down.Connect(() => {
    if (!player.HasTag("BuildMode"))
        return

    const result = getMousePosition()

    if (!result)
        return

    if (!toolContext) {
        const [hit, position] = result
        toolContext = tool.start(hit, position)
        step = 1
    } else {
        if (tool.steps > step)
            step++
        else {
            tool.commit(toolContext)
            toolContext = undefined
        }
    }
})