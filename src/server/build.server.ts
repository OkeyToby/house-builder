import { deserializePart, SerializedPart } from "shared/parts"
const replicatedStorage = game.GetService("ReplicatedStorage")
const collectionService = game.GetService("CollectionService")
const httpService = game.GetService("HttpService")

function getOrCreateRemoteEvent(name: string): RemoteEvent {
    const existing = replicatedStorage.FindFirstChild(name)

    if (existing && existing.IsA("RemoteEvent"))
        return existing

    if (existing)
        existing.Destroy()

    const remote = new Instance("RemoteEvent")
    remote.Name = name
    remote.Parent = replicatedStorage
    return remote
}

const ToggleBuildModeEvent = getOrCreateRemoteEvent("ToggleBuildModeEvent")
const CreatePartEvent = getOrCreateRemoteEvent("CreatePartEvent")
const CutHoleEvent = getOrCreateRemoteEvent("CutHoleEvent")

function createPart(
    parent: Instance,
    name: string,
    size: Vector3,
    position: Vector3,
    color: Color3,
    material: Enum.Material = Enum.Material.SmoothPlastic,
    transparency = 0,
): Part {
    const part = new Instance("Part")
    part.Name = name
    part.Anchored = true
    part.Size = size
    part.Position = position
    part.Color = color
    part.Material = material
    part.Transparency = transparency
    part.Parent = parent
    return part
}

function spawnCuteHouse() {
    if (game.Workspace.FindFirstChild("CuteHouse"))
        return

    const model = new Instance("Model")
    model.Name = "CuteHouse"
    model.Parent = game.Workspace

    const center = new Vector3(0, 0, 0)
    const width = 20
    const depth = 14
    const wallHeight = 10
    const wallThickness = 1
    const floorThickness = 1

    const houseBottomY = 0
    const floorY = houseBottomY + floorThickness / 2
    const wallCenterY = houseBottomY + floorThickness + wallHeight / 2
    const roofY = houseBottomY + floorThickness + wallHeight + floorThickness / 2

    const wallColor = new Color3(1, 0.89, 0.78)
    const roofColor = new Color3(0.92, 0.36, 0.36)
    const floorColor = new Color3(0.81, 0.75, 0.66)

    createPart(
        model,
        "Floor",
        new Vector3(width, floorThickness, depth),
        new Vector3(center.X, floorY, center.Z),
        floorColor,
        Enum.Material.WoodPlanks,
    )

    createPart(
        model,
        "Roof",
        new Vector3(width + 0.8, floorThickness, depth + 0.8),
        new Vector3(center.X, roofY, center.Z),
        roofColor,
        Enum.Material.Slate,
    )

    const wallFrontZ = center.Z - depth / 2 + wallThickness / 2
    const wallBackZ = center.Z + depth / 2 - wallThickness / 2
    const wallLeftX = center.X - width / 2 + wallThickness / 2
    const wallRightX = center.X + width / 2 - wallThickness / 2

    const doorHeight = 6
    const doorWidth = 3
    const doorThickness = 0.45
    const doorCenterY = houseBottomY + floorThickness + doorHeight / 2

    const wallBottomY = houseBottomY + floorThickness
    const wallTopY = wallBottomY + wallHeight
    const frontSideWidth = (width - doorWidth) / 2
    const frontTopHeight = wallHeight - doorHeight
    const frontSideOffsetX = doorWidth / 2 + frontSideWidth / 2
    const frontTopCenterY = wallBottomY + doorHeight + frontTopHeight / 2

    createPart(
        model,
        "WallFrontLeft",
        new Vector3(frontSideWidth, wallHeight, wallThickness),
        new Vector3(center.X - frontSideOffsetX, wallCenterY, wallFrontZ),
        wallColor,
    )

    createPart(
        model,
        "WallFrontRight",
        new Vector3(frontSideWidth, wallHeight, wallThickness),
        new Vector3(center.X + frontSideOffsetX, wallCenterY, wallFrontZ),
        wallColor,
    )

    createPart(
        model,
        "WallFrontTop",
        new Vector3(doorWidth, frontTopHeight, wallThickness),
        new Vector3(center.X, frontTopCenterY, wallFrontZ),
        wallColor,
    )

    createPart(
        model,
        "WallBack",
        new Vector3(width, wallHeight, wallThickness),
        new Vector3(center.X, wallCenterY, wallBackZ),
        wallColor,
    )

    const door = createPart(
        model,
        "Door",
        new Vector3(doorWidth, doorHeight, doorThickness),
        new Vector3(center.X, doorCenterY, wallFrontZ + wallThickness / 2 + doorThickness / 2),
        new Color3(0.2, 0.5, 1),
        Enum.Material.SmoothPlastic,
    )
    door.CanCollide = false

    const windowWidth = 2.2
    const windowHeight = 2
    const windowCenterY = houseBottomY + floorThickness + 5.2
    const windowOffsetZ = 3.4
    const windowColor = new Color3(0.74, 0.9, 1)
    const windowBottomY = windowCenterY - windowHeight / 2
    const windowTopY = windowCenterY + windowHeight / 2
    const leftWindowCenterZ = 0

    const rightBottomHeight = windowBottomY - wallBottomY
    const rightTopHeight = wallTopY - windowTopY
    const middleBandHeight = windowHeight
    const rightSideSegmentDepth = (depth / 2) - (windowOffsetZ + windowWidth / 2)
    const rightCenterSegmentDepth = (windowOffsetZ - windowWidth / 2) * 2
    const leftSideSegmentDepth = (depth / 2) - (math.abs(leftWindowCenterZ) + windowWidth / 2)

    createPart(
        model,
        "WallLeftBottom",
        new Vector3(wallThickness, rightBottomHeight, depth),
        new Vector3(wallLeftX, wallBottomY + rightBottomHeight / 2, center.Z),
        wallColor,
    )

    createPart(
        model,
        "WallLeftTop",
        new Vector3(wallThickness, rightTopHeight, depth),
        new Vector3(wallLeftX, windowTopY + rightTopHeight / 2, center.Z),
        wallColor,
    )

    createPart(
        model,
        "WallLeftMidFront",
        new Vector3(wallThickness, middleBandHeight, leftSideSegmentDepth),
        new Vector3(
            wallLeftX,
            windowCenterY,
            center.Z - (math.abs(leftWindowCenterZ) + windowWidth / 2 + leftSideSegmentDepth / 2),
        ),
        wallColor,
    )

    createPart(
        model,
        "WallLeftMidBack",
        new Vector3(wallThickness, middleBandHeight, leftSideSegmentDepth),
        new Vector3(
            wallLeftX,
            windowCenterY,
            center.Z + (math.abs(leftWindowCenterZ) + windowWidth / 2 + leftSideSegmentDepth / 2),
        ),
        wallColor,
    )

    createPart(
        model,
        "WallRightBottom",
        new Vector3(wallThickness, rightBottomHeight, depth),
        new Vector3(wallRightX, wallBottomY + rightBottomHeight / 2, center.Z),
        wallColor,
    )

    createPart(
        model,
        "WallRightTop",
        new Vector3(wallThickness, rightTopHeight, depth),
        new Vector3(wallRightX, windowTopY + rightTopHeight / 2, center.Z),
        wallColor,
    )

    createPart(
        model,
        "WallRightMidFront",
        new Vector3(wallThickness, middleBandHeight, rightSideSegmentDepth),
        new Vector3(
            wallRightX,
            windowCenterY,
            center.Z - (windowOffsetZ + windowWidth / 2 + rightSideSegmentDepth / 2),
        ),
        wallColor,
    )

    createPart(
        model,
        "WallRightMidCenter",
        new Vector3(wallThickness, middleBandHeight, rightCenterSegmentDepth),
        new Vector3(wallRightX, windowCenterY, center.Z),
        wallColor,
    )

    createPart(
        model,
        "WallRightMidBack",
        new Vector3(wallThickness, middleBandHeight, rightSideSegmentDepth),
        new Vector3(
            wallRightX,
            windowCenterY,
            center.Z + (windowOffsetZ + windowWidth / 2 + rightSideSegmentDepth / 2),
        ),
        wallColor,
    )

    const window1 = createPart(
        model,
        "SideWindow1",
        new Vector3(wallThickness * 0.35, windowHeight, windowWidth),
        new Vector3(wallRightX, windowCenterY, center.Z - windowOffsetZ),
        windowColor,
        Enum.Material.Glass,
        0.3,
    )
    window1.CanCollide = false

    const window2 = createPart(
        model,
        "SideWindow2",
        new Vector3(wallThickness * 0.35, windowHeight, windowWidth),
        new Vector3(wallRightX, windowCenterY, center.Z + windowOffsetZ),
        windowColor,
        Enum.Material.Glass,
        0.3,
    )
    window2.CanCollide = false

    const leftWindow = createPart(
        model,
        "LeftWindow",
        new Vector3(wallThickness * 0.35, windowHeight, windowWidth),
        new Vector3(wallLeftX, windowCenterY, leftWindowCenterZ),
        windowColor,
        Enum.Material.Glass,
        0.3,
    )
    leftWindow.CanCollide = false

    const pathColor = new Color3(0.88, 0.88, 0.9)
    const pathStartZ = wallFrontZ - 1.5
    const pathWidth = 3.2
    const pathDepth = 2.2
    const pathThickness = 0.3
    const pathY = houseBottomY + pathThickness / 2

    for (let i = 0; i < 3; i++) {
        createPart(
            model,
            `PathStone${i + 1}`,
            new Vector3(pathWidth, pathThickness, pathDepth),
            new Vector3(center.X, pathY, pathStartZ - i * (pathDepth + 0.4)),
            pathColor,
            Enum.Material.Slate,
        )
    }

    const flowerStemColor = new Color3(0.2, 0.65, 0.28)
    const flowerPetalColors = [
        new Color3(1, 0.62, 0.78),
        new Color3(0.98, 0.8, 0.33),
        new Color3(0.7, 0.88, 1),
        new Color3(1, 0.56, 0.56),
    ]

    const flowerPositions = [
        new Vector3(center.X - 2.6, houseBottomY + 0.45, wallFrontZ - 2.4),
        new Vector3(center.X + 2.6, houseBottomY + 0.45, wallFrontZ - 2.5),
        new Vector3(center.X - 2.9, houseBottomY + 0.45, wallFrontZ - 5.1),
        new Vector3(center.X + 2.9, houseBottomY + 0.45, wallFrontZ - 5.2),
    ]

    for (let i = 0; i < flowerPositions.size(); i++) {
        const flowerPosition = flowerPositions[i]
        const stem = createPart(
            model,
            `FlowerStem${i + 1}`,
            new Vector3(0.15, 0.9, 0.15),
            flowerPosition,
            flowerStemColor,
            Enum.Material.Grass,
        )
        stem.Shape = Enum.PartType.Cylinder
        stem.Orientation = new Vector3(0, 0, 90)

        const petal = createPart(
            model,
            `FlowerTop${i + 1}`,
            new Vector3(0.5, 0.5, 0.5),
            flowerPosition.add(new Vector3(0, 0.55, 0)),
            flowerPetalColors[i % flowerPetalColors.size()],
            Enum.Material.Neon,
        )
        petal.Shape = Enum.PartType.Ball
    }
}

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

spawnCuteHouse()
