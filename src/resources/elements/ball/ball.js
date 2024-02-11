import { inject, bindable } from 'aurelia-framework';

@inject(Element)
export class Ball {
    @bindable walls;
    _speed = 500; // px/s
    _angle = 0; // radians
    constructor(element) {
        this._element = element;
    }

    attached() {
        console.clear();
        this._position = this._getCurrentPosition();
        $('body').on('click', event => {
            const point = { x: event.clientX, y: event.clientY };
            this._setAngle(point);
            const target = this._findClosestWallIntersectionAhead();
            this._wall = this.walls[target.wallIndex];
            this.moveTo(target);
        });
        $(this._element).on('transitionend', _ => {
            this._position = this._getCurrentPosition();
            this._setReflectedAngle();
            const target = this._findClosestWallIntersectionAhead();
            this._wall = this.walls[target.wallIndex];
            this.moveTo(target);
        });
    }

    _anticipateNextMove() {
        this._calculateTargetPosition();
        this.moveToNextPosition();
    }

    _getCurrentPosition() {
        const rect = this._element.getBoundingClientRect();
        const _currentPosition = {
            x: rect.x,
            y: rect.y
        }
        return _currentPosition;
    }

    _setTransitionTime(point) {
        const dx = point.x - this._position.x;
        const dy = point.y - this._position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const transitionTime = distance / this._speed;
        this._element.style.setProperty('--transitionTime', transitionTime + 's');
    }

    _setNewPosition(point) {
        this._element.style.setProperty('--ballX', point.x + 'px');
        this._element.style.setProperty('--ballY', point.y + 'px');
    }

    _y = x => {
        // y = a * x + b
        // b = startPoint_Y - (tan(angle) * startPoint_X)
        const a = Math.tan(this._angle);
        const b = this._position.y - a * this._position.x;
        return a * x + b;
    }
    _x = y => {
        // y - b = a * x
        // x = (y - b) / a
        const a = Math.tan(this._angle);
        const b = this._position.y - a * this._position.x;
        // guard for a == 0 
        // todo + or - Number.EPSILON
        return (y - b) / (a || Number.EPSILON);
    }

    _getIntersections() {
        const distance = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
        const intersections = this.walls.map((wall, index) => {
            // a wall is either an x coordinate or a y coordinate
            const intersection = {};
            if (wall.x !== undefined) {
                intersection.x = wall.x;
                intersection.y = this._y(wall.x);
                intersection.dx = intersection.x - this._position.x;
                intersection.dy = intersection.y - this._position.y;
                intersection.directionToBall = intersection.dx > 0 ? 'right' : 'left';
            } else {
                intersection.x = this._x(wall.y);
                intersection.y = wall.y;
                intersection.dx = intersection.x - this._position.x;
                intersection.dy = intersection.y - this._position.y;
                intersection.directionToBall = intersection.dy > 0 ? 'down' : 'up';
            }
            intersection.isAhead = this._direction.includes(intersection.directionToBall);
            if (intersection.isAhead) {
                const angle = Math.atan2(intersection.dy, intersection.dx);
                intersection.angle = this._normalizeAngle(angle);
                intersection.distance = distance(this._position, intersection);
            }
            intersection.wallIndex = index;
            return intersection;
        });
        return intersections;
    }

    _findClosestWallIntersectionAhead() {
        // return an array [x, y] for each wall that intersects with the ball's path
        const intersections = this._getIntersections();

        // but not the one on the current wall
        const newIntersections = intersections.filter(intersection => intersection.wallIndex !== this.walls.indexOf(this._wall));

        // return only the intersection with the closest wall ahead of the ball
        const intersectionsAhead = newIntersections.filter(intersection => intersection.isAhead);

        // get the closest intersection(s) first 
        intersectionsAhead.sort((a, b) => a.distance - b.distance);

        console.table('intersections:', intersectionsAhead);
        return intersectionsAhead[0];
    }

    _normalizeAngle(angle) {
        // return positive equivalent of angle
        let normalizedAngle = angle;
        while (normalizedAngle < 0) {
            normalizedAngle += (2 * Math.PI);
        }
        normalizedAngle = normalizedAngle % (2 * Math.PI);
        console.log(this._rad2deg(angle), 'normalizedAngle:', this._rad2deg(normalizedAngle));
        return normalizedAngle;
    }

    _rad2deg(angle) {
        return angle * (180 / Math.PI);
    }

    _getDirection(angle) {
        let direction;
        switch (true) {
            case angle >= 0 && angle < 0.5 * Math.PI:
                direction = 'right down';
                break;
            case angle >= 0.5 * Math.PI && angle < Math.PI:
                direction = 'left down';
                break;
            case angle >= Math.PI && angle < 1.5 * Math.PI:
                direction = 'left up';
                break;
            case angle >= 1.5 * Math.PI && angle < 2 * Math.PI:
                direction = 'right up';
                break;
        }
        return direction;
    }

    _setAngle(point) {
        const dx = point.x - this._position.x;
        const dy = point.y - this._position.y;
        const angle = Math.atan2(dy, dx);
        this._angle = this._normalizeAngle(angle);
        this._direction = this._getDirection(this._angle);
    }

    _setReflectedAngle() {
        let newAngle;
        if (this._wall.x !== undefined) {
            newAngle = Math.PI - this._angle;
        } else {
            newAngle = 0 - this._angle;
        }
        this._angle = this._normalizeAngle(newAngle);
        this._direction = this._getDirection(this._angle);
    }

    moveTo(point) {
        this._setTransitionTime(point);
        this._setNewPosition(point);
    }
}
