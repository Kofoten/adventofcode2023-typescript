import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import path from 'path';

const YEAR = 2023;

const getInput = async (day: number, test?: boolean, sessionCookie?: string): Promise<string | undefined> => {
    const path = getCachePath(day, test);
    if (existsSync(path)) {
        return readFileSync(path, { encoding: 'utf8' });
    } else if (!test) {
        const data = await fetchInput(day, sessionCookie);
        writeFileSync(path, data, { encoding: 'utf8' });
        return data;
    } else {
        return undefined;
    }
};

const fetchInput = async (day: number, sessionCookie?: string): Promise<string> => {
    const url = new URL(`https://adventofcode.com/${YEAR}/day/${day}/input`);

    const headers = new Headers();
    authenticate(headers, sessionCookie);
    const options = { method: 'GET', headers };

    const response = await fetch(url, options);

    if (response.ok) {
        return await response.text();
    } else {
        throw new Error(`${response.status} ${response.statusText}`);
    }
};

const authenticate = (headers: Headers, sessionCookie?: string): void => {
    const aocPath = getAocPath();
    if (!existsSync(aocPath)) {
        mkdirSync(aocPath);
    }

    const cacheFile = path.join(aocPath, 'session');
    if (sessionCookie) {
        writeFileSync(cacheFile, sessionCookie, { encoding: 'utf8' });
    } else if (existsSync(cacheFile)) {
        sessionCookie = readFileSync(cacheFile, { encoding: 'utf8' });
    } else {
        throw new Error('No session cookie found. Can not authenticate to AoC.');
    }

    headers.append('Cookie', `session=${sessionCookie}`);
};

const getCachePath = (day: number, test?: boolean): URL => {
    if (test) {
        return new URL(`./testdata/day${day}.txt`, import.meta.url);
    }

    const aocPath = getAocPath();
    const cacheDir = path.join(aocPath, 'cache');
    if (!existsSync(cacheDir)) {
        mkdirSync(cacheDir);
    }

    return new URL(`file://${path.join(cacheDir, `challenge-input-${day}.txt`)}`);
};

const getAocPath = (): string => {
    const aocDir = path.join(homedir(), '.aoc');
    if (!existsSync(aocDir)) {
        mkdirSync(aocDir);
    }

    return aocDir;
};

export default {
    getInput,
};
