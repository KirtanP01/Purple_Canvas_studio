require('dotenv').config();
const { Client } = require('pg');

const DB_SUPER_USER = process.env.DB_USER || 'postgres';
const DB_SUPER_PASS = process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
const DB_NAME = process.env.DB_NAME || 'purple_canvas_studio';

const ADMIN_USER = 'admin';
const ADMIN_PASS = '123456';

async function main() {
  const client = new Client({
    user: DB_SUPER_USER,
    password: DB_SUPER_PASS,
    host: DB_HOST,
    port: DB_PORT,
    database: 'postgres', // connect to default to run role/db grants
  });

  try {
    await client.connect();
    console.log('Connected to Postgres as', DB_SUPER_USER);

    // Create role if not exists
    const exists = await client.query("SELECT 1 FROM pg_roles WHERE rolname=$1", [ADMIN_USER]);
    if (exists.rowCount === 0) {
      console.log(`Creating role ${ADMIN_USER}...`);
      await client.query(`CREATE ROLE ${ADMIN_USER} WITH LOGIN PASSWORD $1`, [ADMIN_PASS]);
      console.log(`Role ${ADMIN_USER} created`);
    } else {
      console.log(`Role ${ADMIN_USER} already exists, updating password`);
      await client.query(`ALTER ROLE ${ADMIN_USER} WITH PASSWORD $1`, [ADMIN_PASS]);
      console.log(`Password for ${ADMIN_USER} updated`);
    }

    // Grant privileges on database
    console.log(`Granting privileges on database ${DB_NAME} to ${ADMIN_USER}...`);
    await client.query(`GRANT CONNECT ON DATABASE ${DB_NAME} TO ${ADMIN_USER}`);

    // Need to run schema/table grants on the target database
    const dbClient = new Client({
      user: DB_SUPER_USER,
      password: DB_SUPER_PASS,
      host: DB_HOST,
      port: DB_PORT,
      database: DB_NAME,
    });
    await dbClient.connect();
    console.log(`Connected to database ${DB_NAME} to set schema/table privileges`);

    await dbClient.query(`GRANT USAGE ON SCHEMA public TO ${ADMIN_USER}`);
    await dbClient.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ${ADMIN_USER}`);
    await dbClient.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ${ADMIN_USER}`);
    console.log(`Privileges granted to ${ADMIN_USER}`);

    await dbClient.end();
    await client.end();
    console.log('Done');
  } catch (err) {
    console.error('Error creating admin user:', err.message || err);
    try { await client.end(); } catch (e) {}
    process.exitCode = 1;
  }
}

main();
