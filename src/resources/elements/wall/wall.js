import { bindable, inject } from 'aurelia-framework';

@inject(Element)
export class WallCustomElement {
    @bindable wall;

    constructor(element) {
        this._element = element;
    }

    bind() {
        this.wall.bump = this._bump;
    }

    _bump() {
        // no can bump
    }

    attached() {
        this._setWallPosition();
    }

    _setWallPosition() {
        if (this.wall.type.includes('vertical')) {
            this._element.style.setProperty('--wallX', this.wall.x + 'px');
            this._element.classList.add('vertical');
        } else {
            this._element.style.setProperty('--wallY', this.wall.y + 'px');
            this._element.classList.add('horizontal');
        }
    }
}
