const pg = require('pg');
const { migrate } = require('postgres-migrations');

const MIGRATION_PATH = 'migrations';
const DATATYPE_DATE = 1082;

const parseDate = (val) =>
  val === null ? null : moment(val).format("YYYY-MM-DD");

pg.types.setTypeParser(DATATYPE_DATE, (val) => {
  return val === null ? null : parseDate(val)
});

module.exports = async function() {
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    const client = await pool.connect();
    try {
        await migrate({client: client}, MIGRATION_PATH, {logger: console.log});
    } finally {
        client.release();
    }

    return pool;
};
