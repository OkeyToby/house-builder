export type SerializedPart = {
    Name: string
    Position: Vector3
    Size: Vector3
    Shape: Enum.PartType
}

export function serializePart({ Name, Position, Size, Shape }: Part): SerializedPart {
    return { Name, Position, Size, Shape }
}

export function deserializePart({ Name, Position, Size, Shape }: SerializedPart): Part {
    const part = new Instance("Part")
    part.Name = Name
    part.Position = Position
    part.Size = Size
    part.Shape = Shape
    return part
}

// Center part 
export function positionPartAtStart(part: Part, start: Vector3, size: Vector3) {
    part.Size = size.Abs()
    part.Position = new Vector3(start.X + size.X / 2, start.Y + size.Y / 2, start.Z + size.Z / 2)
}