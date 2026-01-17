const userInput = game.GetService("UserInputService")
const replicatedStorage = game.GetService("ReplicatedStorage")

const { KeyCode } = Enum
const toggleBuildMode = replicatedStorage.WaitForChild("ToggleBuildModeEvent") as RemoteEvent

userInput.InputBegan.Connect((input) => {
    if (input.KeyCode === KeyCode.B)
        toggleBuildMode.FireServer()
})