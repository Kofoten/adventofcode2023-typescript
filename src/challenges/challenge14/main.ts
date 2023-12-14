import Challenge from '../challenge.ts';

const calculateAnswer = (map: string[][]) =>
    map.reduce((acc, line, i) => {
        let count = 0;
        for (let j = 0; j < line.length; j++) {
            if (line[j] === 'O') {
                count++;
            }
        }
        return (map.length - i) * count + acc;
    }, 0);

const rotateRight = (map: string[][]): string[][] => {
    const rotated = Array<string[]>(map[0].length);
    for (let i = 0; i < map[0].length; i++) {
        rotated[i] = Array<string>(map.length);
    }

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            rotated[i][j] = map[map.length - 1 - j][i];
        }
    }
    return rotated;
};

const challenge: Challenge = {
    part1: (input: string): string => {
        let map = input
            .trimEnd()
            .split('\n')
            .map((line) => line.split(''));

        map.forEach((line, i) => {
            for (let j = 0; j < line.length; j++) {
                if (line[j] === 'O') {
                    map[i][j] = '.';
                    for (let k = i; k >= 0; k--) {
                        if (map[k - 1] === undefined || map[k - 1][j] !== '.') {
                            map[k][j] = 'O';
                            break;
                        }
                    }
                }
            }
        });

        const answer = calculateAnswer(map);
        return answer.toString();
    },
    part2: (input: string): string => {
        let map = input
            .trimEnd()
            .split('\n')
            .map((line) => line.split(''));

        for (let l = 0; l < 1000000000; l++) {
            map.forEach((line, i) => {
                for (let j = 0; j < line.length; j++) {
                    if (line[j] === 'O') {
                        map[i][j] = '.';
                        for (let k = i; k >= 0; k--) {
                            if (map[k - 1] === undefined || map[k - 1][j] !== '.') {
                                map[k][j] = 'O';
                                break;
                            }
                        }
                    }
                }
            });
            map = rotateRight(map);
        }

        const answer = calculateAnswer(map);
        return answer.toString();
    },
};

export default challenge;
