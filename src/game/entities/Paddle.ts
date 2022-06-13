import * as PIXI from 'pixi.js';
import blueboard from '/assets/blueboard.png';

import { KeyboardListener } from '../listeners/KeyboardListener';

export class Paddle {
  public sprite: PIXI.Sprite;
  public speed = 3;
  public halfWidth = 0;

  private rect: PIXI.Rectangle;

  constructor(private keyboardListener: KeyboardListener) {
    // Create the sprite for the board
    this.sprite = new PIXI.Sprite(PIXI.Loader.shared.resources[blueboard].texture);
    this.sprite.anchor.set(0.5, 0.5);

    // Create the rectangle shape for the bounds
    this.rect = new PIXI.Rectangle(0, 0, 175, 25);

    // Set size props
    this.halfWidth = this.rect.width / 2;
  }

  public get x() {
    return this.sprite.x;
  }

  public get y() {
    return this.sprite.y;
  }

  public setPosition(x: number, y: number) {
    this.sprite.x = x;
    this.sprite.y = y;
    this.rect.x = x;
    this.rect.y = y;
  }

  public setPositionX(x: number) {
    this.sprite.x = x;
    this.rect.x = x;
  }

  public setPositionY(y: number) {
    this.sprite.y = y;
    this.rect.y = y;
  }

  public update(dt: number) {
    // Controls
    this.moveBoard(dt);
  }

  private moveBoard(dt: number) {
    // Left

    if (this.keyboardListener.anyKeysPressed(['a', 'arrowleft'])) {
      const x = this.x - dt * this.speed;
      this.setPositionX(x);
    }
    // Right
    if (this.keyboardListener.anyKeysPressed(['d', 'arrowright'])) {
      const x = this.x + dt * this.speed;
      this.setPositionX(x);
    }
  }
}
