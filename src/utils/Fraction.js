// Class untuk representasi pecahan dan operasi aritmatika
export class Fraction {
  constructor(numerator, denominator = 1) {
    if (denominator === 0) {
      throw new Error('Denominator cannot be zero');
    }
    
    // Handle negative denominator
    if (denominator < 0) {
      numerator = -numerator;
      denominator = -denominator;
    }
    
    this.num = numerator;
    this.den = denominator;
    this.simplify();
  }

  // GCD untuk simplifikasi
  static gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  // Simplify fraction
  simplify() {
    const gcd = Fraction.gcd(this.num, this.den);
    this.num /= gcd;
    this.den /= gcd;
  }

  // Operasi aritmatika
  add(other) {
    const num = this.num * other.den + other.num * this.den;
    const den = this.den * other.den;
    return new Fraction(num, den);
  }

  subtract(other) {
    const num = this.num * other.den - other.num * this.den;
    const den = this.den * other.den;
    return new Fraction(num, den);
  }

  multiply(other) {
    return new Fraction(this.num * other.num, this.den * other.den);
  }

  divide(other) {
    if (other.num === 0) {
      throw new Error('Cannot divide by zero');
    }
    return new Fraction(this.num * other.den, this.den * other.num);
  }

  negate() {
    return new Fraction(-this.num, this.den);
  }

  // Check if zero
  isZero() {
    return this.num === 0;
  }

  // Convert to string
  toString() {
    if (this.den === 1) {
      return this.num.toString();
    }
    return `${this.num}/${this.den}`;
  }

  // Convert to decimal
  toDecimal() {
    return this.num / this.den;
  }

  // Create from number
  static fromNumber(num) {
    if (Number.isInteger(num)) {
      return new Fraction(num, 1);
    }
    
    // Convert decimal to fraction
    const precision = 1000000;
    const numerator = Math.round(num * precision);
    return new Fraction(numerator, precision);
  }
}
