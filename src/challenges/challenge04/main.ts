import Challenge from '../challenge.ts';

const lineRegex = /^Card([\d ]+): ([\d ]+) \| ([\d ]+)$/;

const challenge: Challenge = {
    part1: (input: string): string =>
        input
            .trimEnd()
            .split('\n')
            .map((line) => {
                const match = lineRegex.exec(line);
                if (match === null) {
                    throw new Error('Invalid input');
                }

                const winningNumbers = match[2].split(' ').map((x) => parseInt(x.trim(), 10));
                const myNumbers = match[3].split(' ').map((x) => parseInt(x.trim(), 10));

                let result = 0;
                myNumbers.forEach((mn) => {
                    if (winningNumbers.some((x) => x === mn)) {
                        if (result === 0) {
                            result = 1;
                        } else {
                            result *= 2;
                        }
                    }
                });
                return result;
            })
            .reduce((acc, val) => acc + val)
            .toString(),
    part2: (input: string): string => {
        const lines = input.trimEnd().split('\n');

        const counter: number[] = Array(lines.length).fill(1);

        const cardCount = lines.reduce((acc, line, idx) => {
            const match = lineRegex.exec(line);
            if (match === null) {
                throw new Error('Invalid input');
            }

            const winningNumbers = match[2].split(' ').map((x) => parseInt(x.trim(), 10));
            const myNumbers = match[3].split(' ').map((x) => parseInt(x.trim(), 10));
            const wnningCount = myNumbers.filter((mn) => winningNumbers.some((x) => x === mn));

            for (let i = 0; i < counter[idx]; i++) {
                for (let j = 0; j < wnningCount.length; j++) {
                    const indexToAdd = 1 + idx + j;
                    if (counter[indexToAdd]) {
                        counter[indexToAdd] += 1;
                    } else {
                        counter[indexToAdd] = 1;
                    }
                }
            }
            return acc + counter[idx];
        }, 0);

        return cardCount.toString();
    },
};

export default challenge;
