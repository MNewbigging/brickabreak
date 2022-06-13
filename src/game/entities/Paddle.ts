import * as PIXI from 'pixi.js';
import blueboard from '/assets/blueboard.png';
import darkEnergyBall from '/assets/darkEnergyBall.png';

import { Entity } from './Entity';
import { KeyboardListener } from '../listeners/KeyboardListener';

export class Paddle extends Entity {
  public speed = 3;
  public halfWidth = 0;

  private rackedBalls: PIXI.Sprite[] = [];
  private maxRackSize = 3;

  constructor(private keyboardListener: KeyboardListener, private app: PIXI.Application) {
    super();

    // Create the sprite for the board
    this.sprite = new PIXI.Sprite(PIXI.Loader.shared.resources[blueboard].texture);
    this.sprite.anchor.set(0.5, 0.5);

    // Create the rectangle shape for the bounds
    this.bounds = new PIXI.Rectangle(0, 0, 175, 25);

    // Set size props
    this.halfWidth = this.bounds.width / 2;

    // Controls
    keyboardListener.on('r', this.rackNewBall);
    keyboardListener.on(' ', this.fireNewBalls);
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

  private rackNewBall = () => {
    // Racks up to maxRackSize new balls to be fired. Resets to 0 after max racked.
    if (this.rackedBalls.length < this.maxRackSize) {
      // Create a new rack ball
      const rackBall = this.createRackBall(this.rackedBalls.length);

      // Racked balls are centred above paddle

      // Add the ball to rack and stage it
      this.rackedBalls.push(rackBall);
      this.sprite.addChild(rackBall);
      this.app.stage.addChild(rackBall);
    } else {
      // Clear the rack
      this.rackedBalls.forEach((rb) => {
        this.sprite.removeChild(rb);
        this.app.stage.removeChild(rb);
      });
      this.rackedBalls = [];
    }
  };

  private createRackBall(position: number) {
    const rackBall = new PIXI.Sprite(PIXI.Loader.shared.resources[darkEnergyBall].texture);
    rackBall.anchor.set(0.5, 0.5);
    rackBall.scale.set(0.035, 0.035);
    rackBall.y = this.y - 25;

    switch (position) {
      case 0:
        rackBall.x = this.x;
        break;
      case 1:
        rackBall.x = this.x + 50;
        break;
      case 2:
        rackBall.x = this.x - 50;
        break;
    }

    return rackBall;
  }

  private fireNewBalls = () => {
    if (!this.rackedBalls.length) {
      return;
    }

    // Fire the new balls!
  };
}
