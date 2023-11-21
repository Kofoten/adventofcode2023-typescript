import EchoChallenge from './challenges/echo/main'
import Challenge1 from './challenges/challenge1/main'

const challengeProvider = {
    getChallenge: (day: number): Challenge => {
        switch (day) {
            case 0: return EchoChallenge;
            case 1: return Challenge1;
            default: throw new Error(`The challenge for day ${day} could not be found.`);
        }
    }
}

export default challengeProvider;