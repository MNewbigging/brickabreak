import Phaser from 'phaser';

import { Brick, BrickLayer } from '../utils/BrickLayer';
import { GameEventListener, GameEventType } from '../listeners/GameEventListener';
import { GameManager } from '../GameManager';
import { Vec2 } from '../utils/Vec2';

type Body = Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
type BrickGroup = Phaser.Physics.Arcade.StaticGroup;
type Line = Phaser.GameObjects.Line;
type Key = Phaser.Input.Keyboard.Key;

export class GameScene extends Phaser.Scene {
  private gameSize: Vec2;
  private bricks: BrickGroup;
  private ballOnPaddle = true;
  private ball: Body;
  private paddle: Body;
  private paddleHalfWidth = 0;
  private aimLine: Line;
  private baseBallSpeed = 300;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyA: Key;
  private keyD: Key;
  private paddleTargetPos = 0;

  constructor(private eventListener: GameEventListener, private gameManager: GameManager) {
    super({ key: 'GameScene' });

    eventListener.on(GameEventType.STAGE_START, this.onStageStart);
  }

  public create() {
    this.gameSize = this.getGameSize();
    const center = this.getGameCenter();

    // Enable world bounds, but disable floor
    this.physics.world.setBoundsCollision(true, true, true, false);

    // Bricks
    this.bricks = this.physics.add.staticGroup();
    this.onStageStart();

    // Ball
    this.ball = this.physics.add
      .image(center.x, this.gameSize.y - 100, 'ball')
      .setScale(0.25)
      .setCollideWorldBounds(true)
      .setBounce(1);

    // Paddle
    this.paddle = this.physics.add.image(center.x, this.gameSize.y - 50, 'paddle').setImmovable();
    this.paddleHalfWidth = this.paddle.width / 2;

    // Aiming line
    this.aimLine = this.add.line(0, 0, 0, -20, 0, -50, 0xffffff).setOrigin(0);

    // Colliders
    this.physics.add.collider(this.ball, this.bricks, this.onHitBrick);
    this.physics.add.collider(this.ball, this.paddle, this.onHitPaddle);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    const paddleHalfWidth = this.paddle.width / 2;
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      // Keep paddle in bounds
      // this.paddle.x = Phaser.Math.Clamp(
      //   pointer.x,
      //   paddleHalfWidth,
      //   this.gameSize.x - paddleHalfWidth
      // );

      // Save the pointer pos as target for paddle to move towards
      this.paddleTargetPos = pointer.x;
    });

    this.input.on('pointerup', () => {
      // Fire ball if still attached to paddle
      if (this.ballOnPaddle) {
        this.fireBall();
      }
    });
  }

  public onStageStart = () => {
    // // Create bricks
    // this.bricks = this.physics.add.staticGroup({
    //   key: 'bricks',
    //   frame: ['brick-red', 'brick-pink', 'brick-purple', 'brick-algae', 'brick-lime', 'brick-blue'],
    //   frameQuantity: 10,
    //   gridAlign: {
    //     width: 10,
    //     height: 6,
    //     //position: Phaser.Display.Align.CENTER,
    //     cellWidth: 64,
    //     cellHeight: 32,
    //     x: 100,
    //     y: 100,
    //   },
    // });
    // this.bricks.scaleXY(1, 1);

    // Quick brick
    // const center = this.getGameCenter();
    // this.bricks.create(center.x, center.y, 'bricks', 'brick-red');
    // return;

    // Get the bricks to create for this stage
    const bricks: Brick[][] = BrickLayer.layBricks();

    const brickWidth = 20;
    const brickHeight = 16;

    // Center values
    const rowLength = bricks[0].length;
    const minX = (this.gameSize.x - rowLength * brickWidth) / 2;
    const minY = 50;

    // Create bricks
    bricks.forEach((row, rIdx) => {
      const y = minY + rIdx * brickHeight;
      row.forEach((brick, bIdx) => {
        const x = minX + bIdx * brickWidth;
        this.bricks.create(x, y, 'bricks', brick);
      });
    });
  };

  public update(time: number, delta: number): void {
    // Update paddle
    this.updatePaddle(delta);

    // Update ball position if attached to paddle
    if (this.ballOnPaddle) {
      this.ball.x = this.paddle.x;
      this.ball.y = this.paddle.y - 50;

      // Also update the line pos
      this.updateAimLine();
    }

    // Otherwise check if ball is out of lower bounds
    if (this.ball.y > this.gameSize.y + 100) {
      // Fire ball lost event
      this.eventListener.fireEvent({ type: GameEventType.BALL_LOST });
      // Reset ball
      this.resetBall();
    }
  }

  private updatePaddle(dt: number) {
    // if (this.keyA.isDown) {
    //   // Move left
    //   this.paddle.x -= dt * this.gameManager.paddleSpeed;
    // } else if (this.keyD.isDown) {
    //   // Move right
    //   this.paddle.x += dt * this.gameManager.paddleSpeed;
    // }

    // Normalized different between current and target pos
    const offset = this.paddleTargetPos - this.paddle.x;
    const margin = this.gameManager.paddleSpeed / 20;
    let diff = Math.abs(offset) < margin ? 0 : Math.sign(offset);

    /**
     * if exactly at left edge:
     * - cannot go left more (diff can only be 0 or 1)
     * if less than left edge:
     * - reset to left edge, diff is 0
     * if at right edge:
     * - cannot go right more (diff can only be 0 or -1)
     * if more than right edge:
     * - reset to right edge, diff is 0
     *
     * if p.x - phw is negative
     */

    const rightEdge = this.gameSize.x - this.paddleHalfWidth;

    // If exactly at left edge and trying to go left
    if (this.paddle.x === this.paddleHalfWidth && diff === -1) {
      // Cannot go left
      diff = 0;
    }
    // If beyond left edge, go bak
    else if (this.paddle.x < this.paddleHalfWidth) {
      this.paddle.x = this.paddleHalfWidth;
      // todo don't think this does anything
      //this.paddleTargetPos = this.paddle.x;
      diff = 0;
    }
    // If exactly at right edge and trying to go right
    else if (this.paddle.x === rightEdge && diff === 1) {
      diff = 0;
    }
    // If beyond right edge, go back
    else if (this.paddle.x > rightEdge) {
      this.paddle.x = this.gameSize.x - this.paddleHalfWidth;
      //this.paddleTargetPos = this.paddle.x;
      diff = 0;
    }

    this.paddle.setVelocityX(diff * this.gameManager.paddleSpeed);
  }

  private updateAimLine() {
    // Left and right arrows change line angle
    if (this.cursors.left.isDown) {
      this.aimLine.rotation -= 0.02;
    } else if (this.cursors.right.isDown) {
      this.aimLine.rotation += 0.02;
    }

    // Keep line rotation within bounds
    this.aimLine.rotation = Phaser.Math.Clamp(
      this.aimLine.rotation,
      -Math.PI / 2 + 0.5,
      Math.PI / 2 - 0.5
    );

    this.aimLine.x = this.ball.x;
    this.aimLine.y = this.ball.y;
  }

  private resetBall() {
    // Move ball above paddle and stop it moving
    this.ball.setVelocity(0);
    this.ballOnPaddle = true;

    // Show the aiming line
    this.aimLine.visible = true;
    this.aimLine.x = this.ball.x;
    this.aimLine.y = this.ball.y;
  }

  private fireBall() {
    // Get direction from aim line, scale by starting speed
    const dir = new Vec2(
      Math.cos(this.aimLine.rotation - Math.PI / 2),
      Math.sin(this.aimLine.rotation - Math.PI / 2)
    ).multiplyScalar(this.baseBallSpeed);

    // Apply new velocity to ball
    this.ball.setVelocity(dir.x, dir.y);

    // Ball no longer on paddle, reset and hide aim line
    this.ballOnPaddle = false;
    this.aimLine.visible = false;
    this.aimLine.rotation = 0;
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
    // TODO - do this on short delay so it's not snapping?
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
