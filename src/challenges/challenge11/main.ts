import Challenge from '../challenge.ts';

interface Point {
    x: number;
    y: number;
}

const calculateDistances = (input: string, expansionRate: number): number => {
    const galaxies: Point[] = [];
    let yOffset = 0;

    input
        .trimEnd()
        .split('\n')
        .forEach((line, y) => {
            let empty = true;

            for (let x = 0; x < line.length; x++) {
                if (line[x] === '#') {
                    galaxies.push({ x, y: y + yOffset });
                    empty = false;
                }
            }

            if (empty) {
                yOffset += expansionRate;
            }
        });

    let xOffset = 0;
    let lastX = 0;
    galaxies
        .sort((a, b) => a.x - b.x)
        .forEach((point) => {
            const diff = point.x - lastX;

            for (let i = 1; i < diff; i++) {
                xOffset += expansionRate;
            }

            lastX = point.x;
            point.x = point.x + xOffset;
        });

    const distances: number[] = [];
    for (let i = 0; i < galaxies.length; i++) {
        for (let j = 1 + i; j < galaxies.length; j++) {
            const xDist = Math.abs(galaxies[i].x - galaxies[j].x);
            const yDist = Math.abs(galaxies[i].y - galaxies[j].y);
            distances.push(xDist + yDist);
        }
    }

    const answer = distances.reduce((acc, val) => acc + val);
    return answer;
};

const challenge: Challenge = {
    part1: (input: string): string => calculateDistances(input, 1).toString(),
    part2: (input: string): string => calculateDistances(input, 999999).toString(),
};

export default challenge;
