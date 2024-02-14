import { bindable, inject } from 'aurelia-framework';
import { WallCustomElement } from './wall';

@inject(Element)
export class WallBorderCustomElement extends WallCustomElement {
    @bindable wall;

    _bump = (direction) => {
        console.log(direction);
        switch (true) {
            case direction.includes('up'):
                if (this.wall.y > this.wall.thickness) {
                    this.wall.y -= this.wall.thickness;
                }
                break;

            case direction.includes('down'):
                if (this.wall.y < this.wall.board.height - this.wall.thickness) {
                    this.wall.y += this.wall.thickness;
                }
                break;

            default:
                break;
        }
        this._setWallPosition();
    }

    _setWallPosition() {
        this._element.style.setProperty('--wallX', this.wall.x + 'px');
        this._element.style.setProperty('--wallY', this.wall.y + 'px');
        this._element.style.setProperty('--wallWidth', this.wall.length + 'px');
        this._element.classList.add('border', 'horizontal');
    }
}
