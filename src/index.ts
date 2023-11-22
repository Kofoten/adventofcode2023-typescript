import ArgumentParser from './argumentParser.ts';
import InputProvider from './input/inputProvider.ts';
import ChallengeProvider from './challenges/challengeProvider.ts';

const args = process.argv.slice(2);
const parsingResult = ArgumentParser.parseArguments(args);

if (parsingResult.arguments) {
    const challenge = ChallengeProvider.getChallenge(parsingResult.arguments.day)
    if (challenge) {
        const input = InputProvider.getInput(
            parsingResult.arguments.day,
            parsingResult.arguments.part,
            parsingResult.arguments.test);

        let result = '?';
        if (parsingResult.arguments.part === 1) {
            result = challenge.part1(input);
        } else {
            result = challenge.part2(input);
        }

        console.log(result);
    } else {
        ArgumentParser.showHelp(`No challenge could be found for day ${parsingResult.arguments.day}.`);
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