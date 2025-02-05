export type VectorLike = {
  x: number;
  y: number;
};

export default class Vector {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x || 0;
    this.y = y || 0;
  }

  add = (vector: VectorLike): Vector => {
    this.x += vector.x;
    this.y += vector.y;

    return this;
  };

  sub = (vector: VectorLike): Vector => {
    this.x -= vector.x;
    this.y -= vector.y;

    return this;
  };

  scale = (scalar: number): Vector => {
    this.x *= scalar;
    this.y *= scalar;

    return this;
  };

  mag = (): number => {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  normalize = (): Vector => {
    const magnitude = this.mag();
    if (magnitude !== 0) {
      this.x /= magnitude;
      this.y /= magnitude;
    }
    return this;
  };

  limit = (value: number): Vector => {
    const mag = this.mag();
    if (mag > value) {
      this.normalize().scale(value);
    }
    return this;
  };

  limitX = (value: number): Vector => {
    this.x = Math.max(Math.min(value, this.x), value * -1);

    return this;
  };

  limitY = (value: number): Vector => {
    this.y = Math.max(Math.min(value, this.y), value * -1);

    return this;
  };

  clone(): Vector {
    return new Vector(this.x, this.y);
  }
}
