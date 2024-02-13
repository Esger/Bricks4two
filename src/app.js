import $ from 'jquery';

export class App {
    constructor() {
        this.balls = [];
        this.walls = [];
    }
    attached() {
        this._initWalls();
        this._initBorder();
        this._initBalls();
    }
    _initBalls() {
        this.balls.push(
            {
                x: document.body.clientWidth / 2,
                y: document.body.clientHeight / 2,
                type: 'player'
            },
            {
                x: document.body.clientWidth / 2,
                y: document.body.clientHeight / 2,
                type: 'computer'
            },
        )
    }
    _initWalls() {
        this.walls.push(
            {
                x: document.body.clientWidth,
                type: 'vertical'
            },
            {
                y: document.body.clientHeight,
                type: 'horizontal'
            },
            {
                x: 0,
                type: 'vertical'
            },
            {
                y: 0,
                type: 'horizontal'
            },
        )
    }
    _initBorder() {
        const initialBrickCount = 4;
        const brickWidth = document.body.clientWidth / initialBrickCount;
        for (let i = 0; i < initialBrickCount; i++) {
            this.walls.push({
                x: i * (brickWidth),
                y: document.body.clientHeight / 2,
                length: brickWidth, // or brickHeight for vertical
                type: 'horizontal border'
            });
        }
    }
}
