export type ChallengePartFunction = (input: string, args?: string[]) => string;

export default interface Challenge {
    part1: ChallengePartFunction;
    part2: ChallengePartFunction;
}
