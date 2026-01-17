export function rotateVectorAroundAxis(axis: Vector3, vector: Vector3, angle: number): Vector3 {
    const zVector = vector.Cross(axis).div(axis.Magnitude)
    return vector.mul(math.cos(angle)).add(zVector.mul(math.sin(angle)))
}

export function normalizeVector(vector: Vector3): Vector3 {
    return vector.div(vector.Magnitude)
}

export function vectorWithComponents(
    vector: Vector3,
    x: number | undefined,
    y: number | undefined,
    z: number | undefined
): Vector3 {
    return new Vector3(x ?? vector.X, y ?? vector.Y, z ?? vector.Z)
}