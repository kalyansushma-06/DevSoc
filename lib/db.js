import pg from "pg";

const { Pool } = pg;

// Reuse the connection pool during local development
// so Next.js hot reload doesn't create many connections.
const globalForPg = globalThis;

const pool =
  globalForPg.__devsocPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.__devsocPool = pool;
}

// ---------------------------------------------------------------------------
// PostgreSQL-backed database layer
//
// This keeps the same collection/doc concept that the old JSON database used,
// but stores the data in Neon PostgreSQL instead of /data/*.json.
//
// app_collections:
//   events, projects, members, team, testimonials, etc.
//
// app_docs:
//   about, etc.
// ---------------------------------------------------------------------------

export async function readCollection(collection) {
  const result = await pool.query(
    "SELECT data FROM app_collections WHERE collection = $1",
    [collection]
  );

  if (result.rows.length === 0) return [];

  return result.rows[0].data || [];
}

export async function writeCollection(collection, data) {
  await pool.query(
    `
      INSERT INTO app_collections (collection, data, updated_at)
      VALUES ($1, $2::jsonb, NOW())
      ON CONFLICT (collection)
      DO UPDATE SET
        data = EXCLUDED.data,
        updated_at = NOW()
    `,
    [collection, JSON.stringify(data)]
  );

  return data;
}

// For single-object documents such as about.
export async function readDoc(name) {
  const result = await pool.query(
    "SELECT data FROM app_docs WHERE name = $1",
    [name]
  );

  if (result.rows.length === 0) return null;

  return result.rows[0].data;
}

export async function writeDoc(name, data) {
  await pool.query(
    `
      INSERT INTO app_docs (name, data, updated_at)
      VALUES ($1, $2::jsonb, NOW())
      ON CONFLICT (name)
      DO UPDATE SET
        data = EXCLUDED.data,
        updated_at = NOW()
    `,
    [name, JSON.stringify(data)]
  );

  return data;
}

export async function findById(collection, id) {
  const items = await readCollection(collection);

  return items.find((item) => item.id === id) || null;
}

export async function insert(collection, record) {
  const items = await readCollection(collection);

  items.push(record);

  await writeCollection(collection, items);

  return record;
}

export async function update(collection, id, patch) {
  const items = await readCollection(collection);

  const idx = items.findIndex((item) => item.id === id);

  if (idx === -1) return null;

  items[idx] = {
    ...items[idx],
    ...patch,
  };

  await writeCollection(collection, items);

  return items[idx];
}

export async function remove(collection, id) {
  const items = await readCollection(collection);

  const next = items.filter((item) => item.id !== id);

  const removed = next.length !== items.length;

  if (removed) {
    await writeCollection(collection, next);
  }

  return removed;
}

export default pool;
export { pool };