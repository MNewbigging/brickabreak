import * as PIXI from 'pixi.js';
import blueboard from '/assets/blueboard.png';
import darkEnergyBall from '/assets/darkEnergyBall.png';

import { Entity } from './Entity';
import { GameEventListener, GameEventType } from '../listeners/GameEventListener';
import { KeyboardListener } from '../listeners/KeyboardListener';

export class Paddle extends Entity {
  public speed = 3;
  public halfWidth = 0;

  private rackedBalls: PIXI.Sprite[] = [];
  private maxRackSize = 3;

  constructor(
    private app: PIXI.Application,
    private keyboardListener: KeyboardListener,
    private eventListener: GameEventListener
  ) {
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
    this.moveBoard(dt);
    this.moveRackedBalls();
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

  private moveRackedBalls() {
    this.rackedBalls.forEach((rb: PIXI.Sprite, idx: number) => this.positionRackBall(rb, idx));
  }

  private positionRackBall(rb: PIXI.Sprite, position: number) {
    switch (position) {
      case 0:
        rb.x = this.x;
        break;
      case 1:
        rb.x = this.x + 50;
        break;
      case 2:
        rb.x = this.x - 50;
        break;
    }
  }

  private rackNewBall = () => {
    // Racks up to maxRackSize new balls to be fired. Resets to 0 after max racked.
    if (this.rackedBalls.length < this.maxRackSize) {
      // Create a new rack ball
      const rackBall = this.createRackBall(this.rackedBalls.length);

      // Add the ball to rack and stage it
      this.rackedBalls.push(rackBall);
      this.app.stage.addChild(rackBall);
    } else {
      // Clear the rack and unstage
      this.clearRackedBalls();
    }
  };

  private clearRackedBalls() {
    this.rackedBalls.forEach((rb) => {
      this.app.stage.removeChild(rb);
    });
    this.rackedBalls = [];
  }

  private createRackBall(position: number) {
    const rackBall = new PIXI.Sprite(PIXI.Loader.shared.resources[darkEnergyBall].texture);
    rackBall.anchor.set(0.5, 0.5);
    rackBall.scale.set(0.035, 0.035);
    rackBall.y = this.y - 25;

    this.positionRackBall(rackBall, position);

    return rackBall;
  }

  private fireNewBalls = () => {
    if (!this.rackedBalls.length) {
      return;
    }

    // Fire the racked balls
    this.rackedBalls.forEach((rb) =>
      this.eventListener.fireEvent({ type: GameEventType.FIRE_BALL, position: rb.position })
    );

    // Clear racked balls
    this.clearRackedBalls();
  };
}
