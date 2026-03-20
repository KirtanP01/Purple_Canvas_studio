import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const API_BASE_URL = process.env.SMOKE_API_BASE_URL || 'http://localhost:3000/api';
const KEEP_DATA = process.argv.includes('--keep-data');
const CLEANUP_ONLY = process.argv.includes('--cleanup-only');

const pool = new pg.Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'purple_canvas_studio',
  password: process.env.DB_PASSWORD || '',
  port: Number(process.env.DB_PORT || 5432)
});

const createdIds = {
  art_classes: [],
  painting_parties: [],
  birthday_parties: []
};

function isoDatePlusOneDay() {
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return d.toISOString().split('T')[0];
}

async function postJson(pathname, body) {
  const response = await fetch(`${API_BASE_URL}${pathname}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const raw = await response.text();
  let parsed;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = raw;
  }

  return {
    status: response.status,
    body: parsed
  };
}

async function runFlow(config) {
  const createResult = await postJson(config.createPath, config.createPayload);
  if (createResult.status !== 201 || !createResult.body || typeof createResult.body.id !== 'number') {
    throw new Error(
      `${config.name} create failed. status=${createResult.status} body=${JSON.stringify(createResult.body)}`
    );
  }

  const bookingId = createResult.body.id;
  createdIds[config.tableName].push(bookingId);

  const paymentResult = await postJson(`${config.createPath}/${bookingId}/payment`, {
    paypalOrderId: `ORDER-${config.name}-${config.runId}`,
    paypalCaptureId: `CAP-${config.name}-${config.runId}`,
    paymentAmount: config.paymentAmount
  });

  if (paymentResult.status !== 200) {
    throw new Error(
      `${config.name} payment failed. status=${paymentResult.status} body=${JSON.stringify(paymentResult.body)}`
    );
  }

  const paymentBody = paymentResult.body || {};
  if (paymentBody.status !== 'confirmed' || paymentBody.payment_status !== 'completed') {
    throw new Error(
      `${config.name} payment response mismatch. status=${paymentBody.status} payment_status=${paymentBody.payment_status}`
    );
  }

  return {
    name: config.name,
    bookingId,
    createStatus: createResult.status,
    paymentStatus: paymentResult.status,
    finalStatus: paymentBody.status,
    finalPaymentStatus: paymentBody.payment_status,
    paymentAmount: paymentBody.payment_amount
  };
}

async function deleteByKnownSmokePattern() {
  const deleted = {};

  const statements = [
    ['art_classes', `DELETE FROM art_classes WHERE email LIKE 'smoke.%@example.com' OR parent_name LIKE 'Smoke Parent%'`],
    ['painting_parties', `DELETE FROM painting_parties WHERE email LIKE 'smoke.%@example.com' OR parent_name LIKE 'Smoke Parent%'`],
    ['birthday_parties', `DELETE FROM birthday_parties WHERE email LIKE 'smoke.%@example.com' OR parent_name LIKE 'Smoke Parent%'`]
  ];

  for (const [tableName, sql] of statements) {
    const result = await pool.query(sql);
    deleted[tableName] = result.rowCount || 0;
  }

  return deleted;
}

async function deleteCreatedRowsById() {
  const deleted = {};

  const statements = [
    ['art_classes', createdIds.art_classes],
    ['painting_parties', createdIds.painting_parties],
    ['birthday_parties', createdIds.birthday_parties]
  ];

  for (const [tableName, ids] of statements) {
    if (!ids.length) {
      deleted[tableName] = 0;
      continue;
    }

    const sql = `DELETE FROM ${tableName} WHERE id = ANY($1::int[])`;
    const result = await pool.query(sql, [ids]);
    deleted[tableName] = result.rowCount || 0;
  }

  return deleted;
}

async function ensureApiReachable() {
  const healthUrl = API_BASE_URL.replace(/\/api\/?$/, '/health');
  const response = await fetch(healthUrl);
  if (!response.ok) {
    throw new Error(`API health check failed at ${healthUrl}. status=${response.status}`);
  }
}

async function main() {
  if (CLEANUP_ONLY) {
    const deleted = await deleteByKnownSmokePattern();
    console.log(JSON.stringify({ ok: true, mode: 'cleanup-only', deleted }, null, 2));
    return;
  }

  const runId = Date.now();
  const testDate = isoDatePlusOneDay();

  await ensureApiReachable();

  const results = [];

  results.push(
    await runFlow({
      name: 'art-classes',
      tableName: 'art_classes',
      createPath: '/art-classes',
      createPayload: {
        parentName: 'Smoke Parent Art',
        email: `smoke.art.${runId}@example.com`,
        phone: '555-000-1001',
        studentName: 'Smoke Student',
        studentAge: 9,
        enrollDate: testDate,
        classType: 'group',
        preferredDay: 'Saturday',
        preferredTime: '10:00',
        specialRequests: 'Smoke test'
      },
      paymentAmount: 55,
      runId
    })
  );

  results.push(
    await runFlow({
      name: 'painting-parties',
      tableName: 'painting_parties',
      createPath: '/painting-parties',
      createPayload: {
        parentName: 'Smoke Parent Paint',
        email: `smoke.paint.${runId}@example.com`,
        phone: '555-000-1002',
        partyDate: testDate,
        partyTime: '14:00',
        guestCount: 10,
        childAge: '8-10',
        theme: 'Animals',
        venueAddress: '123 Test Ave',
        city: 'Austin',
        zipCode: '73301',
        specialRequests: 'Smoke test'
      },
      paymentAmount: 120,
      runId
    })
  );

  results.push(
    await runFlow({
      name: 'birthday-parties',
      tableName: 'birthday_parties',
      createPath: '/birthday-parties',
      createPayload: {
        parentName: 'Smoke Parent Bday',
        email: `smoke.bday.${runId}@example.com`,
        phone: '555-000-1003',
        childName: 'Birthday Kid',
        childAge: 7,
        partyDate: testDate,
        partyTime: '16:00',
        guestCount: 12,
        package: 'premium',
        theme: 'Space',
        venueAddress: '456 Party Rd',
        city: 'Austin',
        zipCode: '73301',
        specialRequests: 'Smoke test'
      },
      paymentAmount: 180,
      runId
    })
  );

  console.log(JSON.stringify({ ok: true, mode: 'run', results }, null, 2));

  if (!KEEP_DATA) {
    const deleted = await deleteCreatedRowsById();
    console.log(JSON.stringify({ ok: true, mode: 'post-run-cleanup', deleted }, null, 2));
  }
}

try {
  await main();
} catch (error) {
  console.error(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : String(error) }, null, 2));
  process.exitCode = 1;

  if (!KEEP_DATA) {
    try {
      const deleted = await deleteCreatedRowsById();
      console.error(JSON.stringify({ ok: false, mode: 'failure-cleanup', deleted }, null, 2));
    } catch (cleanupError) {
      console.error(
        JSON.stringify({ ok: false, mode: 'failure-cleanup', error: cleanupError instanceof Error ? cleanupError.message : String(cleanupError) }, null, 2)
      );
    }
  }
} finally {
  await pool.end();
}
