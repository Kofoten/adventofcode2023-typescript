import Challenge from '../challenge.ts';

interface Vector2 {
    x: number;
    y: number;
}

interface LightBeam {
    start: Vector2;
    direction: Vector2;
}

interface ComputedBeam {
    lightMap: { [key: number]: any };
    next: LightBeam[];
}

type CacheBeam = LightBeam & ComputedBeam;

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

const computeBeam = (beam: LightBeam, map: string[][]): ComputedBeam => {
    let position = { ...beam.start };
    const result: ComputedBeam = { lightMap: {}, next: [] };
    while (true) {
        position = addVector2(position, beam.direction);
        if (map[position.y] === undefined || map[position.y][position.x] === undefined) {
            return result;
        }

        const lightKey = position.x * 1000 + position.y;
        result.lightMap[lightKey] = true;

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

    result.next = splitOrTurnBeamBeam(position, beam.direction, map[position.y][position.x]);
    return result;
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

        const memory: string[] = [];
        const queue: LightBeam[] = [{ start: { x: -1, y: 0 }, direction: { x: 1, y: 0 } }];
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

        const counts: { key: string; count: number }[] = [];
        const cache: { [key: string]: CacheBeam } = {};
        for (let dir = 0; dir < 4; dir++) {
            for (let i = 0; i < map.length; i++) {
                const memory: { [key: string]: any } = {};
                const start = getStart(dir, i, map.length);
                const queue: LightBeam[] = [start];
                let lightMap: { [key: number]: any } = {};
                while (queue.length > 0) {
                    const beam = queue.pop()!;
                    const beamKey = toStringLightBeam(beam);
                    if (memory[beamKey]) {
                        continue;
                    }
                    if (cache[beamKey]) {
                        lightMap = { ...lightMap, ...cache[beamKey].lightMap };
                        cache[beamKey].next.forEach((lb) => {
                            const lbKey = toStringLightBeam(lb);
                            if (!memory[lbKey]) {
                                queue.push(lb);
                            }
                        });
                    } else {
                        const result = computeBeam(beam, map);
                        lightMap = { ...lightMap, ...result.lightMap };
                        result.next.forEach((lb) => {
                            const lbKey = toStringLightBeam(lb);
                            if (!memory[lbKey]) {
                                queue.push(lb);
                            }
                        });
                        cache[beamKey] = { ...beam, ...result };
                    }
                    memory[beamKey] = true;
                }

                counts.push({ key: toStringLightBeam(start), count: Object.keys(lightMap).length });
            }
        }

        const answer = counts.sort((a, b) => b.count - a.count)[0]?.count;
        return answer.toString();
    },
};

export default challenge;
