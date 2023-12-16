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

const computeBeam2 = (map: string[][], start: LightBeam): LightMap => {
    const lightMap: LightMap = {};

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
            lightMap[position.y * 1000 + position.x] = true;
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

        const start = { start: { x: -1, y: 0 }, direction: { x: 1, y: 0 } };
        const lightMap = computeBeam2(map, start);
        return Object.keys(lightMap).length.toString();
    },
    part2: (input: string): string => {
        const map = input
            .trimEnd()
            .split('\n')
            .map((line) => line.split(''));

        const splitBeams: LightBeam[] = [];
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                const type = map[y][x];
                if (type === '-') {
                    splitBeams.push({ start: { x, y }, direction: { x: -1, y: 0 } });
                    splitBeams.push({ start: { x, y }, direction: { x: 1, y: 0 } });
                } else if (type === '|') {
                    splitBeams.push({ start: { x, y }, direction: { x: 0, y: -1 } });
                    splitBeams.push({ start: { x, y }, direction: { x: 0, y: 1 } });
                }
            }
        }

        const lightMapCache: { [key: string]: LightMap } = {};
        for (let i = 0; i < splitBeams.length; i++) {
            const beamKey = toStringLightBeam(splitBeams[i]);
            const lightMap = computeBeam2(map, splitBeams[i]);
            lightMapCache[beamKey] = lightMap;
        }

        const counts: { start: LightBeam; count: number }[] = [];
        for (let dir = 0; dir < 4; dir++) {
            for (let i = 0; i < map.length; i++) {
                let lightMap: LightMap = {};
                const start = getStart(dir, i, map.length);

                let direction = { ...start.direction };
                let position = { ...start.start };
                while (true) {
                    position = addVector2(position, direction);
                    if (map[position.y] === undefined || map[position.y][position.x] === undefined) {
                        break;
                    }

                    lightMap[position.y * 1000 + position.x] = true;
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
                            const leftKey = toStringLightBeam(beams[0]);
                            const rightKey = toStringLightBeam(beams[1]);
                            lightMap = { ...lightMap, ...lightMapCache[leftKey], ...lightMapCache[rightKey] };
                            break;
                        } else {
                            throw new Error('WTF!');
                        }
                    }
                }

                const count = Object.keys(lightMap).length;
                counts.push({ start, count });
            }
        }

        const answer = counts.sort((a, b) => b.count - a.count)[0]?.count;
        return answer.toString();
    },
};

export default challenge;
