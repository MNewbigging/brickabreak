import { Vec2 } from './Vec2';

export class PhysicsUtils {
  public static isCircleInRectArea(rPos: Vec2, rW: number, rH: number, cPos: Vec2, cR: number) {
    // Distances between circle and rectangle
    const dx = Math.abs(cPos.x - rPos.x);
    const dy = Math.abs(cPos.y - rPos.y);

    const halfWidth = rW * 0.5;
    const halfHeight = rH * 0.5;

    // Easy cases where circle is not colliding
    if (dx > halfWidth + cR) return false;
    if (dy > halfHeight + cR) return false;

    // Easy cases of collision
    if (dx < halfWidth) return true;
    if (dy < halfHeight) return true;

    // Corner cases
    const cornerDistSq =
      (dx - halfWidth) * (dx - halfWidth) + (dy - halfHeight) * (dy - halfHeight);

    return cornerDistSq <= cR * cR;
  }
}
