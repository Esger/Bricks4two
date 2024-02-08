import $ from 'jquery';

export class App {
    constructor() {
        this.walls = [];
    }
    attached() {
        this.walls.push(
            { x: window.innerWidth },
            { y: window.innerHeight },
            { x: 0 },
            { y: 0 },
        );
    }
}
