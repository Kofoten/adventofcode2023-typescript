import { existsSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import path from 'path';

export const getAocCachePath = (): string => {
    const aocDir = path.join(homedir(), '.aoc');
    if (!existsSync(aocDir)) {
        mkdirSync(aocDir);
    }

    return aocDir;
};
