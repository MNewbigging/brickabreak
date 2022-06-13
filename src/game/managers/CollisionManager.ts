import { Ball } from '../entities/Ball';
import { GameEventListener, GameEventType } from '../listeners/GameEventListener';
import { Paddle } from '../entities/Paddle';
import { PhysicsUtils } from '../utils/PhysicsUtils';
import { Vec2 } from '../utils/Vec2';

export class CollisionManager {
  constructor(
    private maxWidth: number,
    private maxHeight: number,
    private eventListener: GameEventListener
  ) {}

  public checkCollisions(paddle: Paddle, balls: Ball[]) {
    // Check paddle against game boundaries
    this.checkPaddleBounds(paddle);

    // Check balls against bounds
    balls.forEach((b) => {
      this.checkBallBounds(b);
      this.checkBallPaddle(paddle, b);
    });
  }

  private checkPaddleBounds(paddle: Paddle) {
    // Horizontal
    const px = paddle.position.x;
    if (px + paddle.halfWidth > this.maxWidth) {
      // Over right edge, move back inside bounds
      const x = this.maxWidth - paddle.halfWidth;
      paddle.setX(x);
    } else if (px - paddle.halfWidth < 0) {
      // Over left edge, move back inside bounds
      const x = paddle.halfWidth;
      paddle.setX(x);
    }
  }

  private checkBallBounds(ball: Ball) {
    // Horizontal
    const bx = ball.position.x;
    const by = ball.position.y;

    if (bx + ball.radius > this.maxWidth) {
      ball.setX(this.maxWidth - ball.radius);
      ball.velocity.x *= -1;
    } else if (bx - ball.radius < 0) {
      ball.setX(ball.radius);
      ball.velocity.x *= -1;
    }
    // Vertical
    if (by - ball.radius > this.maxHeight) {
      // Hit the bottom; lost the ball
      this.eventListener.fireEvent({ type: GameEventType.REMOVE_BALL, id: ball.id });
    } else if (by - ball.radius < 0) {
      ball.setY(ball.radius);
      ball.velocity.y *= -1;
    }
  }

  private checkBallPaddle(paddle: Paddle, ball: Ball) {
    // Check if the ball has hit the paddle
    const collides = PhysicsUtils.isCircleInRectArea(
      paddle.position,
      paddle.width,
      paddle.height,
      ball.position,
      ball.radius
    );

    if (!collides) {
      return collides;
    }

    // Find nearest point on paddle

    const rectLeft = paddle.position.x - paddle.halfWidth;
    const rectRight = paddle.position.x + paddle.halfWidth;
    const xNearest = Math.max(rectLeft, Math.min(ball.position.x, rectRight));

    const rectTop = paddle.position.y + paddle.halfHeight;
    const rectBot = paddle.position.y - paddle.halfHeight;
    const yNearest = Math.max(rectBot, Math.min(ball.position.x, rectTop));

    // Reflect around normal of nearest point
    const reflect = new Vec2(ball.position.x - xNearest, ball.position.y - yNearest); // distance
    reflect.normalize(); // direction
    const reflectAngle = 2 * Vec2.dot(ball.velocity, reflect); // reflect theta
    reflect.multiplyScalar(reflectAngle); // apply reflect magnitude to direction to give vel

    // Subtract reflect velocity from current to bounce
    ball.velocity.x -= reflect.x;
    ball.velocity.y -= reflect.y;

    return collides;
  }
}
