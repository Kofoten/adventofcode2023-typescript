import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import aocClient from '../io/aocClient.ts';
import { getAocCachePath } from '../common/utilities.ts';

const FILE_OPTIONS: { encoding: BufferEncoding } = { encoding: 'utf8' };

const getInput = async (
    day: number,
    part: number,
    test?: boolean,
    sessionCookie?: string
): Promise<string | undefined> => {
    if (test) {
        return getTestInput(day, part);
    } else {
        return getInputInner(day, sessionCookie);
    }
};

const getTestInput = (day: number, part: number): string | undefined => {
    const dayString = getDayString(day);
    const potentialPaths = [
        new URL(`./testdata/day${dayString}.txt`, import.meta.url),
        new URL(`./testdata/day${dayString}p${part}.txt`, import.meta.url),
    ];

    for (let i = 0; i < potentialPaths.length; i++) {
        if (existsSync(potentialPaths[i])) {
            return readFileSync(potentialPaths[i], FILE_OPTIONS);
        }
    }

    return undefined;
};

const getInputInner = async (day: number, sessionCookie?: string) => {
    const path = getCachePath(day);
    if (existsSync(path)) {
        return readFileSync(path, { encoding: 'utf8' });
    } else {
        const data = await aocClient.fetchInput(day, sessionCookie);
        writeFileSync(path, data, { encoding: 'utf8' });
        return data;
    }
};

const getCachePath = (day: number): URL => {
    const aocPath = getAocCachePath();
    const cacheDir = path.join(aocPath, 'cache');
    if (!existsSync(cacheDir)) {
        mkdirSync(cacheDir);
    }

    const dayString = getDayString(day);
    return new URL(`file://${path.join(cacheDir, `challenge-input-${dayString}.txt`)}`);
};

const getDayString = (day: number): string => day.toString().padStart(2, '0');

export default {
    getInput,
};
