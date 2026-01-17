import { normalizeVector, vectorWithComponents } from "shared/vectors"

const runService = game.GetService("RunService")
const { LocalPlayer: player } = game.GetService("Players")
const userInputService = game.GetService("UserInputService")
const replicatedStorage = game.GetService("ReplicatedStorage")

const cameraSpeed = 20
const { KeyCode, CameraType } = Enum
const camera = game.Workspace.CurrentCamera
const toggleBuildMode = replicatedStorage.WaitForChild("ToggleBuildModeEvent") as RemoteEvent

runService.Heartbeat.Connect((delta) => {
    if (!player.HasTag("BuildMode"))
        return

    let movement = new Vector3()
    const shiftDown = userInputService.IsKeyDown(KeyCode.LeftShift)
    const lookVector = vectorWithComponents(camera!.CFrame.LookVector, undefined, 0, undefined)
    const { RightVector: rightVector } = camera!.CFrame

    if (userInputService.IsKeyDown(KeyCode.W))
        movement = movement.add(lookVector)

    if (userInputService.IsKeyDown(KeyCode.S))
        movement = movement.sub(lookVector)

    if (userInputService.IsKeyDown(KeyCode.A))
        movement = movement.sub(rightVector)

    if (userInputService.IsKeyDown(KeyCode.D))
        movement = movement.add(rightVector)

    if (shiftDown)
        movement = movement.mul(2)

    camera!.CFrame = camera!.CFrame.add(normalizeVector(movement)
        .mul(cameraSpeed)
        .mul(delta))
})

toggleBuildMode.OnClientEvent.Connect((buildMode) => {
    camera!.CameraType = typeIs(buildMode, "boolean") && buildMode ? CameraType.Scriptable : CameraType.Custom
})