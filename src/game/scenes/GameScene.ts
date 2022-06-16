import Phaser from 'phaser';

import { GameEventListener, GameEventType } from '../listeners/GameEventListener';
import { GameManager } from '../GameManager';
import { Vec2 } from '../utils/Vec2';

type Body = Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
type BrickGroup = Phaser.Physics.Arcade.StaticGroup;

export class GameScene extends Phaser.Scene {
  private gameSize: Vec2;
  private bricks: BrickGroup;
  private ballOnPaddle = true;
  private ball: Body;
  private paddle: Body;

  constructor(private eventListener: GameEventListener) {
    super({ key: 'GameScene' });
  }

  public create() {
    this.gameSize = this.getGameSize();
    const center = this.getGameCenter();

    // Enable world bounds, but disable floor
    this.physics.world.setBoundsCollision(true, true, true, false);

    // Create bricks
    this.bricks = this.physics.add.staticGroup();
    this.bricks.create(center.x, center.y, 'brick');
    // const minX = 200;
    // const brickWidth = 84;
    // const minY = 75;
    // const brickHeight = 60;
    // for (let i = 0; i < 5; i++) {
    //   const y = minY + i * brickHeight;
    //   for (let j = 0; j < 5; j++) {
    //     const x = minX + j * brickWidth;
    //     this.bricks.create(x, y, 'brick');
    //   }
    // }

    // Ball
    this.ball = this.physics.add
      .image(center.x, this.gameSize.y - 100, 'ball')
      .setScale(0.25)
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

    this.scale.on('resize', this.resize);
  }

  public resize = () => {
    console.log('resize');
  };

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

  private onHitBrick = (ball: Body, brick: Body) => {
    // Damage the brick
    this.damageBrick(ball, brick);

    // Was this the last brick in the stage?
    if (this.bricks.countActive() === 0) {
      this.onBricksCleared();
      return;
    }

    // Increase speed of ball - get current speed
    const curSpeed = this.ball.body.velocity.length();
    // The new speed is slightly faster than the current speed
    const newSpeed = curSpeed * 1.1;
    // Apply the new speed by scaling against normalised velocity
    this.ball.body.velocity.normalize().scale(newSpeed);
  };

  private damageBrick(_ball: Body, brick: Body) {
    // TODO - damage model, just removing for now
    brick.disableBody(true, true);

    // Fire destroyed brick event
    this.eventListener.fireEvent({ type: GameEventType.BRICK_DESTROYED });
  }

  private onBricksCleared = () => {
    // Reset ball and paddle for next stage
    this.resetBall();

    // Fire the stage end event
    this.eventListener.fireEvent({ type: GameEventType.STAGE_END });
  };

  private onHitPaddle = () => {
    // Some basic, but not great, reflecting angle logic for the paddle
    // let diff = 0;
    // if (this.ball.x < this.paddle.x) {
    //   //  Ball is on the left-hand side of the paddle
    //   diff = this.paddle.x - this.ball.x;
    //   this.ball.setVelocityX(-10 * diff);
    // } else if (this.ball.x > this.paddle.x) {
    //   //  Ball is on the right-hand side of the paddle
    //   diff = this.ball.x - this.paddle.x;
    //   this.ball.setVelocityX(10 * diff);
    // } else {
    //   //  Ball is perfectly in the middle
    //   //  Add a little random X to stop it bouncing straight up!
    //   this.ball.setVelocityX(2 + Math.random() * 8);
    // }
  };

  private getGameSize(): Vec2 {
    return new Vec2(this.sys.game.scale.gameSize.width, this.sys.game.scale.gameSize.height);
  }

  private getGameCenter(): Vec2 {
    const gameSize = this.getGameSize();

    return new Vec2(gameSize.x / 2, gameSize.y / 2);
  }
}
