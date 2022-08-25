const { describe, it, expect } = globalThis.Bun.jest(import.meta.path);
const { Deck, Card, Player, Game } = require('./index.js');

describe("deck", () => {
    it("builds a deck", () => {
        const deck = new Deck();
        expect(deck.cards.length).toBe(52);
        expect(deck.cards[0].rank).toBe(1);
        expect(deck.cards[0].suit).toBe('spade');
    });

    it("shuffles a deck", () => {
        const deck = new Deck();
        const unshuffled = deck.order;
        deck.shuffle();
        expect(unshuffled === deck.order).toBe(false);
    });

    it("deals to a player", () => {
        const charles = new Player('Charles');
        const deck = new Deck();
        deck.deal(charles);

        expect(charles.cards.length).toBe(1);
        expect(charles.cards[0].rank).toBe(13);
        expect(charles.cards[0].suit).toBe('heart');
    });
});

describe("player", () => {
    it("has a score", () => {
        const charles = new Player("Charles");
        const deck = new Deck();
        deck.deal(charles);

        expect(charles.score).toBe(13);
    })

    it("can have blackjack", () => {
        const charles = new Player("Charles");
        charles.cards.push(new Card(13, 'heart'));
        charles.cards.push(new Card(8, 'spade'));

        expect(charles.hasBlackjack).toBe(true);
    });
});

describe("game", () => {
    it("plays a game", () => {
        const game = new Game();
        const result = game.play();

        expect(game.sam.score > 0).toBe(true);
        if (game.sam.score < 22) {
            expect(game.dealer.score > 0).toBe(true);
        }
        
        expect([game.sam, game.dealer, null].includes(result));
    });
});