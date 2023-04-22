export interface IVec3 {
  x: number;
  y: number;
  z: number;
}

export type XYZ = Record<"x" | "y" | "z", number>;

export default class Vector {
  public x: number;
  public y: number;
  public z: number;

  constructor(a?: number | number[] | XYZ | Vector, b?: number, c?: number) {
    if (Array.isArray(a)) {
      this.x = a[0] ? a[0] : 0;
      this.y = a[1] ? a[1] : 0;
      this.z = a[2] ? a[2] : 0;
      return;
    }

    if (!!a && typeof a === "object") {
      this.x = a.x ? a.x : 0;
      this.y = a.y ? a.y : 0;
      this.z = a.z ? a.z : 0;
      return;
    }

    this.x = a ? a : 0;
    this.y = b ? b : 0;
    this.z = c ? c : 0;
  }

  // Methods //
  /**
   * Returns the negative of this vector.
   */
  negative() {
    return new Vector(-this.x, -this.y, -this.z);
  }

  /**
   * Add a vector or number to this vector.
   * @param {Vector | number} a: Vector or number to add
   * @returns {Vector} New vector
   */
  add(v: Vector | number) {
    if (v instanceof Vector)
      return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
    else return new Vector(this.x + v, this.y + v, this.z + v);
  }

  /**
   * Substracts a vector or number from this vector.
   * @param {Vector | number} a: Vector or number to subtract
   * @returns {Vector} New vector
   */
  subtract(v: Vector | number) {
    if (v instanceof Vector)
      return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
    else return new Vector(this.x - v, this.y - v, this.z - v);
  }

  /**
   * Multiplies a vector or a number to a vector.
   * @param {Vector | number} a: Vector or number to multiply
   * @param {Vector} b: Vector to multiply
   */
  multiply(v: Vector | number) {
    if (v instanceof Vector)
      return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
    else return new Vector(this.x * v, this.y * v, this.z * v);
  }

  /**
   * Divide this vector by a vector or a number.
   * @param {Vector | number} a: Vector or number to divide
   * @returns {Vector} New vector
   */
  divide(v: Vector | number) {
    if (v instanceof Vector)
      return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
    else return new Vector(this.x / v, this.y / v, this.z / v);
  }

  /**
   * Check if the given vector is equal to this vector.
   * @param {Vector} v: Vector to compare
   * @returns {boolean} True if equal
   */
  equals(v: Vector) {
    return this.x == v.x && this.y == v.y && this.z == v.z;
  }

  /**
   * Returns the dot product of this vector and another vector.
   * @param {Vector} v: Vector to dot
   * @returns {number} Dot product
   */
  dot(v: Vector) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  /**
   * Lerp between this vector and another vector.
   * @param {Vector} v: Vector to lerp to
   * @param {number} fraction: Fraction to lerp
   * @returns {Vector}
   */
  lerp(v: Vector, fraction: number) {
    return v
      .subtract(this)
      .multiply(fraction)
      .add(this);
  }

  static normalize(v: Vector): Vector {
    const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    return new Vector(v.x / length, v.y / length, v.z / length);
  }

  static getTriangleCentroid(p1: Vector, p2: Vector, p3: Vector) {
    var centerX = (p1.x + p2.x + p3.x) / 3;
    var centerY = (p1.y + p2.y + p3.y) / 3;
    var centerZ = (p1.z + p2.z + p3.z) / 3;
    return new Vector(centerX, centerY, centerZ);
  }

  static cross(a: Vector, b: Vector, c: Vector = new Vector()) {
    c.x = a.y * b.z - a.z * b.y;
    c.y = a.z * b.x - a.x * b.z;
    c.z = a.x * b.y - a.y * b.x;
    return c;
  }
}
