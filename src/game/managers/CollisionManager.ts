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

    // Find nearest point on paddle
    const rectNearest = PhysicsUtils.getNearestRectPointToCircle(
      paddle.bounds.left,
      paddle.bounds.right,
      paddle.bounds.top,
      paddle.bounds.bottom,
      ball.position
    );

    // Get distance vector from nearest paddle point to ball
    const distance = Vec2.sub(ball.position, rectNearest); // distance

    // Normalize the distance vector to get the collision normal direction
    const colNormal = Vec2.normalize(distance);

    // Reflect the ball's current trajectory against the collision normal
    const reflectAngle = 2 * Vec2.dot(ball.direction, colNormal);

    // Scale the collision normal by the reflecting angle to give reflect velocity

    const colReflect = Vec2.multiplyScalar(colNormal, reflectAngle - Math.abs(paddle.velocity.x));

    // Subtract reflect velocity from direction to set rebound direction
    ball.direction.x -= colReflect.x;
    ball.direction.y -= colReflect.y;

    // Also need to move the ball outside of the collision area along its new direction
    const intDepth = Math.abs(Vec2.getLength(distance) - ball.radius);

    const x = ball.x + ball.direction.x * intDepth;
    const y = ball.y + ball.direction.y * intDepth;

    ball.setPosition(x, y);

    /**
     * The above works only when paddle is stationary. If the paddle hits the ball on the side,
     * the paddle is too much inside the ball and doesn't let it move outside (collision always
     * occurs, ball freaks out).
     *
     * Need to move the ball outside of the paddle on collision.
     *
     *
     */

    return collides;
  }
}
