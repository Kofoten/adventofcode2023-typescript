import Challenge from '../challenge.ts';

const challenge: Challenge = {
    part1: (input: string): string => {
        const sequences = input
            .trimEnd()
            .split('\n')
            .map((line) => line.split(' ').map((v) => parseInt(v, 10)));

        const extrapolations: number[] = [];
        sequences.forEach((sequence) => {
            let values: number[][] = [sequence];
            while (values[values.length - 1].some((v) => v !== 0)) {
                const current = values[values.length - 1];
                const next: number[] = [];

                for (let i = 0; i < current.length - 1; i++) {
                    next.push(current[i + 1] - current[i]);
                }

                values.push(next);
            }

            let extrapolation = 0;
            for (let i = values.length - 2; i >= 0; i--) {
                extrapolation += values[i][values[i].length - 1];
            }

            extrapolations.push(extrapolation);
        });

        const result = extrapolations.reduce((acc, val) => acc + val);
        return result.toString();
    },
    part2: (input: string): string => {
        const sequences = input
            .trimEnd()
            .split('\n')
            .map((line) => line.split(' ').map((v) => parseInt(v, 10)));

        const extrapolations: number[] = [];
        sequences.forEach((sequence) => {
            let values: number[][] = [sequence];
            while (values[values.length - 1].some((v) => v !== 0)) {
                const current = values[values.length - 1];
                const next: number[] = [];

                for (let i = 0; i < current.length - 1; i++) {
                    next.push(current[i + 1] - current[i]);
                }

                values.push(next);
            }

            let extrapolation = 0;
            for (let i = values.length - 2; i >= 0; i--) {
                const x = values[i][0] - extrapolation;
                extrapolation = x;
            }

            extrapolations.push(extrapolation);
        });

        const result = extrapolations.reduce((acc, val) => acc + val);
        return result.toString();
    },
};

export default challenge;
