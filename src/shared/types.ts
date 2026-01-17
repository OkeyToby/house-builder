export type TypedReplicatedStorage = ReplicatedStorage & {
    CutHoleEvent: RemoteEvent
    CreatePartEvent: RemoteEvent
    ToggleBuildModeEvent: RemoteEvent
}