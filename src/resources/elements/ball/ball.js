import { inject } from 'aurelia-framework';

@inject(Element)
export class Ball {
    speed = 500; // px/s
    constructor(element) {
        this._element = element;
        $('body').on('click', event => {
            this.moveTo(event.clientX, event.clientY);
        });
    }

    attached() {
    }

    _setCurrentPosition() {
        this.currentPosition = {
            x: this._element.getBoundingClientRect().x,
            y: this._element.getBoundingClientRect().y,
        }
    }

    _setTransitionTime(x, y) {
        const dx = x - this.currentPosition.x;
        const dy = y - this.currentPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const transitionTime = distance / this.speed;
        this._element.style.setProperty('--transitionTime', transitionTime + 's');
    }

    _setNewPosition(x, y) {
        this._element.style.setProperty('--ballX', x + 'px');
        this._element.style.setProperty('--ballY', y + 'px');
    }

    moveTo(x, y) {
        this._setCurrentPosition(x, y);
        this._setTransitionTime(x, y);
        this._setNewPosition(x, y);
    }
}
