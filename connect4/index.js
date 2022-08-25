const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const prompt = (query) => new Promise((resolve) => readline.question(query, resolve));

const TO_WIN = 4;

class Board {
    rows = 6;
    columns = 7;
    board = [];
    winner = null;

    constructor() {
        for (let i = 0; i < this.rows; i++) {
            this.board[i] = this.board[i] || [];
            for (let j = 0; j < this.columns; j++) {
                this.board[i][j] = '.';
            }
        }
    }

    insert(piece, column) {
        const highestPiece = this.board.findIndex((row) => {
            return row[column - 1] !== '.';
        });

        const row = highestPiece === -1
            ? this.board.length - 1
            : highestPiece - 1;

        this.board[row][column - 1] = piece;

        if (this.isWinner(row, column - 1, piece)) {
            this.winner = piece;
        };
    }

    isWinner(row, column, piece) {
        // We need to check for how many continuous pieces in each of
        // the 8 directions around it. Top and bottom are reversed
        // because the rows increase _downwards_. Start at -1 because
        // we also count the token that was dropped.
        const directions = {
            t: { delta: [0, -1], count: -1, inverse: 'b' },
            tr: { delta: [1, -1], count: -1, inverse: 'bl' },
            r: { delta: [1, 0], count: -1, inverse: 'l' },
            br: { delta: [1, 1], count: -1, inverse: 'tl' },
            b: { delta: [0, 1], count: -1, inverse: 't' },
            bl: { delta: [-1, 1], count: -1, inverse: 'tr' },
            l: { delta: [-1, 0], count: -1, inverse: 'r' },
            tl: { delta: [-1, -1], count: -1, inverse: 'br' },
        }

        Object.keys(directions).forEach(direction => {
            let [tempRow, tempCol] = [row, column];
            const delta = directions[direction].delta;
            while (this.board[tempRow] && this.board[tempRow][tempCol] === piece) {
                directions[direction].count++;
                tempRow += delta[1];
                tempCol += delta[0];
            }
        });

        return Object.keys(directions).some(direction => {
            return directions[direction].count + directions[directions[direction].inverse].count >= TO_WIN - 1;
        });
    }

    display() {
        const headings = [...Array(this.columns+1).keys()].slice(1);
        console.log(...headings);

        for (let row of this.board) {
            console.log(...row);
        }
    }
}

class Game {
    board;
    players = ['X', '0'];
    turn = 0;
    finished = false;

    constructor() {
        this.board = new Board();
    }

    async play() {
        this.board.display();
        
        while (!this.finished) {
            const currentPlayer = this.players[this.turn % this.players.length];
            const column = parseInt(await prompt(`Player ${currentPlayer}: `), 10);

            if (isNaN(column) || column < 0 || column > this.board.columns) {
                continue;
            }

            this.board.insert(currentPlayer, column);
            this.board.display();
            if (this.board.winner) this.finish(this.board.winner);
            this.turn++;
        }
    }

    finish(piece) {
        this.finished = true;
        console.log(`${piece} wins!`)
    }
}

const game = new Game();
game.play();