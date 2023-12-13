import Challenge from '../challenge.ts';

interface Pattern {
    horizontal: number[];
    vertical: number[];
}

const parseInput = (input: string): Pattern[] => {
    const patterns = input.trimEnd().split('\n\n');
    return patterns.map((pattern) => {
        const lines = pattern.split('\n');
        const horizontal = lines.map((line) =>
            line.split('').reduce((mask, val, i) => {
                if (val === '#') {
                    return mask + (1 << i);
                } else {
                    return mask;
                }
            }, 0)
        );

        const vertical: number[] = [];
        for (let i = 0; i < lines[0].length; i++) {
            let mask = 0;
            for (let j = 0; j < lines.length; j++) {
                if (lines[j][i] === '#') {
                    mask += 1 << j;
                }
            }
            vertical.push(mask);
        }

        return { horizontal, vertical };
    });
};

const isMirrorAtIndex = (pattern: number[], index: number): boolean => {
    for (let i = 0; ; i++) {
        const leftIndex = index - i;
        const rightIndex = 1 + index + i;
        const left = pattern[leftIndex];
        const right = pattern[rightIndex];
        if (left !== right) {
            return left === undefined || right === undefined;
        }
    }
};

const isMirrorAtIndexSmudgeCorrection = (pattern: number[], index: number): boolean => {
    let smudgeCorrected = false;
    for (let i = 0; ; i++) {
        const leftIndex = index - i;
        const rightIndex = 1 + index + i;
        const left = pattern[leftIndex];
        const right = pattern[rightIndex];
        const x = left ^ right;
        if (left !== right) {
            if (left === undefined || right === undefined) {
                return smudgeCorrected;
            } else if ((x & (x - 1)) === 0) {
                smudgeCorrected = true;
            } else {
                return false;
            }
        }
    }
};

const challenge: Challenge = {
    part1: (input: string): string => {
        const patterns = parseInput(input);
        const answer = patterns.reduce((acc, pattern) => {
            const maxH = pattern.horizontal.length - 1;
            let rowsValue = 0;
            for (let i = 0; i < maxH; i++) {
                if (isMirrorAtIndex(pattern.horizontal, i)) {
                    rowsValue = (i + 1) * 100;
                    break;
                }
            }

            const maxV = pattern.vertical.length - 1;
            let colsValue = 0;
            for (let i = 0; i < maxV; i++) {
                if (isMirrorAtIndex(pattern.vertical, i)) {
                    colsValue = i + 1;
                    break;
                }
            }

            return acc + rowsValue + colsValue;
        }, 0);
        return answer.toString();
    },
    part2: (input: string): string => {
        const patterns = parseInput(input);
        const answer = patterns.reduce((acc, pattern) => {
            const maxH = pattern.horizontal.length - 1;
            let rowsValue = 0;
            for (let i = 0; i < maxH; i++) {
                if (isMirrorAtIndexSmudgeCorrection(pattern.horizontal, i)) {
                    rowsValue = (i + 1) * 100;
                    break;
                }
            }

            const maxV = pattern.vertical.length - 1;
            let colsValue = 0;
            for (let i = 0; i < maxV; i++) {
                if (isMirrorAtIndexSmudgeCorrection(pattern.vertical, i)) {
                    colsValue = i + 1;
                    break;
                }
            }

            return acc + rowsValue + colsValue;
        }, 0);
        return answer.toString();
    },
};

export default challenge;
