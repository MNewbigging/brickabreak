import { Paddle } from '../entities/Paddle';

export class CollisionManager {
  constructor(private maxWidth: number, private maxHeight: number) {}

  public checkCollisions(paddle: Paddle) {
    // Check against game boundaries
    this.checkPaddleBounds(paddle);
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
}
