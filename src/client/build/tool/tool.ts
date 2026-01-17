export interface ToolContext {
    start: Vector3
    previewParts: Part[]
}

export interface Tool<C = ToolContext> {
    steps: number

    start(hit: RaycastResult, position: Vector3): C
    heartbeat(hit: RaycastResult, position: Vector3, step: number, context: C): void
    commit(context: C): void
    cancel(): void
}