import Challenge from '../challenge.ts';

interface Lens {
    slot: number;
    power: number;
}

interface Box {
    last: number;
    lenses: { [key: string]: Lens };
}

const entryRegex = /^([a-z]+)(-|=)([0-9])?$/;

const computeHash = (text: string): number =>
    text.split('').reduce((hash, char) => {
        const asciiCode = char.charCodeAt(0);
        hash = hash + asciiCode;
        hash *= 17;
        return hash % 256;
    }, 0);

const challenge: Challenge = {
    part1: (input: string): string =>
        input
            .trimEnd()
            .split(',')
            .reduce((result, text) => {
                const value = computeHash(text);
                return result + value;
            }, 0)
            .toString(),
    part2: (input: string): string => {
        const boxes: Box[] = [];

        for (let i = 0; i < 256; i++) {
            boxes[i] = { last: -1, lenses: {} };
        }

        input
            .trimEnd()
            .split(',')
            .forEach((entry) => {
                const match = entryRegex.exec(entry);
                if (match) {
                    const label = match[1];
                    const boxIndex = computeHash(label);
                    switch (match[2]) {
                        case '-':
                            delete boxes[boxIndex].lenses[label];
                            break;
                        case '=':
                            const power = parseInt(match[3], 10);
                            if (boxes[boxIndex].lenses[label]) {
                                boxes[boxIndex].lenses[label].power = power;
                            } else {
                                boxes[boxIndex].last++;
                                boxes[boxIndex].lenses[label] = { slot: boxes[boxIndex].last, power };
                            }
                            break;
                        default:
                            break;
                    }
                }
            });

        const answer = boxes.reduce((sum, box, i) => {
            const orderedLenses = Object.values(box.lenses).sort((a, b) => a.slot - b.slot);
            const boxMultiplier = 1 + i;
            const lensPowers = orderedLenses.map((lens, slot) => boxMultiplier * (1 + slot) * lens.power);
            return sum + lensPowers.reduce((acc, lp) => acc + lp, 0);
        }, 0);

        return answer.toString();
    },
};

export default challenge;
