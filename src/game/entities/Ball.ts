import * as PIXI from 'pixi.js';
import darkEnergyBall from '/assets/darkEnergyBall.png';

import { RandomUtils } from '../utils/RandomUtils';
import { Vec2 } from '../utils/Vec2';

export class Ball {
  public id = RandomUtils.createId();
  public sprite: PIXI.Sprite;
  public bounds: PIXI.Circle;
  public radius = 1;
  public speed = 1;
  public position = new Vec2();
  public direction = new Vec2(0, -1);

  constructor() {
    // Create the ball sprite
    this.sprite = new PIXI.Sprite(PIXI.Loader.shared.resources[darkEnergyBall].texture);
    this.sprite.anchor.set(0.5, 0.5);

    // Scale since image is massive
    this.sprite.scale.set(0.035, 0.035);

    // Create the circle shape for the ball
    this.bounds = new PIXI.Circle(0, 0, this.sprite.width);
    this.radius = this.sprite.width / 2 - 5; // adjust to suit image size
  }

  public set x(x: number) {
    this.position.x = x;
    this.sprite.x = x;
    this.bounds.x = x;
  }

  public set y(y: number) {
    this.position.y = y;
    this.sprite.y = y;
    this.bounds.y = y;
  }

  public setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public update(dt: number) {
    // Move
    const x = this.sprite.x + this.direction.x * dt * this.speed;
    const y = this.sprite.y + this.direction.y * dt * this.speed;
    this.setPosition(x, y);
  }
}
