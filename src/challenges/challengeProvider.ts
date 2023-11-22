import Challenge, { ChallengePartFunction } from './challenge.ts';

// Challenge Implementations
import Challenge0 from './challenge0/main.ts';
import Challenge1 from './challenge1/main.ts';

const getChallenge = (day: number): Challenge | undefined => {
    switch (day) {
        case 0:
            return Challenge0;
        case 1:
            return Challenge1;
        default:
            return undefined;
    }
};

const getChallengeFunction = (day: number, part: number): ChallengePartFunction | undefined => {
    const challenge = getChallenge(day);
    if (!challenge) {
        return undefined;
    }

    switch (part) {
        case 1:
            return challenge.part1;
        case 2:
            return challenge.part2;
        default:
            return undefined;
    }
};

export default {
    getChallenge,
    getChallengeFunction,
};
