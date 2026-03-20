import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const args = process.argv.slice(2);

const getArgValue = (flag) => {
  const index = args.indexOf(flag);
  if (index === -1 || index === args.length - 1) {
    return undefined;
  }
  return args[index + 1];
};

const username = (getArgValue('--username') || process.env.ADMIN_USERNAME || '').trim();
const password = getArgValue('--password') || process.env.ADMIN_PASSWORD || '';

if (!username || !password) {
  console.error('Missing admin credentials.');
  console.error('Usage: node tools/create_admin_user.js --username <username> --password <password>');
  console.error('Or set ADMIN_USERNAME and ADMIN_PASSWORD in backend/.env');
  process.exit(1);
}

const pool = new pg.Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'purple_canvas_studio',
  password: process.env.DB_PASSWORD || '',
  port: Number(process.env.DB_PORT || 5432)
});

async function ensureAdminTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'admin',
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    ALTER TABLE admin_users
    ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'admin',
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
  `);
}

async function upsertAdminUser() {
  const passwordHash = await bcrypt.hash(password, 12);
  const result = await pool.query(
    `INSERT INTO admin_users (username, password_hash, role, is_active)
     VALUES ($1, $2, 'admin', TRUE)
     ON CONFLICT (username)
     DO UPDATE SET
       password_hash = EXCLUDED.password_hash,
       role = 'admin',
       is_active = TRUE,
       updated_at = CURRENT_TIMESTAMP
     RETURNING id, username, role, is_active`,
    [username, passwordHash]
  );

  return result.rows[0];
}

async function main() {
  try {
    await ensureAdminTable();
    const adminUser = await upsertAdminUser();
    console.log(`Admin user saved with hashed password: ${adminUser.username} (id: ${adminUser.id})`);
  } catch (error) {
    console.error('Error creating admin user:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
