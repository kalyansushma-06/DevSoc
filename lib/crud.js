import { NextResponse } from "next/server";

import { nanoid } from "nanoid";

import { readCollection, writeCollection } from "./db";

import { getSession } from "./auth";

// ---------------------------------------------------------------------------
// Generic CRUD handlers for a PostgreSQL-backed collection.
// ---------------------------------------------------------------------------

function unauthorized() {
  return NextResponse.json(
    { error: "Admin login required." },
    { status: 401 }
  );
}

export function crudHandlers(collection, { requireAuthFor = [] } = {}) {
  async function GET(request) {
    if (requireAuthFor.includes("GET") && !getSession()) {
      return unauthorized();
    }

    const { searchParams } = new URL(request.url);

    let items = await readCollection(collection);

    for (const [key, value] of searchParams.entries()) {
      if (key === "limit") continue;

      items = items.filter((item) => String(item[key]) === value);
    }

    const limit = searchParams.get("limit");

    if (limit) {
      items = items.slice(0, Number(limit));
    }

    return NextResponse.json({ items });
  }

  async function POST(request) {
    if (requireAuthFor.includes("POST") && !getSession()) {
      return unauthorized();
    }

    const body = await request.json();

    const items = await readCollection(collection);

    const record = {
      id: nanoid(10),
      createdAt: new Date().toISOString(),
      ...body,
    };

    items.push(record);

    await writeCollection(collection, items);

    return NextResponse.json({ item: record }, { status: 201 });
  }

  return { GET, POST };
}

export function itemHandlers(collection, { requireAuthFor = [] } = {}) {
  async function GET(_request, { params }) {
    if (requireAuthFor.includes("GET") && !getSession()) {
      return unauthorized();
    }

    const items = await readCollection(collection);

    const item = items.find((i) => i.id === params.id);

    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ item });
  }

  async function PATCH(request, { params }) {
    if (requireAuthFor.includes("PATCH") && !getSession()) {
      return unauthorized();
    }

    const patch = await request.json();

    const items = await readCollection(collection);

    const idx = items.findIndex((i) => i.id === params.id);

    if (idx === -1) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    items[idx] = {
      ...items[idx],
      ...patch,
    };

    await writeCollection(collection, items);

    return NextResponse.json({ item: items[idx] });
  }

  async function DELETE(_request, { params }) {
    if (requireAuthFor.includes("DELETE") && !getSession()) {
      return unauthorized();
    }

    const items = await readCollection(collection);

    const next = items.filter((i) => i.id !== params.id);

    if (next.length === items.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await writeCollection(collection, next);

    return NextResponse.json({ ok: true });
  }

  return { GET, PATCH, DELETE };
}