import $ from 'jquery';

export class App {
    constructor() {
        this.balls = [];
        this.walls = [];
    }
    attached() {
        this.balls.push(
            {
                x: document.body.clientWidth / 2,
                y: document.body.clientHeight / 2
            },
        )
        this.walls.push(
            { x: document.body.clientWidth },
            { y: document.body.clientHeight },
            { x: 0 },
            { y: 0 },
        );
    }
}
