import { bindable, inject } from 'aurelia-framework';

@inject(Element)
export class Wall {
    @bindable wall;

    constructor(element) {
        this._element = element;
    }

    attached() {
        this._setWallPosition();
    }

    _setWallPosition() {
        if (this.wall.x !== undefined) {
            this._element.style.setProperty('--wallX', this.wall.x + 'px');
            this._element.classList.add('vertical');
        } else {
            this._element.style.setProperty('--wallY', this.wall.y + 'px');
            this._element.classList.add('horizontal');
        }
    }
}
