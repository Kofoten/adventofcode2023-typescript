import Challenge from '../challenge.ts';

interface MapPartition {
    startOn: number;
    stopBefore: number;
    destination: number;
}

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
                startOn: mapDescriptors[1],
                stopBefore: mapDescriptors[1] + mapDescriptors[2],
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
                const partition = map.partitions.find((p) => p.startOn <= acc && p.stopBefore > acc);

                let result = acc;
                if (partition) {
                    result -= partition.startOn;
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

        let min = Number.MAX_SAFE_INTEGER;
        for (let i = 0; i < data.seeds.length; i += 2) {
            const stop = data.seeds[i] + data.seeds[i + 1];
            for (let seed = data.seeds[i]; seed < stop; seed++) {
                const location = orderedMaps.reduce((acc, map) => {
                    const partition = map.partitions.find((p) => p.startOn <= acc && p.stopBefore > acc);

                    let result = acc;
                    if (partition) {
                        result -= partition.startOn;
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
