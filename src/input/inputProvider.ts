import { readFileSync, existsSync } from 'fs';

const getInput = (day: number, test?: boolean): string | undefined => {
    const path = getPath(day, test);
    if (existsSync(path)) {
        return readFileSync(path, { encoding: 'utf8' });
    } else if (test) {
        // TODO: Fetch input from AoC and store it in cache.
    } else {
        return undefined;
    }
};

const getPath = (day: number, test?: boolean): URL =>
    new URL(`./data/${test ? 'test' : 'cache'}/${day}.txt`, import.meta.url);

export default {
    getInput,
};
