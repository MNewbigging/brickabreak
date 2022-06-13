import * as PIXI from 'pixi.js';
import blueboard from '/assets/blueboard.png';

import { Entity } from './Entity';
import { KeyboardListener } from '../listeners/KeyboardListener';

export class Paddle extends Entity {
  public speed = 3;
  public halfWidth = 0;

  constructor(private keyboardListener: KeyboardListener) {
    super();

    // Create the sprite for the board
    this.sprite = new PIXI.Sprite(PIXI.Loader.shared.resources[blueboard].texture);
    this.sprite.anchor.set(0.5, 0.5);

    // Create the rectangle shape for the bounds
    this.bounds = new PIXI.Rectangle(0, 0, 175, 25);

    // Set size props
    this.halfWidth = this.bounds.width / 2;
  }

  public update(dt: number) {
    // Controls
    this.moveBoard(dt);
  }

  private moveBoard(dt: number) {
    // Left
    if (this.keyboardListener.anyKeysPressed(['a', 'arrowleft'])) {
      this.x = this.x - dt * this.speed;
    }
    // Right
    if (this.keyboardListener.anyKeysPressed(['d', 'arrowright'])) {
      this.x = this.x + dt * this.speed;
    }
  }
}
