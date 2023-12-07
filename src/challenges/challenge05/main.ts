import Challenge from '../challenge.ts';

interface Range {
    start: number;
    stop: number;
}

type MapPartition = Range & {
    destination: number;
};

interface Map {
    from: string;
    to: string;
    partitions: MapPartition[];
}

interface Input {
    seeds: number[];
    maps: Map[];
}

const seedsRegex = /^seeds: ([\d ]+)$/;
const mapNameRegex = /^([a-z]+)-to-([a-z]+) map:$/;

const mapRanges = (ranges: Range[], map: Map): Range[] => {
    let remaining: Range[] = ranges;
    const mapped: Range[] = [];
    map.partitions.forEach((m) => {
        const next: Range[] = [];
        remaining.forEach((r) => {
            if (intersects(m, r)) {
                let mappedStart = r.start;
                let mappedStop = r.stop;

                if (m.start > r.start) {
                    mappedStart = m.start;
                    next.push({
                        start: r.start,
                        stop: m.start - 1,
                    });
                }

                if (m.stop < r.stop) {
                    mappedStop = m.stop;
                    next.push({
                        start: m.stop + 1,
                        stop: r.stop,
                    });
                }

                mapped.push({
                    start: mappedStart - m.start + m.destination,
                    stop: mappedStop - m.start + m.destination,
                });
            } else {
                next.push(r);
            }
        });

        remaining = next;
    });

    return mapped.concat(remaining);
};

const mergeRanges = (ranges: Range[]): Range[] => {
    const merged: Range[] = [];
    for (let i = 0; i < ranges.length; i++) {
        let range = ranges[i];
        const indexesToRemove: number[] = [];
        merged.forEach((m, j) => {
            if (intersects(range, m)) {
                range = maximize(range, m);
                indexesToRemove.push(j);
            }
        });

        for (let j = 0; j < merged.length; j++) {}

        indexesToRemove.forEach((index) => delete merged[index]);
        merged.push(range);
    }
    return merged;
};

const maximize = (first: Range, second: Range): Range => ({
    start: first.start < second.start ? first.start : second.start,
    stop: first.stop > second.stop ? first.stop : second.stop,
});

const intersects = (first: Range, second: Range): boolean => {
    if (first.start <= second.start && first.stop >= second.start) {
        return true;
    }

    if (first.start <= second.stop && first.stop >= second.stop) {
        return true;
    }

    return false;
};

const parseInput = (input: string): Input => {
    const lines = input.split('\n');

    const match = seedsRegex.exec(lines[0]);
    if (match === null) {
        throw new Error('Invalid input');
    }

    const seeds = match[1]
        .split(' ')
        .filter((x) => x.length > 0)
        .map((x) => parseInt(x.trim(), 10));

    const maps: Map[] = [];
    for (let i = 1; i < lines.length; i++) {
        const mapMatch = mapNameRegex.exec(lines[i]);
        if (mapMatch === null) {
            continue;
        } else {
            i++;
        }

        const map: Map = {
            from: mapMatch[1],
            to: mapMatch[2],
            partitions: [],
        };

        while (lines[i].length > 0) {
            const mapDescriptors = lines[i]
                .split(' ')
                .filter((x) => x.length > 0)
                .map((x) => parseInt(x.trim(), 10));

            map.partitions.push({
                start: mapDescriptors[1],
                stop: mapDescriptors[1] + mapDescriptors[2] - 1,
                destination: mapDescriptors[0],
            });

            i++;
        }

        maps.push(map);
    }

    return {
        seeds,
        maps,
    };
};

const challenge: Challenge = {
    part1: (input: string): string => {
        const data = parseInput(input);

        const orderedMaps: Map[] = [];
        let searchKey = 'seed';
        for (let i = 0; i < data.maps.length && searchKey !== 'location'; i++) {
            const map = data.maps.find((x) => x.from === searchKey);
            if (map === undefined) {
                throw new Error('Data is invalid');
            }
            orderedMaps.push(map);
            searchKey = map.to;
        }

        const locations = data.seeds.map((seed) =>
            orderedMaps.reduce((acc, map) => {
                const partition = map.partitions.find((p) => p.start <= acc && p.stop >= acc);

                let result = acc;
                if (partition) {
                    result -= partition.start;
                    result += partition.destination;
                }

                return result;
            }, seed)
        );

        return locations.reduce((acc, val) => (val < acc ? val : acc)).toString();
    },
    part2: (input: string): string => {
        const data = parseInput(input);

        const orderedMaps: Map[] = [];
        let searchKey = 'seed';
        for (let i = 0; i < data.maps.length && searchKey !== 'location'; i++) {
            const map = data.maps.find((x) => x.from === searchKey);
            if (map === undefined) {
                throw new Error('Data is invalid');
            }
            orderedMaps.push(map);
            searchKey = map.to;
        }

        let ranges: Range[] = [];
        for (let i = 0; i < data.seeds.length; i += 2) {
            ranges.push({
                start: data.seeds[i],
                stop: data.seeds[i] + data.seeds[i + 1],
            });
        }

        for (let i = 0; i < data.maps.length; i++) {
            const currentRanges = mapRanges(ranges, data.maps[i]);
            ranges = mergeRanges(currentRanges);
        }

        const rMin = ranges.reduce((a, r) => (r.start < a ? r.start : a), Number.MAX_SAFE_INTEGER);

        let min = Number.MAX_SAFE_INTEGER;
        for (let i = 0; i < data.seeds.length; i += 2) {
            const stop = data.seeds[i] + data.seeds[i + 1];
            for (let seed = data.seeds[i]; seed < stop; seed++) {
                const location = orderedMaps.reduce((acc, map) => {
                    const partition = map.partitions.find((p) => p.start <= acc && p.stop >= acc);

                    let result = acc;
                    if (partition) {
                        result -= partition.start;
                        result += partition.destination;
                    }

                    return result;
                }, seed);

                if (location < min) {
                    min = location;
                }
            }
        }

        return min.toString();
    },
};

export default challenge;
