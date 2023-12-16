import Challenge from '../challenge.ts';

interface Vector2 {
    x: number;
    y: number;
}

interface LightBeam {
    start: Vector2;
    direction: Vector2;
}

interface LightMap {
    [key: number]: any;
}

interface BeamCache {
    [key: string]: { [key: number]: any };
}

type Split = Vector2 & { type: '-' | '|' };

const addVector2 = (left: Vector2, right: Vector2): Vector2 => ({ x: left.x + right.x, y: left.y + right.y });
const toStringVector2 = (vec: Vector2): string => `${vec.x},${vec.y}`;
const toStringLightBeam = (lb: LightBeam): string => `${toStringVector2(lb.start)};${toStringVector2(lb.direction)}`;

const splitOrTurnBeamBeam = (position: Vector2, direction: Vector2, object: string): LightBeam[] => {
    const beams: LightBeam[] = [];
    switch (object) {
        case '/':
            if (direction.x === 1) {
                beams.push({ start: { ...position }, direction: { x: 0, y: -1 } });
            } else if (direction.x === -1) {
                beams.push({ start: { ...position }, direction: { x: 0, y: 1 } });
            } else if (direction.y === 1) {
                beams.push({ start: { ...position }, direction: { x: -1, y: 0 } });
            } else if (direction.y === -1) {
                beams.push({ start: { ...position }, direction: { x: 1, y: 0 } });
            }
            break;
        case '\\':
            if (direction.x === 1) {
                beams.push({ start: { ...position }, direction: { x: 0, y: 1 } });
            } else if (direction.x === -1) {
                beams.push({ start: { ...position }, direction: { x: 0, y: -1 } });
            } else if (direction.y === 1) {
                beams.push({ start: { ...position }, direction: { x: 1, y: 0 } });
            } else if (direction.y === -1) {
                beams.push({ start: { ...position }, direction: { x: -1, y: 0 } });
            }
            break;
        case '|':
            beams.push({ start: { ...position }, direction: { x: 0, y: -1 } });
            beams.push({ start: { ...position }, direction: { x: 0, y: 1 } });
            break;
        case '-':
            beams.push({ start: { ...position }, direction: { x: -1, y: 0 } });
            beams.push({ start: { ...position }, direction: { x: 1, y: 0 } });
            break;
        default:
            break;
    }
    return beams;
};

const computeBeam = (
    beam: LightBeam,
    map: string[][],
    cache: BeamCache /*, memory?: { [key: string]: any }*/
): LightMap => {
    //if (!memory) {
    //    memory = {};
    //}

    const beamKey = toStringLightBeam(beam);
    if (cache[beamKey]) {
        return cache[beamKey];
    }

    //if (memory[beamKey]) {
    //    return {};
    //}

    //memory[beamKey] = true;

    let lightMap: LightMap = {};
    let direction = { ...beam.direction };
    let position = { ...beam.start };
    while (true) {
        position = addVector2(position, direction);
        if (map[position.y] === undefined || map[position.y][position.x] === undefined) {
            break;
        }

        lightMap[position.x * 1000 + position.y] = true;

        const tile = map[position.y][position.x];
        if (tile !== '.') {
            // If travelling on Y axis and non dot is '|'
            if (direction.y !== 0 && tile === '|') {
                continue;
            }

            // If travelling on X axis and non dot is '-'
            if (direction.x !== 0 && tile === '-') {
                continue;
            }

            const beams = splitOrTurnBeamBeam(position, direction, tile);
            if (beams.length === 0) {
                break;
            } else if (beams.length === 1) {
                direction = beams[0].direction;
            } else if (beams.length === 2) {
                const leftLightMap = computeBeam(beams[0], map, cache /*, memory*/);
                const rightLightMap = computeBeam(beams[1], map, cache /*, memory*/);
                const innerLightMap = { ...leftLightMap, ...rightLightMap };
                lightMap = { ...lightMap, ...innerLightMap };
                break;
            } else {
                throw new Error('WTF!');
            }
        }
    }

    cache[beamKey] = lightMap;
    return lightMap;
};

const getStart = (dir: number, index: number, size: number): LightBeam => {
    switch (dir) {
        case 0:
            return { start: { x: -1, y: index }, direction: { x: 1, y: 0 } };
        case 1:
            return { start: { x: size, y: index }, direction: { x: -1, y: 0 } };
        case 2:
            return { start: { x: index, y: -1 }, direction: { x: 0, y: 1 } };
        case 3:
            return { start: { x: index, y: size }, direction: { x: 0, y: -1 } };
        default:
            throw new Error('Invalid direction');
    }
};

const challenge: Challenge = {
    part1: (input: string, args?: string[]): string => {
        const map = input
            .trimEnd()
            .split('\n')
            .map((line) => line.split(''));

        const lightMap: boolean[][] = Array(map.length);
        for (let i = 0; i < map.length; i++) {
            lightMap[i] = Array(map[i].length).fill(false);
        }

        const cache: BeamCache = {};
        const start = { start: { x: -1, y: 0 }, direction: { x: 1, y: 0 } };
        const lm2 = computeBeam(start, map, cache);
        const ans = Object.keys(lm2).length;

        const memory: string[] = [];
        const queue: LightBeam[] = [start];
        while (queue.length > 0) {
            const beam = queue.pop()!;
            let position = { ...beam.start };
            while (true) {
                position = addVector2(position, beam.direction);
                if (map[position.y] === undefined || map[position.y][position.x] === undefined) {
                    break;
                }
                lightMap[position.y][position.x] = true;
                if (map[position.y][position.x] !== '.') {
                    // If travelling on Y axis and non dot is '|'
                    if (beam.direction.y !== 0 && map[position.y][position.x] !== '|') {
                        break;
                    }

                    // If travelling on X axis and non dot is '-'
                    if (beam.direction.x !== 0 && map[position.y][position.x] !== '-') {
                        break;
                    }
                }
            }

            memory.push(toStringLightBeam(beam));
            if (map[position.y] !== undefined && map[position.y][position.x] !== undefined) {
                splitOrTurnBeamBeam(position, beam.direction, map[position.y][position.x]).forEach((lb) => {
                    const lbStr = toStringLightBeam(lb);
                    if (!memory.some((m) => m === lbStr)) {
                        queue.push(lb);
                    }
                });
            }
        }

        const answer = lightMap.reduce((count, row) => count + row.reduce((rc, val) => rc + (val ? 1 : 0), 0), 0);

        if (args && args.some((arg) => arg === '--visualize')) {
            for (let y = 0; y < map.length; y++) {
                let row = '';
                for (let x = 0; x < map[y].length; x++) {
                    if (lightMap[y][x]) {
                        row += `\x1b[36m${map[y][x]}\x1b[0m`;
                    } else {
                        row += map[y][x];
                    }
                }
                console.log(row);
            }
        }
        return answer.toString();
    },
    part2: (input: string): string => {
        const map = input
            .trimEnd()
            .split('\n')
            .map((line) => line.split(''));

        const splits: Split[] = [];
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                const type = map[y][x];
                if (type === '-' || type === '|') {
                    splits.push({ y, x, type });
                }
            }
        }

        const cache: BeamCache = {};
        const counts: { start: LightBeam; count: number }[] = [];
        for (let dir = 0; dir < 4; dir++) {
            for (let i = 0; i < map.length; i++) {
                const start = getStart(dir, i, map.length);
                const lightMap = computeBeam(start, map, cache);
                counts.push({ start, count: Object.keys(lightMap).length });
            }
        }

        const answer = counts.sort((a, b) => b.count - a.count)[0]?.count;
        return answer.toString();
    },
};

export default challenge;
