const pg = require('pg');

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.q = function(...args) {
  console.log(args);
  return this.query(...args);
};

module.exports = pool;
