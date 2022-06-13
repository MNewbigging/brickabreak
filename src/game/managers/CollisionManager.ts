import { Ball } from '../entities/Ball';
import { GameEventListener, GameEventType } from '../listeners/GameEventListener';
import { Paddle } from '../entities/Paddle';

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
    balls.forEach((b) => this.checkBallBounds(b));
  }

  private checkPaddleBounds(paddle: Paddle) {
    // Horizontal
    if (paddle.x + paddle.halfWidth > this.maxWidth) {
      // Over right edge, move back inside bounds
      paddle.x = this.maxWidth - paddle.halfWidth;
    } else if (paddle.x - paddle.halfWidth < 0) {
      // Over left edge, move back inside bounds
      paddle.x = paddle.halfWidth;
    }
  }

  private checkBallBounds(ball: Ball) {
    // Horizontal
    if (ball.x + ball.radius > this.maxWidth) {
      ball.x = this.maxWidth - ball.radius;
      ball.velocity.x *= -1;
    } else if (ball.x - ball.radius < 0) {
      ball.x = ball.radius;
      ball.velocity.x *= -1;
    }
    // Vertical
    if (ball.y + ball.radius > this.maxHeight) {
      // Hit the bottom; lost the ball
      this.eventListener.fireEvent({ type: GameEventType.REMOVE_BALL, id: ball.id });
    } else if (ball.y - ball.radius < 0) {
      ball.y = ball.radius;
      ball.velocity.y *= -1;
    }
  }
}
