const pg = require('pg');
const QueryManager = require('./query-manager');

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = new QueryManager(pool);
