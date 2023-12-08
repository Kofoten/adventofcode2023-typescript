import Challenge from '../challenge.ts';

interface NodeCollection {
    [key: string]: [string, string];
}

interface CountResult {
    steps: number;
    endNode: string;
}

const nodeRegex = /^([A-Z0-9]+) = \(([A-Z0-9]+), ([A-Z0-9]+)\)$/;

const parseInput = (input: string): [string, NodeCollection] => {
    const lines = input.trimEnd().split('\n');
    const instructions = lines[0];
    const nodes: NodeCollection = {};

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const match = nodeRegex.exec(line);
        if (match === null) {
            continue;
        }
        nodes[match[1]] = [match[2], match[3]];
    }

    return [instructions, nodes];
};

const countSteps = (nodes: NodeCollection, instructions: string, from: string, stopCondition: RegExp): CountResult => {
    let steps = 0;
    let currentNode = nodes[from];
    while (true) {
        const index = steps % instructions.length;
        let next = '';
        if (instructions[index] === 'L') {
            next = currentNode[0];
        } else {
            next = currentNode[1];
        }

        const match = stopCondition.exec(next);
        if (match) {
            steps++;
            return { steps, endNode: next };
        } else {
            currentNode = nodes[next];
        }
        steps++;
    }
};

const factorize = (number: number): number[] => {
    const factors = [];
    for (let i = 2; i <= Math.sqrt(number); i++) {
        while (number % i === 0) {
            factors.push(i);
            number /= i;
        }
    }

    if (number > 1) {
        factors.push(number);
    }

    return factors;
};

const challenge: Challenge = {
    part1: (input: string): string => {
        const [instructions, nodes] = parseInput(input);
        const result = countSteps(nodes, instructions, 'AAA', /^ZZZ$/);
        return result.steps.toString();
    },
    part2: (input: string): string => {
        const [instructions, nodes] = parseInput(input);

        const counts: { [key: string]: CountResult } = {};
        const keys = Object.keys(nodes).filter((key) => key.endsWith('Z') || key.endsWith('A'));

        keys.forEach((node) => {
            const result = countSteps(nodes, instructions, node, /^..Z$/);
            counts[node] = result;
        });

        const startNodeCountResults = Object.entries(counts)
            .filter((e) => e[0].endsWith('A'))
            .map((e) => e[1]);

        startNodeCountResults.forEach((cr) => {
            const endNodeCountResult = counts[cr.endNode];
            if (endNodeCountResult.endNode !== cr.endNode) {
                throw new Error('End node does not cycle.');
            }

            if (endNodeCountResult.steps !== cr.steps) {
                throw new Error('Start and end node does not contain equal amount of steps.');
            }
        });

        const primeCounts: { [key: number]: { num: number; count: number } } = {};
        startNodeCountResults.forEach((cr) => {
            const factorCounts: { [key: number]: { num: number; count: number } } = {};
            const factors = factorize(cr.steps);
            factors.forEach((f) => {
                if (factorCounts[f]) {
                    factorCounts[f].count++;
                } else {
                    factorCounts[f] = {
                        num: f,
                        count: 1,
                    };
                }
            });

            Object.values(factorCounts).forEach((fc) => {
                if (!primeCounts[fc.num] || primeCounts[fc.num].count < fc.count) {
                    primeCounts[fc.num] = fc;
                }
            });
        });

        const factorialMults = Object.values(primeCounts).map((pc) => Math.pow(pc.num, pc.count));
        const result = factorialMults.reduce((acc, fm) => acc * fm);
        return result.toString();
    },
};

export default challenge;
