import Challenge from '../challenge.ts';

interface PartSymbol {
    value: string;
    row: number;
    col: number;
}

const getAdjecentSymbol = (lines: string[], row: number, left: number, right: number): PartSymbol | undefined => {
    if (left >= 0 && lines[row][left] !== '.') {
        return {
            value: lines[row][left],
            row: row,
            col: left,
        };
    }

    if (right < lines[row].length && lines[row][right] !== '.') {
        return {
            value: lines[row][right],
            row: row,
            col: right,
        };
    }

    if (row - 1 >= 0) {
        for (let i = left; i <= right; i++) {
            if (i >= 0 && i < lines[row - 1].length && lines[row - 1][i] !== '.') {
                return {
                    value: lines[row - 1][i],
                    row: row - 1,
                    col: i,
                };
            }
        }
    }

    if (row + 1 < lines.length) {
        for (let i = left; i <= right; i++) {
            if (i >= 0 && i < lines[row + 1].length && lines[row + 1][i] !== '.') {
                return {
                    value: lines[row + 1][i],
                    row: row + 1,
                    col: i,
                };
            }
        }
    }

    return undefined;
};

const challenge: Challenge = {
    part1: (input: string): string => {
        const lines = input.split('\n');
        const partNumbers: number[] = [];

        for (let row = 0; row < lines.length; row++) {
            let cache = '';
            for (let col = 0; col <= lines[row].length; col++) {
                const letter = lines[row][col];
                const n = parseInt(letter, 10);
                if (!Number.isNaN(n)) {
                    cache += letter;
                } else if (cache.length > 0) {
                    const left = col - cache.length - 1;
                    const adjecentSymbol = getAdjecentSymbol(lines, row, left, col);

                    if (adjecentSymbol) {
                        partNumbers.push(parseInt(cache));
                    }

                    cache = '';
                }
            }
        }

        return partNumbers.reduce((acc, val) => acc + val, 0).toString();
    },
    part2: (input: string): string => {
        const lines = input.split('\n');
        const potentialGears: { [key: string]: number[] } = {};

        for (let row = 0; row < lines.length; row++) {
            let cache = '';
            for (let col = 0; col <= lines[row].length; col++) {
                const letter = lines[row][col];
                const n = parseInt(letter, 10);
                if (!Number.isNaN(n)) {
                    cache += letter;
                } else if (cache.length > 0) {
                    const left = col - cache.length - 1;
                    const adjecentSymbol = getAdjecentSymbol(lines, row, left, col);

                    if (adjecentSymbol && adjecentSymbol.value === '*') {
                        var key = `${adjecentSymbol.row}:${adjecentSymbol.col}`;
                        if (potentialGears[key]) {
                            potentialGears[key].push(parseInt(cache));
                        } else {
                            potentialGears[key] = [parseInt(cache)];
                        }
                    }

                    cache = '';
                }
            }
        }

        return Object.values(potentialGears)
            .filter((x) => x.length === 2)
            .reduce((acc, val) => acc + val[0] * val[1], 0)
            .toString();
    },
};

export default challenge;
