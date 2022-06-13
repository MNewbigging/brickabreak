import * as PIXI from 'pixi.js';
import blueboard from '/assets/blueboard.png';

export class Paddle {
  public sprite: PIXI.Sprite;

  constructor() {
    // Create the sprite for the board
    this.sprite = new PIXI.Sprite(PIXI.Loader.shared.resources[blueboard].texture);
    this.sprite.anchor.set(0.5, 0.5);
  }

  public setPosition(x: number, y: number) {
    this.sprite.x = x;
    this.sprite.y = y;
  }
}
