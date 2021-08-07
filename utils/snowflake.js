const MODIFIER = 9223372036854775808n;

module.exports = class Snowflake {
  static fromBigInt(val) {
    if (val === null || val === undefined) {
      return null;
    }
    if (typeof val !== 'bigint') {
      val = BigInt(val);
    }
    return new Snowflake(val + MODIFIER);
  }

  static fromDiscord(val) {
    if (val === null || val === undefined) {
      return null;
    }
    return this.fromSnowflake(val.id);
  }

  static fromSnowflake(val) {
    if (val === null || val === undefined) {
      return null;
    }
    if (typeof val !== 'bigint') {
      val = BigInt(val);
    }
    return new Snowflake(val);
  }

  constructor(val) {
    if (val === null || val === undefined) {
      this.value = null;
      return;
    }
    if (typeof val !== 'bigint') {
      val = BigInt(val);
    }
    this.value = val;
  }

  toString() {
    return this.value.toString();
  }

  toBigInt() {
    return this.value - MODIFIER;
  }

  toPostgres(_) {
    return this.toBigInt().toString();
  }
};
