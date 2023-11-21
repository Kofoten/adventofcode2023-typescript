type PartFunction = (input: string) => string

interface Challenge {
    part1: PartFunction
    part2: PartFunction
}