import Challenge from '../challenge.ts';

const getFirstAndLastDigits = (line: string): number => {
    let first = NaN;
    let last = NaN;

    let lbcache = '';
    for (let i = 0; i < line.length; i++) {
        let val = parseInt(line[i]);

        if (Number.isNaN(val)) {
            lbcache += line[i];

            if (lbcache.endsWith('one')) {
                val = 1;
            } else if (lbcache.endsWith('two')) {
                val = 2;
            } else if (lbcache.endsWith('two')) {
                val = 2;
            } else if (lbcache.endsWith('three')) {
                val = 3;
            } else if (lbcache.endsWith('four')) {
                val = 4;
            } else if (lbcache.endsWith('five')) {
                val = 5;
            } else if (lbcache.endsWith('six')) {
                val = 6;
            } else if (lbcache.endsWith('seven')) {
                val = 7;
            } else if (lbcache.endsWith('eight')) {
                val = 8;
            } else if (lbcache.endsWith('nine')) {
                val = 9;
            } else {
                continue;
            }
        }

        if (Number.isNaN(first)) {
            first = val;
        }

        last = val;
    }

    return first * 10 + last;
};

const challenge: Challenge = {
    part1: (input: string): string =>
        input
            .split('\n')
            .filter((line) => line.length > 0)
            .map((line) => getFirstAndLastDigits(line))
            .reduce((acc, val) => acc + val, 0)
            .toString(),
    part2: (input: string): string =>
        input
            .split('\n')
            .filter((line) => line.length > 0)
            .map((line) => getFirstAndLastDigits(line))
            .reduce((acc, val) => acc + val, 0)
            .toString(),
};

export default challenge;
