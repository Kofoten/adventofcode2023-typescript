import Challenge, { ChallengePartFunction } from './challenge.ts';

// Challenge Implementations
import Challenge00 from './challenge00/main.ts';
import Challenge01 from './challenge01/main.ts';
import Challenge02 from './challenge02/main.ts';
import Challenge03 from './challenge03/main.ts';
import Challenge04 from './challenge04/main.ts';
import Challenge05 from './challenge05/main.ts';
import Challenge06 from './challenge06/main.ts';
import Challenge07 from './challenge07/main.ts';
import Challenge08 from './challenge08/main.ts';
import Challenge09 from './challenge09/main.ts';
import Challenge10 from './challenge10/main.ts';
import Challenge11 from './challenge11/main.ts';
import Challenge12 from './challenge12/main.ts';
import Challenge13 from './challenge13/main.ts';
import Challenge14 from './challenge14/main.ts';
import Challenge15 from './challenge15/main.ts';
import Challenge16 from './challenge16/main.ts';
import Challenge17 from './challenge17/main.ts';
import Challenge18 from './challenge18/main.ts';
import Challenge19 from './challenge19/main.ts';
import Challenge20 from './challenge20/main.ts';
import Challenge21 from './challenge21/main.ts';
import Challenge22 from './challenge22/main.ts';
import Challenge23 from './challenge23/main.ts';
import Challenge24 from './challenge24/main.ts';
import Challenge25 from './challenge25/main.ts';

const getChallenge = (day: number): Challenge | undefined => {
    switch (day) {
        case 0:
            return Challenge00;
        case 1:
            return Challenge01;
        case 2:
            return Challenge02;
        case 3:
            return Challenge03;
        case 4:
            return Challenge04;
        case 5:
            return Challenge05;
        case 6:
            return Challenge06;
        case 7:
            return Challenge07;
        case 8:
            return Challenge08;
        case 9:
            return Challenge09;
        case 10:
            return Challenge10;
        case 11:
            return Challenge11;
        case 12:
            return Challenge12;
        case 13:
            return Challenge13;
        case 14:
            return Challenge14;
        case 15:
            return Challenge15;
        case 16:
            return Challenge16;
        case 17:
            return Challenge17;
        case 18:
            return Challenge18;
        case 19:
            return Challenge19;
        case 20:
            return Challenge20;
        case 21:
            return Challenge21;
        case 22:
            return Challenge22;
        case 23:
            return Challenge23;
        case 24:
            return Challenge24;
        case 25:
            return Challenge25;
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
