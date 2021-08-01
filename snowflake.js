
module.exports = class Snowflake {

    static MODIFIER = 9223372036854775808n;

    static fromBigInt(val) {
        if (val === null || val === undefined) {
            return null;
        }
        if (typeof(val) !== 'BigInt') {
            val = BigInt(val);
        }
        return new Snowflake(val + Snowflake.MODIFIER)
    }

    static fromDiscord(val) {
        if (val === null || val === undefined) {
            return null;
        }
        return this.fromSnowflake(val.id);
    }

    static fromSnowflake(val){
        if (val === null || val === undefined) {
            return null;
        }
        if (typeof(val) !== 'bigint') {
            val = BigInt(val);
        }
        return new Snowflake(val)
    }

    constructor(val) {
        if (val === null || val === undefined) {
            this.value = null;
            return;
        }
        if (typeof(val) !== 'bigint') {
            val = BigInt(val);
        }
        this.value = val;
    }

    toString() {
        return this.value.toString();
    }

    toBigInt() {
        return this.value - Snowflake.MODIFIER;
    }

    toPostgres(_) {
        return this.toBigInt().toString();
    }

}
