export function roundToValue(number: number, value: number): number {
    return math.round(number / value) * value
}