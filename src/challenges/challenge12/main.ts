import Challenge from '../challenge.ts';

interface Record {
    data: string,
    groups: number[]
}

const reapeatJoin = (str: string, separator: string, count: number) => {
    let result = str;
    for (let i = 1; i < count; i++) {
        result += `${separator}${str}`;
    }
    return result;
}

const parseInput = (input: string, folds: number): Record[] => input
    .trimEnd()
    .split('\n')
    .map(line => {
        let [data, groupsStr] = line.split(' ');
        data = reapeatJoin(data, '?', folds);
        groupsStr = reapeatJoin(groupsStr, ',', folds);
        const groups = groupsStr.split(',').map(x => parseInt(x, 10));
        return { data, groups };
    });

const calculatePossibleArrangements = (records: Record[]): number => records.reduce((count, record) => {
    const combinations = record.groups.reduce<string[]>((possibilities, group) => {
        const x: string[] = []
        possibilities.forEach(data => {
            for (let i = data.lastIndexOf('x'); i < data.length; i++) {
                if (data[i - 1] === '#' || data[i - 1] === 'x') {
                    continue;
                } else if (data[i] === '#' || data[i] === '?') {
                    const isMatchRequired = data[i] === '#';
                    let next = data;
                    let match = true;
                    for (let j = 0; j < group && match; j++){
                        if (data[i + j] === '.' || i + j >= data.length) {
                            match = false;
                        } else {
                            next = next.substring(0, i + j) + 'x' + next.substring(1 + i + j);
                        }
                    }

                    if (data[i + group] === '#') {
                        match = false;
                    } else if (i + group < data.length) {
                        next = next.substring(0, i + group) + '.' + next.substring(1 + i + group);
                    }

                    if (match) {
                        x.push(next);
                    }

                    if (isMatchRequired) {
                        break;
                    }
                }
            }
        });
        return x;
    }, [record.data])
    const complete = combinations.filter(x => x.indexOf('#') === -1);
    return count + complete.length;
}, 0)

const challenge: Challenge = {
    part1: (input: string): string => {
        const records = parseInput(input, 1);
        const answer = calculatePossibleArrangements(records);
        return answer.toString();
    },
    part2: (input: string): string => {
        const records = parseInput(input, 5);
        const answer = calculatePossibleArrangements(records);
        return answer.toString();
    },
};

export default challenge;
