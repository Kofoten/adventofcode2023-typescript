import Challenge from '../challenge.ts';

interface Set {
    red: number;
    green: number;
    blue: number;
}

interface Game {
    id: number;
    sets: Set[];
}

const GameIdRegex = /^Game (\d+)$/;
const ValueRegex = /^(\d+) (red|green|blue)$/;

const parseGame = (line: string): Game => {
    const [gameName, gameString] = line.split(':');
    const gameId = parseInt(GameIdRegex.exec(gameName)![1]);
    const game: Game = {
        id: gameId,
        sets: [],
    };

    gameString.split(';').forEach((setString) => {
        const set: Set = {
            red: 0,
            green: 0,
            blue: 0,
        };

        setString
            .split(',')
            .map((x) => x.trim())
            .forEach((valueString) => {
                const match = ValueRegex.exec(valueString)!;
                switch (match[2]) {
                    case 'red':
                        set.red = parseInt(match[1]);
                        break;
                    case 'green':
                        set.green = parseInt(match[1]);
                        break;
                    case 'blue':
                        set.blue = parseInt(match[1]);
                        break;
                    default:
                        break;
                }
            });

        game.sets.push(set);
    });

    return game;
};

const isGamePossible = (game: Game, limits: Set): boolean =>
    game.sets.every((set) => set.red <= limits.red && set.green <= limits.green && set.blue <= limits.blue);

const calculateSmallestPossibleSet = (game: Game): Set => {
    const minset: Set = {
        red: 0,
        green: 0,
        blue: 0,
    };

    game.sets.forEach((set) => {
        if (set.red > minset.red) {
            minset.red = set.red;
        }

        if (set.green > minset.green) {
            minset.green = set.green;
        }

        if (set.blue > minset.blue) {
            minset.blue = set.blue;
        }
    });

    return minset;
};

const challenge: Challenge = {
    part1: (input: string): string =>
        input
            .trimEnd()
            .split('\n')
            .map((line) => {
                const game = parseGame(line);
                const limits: Set = {
                    red: 12,
                    green: 13,
                    blue: 14,
                };

                return isGamePossible(game, limits) ? game.id : 0;
            })
            .reduce((acc, val) => acc + val, 0)
            .toString(),
    part2: (input: string): string =>
        input
            .trimEnd()
            .split('\n')
            .map((line) => {
                const game = parseGame(line);
                const minset = calculateSmallestPossibleSet(game);

                return minset.red * minset.green * minset.blue;
            })
            .reduce((acc, val) => acc + val, 0)
            .toString(),
};

export default challenge;
