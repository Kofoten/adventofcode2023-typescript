interface ArgumentParsingResult {
    arguments?: Arguments,
    error?: string,
}

interface Arguments {
    day: number,
    part: number,
    test: boolean,
    additionalArguments: string[]
}

const parseArguments = (args: string[]): ArgumentParsingResult => {
    if (args.some(arg => arg === '-h' || arg === '--help')) {
        return { };
    }

    if (args.length < 2) {
        if (args.length < 1) {
            return { error: `Missig required argument ''day'` };
        }

        return { error: `Missig required argument 'part'` };
    }

    const day = parseInt(args[0], 10);
    if (!Number.isInteger(day) || day < 0) {
        return { error: `Invalid value '${day}' for argument 'day'. 'day' must be a positive integer.` };
    }

    const part = parseInt(args[1], 10);
    if (!Number.isInteger(part) || part < 1 || part > 2) {
        return { error: `Invalid value '${part}' for argument 'part'. Allowed values are '1' and '2'.` };
    }

    const test = args.length > 2 && (args[2] === '-t' || args[2] === '--test');

    return {
        arguments: {
            day,
            part,
            test,
            additionalArguments: args.slice(test ? 3 : 2),
        }
    }
}

const showHelp = (message?: string) => {
    if (message) {
        console.log(`ERROR: ${message}`);
    }

    console.log('My Advent of Code project for 2023 in TypeSript');
    console.log('Usage: x <day> <part> [options] [additionalArguments]...');
    console.log('\tday (required): \tSpecifies which days challenge to run.');
    console.log('\tpart (required):\tSpecifies which part of the challenge to run.');
    console.log();
    console.log('Options:');
    console.log('\t-h, --help:\tDisplays this message.');
    console.log('\t-t, --test:\tSpecifies that the program should use the example data for the challenge as input.');
}

export default {
    parseArguments,
    showHelp
}