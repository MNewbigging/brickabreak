import * as PIXI from 'pixi.js';

import { RandomUtils } from '../utils/RandomUtils';
import { Vec2 } from '../utils/Vec2';

export abstract class Entity {
  public id = RandomUtils.createId();
  public sprite: PIXI.Sprite;
  public bounds: PIXI.Circle | PIXI.Rectangle;

  public get x() {
    return this.sprite.x;
  }

  public set x(x: number) {
    this.sprite.x = x;
    this.bounds.x = x;
  }

  public get y() {
    return this.sprite.y;
  }

  public set y(y: number) {
    this.sprite.y = y;
    this.bounds.y = y;
  }

  public setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export abstract class UpdateEntity extends Entity {
  public abstract update(dt: number): void;
}

export abstract class PhysicsEntity extends UpdateEntity {
  public speed = 1;
  public velocity = new Vec2();
}
