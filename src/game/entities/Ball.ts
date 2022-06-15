import * as PIXI from 'pixi.js';
import darkEnergyBall from '/assets/darkEnergyBall.png';

import { CircleEntity, IPhysicsEntity } from './Entity';
import { Vec2 } from '../utils/Vec2';

export class Ball extends CircleEntity implements IPhysicsEntity {
  public radius = 1;
  public speed = 10;
  public velocity = new Vec2(0, -1);

  constructor() {
    super(darkEnergyBall);

    // Scale since image is massive
    this.sprite.scale.set(0.035, 0.035);

    // Create the circle shape for the ball
    this.bounds = new PIXI.Circle(0, 0, this.sprite.width);
    this.radius = this.sprite.width / 2 - 5;
  }

  public update(dt: number) {
    // Move
    const x = this.sprite.x + this.velocity.x * dt * this.speed;
    const y = this.sprite.y + this.velocity.y * dt * this.speed;
    this.setPosition(x, y);
  }
}
