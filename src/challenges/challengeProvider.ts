import Challenge from './challenge.ts'
import EchoChallenge from './echo/main.ts'

import Challenge1 from './challenge1/main.ts'

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