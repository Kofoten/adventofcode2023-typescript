import Challenge from '../challenge.ts';

interface RaceDetails {
    time: number;
    distance: number;
}

const parseInput = (input: string): RaceDetails[] => {
    const data = input
        .trimEnd()
        .split('\n')
        .map((line) =>
            line
                .substring(9)
                .split(' ')
                .filter((x) => x.length > 0)
        );

    return data[0].map((x, i) => ({
        time: parseInt(x, 10),
        distance: parseInt(data[1][i], 10),
    }));
};

const challenge: Challenge = {
    part1: (input: string): string => {
        const data = parseInput(input);

        let answer = 1;
        for (let i = 0; i < data.length; i++) {
            let records = 0;
            for (let j = 0; j <= data[i].time; j++) {
                const distance = (data[i].time - j) * j;
                if (distance > data[i].distance) {
                    records++;
                }
            }
            answer *= records;
        }

        return answer.toString();
    },
    part2: (input: string): string => {
        const race = input
            .trimEnd()
            .split('\n')
            .map((l) => parseInt(l.substring(9).replaceAll(' ', ''), 10));

        let records = 0;
        for (let j = 0; j <= race[0]; j++) {
            const distance = (race[0] - j) * j;
            if (distance > race[1]) {
                records++;
            }
        }

        return records.toString();
    },
};

export default challenge;
