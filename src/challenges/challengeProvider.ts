import Challenge, { ChallengePartFunction } from './challenge.ts';

// Challenge Implementations
import Challenge00 from './challenge00/main.ts';
import Challenge01 from './challenge01/main.ts';
import Challenge02 from './challenge02/main.ts';

const getChallenge = (day: number): Challenge | undefined => {
    switch (day) {
        case 0:
            return Challenge00;
        case 1:
            return Challenge01;
        case 2:
            return Challenge02;
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
