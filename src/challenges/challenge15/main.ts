import Challenge from '../challenge.ts';

interface Lens {
    slot: number;
    focalLength: number;
}

interface Box {
    lastSlot: number;
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
            boxes[i] = { lastSlot: -1, lenses: {} };
        }

        input
            .trimEnd()
            .split(',')
            .forEach((entry) => {
                const match = entryRegex.exec(entry);
                if (match) {
                    const label = match[1];
                    const boxIndex = computeHash(label);
                    const box = boxes[boxIndex];
                    switch (match[2]) {
                        case '-':
                            delete box.lenses[label];
                            break;
                        case '=':
                            const focalLength = parseInt(match[3], 10);
                            if (box.lenses[label]) {
                                box.lenses[label].focalLength = focalLength;
                            } else {
                                box.lastSlot++;
                                box.lenses[label] = { slot: box.lastSlot, focalLength };
                            }
                            break;
                        default:
                            break;
                    }
                }
            });

        const answer = boxes.reduce((sum, box, i) => {
            const orderedLenses = Object.values(box.lenses).sort((a, b) => a.slot - b.slot);
            const lensPowers = orderedLenses.map((lens, slot) => (1 + i) * (1 + slot) * lens.focalLength);
            return sum + lensPowers.reduce((acc, lp) => acc + lp, 0);
        }, 0);

        return answer.toString();
    },
};

export default challenge;
