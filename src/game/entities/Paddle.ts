import * as PIXI from 'pixi.js';
import blueboard from '/assets/blueboard.png';
import darkEnergyBall from '/assets/darkEnergyBall.png';

import { GameEventListener, GameEventType } from '../listeners/GameEventListener';
import { KeyboardListener } from '../listeners/KeyboardListener';
import { RectangleEntity } from './Entity';
import { Vec2 } from '../utils/Vec2';

export class Paddle extends RectangleEntity {
  public speed = 3;
  public width = 0;
  public halfWidth = 0;
  public height = 0;
  public halfHeight = 0;

  private rackedBalls: PIXI.Sprite[] = [];
  private maxRackSize = 3;

  constructor(
    private app: PIXI.Application,
    private keyboardListener: KeyboardListener,
    private eventListener: GameEventListener
  ) {
    super(blueboard);

    // Until the blueboard image is right size, do this fudge
    this.width = 175;
    this.halfWidth = this.width / 2;
    this.height = 30;
    this.halfHeight = this.height / 2;
    this.bounds = new PIXI.Rectangle(-this.halfWidth, -this.halfHeight, this.width, this.height);

    console.log('paddle sprite', this.sprite);
    console.log('paddle rect', this.bounds);

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
      const x = this.position.x - dt * this.speed;
      this.setX(x);
    }
    // Right
    if (this.keyboardListener.anyKeysPressed(['d', 'arrowright'])) {
      const x = this.position.x + dt * this.speed;
      this.setX(x);
    }
  }

  private moveRackedBalls() {
    this.rackedBalls.forEach((rb: PIXI.Sprite, idx: number) => this.positionRackBall(rb, idx));
  }

  private positionRackBall(rb: PIXI.Sprite, position: number) {
    switch (position) {
      case 0:
        rb.x = this.position.x;
        break;
      case 1:
        rb.x = this.position.x + 50;
        break;
      case 2:
        rb.x = this.position.x - 50;
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
    rackBall.y = this.position.y - 25;

    this.positionRackBall(rackBall, position);

    return rackBall;
  }

  private fireNewBalls = () => {
    if (!this.rackedBalls.length) {
      return;
    }

    // Fire the racked balls
    this.rackedBalls.forEach((rb) =>
      this.eventListener.fireEvent({
        type: GameEventType.FIRE_BALL,
        position: new Vec2(rb.position.x, rb.position.y),
      })
    );

    // Clear racked balls
    this.clearRackedBalls();
  };
}
