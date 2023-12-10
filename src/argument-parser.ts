interface ArgumentParsingResult {
    arguments?: Arguments;
    error?: string;
}

export interface Arguments {
    day: number;
    part: number;
    test?: boolean;
    showHelp?: boolean;
    sessionCookie?: string;
    additionalArguments: string[];
}

const parseArguments = (args: string[]): ArgumentParsingResult => {
    if (args.some((arg) => arg === '-h' || arg === '--help')) {
        return {};
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

    const result: Arguments = { day, part, additionalArguments: [] };

    for (let i = 2; i < args.length; i++) {
        if (args[i].startsWith('-')) {
            switch (args[i]) {
                case '-t':
                case '--test':
                    result.test = true;
                    break;
                case '-h':
                case '--help':
                    result.showHelp = true;
                    break;
                case '--set-session-cookie':
                    {
                        i++;
                        if (args[i] === undefined) {
                            return { error: `--set-session-cookie requires a parameter.` };
                        }
                        const sessionCookie = parseSessionCookie(args[i]);
                        if (!sessionCookie) {
                            return { error: `Invalid value '${args[i]}' for option '--set-session-cookie'.` };
                        }

                        result.sessionCookie = sessionCookie;
                    }
                    break;
                default:
                    result.additionalArguments.push(args[i]);
                    break;
            }
        }
    }

    return { arguments: result };
};

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
    console.log(
        '\t--set-session-cookie:\tSets a sessioncookie value to use when authenticating. This is only required when the cookie changes.'
    );
};

const parseSessionCookie = (value: string): string | undefined => {
    const regexp = /^(session=)?([0-9A-Fa-f]+);?$/;
    const match = regexp.exec(value);
    if (match === null) {
        return undefined;
    }

    return match[2];
};

export default {
    parseArguments,
    showHelp,
};
