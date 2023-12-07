import Challenge from '../challenge.ts';

interface Hand {
    type: HandType;
    cards: number[];
    bid: number;
    counts: { [key: number]: number };
}

enum HandType {
    FiveOfKind = 0,
    FourOfKind = 1,
    FullHouse = 2,
    ThreeOfKind = 3,
    TwoPair = 4,
    OnePair = 5,
    HighCard = 6,
    Unknown = 7,
}

const runChallenge = (input: string, jIsJoker?: boolean): number => {
    const hands: Hand[] = [];
    input
        .trimEnd()
        .split('\n')
        .map((line) => {
            const [handStr, bid] = line.split(' ');
            const hand: Hand = {
                type: HandType.Unknown,
                bid: parseInt(bid, 10),
                cards: [],
                counts: {},
            };

            for (let i = 0; i < handStr.length; i++) {
                let value = parseInt(handStr[i]);
                if (Number.isNaN(value)) {
                    switch (handStr[i]) {
                        case 'T':
                            value = 10;
                            break;
                        case 'J':
                            value = jIsJoker ? 1 : 11;
                            break;
                        case 'Q':
                            value = 12;
                            break;
                        case 'K':
                            value = 13;
                            break;
                        case 'A':
                            value = 14;
                            break;
                        default:
                            break;
                    }
                }

                hand.cards.push(value);

                if (hand.counts[value]) {
                    hand.counts[value]++;
                } else {
                    hand.counts[value] = 1;
                }
            }

            if (jIsJoker && hand.counts[1]) {
                const entries = Object.entries(hand.counts)
                    .map((e) => [parseInt(e[0], 10), e[1]])
                    .sort((a, b) => {
                        const x = b[1] - a[1];
                        return x === 0 ? b[0] - a[0] : x;
                    });

                if (entries[0][0] === 1) {
                    if (entries[1]) {
                        hand.counts[entries[1][0]] += hand.counts[1];
                        delete hand.counts[1];
                    } else {
                        hand.counts = { 14: 5 };
                    }
                } else {
                    hand.counts[entries[0][0]] += hand.counts[1];
                    delete hand.counts[1];
                }
            }

            const values = Object.values(hand.counts);
            switch (values.length) {
                case 1:
                    hand.type = HandType.FiveOfKind;
                    break;
                case 2:
                    if (values.some((v) => v === 4)) {
                        hand.type = HandType.FourOfKind;
                    } else {
                        hand.type = HandType.FullHouse;
                    }
                    break;
                case 3:
                    if (values.some((v) => v === 3)) {
                        hand.type = HandType.ThreeOfKind;
                    } else {
                        hand.type = HandType.TwoPair;
                    }
                    break;
                case 4:
                    hand.type = HandType.OnePair;
                    break;
                case 5:
                    hand.type = HandType.HighCard;
                    break;
                default:
                    break;
            }

            let added = false;
            for (let i = 0; i < hands.length; i++) {
                if (compareHands(hand, hands[i]) === -1) {
                    hands.splice(i, 0, hand);
                    added = true;
                    break;
                }
            }

            if (!added) {
                hands.push(hand);
            }
        });

    return hands.reduce((acc, val, idx) => acc + val.bid * (1 + idx), 0);
};

const compareHands = (hand: Hand, other: Hand): number => {
    if (hand.type > other.type) {
        return -1;
    }

    if (hand.type < other.type) {
        return 1;
    }

    for (let i = 0; i < 5; i++) {
        if (hand.cards[i] > other.cards[i]) {
            return 1;
        }

        if (hand.cards[i] < other.cards[i]) {
            return -1;
        }
    }

    return 0;
};

const challenge: Challenge = {
    part1: (input: string): string => runChallenge(input, false).toString(),
    part2: (input: string): string => runChallenge(input, true).toString(),
};

export default challenge;
