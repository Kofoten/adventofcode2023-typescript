import { readFileSync } from 'node:fs'


const getInput = (day: number, part: number, test?: boolean): string =>
{
    var x = new URL('./data.txt', import.meta.url)
    return x.toString();
}

export default {
    getInput
}