import * as PIXI from 'pixi.js';
import darkEnergyBall from '/assets/darkEnergyBall.png';

import { PhysicsEntity } from './Entity';

export class Ball extends PhysicsEntity {
  public radius = 1;

  constructor() {
    super();

    // Create the sprite for the ball, center origin
    this.sprite = new PIXI.Sprite(PIXI.Loader.shared.resources[darkEnergyBall].texture);
    this.sprite.anchor.set(0.5, 0.5);

    // Scale since image is massive
    this.sprite.scale.set(0.035, 0.035);

    // Create the circle shape for the ball
    this.bounds = new PIXI.Circle(0, 0, this.sprite.width);
    this.radius = this.sprite.width / 2;

    // Default settings
    this.speed = 3;
    this.velocity.x = 0;
    this.velocity.y = -1;
  }

  public update(dt: number) {
    // Move
    const x = this.sprite.x + this.velocity.x * dt * this.speed;
    const y = this.sprite.y + this.velocity.y * dt * this.speed;
    this.setPosition(x, y);
  }

  public checkBoundsCollisions(maxWidth: number, maxHeight: number) {
    let collided = false;

    // Horizontal
    if (this.sprite.x + this.radius > maxWidth) {
      this.x = maxWidth - this.radius;
      this.velocity.x *= -1;
      collided = true;
    } else if (this.sprite.x - this.radius < 0) {
      this.x = 0 + this.radius;
      this.velocity.y *= -1;
      collided = true;
    }

    // Vertical
    if (this.sprite.y + this.radius > maxHeight) {
      this.x = maxHeight - this.radius;
      this.velocity.x *= -1;
      collided = true;
    } else if (this.sprite.y - this.radius < 0) {
      this.x = 0 + this.radius;
      this.velocity.y *= -1;
      collided = true;
    }

    //this.speed += collided ? 0 : 0.1;
  }
}
