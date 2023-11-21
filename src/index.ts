import * as ArgumentParser from './argumentParser';
import challengeProvider from './challengeProvider';

const parsingResult = ArgumentParser.parseArguments(process.argv);
if (parsingResult.arguments) {
    const challenge = challengeProvider.getChallenge(parsingResult.arguments.day)
    if (challenge) {
        let result = '?';
        // TODO: GetInput
        if (parsingResult.arguments.part === 1) {
            result = challenge.part1('input');
        } else {
            result = challenge.part2('input');
        }
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