import Challenge from '../challenge.ts';

interface Point {
    x: number;
    y: number;
}

const pointEquals = (first: Point, second: Point) => {
    if (first && second) {
        return first.x === second.x && first.y === second.y;
    }

    return false;
};

const firstValidConnection = (map: string[][], point: Point): Point | undefined => {
    if ('|7F'.indexOf(map[point.y - 1][point.x]) !== -1) {
        return { x: point.x, y: point.y - 1 };
    } else if ('|JL'.indexOf(map[point.y + 1][point.x]) !== -1) {
        return { x: point.x, y: point.y + 1 };
    } else if ('-FL'.indexOf(map[point.y][point.x - 1]) !== -1) {
        return { x: point.x - 1, y: point.y };
    } else if ('-7J'.indexOf(map[point.y][point.x + 1]) !== -1) {
        return { x: point.x + 1, y: point.y };
    } else {
        return undefined;
    }
};

const getNeigbours = (position: Point, map: string[][]): Point[] => {
    const tile = map[position.y][position.x];
    switch (tile) {
        case 'F':
            return [
                { x: position.x + 1, y: position.y },
                { x: position.x, y: position.y + 1 },
            ];
        case '7':
            return [
                { x: position.x - 1, y: position.y },
                { x: position.x, y: position.y + 1 },
            ];
        case 'J':
            return [
                { x: position.x - 1, y: position.y },
                { x: position.x, y: position.y - 1 },
            ];
        case 'L':
            return [
                { x: position.x + 1, y: position.y },
                { x: position.x, y: position.y - 1 },
            ];
        case '|':
            return [
                { x: position.x, y: position.y + 1 },
                { x: position.x, y: position.y - 1 },
            ];
        case '-':
            return [
                { x: position.x + 1, y: position.y },
                { x: position.x - 1, y: position.y },
            ];
        default:
            throw new Error(`Invalid tile: ${tile}`);
    }
};

const findPath = (map: string[][]): Point[] => {
    const path: Point[] = [];

    for (let y = 0; path.length < 1; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 'S') {
                path.push({ x, y });
                break;
            }
        }
    }

    const start = path[0];
    path.push(firstValidConnection(map, start)!);

    for (let i = 0; ; i++) {
        const neigbours = getNeigbours(path[path.length - 1], map);
        const possibilities = neigbours.filter((p) => !pointEquals(p, path[path.length - 2]));

        if (pointEquals(possibilities[0], start)) {
            break;
        }

        path.push(possibilities[0]);
    }

    return path;
};

const visualize = (map: string[][], positions: Point[], enclosed?: Point[]): void => {
    for (let y = 0; y < map.length; y++) {
        let row = '';
        for (let x = 0; x < map[y].length; x++) {
            if (positions.some((p) => pointEquals(p, { x, y }))) {
                row += `\x1b[36m${map[y][x]}\x1b[0m`;
            } else if (enclosed && enclosed.some((p) => pointEquals(p, { x, y }))) {
                row += `\x1b[31m${map[y][x]}\x1b[0m`;
            } else {
                row += map[y][x];
            }
        }

        console.log(row);
    }
};

const isInsideMap = (map: string[][], point: Point) => {
    if (point.x < 0 || point.y < 0) {
        return false;
    }

    return point.y < map.length && point.x < map[0].length;
};

const fillNonPath = (map: string[][], path: Point[], source: Point, direction: Point, filler: 'l' | 'r'): void => {
    let toFill = { x: source.x + direction.x, y: source.y + direction.y };
    while (isInsideMap(map, toFill) && !path.some((p) => pointEquals(p, toFill))) {
        map[toFill.y][toFill.x] = filler;
        toFill = { x: toFill.x + direction.x, y: toFill.y + direction.y };
    }
};

const challenge: Challenge = {
    part1: (input: string, args?: string[]): string => {
        const map = input
            .trimEnd()
            .split('\n')
            .map((line) => line.split(''));

        const path = findPath(map);

        if (args && args.some((a) => a === '--visualize')) {
            visualize(map, path);
        }

        const farthest = Math.floor(path.length / 2);
        return farthest.toString();
    },
    part2: (input: string, args?: string[]): string => {
        const originalMap = input
            .trimEnd()
            .split('\n')
            .map((line) => line.split(''));

        const map = input
            .trimEnd()
            .split('\n')
            .map((line) => line.split(''));

        const path = findPath(map);

        for (let i = 1; i < path.length; i++) {
            const tile = map[path[i].y][path[i].x];
            switch (tile) {
                case '-':
                    if (path[i - 1].x < path[i].x) {
                        fillNonPath(map, path, path[i], { x: 0, y: -1 }, 'l');
                        fillNonPath(map, path, path[i], { x: 0, y: 1 }, 'r');
                    } else {
                        fillNonPath(map, path, path[i], { x: 0, y: -1 }, 'r');
                        fillNonPath(map, path, path[i], { x: 0, y: 1 }, 'l');
                    }
                    break;
                case '|':
                    if (path[i - 1].y < path[i].y) {
                        fillNonPath(map, path, path[i], { x: 1, y: 0 }, 'l');
                        fillNonPath(map, path, path[i], { x: -1, y: 0 }, 'r');
                    } else {
                        fillNonPath(map, path, path[i], { x: 1, y: 0 }, 'r');
                        fillNonPath(map, path, path[i], { x: -1, y: 0 }, 'l');
                    }
                    break;
                case '7':
                    if (path[i - 1].x < path[i].x) {
                        fillNonPath(map, path, path[i], { x: 0, y: -1 }, 'l');
                        fillNonPath(map, path, path[i], { x: 1, y: 0 }, 'l');
                    } else {
                        fillNonPath(map, path, path[i], { x: 0, y: -1 }, 'r');
                        fillNonPath(map, path, path[i], { x: 1, y: 0 }, 'r');
                    }
                    break;
                case 'L':
                    if (path[i - 1].x > path[i].x) {
                        fillNonPath(map, path, path[i], { x: 0, y: 1 }, 'l');
                        fillNonPath(map, path, path[i], { x: -1, y: 0 }, 'l');
                    } else {
                        fillNonPath(map, path, path[i], { x: 0, y: 1 }, 'r');
                        fillNonPath(map, path, path[i], { x: -1, y: 0 }, 'r');
                    }
                    break;
                case 'J':
                    if (path[i - 1].x < path[i].x) {
                        fillNonPath(map, path, path[i], { x: 0, y: 1 }, 'r');
                        fillNonPath(map, path, path[i], { x: 1, y: 0 }, 'r');
                    } else {
                        fillNonPath(map, path, path[i], { x: 0, y: 1 }, 'l');
                        fillNonPath(map, path, path[i], { x: 1, y: 0 }, 'l');
                    }
                    break;
                case 'F':
                    if (path[i - 1].x > path[i].x) {
                        fillNonPath(map, path, path[i], { x: 0, y: -1 }, 'r');
                        fillNonPath(map, path, path[i], { x: -1, y: 0 }, 'r');
                    } else {
                        fillNonPath(map, path, path[i], { x: 0, y: -1 }, 'l');
                        fillNonPath(map, path, path[i], { x: -1, y: 0 }, 'l');
                    }
                    break;
                default:
                    break;
            }
        }

        let inside = 'r';
        for (let i = 0; i < map.length; i++) {
            if (map[i][0] === 'r') {
                inside = 'l';
                break;
            }
        }

        const enclosed: Point[] = [];
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                if (map[y][x] === inside) {
                    enclosed.push({ x, y });
                }
            }
        }

        if (args && args.some((a) => a === '--visualize')) {
            visualize(originalMap, path, enclosed);
        }

        return enclosed.length.toString();
    },
};

export default challenge;
