import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { FO, getAocCachePath } from './utilities.ts';

const YEAR = 2023;
const FILE_OPTIONS: FO = { encoding: 'utf8' };

const fetchInput = async (day: number, sessionCookie?: string): Promise<string> => {
    const url = new URL(`https://adventofcode.com/${YEAR}/day/${day}/input`);

    const headers = new Headers();
    authenticate(headers, sessionCookie);
    const options = { method: 'GET', headers };

    // Day zero is a framework test day. Returning 'Hello World!' right before the request is sent to go through as
    // much code as possible without relying on external dependencies. The ability to cache the session cookie should
    // also still be supported without sending any request.
    if (day === 0) {
        return 'Hello World!';
    }

    const response = await fetch(url, options);

    if (response.ok) {
        return await response.text();
    } else {
        throw new Error(`${response.status} ${response.statusText}`);
    }
};

const sendAnswer = async (day: number, part: number, answer: string): Promise<boolean> => {
    throw new Error('Not implemented');
};

const authenticate = (headers: Headers, sessionCookie?: string): void => {
    const aocPath = getAocCachePath();
    if (!existsSync(aocPath)) {
        mkdirSync(aocPath);
    }

    const cacheFile = path.join(aocPath, 'session');
    if (sessionCookie) {
        writeFileSync(cacheFile, sessionCookie, FILE_OPTIONS);
    } else if (existsSync(cacheFile)) {
        sessionCookie = readFileSync(cacheFile, FILE_OPTIONS);
    } else {
        throw new Error('No session cookie found. Can not authenticate to AoC.');
    }

    headers.append('Cookie', `session=${sessionCookie}`);
};

export default {
    fetchInput,
    sendAnswer,
};
