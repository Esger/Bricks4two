import { inject, bindable } from 'aurelia-framework';

@inject(Element)
export class Ball {
    @bindable walls;
    speed = 500; // px/s
    angle = 0; // radians
    constructor(element) {
        this._element = element;
    }

    // y - y1 = sin(θ) * (x - x1)
    _y = x => {
        const left = this._quadrant == 2 ? -1 : 1;
        return left * (x - this.currentPosition.x) * Math.sin(this.angle) + this.currentPosition.y;
    }
    _x = y => {
        const up = this._quadrant == 3 ? -1 : 1;
        return up * (y - this.currentPosition.y) * Math.cos(this.angle) + this.currentPosition.x;
    }

    attached() {
        this._setCurrentPosition();
        $('body').on('click', event => {
            this._setAngle(event.clientX, event.clientY);
            const intersections = this._calculateWallIntersection();
            this.moveTo(...intersections[this._quadrant]);
        });
        $(this._element).on('transitionend', _ => {
            // this._anticipateNextMove();
        });
    }

    _anticipateNextMove() {
        this._calculateTargetPosition();
        this.moveToNextPosition();
    }

    _setCurrentPosition() {
        this.currentPosition = {
            x: this._element.getBoundingClientRect().x,
            y: this._element.getBoundingClientRect().y,
        }
        console.log('currentPos:', this.currentPosition);
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

    _calculateWallIntersection() {
        const intersections = this.walls.map(wall => {
            if (wall.x !== undefined) {
                return [wall.x, this._y(wall.x)]
            } else {
                return [this._x(wall.y), wall.y]
            }
        });
        console.log('intersections:', intersections);
        return intersections;
    }

    _getQuadrant(angle) {
        // quadrants 0, 1, 2, 3 (right, down, left, up)
        // 0.25 pi - 0.75 pi -> quadrant 1
        // 0.75 pi - 1.25 pi -> quadrant 2
        // 1.25 pi - 1.75 pi -> quadrant 3
        // 1.75 pi - 2.25 pi -> quadrant 0
        let quadrant;
        switch (true) {
            case angle > 0 && angle < 0.25 * Math.PI:
                quadrant = 0;
                break;
            case angle > 0.25 * Math.PI && angle < 0.75 * Math.PI:
                quadrant = 1;
                break;
            case angle > 0.75 * Math.PI && angle < 1.25 * Math.PI:
                quadrant = 2;
                break;
            case angle > 1.25 * Math.PI && angle < 1.75 * Math.PI:
                quadrant = 3;
                break;
            case angle > 1.75 * Math.PI && angle < 2 * Math.PI:
                quadrant = 0;
                break;
        }
        console.log('quadrant:', quadrant);
        return quadrant;
    }

    _normalizeAngle(angle) {
        // return positive equivalent of angle
        const normalizedAngle = (angle + 2 * Math.PI) % (2 * Math.PI);
        console.log(angle, 'normalizedAngle:', normalizedAngle);
        return normalizedAngle;
    }

    _setAngle(x, y) {
        const dx = x - this.currentPosition.x;
        const dy = y - this.currentPosition.y;
        const angle = Math.atan2(dy, dx);
        this.angle = this._normalizeAngle(angle);
        this._quadrant = this._getQuadrant(this.angle);
        console.log('angle:', this.angle);
    }

    moveTo(x, y) {
        this._setCurrentPosition(x, y);
        this._setTransitionTime(x, y);
        this._setNewPosition(x, y);
    }
}
