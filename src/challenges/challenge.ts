type PartFunction = (input: string, args?: string[]) => string

export default interface Challenge {
    part1: PartFunction
    part2: PartFunction
}