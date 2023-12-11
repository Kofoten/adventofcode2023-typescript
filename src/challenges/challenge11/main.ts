import Challenge from '../challenge.ts';

interface Point {
    x: number;
    y: number;
}

const readInput = (input: string, expansionRate: number): Point[] => {
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
            if (diff > 1) {
                xOffset += expansionRate;
            }

            lastX = point.x;
            point.x = point.x + xOffset;
        });

    return galaxies;
};

const challenge: Challenge = {
    part1: (input: string): string => {
        const galaxies = readInput(input, 1);
        const distances: number[] = [];
        for (let i = 0; i < galaxies.length; i++) {
            for (let j = 1 + i; j < galaxies.length; j++) {
                const xDist = Math.abs(galaxies[i].x - galaxies[j].x);
                const yDist = Math.abs(galaxies[i].y - galaxies[j].y);
                distances.push(xDist + yDist);
            }
        }

        const answer = distances.reduce((acc, val) => acc + val);
        return answer.toString();
    },
    part2: (input: string): string => {
        const galaxies = readInput(input, 999999);
        const distances: number[] = [];
        for (let i = 0; i < galaxies.length; i++) {
            for (let j = 1 + i; j < galaxies.length; j++) {
                const xDist = Math.abs(galaxies[i].x - galaxies[j].x);
                const yDist = Math.abs(galaxies[i].y - galaxies[j].y);
                distances.push(xDist + yDist);
            }
        }

        const answer = distances.reduce((acc, val) => acc + val);
        return answer.toString();
    },
};

export default challenge;
