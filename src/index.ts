import * as ArgumentParser from './argumentParser';

const parsingResult = ArgumentParser.parseArguments(process.argv);
if (!parsingResult.arguments) {
    ArgumentParser.showHelp(parsingResult.error);
    process.exit(1);
}

