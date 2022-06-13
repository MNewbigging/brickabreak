import * as PIXI from 'pixi.js';

import { RandomUtils } from '../utils/RandomUtils';
import { Vec2 } from '../utils/Vec2';

export abstract class Entity {
  public id = RandomUtils.createId();
  public sprite: PIXI.Sprite;
  // public bounds: PIXI.Circle | PIXI.Rectangle;
  public position = new Vec2();

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
  bounds: PIXI.Rectangle;

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
