import { deserializePart, SerializedPart } from "shared/parts"
import { TypedReplicatedStorage } from "shared/types"

const { ToggleBuildModeEvent, CreatePartEvent, CutHoleEvent } = game.GetService("ReplicatedStorage") as TypedReplicatedStorage
const collectionService = game.GetService("CollectionService")
const httpService = game.GetService("HttpService")

ToggleBuildModeEvent.OnServerEvent.Connect((player) => {
    const character = player.Character ?? player.CharacterAdded.Wait()[0]
    const root = character.WaitForChild("HumanoidRootPart") as BasePart

    if (!root)
        return

    const wasInBuildMode = player.HasTag("BuildMode")

    if (wasInBuildMode)
        player.RemoveTag("BuildMode")
    else player.AddTag("BuildMode")

    root.Anchored = true
    ToggleBuildModeEvent.FireClient(player, !wasInBuildMode)
})

CreatePartEvent.OnServerEvent.Connect((_, ...[serializedPart]) => {
    const partId = httpService.GenerateGUID()
    const part = deserializePart(serializedPart as SerializedPart)
    part.Anchored = true
    collectionService.AddTag(part, `part-id-${partId}`)
    part.Parent = game.Workspace
})

CutHoleEvent.OnServerEvent.Connect((_, ...[id, serializedPart]) => {
    const instances = collectionService.GetTagged(`part-id-${id}`)

    if (instances.size() !== 1)
        return

    const ref = instances[0] as Part
    const part = deserializePart(serializedPart as SerializedPart)
    const union = ref.SubtractAsync([part])

    if (union) {
        ref.Destroy()
        union.Position = ref.Position
        union.Parent = game.Workspace
    }
})