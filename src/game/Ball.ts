import * as PIXI from 'pixi.js';
import darkEnergyBall from '/assets/darkEnergyBall.png';

export class Ball {
  public sprite: PIXI.Sprite;
  private circleMask: PIXI.Graphics;

  constructor(public radius = 1) {
    // Create the sprite for the ball, center origin
    const sprite = PIXI.Sprite.from(darkEnergyBall);
    sprite.anchor.set(0.5, 0.5);

    // Scale according to radius
    //sprite.scale.set(radius, radius);

    // Position
    //this.setPosition(x, y);

    this.sprite = sprite;
  }

  public setPosition(x: number, y: number) {
    this.sprite.x = x;
    this.sprite.y = y;
    // this.circleMask.x = x;
    // this.circleMask.y = y;
  }
}
