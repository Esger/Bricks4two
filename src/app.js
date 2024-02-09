import $ from 'jquery';

export class App {
    constructor() {
        this.walls = [];
    }
    attached() {
        this.walls.push(
            { x: document.body.clientWidth },
            { y: document.body.clientHeight },
            { x: 0 },
            { y: 0 },
        );
    }
}
