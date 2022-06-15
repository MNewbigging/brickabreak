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

  public checkCollisions(dt: number, paddle: Paddle, balls: Ball[]) {
    // Check paddle against game boundaries
    this.checkPaddleBounds(paddle);

    // Check balls against bounds
    balls.forEach((b) => {
      this.checkBallBounds(b);
      this.checkBallPaddle(dt, paddle, b);
    });
  }

  private checkPaddleBounds(paddle: Paddle) {
    // Horizontal
    const px = paddle.x;
    if (px + paddle.halfWidth > this.maxWidth) {
      // Over right edge, move back inside bounds
      paddle.x = this.maxWidth - paddle.halfWidth;
    } else if (px - paddle.halfWidth < 0) {
      // Over left edge, move back inside bounds
      paddle.x = paddle.halfWidth;
    }
  }

  private checkBallBounds(ball: Ball) {
    // Horizontal
    const bx = ball.position.x;
    const by = ball.position.y;

    if (bx + ball.radius > this.maxWidth) {
      ball.x = this.maxWidth - ball.radius;
      ball.direction.x *= -1;
    } else if (bx - ball.radius < 0) {
      ball.x = ball.radius;
      ball.direction.x *= -1;
    }
    // Vertical
    if (by - ball.radius > this.maxHeight) {
      // Hit the bottom; lost the ball
      this.eventListener.fireEvent({ type: GameEventType.REMOVE_BALL, id: ball.id });
    } else if (by - ball.radius < 0) {
      ball.y = ball.radius;
      ball.direction.y *= -1;
    }
  }

  private checkBallPaddle(dt: number, paddle: Paddle, ball: Ball) {
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

    // Move ball outside of collision by moving backwards
    ball.x -= ball.direction.x * ball.speed * dt;
    ball.y -= ball.direction.y * ball.speed * dt;

    // Find nearest point on paddle
    const rectLeft = paddle.bounds.left;
    const rectRight = paddle.bounds.right;
    const xNearest = Math.max(rectLeft, Math.min(ball.position.x, rectRight));

    const rectTop = paddle.bounds.top;
    const rectBot = paddle.bounds.bottom;
    const yNearest = Math.max(rectBot, Math.min(ball.position.x, rectTop));

    // Reflect around normal of nearest point
    const reflect = new Vec2(ball.position.x - xNearest, ball.position.y - yNearest); // distance
    reflect.normalize(); // direction
    const reflectAngle = 2 * Vec2.dot(ball.direction, reflect); // reflect theta
    reflect.multiplyScalar(reflectAngle); // apply reflect magnitude to direction to give vel

    // Subtract reflect velocity from current to bounce
    ball.direction.x -= reflect.x;
    ball.direction.y -= reflect.y;

    return collides;
  }
}
