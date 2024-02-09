import { inject, bindable } from 'aurelia-framework';

@inject(Element)
export class Ball {
    @bindable walls;
    speed = 500; // px/s
    angle = 0; // radians
    constructor(element) {
        this._element = element;
    }

    _y = x => {
        // y = a * x + b
        // b = startPoint_Y - (tan(angle) * startPoint_X)
        const a = Math.tan(this.angle);
        const b = this.currentPosition.y - a * this.currentPosition.x;
        return a * x + b;
    }
    _x = y => {
        // y - b = a * x
        // x = (y - b) / a
        const a = Math.tan(this.angle);
        const b = this.currentPosition.y - a * this.currentPosition.x;
        // guard for a == 0 
        // todo + or - Number.EPSILON
        return (y - b) / (a || Number.EPSILON);
    }

    attached() {
        console.clear();
        this.currentPosition = this._getCurrentPosition();
        $('body').on('click', event => {
            const point = { x: event.clientX, y: event.clientY };
            this._setAngle(point);
            const target = this._calculateClosestWallIntersectionAhead();
            this.moveTo(target);
        });
        // $(this._element).one('transitionend', _ => {
        //     this._setNewAngle();
        //     const target = this._calculateClosestWallIntersectionAhead();
        //     this.moveTo(...target);
        // });
    }

    _anticipateNextMove() {
        this._calculateTargetPosition();
        this.moveToNextPosition();
    }

    _getCurrentPosition() {
        const rect = this._element.getBoundingClientRect();
        const currentPosition = {
            x: rect.x,
            y: rect.y
        }
        return currentPosition;
    }

    _setTransitionTime(point) {
        const dx = point.x - this.currentPosition.x;
        const dy = point.y - this.currentPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const transitionTime = distance / this.speed;
        this._element.style.setProperty('--transitionTime', transitionTime + 's');
    }

    _setNewPosition(point) {
        this._element.style.setProperty('--ballX', point.x + 'px');
        this._element.style.setProperty('--ballY', point.y + 'px');
    }

    _calculateClosestWallIntersectionAhead() {
        // return an array [x, y] for each wall that intersects with the ball's path
        // should only return the intersection for the closest wall ahead of the ball
        const distance = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
        const intersections = this.walls.map(wall => {
            // a wall is either an x coordinate or a y coordinate
            const intersection = {};
            if (wall.x !== undefined) {
                intersection.x = wall.x;
                intersection.y = this._y(wall.x);
            } else {
                intersection.x = this._x(wall.y);
                intersection.y = wall.y;
            }
            const dx = intersection.x - this.currentPosition.x;
            const dy = intersection.y - this.currentPosition.y;
            const angle = Math.atan2(dy, dx);
            intersection.angle = this._normalizeAngle(angle);
            intersection.distance = distance(this.currentPosition, intersection);
            return intersection;
        });
        // get the one(s) ahead of the ball
        const isOnPath = intersection => Math.abs(intersection.angle - this.angle) < 0.01;
        const intersectionsAhead = intersections.filter(intersection => isOnPath(intersection));

        // get the closest intersection(s) first   
        intersectionsAhead.sort((a, b) => a.distance - b.distance);

        console.table('intersections:', intersectionsAhead);
        return intersectionsAhead[0];
    }

    _normalizeAngle(angle) {
        // return positive equivalent of angle
        const normalizedAngle = (angle + 2 * Math.PI) % (2 * Math.PI);
        console.log(this._rad2deg(angle), 'normalizedAngle:', this._rad2deg(normalizedAngle));
        return normalizedAngle;
    }

    _rad2deg(angle) {
        return angle * (180 / Math.PI);
    }

    _setAngle(point) {
        const dx = point.x - this.currentPosition.x;
        const dy = point.y - this.currentPosition.y;
        const angle = Math.atan2(dy, dx);
        this.angle = this._normalizeAngle(angle);
    }

    moveTo(point) {
        this.currentPosition = this._getCurrentPosition();
        this._setTransitionTime(point);
        this._setNewPosition(point);
    }
}
