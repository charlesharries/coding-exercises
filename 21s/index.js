export class Deck {
    suits = ['spade', 'diamond', 'club', 'heart'];
    ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    cards = [];

    constructor() {
        this.suits.forEach(suit => {
            this.ranks.forEach(rank => {
                this.cards.push(new Card(rank, suit));
            })
        })
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    get order() {
        return this.cards.reduce((all, card) => {
            return `${all} ${card.rank}.${card.suit}`;
        }, "").trim();
    }

    /**
     * 
     * @param {Player} player 
     */
    deal(player) {
        player.cards.push(this.cards.pop());
    }
}

export class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }
}

export class Player {
    /** @type {Card[]} */
    cards = [];

    constructor(name) {
        this.name = name;
    }

    get score() {
        return this.cards.reduce((sum, card) => sum + card.rank, 0);
    }

    get hasBlackjack() {
        return this.score == 21;
    }
}

const WIN = "win";
const LOSE = "lose";

export class Game {
    deck;
    sam;
    dealer;

    constructor() {
        this.deck = new Deck();
        this.sam = new Player('sam');
        this.dealer = new Player('dealer');
    }

    takeTurn(player) {
        while (player.score < 17) {
            this.deck.deal(player);
        }
        if (player.hasBlackjack) return WIN;
        if (player.score > 21) return LOSE;
        return null;
    }

    play() {
        this.deck.shuffle();

        // Sam's turn
        let result = this.takeTurn(this.sam);
        if (result === WIN) return this.sam;
        if (result === LOSE) return this.dealer;

        // Dealer's turn
        result = this.takeTurn(this.dealer);
        if (result === WIN) return this.dealer;
        if (result === LOSE) return this.sam;

        // Did they tie?
        if (this.dealer.score === this.sam.score) return null;

        // Who wins?
        return this.dealer.score > this.sam.score
            ? this.dealer
            : this.sam;
    }
}
