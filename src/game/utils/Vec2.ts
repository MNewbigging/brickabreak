export class Vec2 {
  constructor(public x = 0, public y = 0) {}

  public normalize() {
    const length = Vec2.getLength(this);
    this.x /= length;
    this.y /= length;
  }

  public multiplyScalar(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
  }

  // STATICS
  public static getLengthSq(v: Vec2): number {
    return v.x * v.x + v.y * v.y;
  }

  public static getLength(v: Vec2): number {
    return Math.sqrt(Vec2.getLengthSq(v));
  }

  public static normalize(v: Vec2): Vec2 {
    const res = new Vec2(v.x, v.y);
    res.normalize();

    return res;
  }

  public static dot(v1: Vec2, v2: Vec2): number {
    return v1.x * v2.x + v1.y * v2.y;
  }
}
