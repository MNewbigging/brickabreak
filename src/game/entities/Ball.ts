import * as PIXI from 'pixi.js';
import darkEnergyBall from '/assets/darkEnergyBall.png';

export class Ball {
  public sprite: PIXI.Sprite;
  private circle: PIXI.Circle;
  private speed = 3;
  private vx = 1;
  private vy = 1;

  constructor(public radius = 1) {
    // Create the sprite for the ball, center origin
    this.sprite = new PIXI.Sprite(PIXI.Loader.shared.resources[darkEnergyBall].texture);
    this.sprite.anchor.set(0.5, 0.5);

    // Scale since image is massive
    this.sprite.scale.set(0.035, 0.035);

    // Create the circle shape for the ball
    this.circle = new PIXI.Circle(0, 0, this.sprite.width);
  }

  public setPosition(x: number, y: number) {
    this.sprite.x = x;
    this.sprite.y = y;
    this.circle.x = x;
    this.circle.y = y;
  }

  public setPositionX(x: number) {
    this.sprite.x = x;
    this.circle.x = x;
  }

  public setPositionY(y: number) {
    this.sprite.y = y;
    this.circle.y = y;
  }

  public update(dt: number) {
    // Move
    const x = this.sprite.x + this.vx * dt * this.speed;
    const y = this.sprite.y + this.vy * dt * this.speed;
    this.setPosition(x, y);
  }

  public checkCollisions(maxWidth: number, maxHeight: number) {
    let collided = false;

    // Horizontal
    if (this.sprite.x + this.radius > maxWidth) {
      this.setPositionX(maxWidth - this.radius);
      this.vx *= -1;
      collided = true;
    } else if (this.sprite.x - this.radius < 0) {
      this.setPositionX(0 + this.radius);
      this.vx *= -1;
      collided = true;
    }

    // Vertical
    if (this.sprite.y + this.radius > maxHeight) {
      this.setPositionY(maxHeight - this.radius);
      this.vy *= -1;
      collided = true;
    } else if (this.sprite.y - this.radius < 0) {
      this.setPositionY(0 + this.radius);
      this.vy *= -1;
      collided = true;
    }

    //this.speed += collided ? 0 : 0.1;
  }
}
