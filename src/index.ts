import ArgumentParser, { Arguments } from './argumentParser.ts';
import InputProvider from './inputProvider.ts';
import ChallengeProvider from './challenges/challengeProvider.ts';

const app = async (args: Arguments): Promise<void> => {
    const challengeFunction = ChallengeProvider.getChallengeFunction(args.day, args.part);
    if (!challengeFunction) {
        throw new Error(`No challenge could be found for day ${args.day}.`);
    }

    const input = await InputProvider.getInput(args.day, args.part, args.test, args.sessionCookie);
    if (!input) {
        throw new Error(`Could not get input for the specified day ${args.day}.`);
    }

    const result = challengeFunction(input, args.additionalArguments);
    console.log(result);
};

const args = process.argv.slice(2);
const parsingResult = ArgumentParser.parseArguments(args);

if (parsingResult.arguments) {
    try {
        await app(parsingResult.arguments);
    } catch (error) {
        console.error(error);
        process.exit(42);
    }
} else {
    ArgumentParser.showHelp(parsingResult.error);

    if (parsingResult.error) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}
