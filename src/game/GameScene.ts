import Phaser from 'phaser';
import blueboard from '/assets/blueboard.png';
import brick from '/assets/brick.png';
import darkEnergyBall from '/assets/darkEnergyBall.png';

import { Vec2 } from '../game/utils/Vec2';

type Body = Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
type BrickGroup = Phaser.Physics.Arcade.StaticGroup;

export class GameScene extends Phaser.Scene {
  private gameSize: Vec2;
  private bricks: BrickGroup;
  private ballOnPaddle = true;
  private ball: Body;
  private paddle: Body;

  constructor() {
    super({ key: 'brickabreak' });
  }

  public preload() {
    console.log('preload');

    this.load.image('paddle', blueboard);
    this.load.image('ball', darkEnergyBall);
    this.load.image('brick', brick);
  }

  public create() {
    console.log('create');

    this.gameSize = new Vec2(
      this.sys.game.scale.gameSize.width,
      this.sys.game.scale.gameSize.height
    );
    const center = new Vec2(
      this.sys.game.scale.gameSize.width / 2,
      this.sys.game.scale.gameSize.height / 2
    );

    //this.add.image(center.x, center.y, 'brick'); //.setScale(0.035);

    // Enable world bounds, but disable floor
    this.physics.world.setBoundsCollision(true, true, true, false);

    // Create bricks
    this.bricks = this.physics.add.staticGroup();
    this.bricks.create(center.x, 100, 'brick');

    // Ball
    this.ball = this.physics.add
      .image(center.x, this.gameSize.y - 100, 'ball')
      .setScale(0.035)
      .setCollideWorldBounds(true)
      .setBounce(1);

    // Paddle
    this.paddle = this.physics.add.image(center.x, this.gameSize.y - 50, 'paddle').setImmovable();

    // Colliders
    this.physics.add.collider(this.ball, this.bricks, this.onHitBrick);
    this.physics.add.collider(this.ball, this.paddle, this.onHitPaddle);

    // Input
    const paddleHalfWidth = this.paddle.width / 2;
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      // Keep paddle in bounds
      this.paddle.x = Phaser.Math.Clamp(
        pointer.x,
        paddleHalfWidth,
        this.gameSize.x - paddleHalfWidth
      );
    });

    this.input.on('pointerup', () => {
      // Fire ball if still attached to paddle
      if (this.ballOnPaddle) {
        this.ball.setVelocity(-75, -300);
        this.ballOnPaddle = false;
      }
    });
  }

  public update(time: number, delta: number): void {
    // Update ball position if attached to paddle
    if (this.ballOnPaddle) {
      this.ball.x = this.paddle.x;
    }
    // Otherwise check if ball is out of lower bounds
    if (this.ball.y > this.gameSize.y + 100) {
      this.resetBall();
    }
  }

  private resetBall() {
    this.ball.setVelocity(0);
    this.ball.setPosition(this.paddle.x, this.paddle.y - 50);
    this.ballOnPaddle = true;
  }

  private onHitBrick = () => {
    console.log('hit brick');
  };

  private onHitPaddle = () => {
    console.log('hit paddle');
  };
}
