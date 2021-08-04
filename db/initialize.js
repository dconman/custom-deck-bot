const pg = require('pg');
const { migrate } = require('postgres-migrations');

const MIGRATION_PATH = 'migrations';

module.exports = async function () {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  return client
    .connect()
    .then(() =>
      migrate({ client: client }, MIGRATION_PATH, {
        logger: console.log,
      })
    )
    .finally(() => client.end());
};
