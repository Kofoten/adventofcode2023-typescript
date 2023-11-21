import EchoChallenge from './challenges/echo/main'
import Challenge1 from './challenges/challenge1/main'

const challengeProvider = {
    getChallenge: (day: number): Challenge | undefined=> {
        switch (day) {
            case 0: return EchoChallenge;
            case 1: return Challenge1;
            default: return undefined;
        }
    }
}

export default challengeProvider;