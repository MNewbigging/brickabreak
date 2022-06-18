import Phaser from 'phaser';

import { Brick, BrickName } from '../bricks/Brick';
import { BrickLayer } from '../utils/BrickLayer';
import { BrickMod } from '../mods/GameMod';
import { GameEventListener, GameEventType } from '../listeners/GameEventListener';
import { GameManager } from '../GameManager';
import { RandomUtils } from '../utils/RandomUtils';
import { Vec2 } from '../utils/Vec2';

type Body = Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
type BrickGroup = Phaser.Physics.Arcade.StaticGroup;
type Line = Phaser.GameObjects.Line;
type Image = Phaser.GameObjects.Image;

export class GameScene extends Phaser.Scene {
  private gameSize: Vec2;
  private bricks = new Map<string, Brick>();
  private brickBodies: BrickGroup;
  private cracks = new Map<string, Image>();
  private ballOnPaddle = true;
  private ball: Body;
  private ballPaddleOffset = -30;
  private paddle: Body;
  private aimLine: Line;
  private baseBallSpeed = 300;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
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
    this.brickBodies = this.physics.add.staticGroup();

    // Ball
    this.ball = this.physics.add
      .image(center.x, this.gameSize.y - 100, 'ball')
      .setScale(0.25)
      .setCollideWorldBounds(true)
      .setBounce(1);

    // Paddle
    this.paddle = this.physics.add.image(center.x, this.gameSize.y - 50, 'paddle').setImmovable();

    // Aiming line
    this.aimLine = this.add.line(0, 0, 0, -20, 0, -50, 0xffffff).setOrigin(0);

    // Colliders
    this.physics.add.collider(this.ball, this.brickBodies, this.onHitBrick);
    this.physics.add.collider(this.ball, this.paddle, this.onHitPaddle);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      // Save the pointer pos as target for paddle to move towards
      this.paddleTargetPos = pointer.x;
    });

    this.input.on('pointerup', () => {
      // Fire ball if still attached to paddle
      if (this.ballOnPaddle) {
        this.fireBall();
      }
    });

    // First time this runs, do stage setup manually
    this.onStageStart();
  }

  private onStageStart = () => {
    // Create the bricks for this level
    this.buildBricks();

    // Ensure gm values are up to date
    this.paddle.scaleX = this.gameManager.paddleWidthScale;
  };

  private buildBricks() {
    // Clear any previous brick data
    this.bricks.clear();
    this.brickBodies.clear();
    this.cracks.forEach((img: Image) => img.destroy());
    this.cracks.clear();

    // Get the bricks to create for this stage
    const bricks: Brick[][] = BrickLayer.oneBrick();

    const brickWidth = 40;
    const brickHeight = 32;

    // Center values
    const rowLength = bricks[0].length;
    const minX = (this.gameSize.x - rowLength * brickWidth) / 2;
    const minY = 50;

    // Create bricks
    bricks.forEach((row, rIdx) => {
      // Brick y pos
      const y = minY + rIdx * brickHeight;
      row.forEach((brick, bIdx) => {
        // Brick x pos
        const x = minX + bIdx * brickWidth;

        // Create the brick physics object
        const b = this.physics.add.staticImage(x, y, 'bricks', brick.name);
        b.setData('id', brick.id);
        this.brickBodies.add(b);

        // Add brick to map
        this.bricks.set(brick.id, brick);

        // Create the crack image for it
        const crack = this.add.image(x, y, '');
        crack.visible = false;
        this.cracks.set(brick.id, crack);
      });
    });
  }

  public update(time: number, delta: number): void {
    // Update paddle
    this.updatePaddle();

    // Update ball position if attached to paddle
    if (this.ballOnPaddle) {
      this.ball.x = this.paddle.x;
      this.ball.y = this.paddle.y + this.ballPaddleOffset;

      // Also update the line pos
      this.updateAimLine();
    }

    // Otherwise check if ball is out of lower bounds
    if (this.ball.y > this.gameSize.y + this.ball.height) {
      // Fire ball lost event
      this.eventListener.fireEvent({ type: GameEventType.BALL_LOST });
      // Reset ball
      this.resetBall();
    }
  }

  private updatePaddle() {
    // Normalized different between current and target pos
    const offset = this.paddleTargetPos - this.paddle.x;
    const margin = this.gameManager.paddleSpeed / 20;
    let diff = Math.abs(offset) < margin ? 0 : Math.sign(offset);

    const rightEdge = this.gameSize.x - this.paddle.body.halfWidth;

    // If exactly at left edge and trying to go left
    if (this.paddle.x === this.paddle.body.halfWidth && diff === -1) {
      // Cannot go left
      diff = 0;
    }
    // If beyond left edge, go bak
    else if (this.paddle.x < this.paddle.body.halfWidth) {
      this.paddle.x = this.paddle.body.halfWidth;
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
      this.paddle.x = this.gameSize.x - this.paddle.body.halfWidth;
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

  private onHitBrick = (_ball: Body, brickBody: Body) => {
    // Get the id of brick hit
    const id = brickBody.getData('id');

    // Get the brick
    const brick = this.bricks.get(id);

    // Damage the brick
    brick.takeHit();

    // Get the crack image for the brick
    const crack = this.cracks.get(id);

    // Has the brick been destroyed?
    if (brick.hitsLeft < 0) {
      // Remove the brick body
      brickBody.disableBody(true, true);
      // Remove the crack image
      crack.destroy();
      // Do brick's on destroy effect, if any
      this.activateBrickDestroyMod(brick);
      // Fire destroyed brick event
      this.eventListener.fireEvent({ type: GameEventType.BRICK_DESTROYED });
    } else {
      // Brick was just damaged; show next crack image
      crack.setTexture('cracksheet', `crack-${brick.hitsLeft}`);
      crack.visible = true;
    }

    // Was this the last brick in the stage?
    if (this.brickBodies.countActive() === 0) {
      this.onBricksCleared();
      return;
    }

    // Increase speed of ball - get current speed
    const curSpeed = this.ball.body.velocity.length();
    // The new speed is slightly faster than the current speed
    const newSpeed = curSpeed + this.gameManager.ballSpeedMod;
    // Apply the new speed by scaling against normalised velocity
    this.ball.body.velocity.normalize().scale(newSpeed);
  };

  private activateBrickDestroyMod(brick: Brick) {
    if (!brick.onDestroyMod) {
      return;
    }

    switch (brick.onDestroyMod) {
      case BrickMod.EXPLOSIVE:
        // Blows up neighbouring bricks, or damages bricks in a radius?
        break;
    }

    console.log('brick destroy mod', brick.onDestroyMod);
  }

  private onBricksCleared = () => {
    // Reset ball and paddle for next stage
    // TODO - do this on short delay so it's not snapping?
    this.resetBall();

    // Fire the stage end event
    this.eventListener.fireEvent({ type: GameEventType.STAGE_END });
  };

  private onHitPaddle = () => {
    // Angle the ball more to edges of paddle
    let offset = this.ball.x - this.paddle.x;
    // If ball hit paddle dead center
    if (offset === 0) {
      offset = RandomUtils.randomRange(-10, 10);
    }

    // Maintain current speed after collision
    const curSpeed = this.ball.body.velocity.length();

    // Set the rebound angle
    this.ball.setVelocityX(offset * 5);

    // Scale by current speed
    this.ball.body.velocity.normalize().scale(curSpeed);

    // In case paddle squashes ball against side, make sure ball still moves
    if (this.ball.body.velocity.y > 0 && this.ball.body.velocity.y < 1) {
      this.ball.setVelocityY(curSpeed);
    }
  };

  private getGameSize(): Vec2 {
    return new Vec2(this.sys.game.scale.gameSize.width, this.sys.game.scale.gameSize.height);
  }

  private getGameCenter(): Vec2 {
    const gameSize = this.getGameSize();

    return new Vec2(gameSize.x / 2, gameSize.y / 2);
  }
}
