import Challenge from '../challenge.ts';

interface MachinePart {
    [key: string]: number;
}

interface Rule {
    type: '<' | '>';
    key: string;
    value: number;
    left: string;
    right: string;
}

interface RuleCollection {
    [key: string]: Rule;
}

interface Input {
    workflows: RuleCollection;
    machineParts: MachinePart[];
}

const workflowRegex = /^([a-z\-]+)\{(.+)\}$/;
const ruleRegex = /^([a-z]+)(\<|\>)([0-9]+):(.+)$/;
const isKeyRegex = /^[a-zAR]+$/;

const parseInput = (input: string): Input => {
    const [workflowStrings, valuesStr] = input.trimEnd().split('\n\n');
    const machineParts = valuesStr.split('\n').map((vstr) => {
        const values: MachinePart = {};
        vstr.substring(1, vstr.length - 1)
            .split(',')
            .forEach((x) => {
                const [key, value] = x.split('=');
                values[key] = parseInt(value, 10);
            });
        return values;
    });

    const workflows: RuleCollection = {};
    const queue = workflowStrings.split('\n');
    while (queue.length > 0) {
        const workflowString = queue.shift()!;
        const workflowMatch = workflowRegex.exec(workflowString);
        if (workflowMatch === null) {
            throw new Error('Invalid input.');
        }

        const ruleMatch = ruleRegex.exec(workflowMatch[2]);
        if (ruleMatch === null) {
            throw new Error('Invalid input.');
        }

        const ruleType = ruleMatch[2];
        if (ruleType !== '<' && ruleType !== '>') {
            throw new Error('Invalid input.');
        }

        const commaIndex = ruleMatch[4].indexOf(',');
        const leftString = ruleMatch[4].substring(0, commaIndex);
        const leftKeyMatch = isKeyRegex.exec(leftString);
        let leftKey = leftString;
        if (leftKeyMatch === null) {
            leftKey = `${workflowMatch[1]}-l`;
            queue.push(`${leftKey}{${leftString}}`);
        }

        const rightString = ruleMatch[4].substring(1 + commaIndex, ruleMatch[4].length);
        const rightKeyMatch = isKeyRegex.exec(rightString);
        let rightKey = rightString;
        if (rightKeyMatch === null) {
            rightKey = `${workflowMatch[1]}-r`;
            queue.push(`${rightKey}{${rightString}}`);
        }

        workflows[workflowMatch[1]] = {
            type: ruleType,
            key: ruleMatch[1],
            value: parseInt(ruleMatch[3], 10),
            left: leftKey,
            right: rightKey,
        };
    }

    return {
        workflows,
        machineParts,
    };
};

const filterParts = (workflows: RuleCollection, part: MachinePart): boolean => {
    let ans = 'in';
    while (ans !== 'R' && ans !== 'A') {
        const rule = workflows[ans];
        const rating = part[rule.key];
        if (rule.type === '<' && rating < rule.value) {
            ans = rule.left;
        } else if (rule.type === '>' && rating > rule.value) {
            ans = rule.left;
        } else {
            ans = rule.right;
        }
    }
    return ans === 'A';
};

const challenge: Challenge = {
    part1: (input: string): string => {
        const data = parseInput(input);
        const accepted = data.machineParts.filter((part) => filterParts(data.workflows, part));
        const answer = accepted.reduce((sum, part) => sum + Object.values(part).reduce((acc, val) => acc + val, 0), 0);
        return answer.toString();
    },
    part2: (input: string): string => {
        const data = parseInput(input);

        return '';
    },
};

export default challenge;
