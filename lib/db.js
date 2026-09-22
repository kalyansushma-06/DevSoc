import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Tiny JSON-file "database".
//
// Every collection (events, projects, members, ...) lives as a single JSON
// file under /data. This is intentionally simple so the whole site runs with
// zero external services for local development and grading/demo purposes.
//
// IMPORTANT FOR PRODUCTION: most serverless hosts (Vercel, Netlify, etc.)
// ship a read-only filesystem, so writes here will not persist once
// deployed. Swap readCollection/writeCollection for calls to a real database
// (Postgres, MongoDB, etc.) before you rely on this in production - the rest
// of the app (API routes, admin UI) does not need to change, only this file.
// ---------------------------------------------------------------------------

const DATA_DIR = path.join(process.cwd(), "data");

function filePathFor(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

export function readCollection(collection) {
  const file = filePathFor(collection);
  if (!fs.existsSync(file)) return [];
  const raw = fs.readFileSync(file, "utf-8").trim();
  if (!raw) return [];
  return JSON.parse(raw);
}

export function writeCollection(collection, data) {
  const file = filePathFor(collection);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf-8");
  return data;
}

// For single-object files like about.json (not an array of records).
export function readDoc(name) {
  const file = filePathFor(name);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export function writeDoc(name, data) {
  const file = filePathFor(name);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf-8");
  return data;
}

export function findById(collection, id) {
  return readCollection(collection).find((item) => item.id === id) || null;
}

export function insert(collection, record) {
  const items = readCollection(collection);
  items.push(record);
  writeCollection(collection, items);
  return record;
}

export function update(collection, id, patch) {
  const items = readCollection(collection);
  const idx = items.findIndex((item) => item.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...patch };
  writeCollection(collection, items);
  return items[idx];
}

export function remove(collection, id) {
  const items = readCollection(collection);
  const next = items.filter((item) => item.id !== id);
  const removed = next.length !== items.length;
  if (removed) writeCollection(collection, next);
  return removed;
}
