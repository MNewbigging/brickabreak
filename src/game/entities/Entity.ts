import * as PIXI from 'pixi.js';

import { RandomUtils } from '../utils/RandomUtils';
import { Vec2 } from '../utils/Vec2';

export abstract class Entity {
  public id = RandomUtils.createId();
  public sprite: PIXI.Sprite;
  public position = new Vec2();

  constructor(texture: string) {
    this.sprite = new PIXI.Sprite(PIXI.Loader.shared.resources[texture].texture);
    this.sprite.anchor.set(0.5, 0.5);
  }

  public setX(x: number) {
    this.sprite.x = x;
    this.position.x = x;
  }

  public setY(y: number) {
    this.sprite.y = y;
    this.position.y = y;
  }

  public setPosition(x: number, y: number) {
    this.setX(x);
    this.setY(y);
  }
}

export abstract class RectangleEntity extends Entity {
  public bounds: PIXI.Rectangle;
  public width = 0;
  public halfWidth = 0;
  public height = 0;
  public halfHeight = 0;

  constructor(texture: string) {
    super(texture);

    this.width = this.sprite.width;
    this.halfWidth = this.width / 2;
    this.height = this.sprite.height;
    this.halfHeight = this.height / 2;

    // Create bounds rect
    this.bounds = new PIXI.Rectangle(-this.halfWidth, -this.halfHeight, this.width, this.height);
  }

  public setX(x: number) {
    super.setX(x);

    this.bounds.x = x;
  }

  public setY(y: number) {
    super.setY(y);

    this.bounds.y = y;
  }
}

export abstract class CircleEntity extends Entity {
  bounds: PIXI.Circle;

  public setX(x: number) {
    super.setX(x);

    this.bounds.x = x;
  }

  public setY(y: number) {
    super.setY(y);

    this.bounds.y = y;
  }
}

export interface IPhysicsEntity {
  update: (dt: number) => void;
  speed: number;
  velocity: Vec2;
}
