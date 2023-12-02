import Challenge from '../challenge.ts';

interface Node {
    children: { [key: string]: Node };
    value?: number;
}

interface KeyValuePairs {
    [key: string]: number;
}

const digitMap: KeyValuePairs = {
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
};

const aheadMap: KeyValuePairs = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
};

const behindMap: KeyValuePairs = {
    eno: 1,
    owt: 2,
    eerht: 3,
    ruof: 4,
    evif: 5,
    xis: 6,
    neves: 7,
    thgie: 8,
    enin: 9,
};

const createTree = (keyValuPairs: KeyValuePairs): Node => {
    const root: Node = { children: {} };

    Object.entries(keyValuPairs).forEach((kvp) => {
        let current = root;
        for (let i = 0; i < kvp[0].length; i++) {
            let node = current.children[kvp[0][i]];
            if (!node) {
                node = { children: {} };
                current.children[kvp[0][i]] = node;
            }

            current = node;
        }

        current.value = kvp[1];
    });

    return root;
};

const makeTree = (useMaps: 'digitsOnly' | 'ahead' | 'behind'): Node => {
    switch (useMaps) {
        case 'digitsOnly':
            return createTree({ ...digitMap });
        case 'ahead': {
            const map = { ...digitMap, ...aheadMap };
            return createTree(map);
        }
        case 'behind': {
            const map = { ...digitMap, ...behindMap };
            return createTree(map);
        }
        default:
            return createTree({});
    }
};

const getFirstDigit = (text: string, matchOnlyDigits?: boolean): number => {
    const tree = matchOnlyDigits ? makeTree('digitsOnly') : makeTree('behind');
    let cache = '';

    for (let i = 0; i < text.length; i++) {
        cache += text[i];
        let current = tree;
        for (let j = cache.length - 1; j >= 0; j--) {
            const node = current.children[cache[j]];
            if (node) {
                current = node;
            } else {
                break;
            }
        }

        if (current.value) {
            return current.value;
        }
    }

    return NaN;
};

const getLastDigit = (text: string, matchOnlyDigits?: boolean): number => {
    const tree = matchOnlyDigits ? makeTree('digitsOnly') : makeTree('ahead');
    let cache = '';

    for (let i = text.length - 1; i >= 0; i--) {
        cache += text[i];
        let current = tree;
        for (let j = cache.length - 1; j >= 0; j--) {
            const node = current.children[cache[j]];
            if (node) {
                current = node;
            } else {
                break;
            }
        }

        if (current.value) {
            return current.value;
        }
    }

    return NaN;
};

const challenge: Challenge = {
    part1: (input: string): string =>
        input
            .split('\n')
            .filter((line) => line.length > 0)
            .map((line) => {
                line = line.trimEnd();
                let first = getFirstDigit(line, true);
                let last = getLastDigit(line, true);
                return first * 10 + last;
            })
            .reduce((acc, val) => acc + val, 0)
            .toString(),
    part2: (input: string): string =>
        input
            .split('\n')
            .filter((line) => line.length > 0)
            .map((line) => {
                line = line.trimEnd();
                let first = getFirstDigit(line, false);
                let last = getLastDigit(line, false);
                return first * 10 + last;
            })
            .reduce((acc, val) => acc + val, 0)
            .toString(),
};

export default challenge;
