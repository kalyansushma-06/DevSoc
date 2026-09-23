// app/api/certificates/route.js
import { NextResponse } from "next/server";
import * as dbModule from "@/lib/db";

const pool = dbModule.default || dbModule.pool;

// GET: List all certificates
export async function GET() {
  try {
    const result = await pool.query(
      "SELECT data FROM app_collections WHERE collection = $1",
      ["certificates"]
    );
    const certificates = result.rows[0]?.data || [];
    return NextResponse.json({ certificates });
  } catch (error) {
    console.error("GET certificates error:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificates", details: error.message },
      { status: 500 }
    );
  }
}

// POST: Issue new certificate
export async function POST(req) {
  try {
    const body = await req.json();

    const certId =
      body.certificateId ||
      body.id ||
      "CERT-" + Math.random().toString(36).substring(2, 9).toUpperCase();

    const newCertificate = {
      id: certId,
      certificateId: certId,
      recipientName: body.recipientName || body.name || "",
      name: body.recipientName || body.name || "",
      recipientEmail: body.recipientEmail || body.email || "",
      eventName: body.eventName || body.event || "",
      event: body.eventName || body.event || "",
      issueDate: body.issueDate || body.date || new Date().toISOString().split("T")[0],
      templateUrl: body.templateUrl || "",
      layout: body.layout || {},
      qrUrl: body.qrUrl || "",
      status: "valid",
      createdAt: body.createdAt || new Date().toISOString(),
    };

    const currentRes = await pool.query(
      "SELECT data FROM app_collections WHERE collection = $1",
      ["certificates"]
    );
    const existingList = currentRes.rows[0]?.data || [];
    const updatedList = [newCertificate, ...existingList];

    await pool.query(
      `INSERT INTO app_collections (collection, data, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (collection)
       DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      ["certificates", JSON.stringify(updatedList)]
    );

    return NextResponse.json({ success: true, certificate: newCertificate }, { status: 201 });
  } catch (error) {
    console.error("POST certificate error:", error);
    return NextResponse.json(
      { error: "Failed to save certificate", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH: Toggle Revoke / Reinstate certificate status
export async function PATCH(req) {
  try {
    const { id, status } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const currentRes = await pool.query(
      "SELECT data FROM app_collections WHERE collection = $1",
      ["certificates"]
    );
    const list = currentRes.rows[0]?.data || [];

    const updatedList = list.map((c) => {
      const matchId = c.certificateId || c.id || c.code;
      if (matchId === id) {
        return { ...c, status: status || (c.status === "revoked" ? "valid" : "revoked") };
      }
      return c;
    });

    await pool.query(
      `INSERT INTO app_collections (collection, data, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (collection)
       DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      ["certificates", JSON.stringify(updatedList)]
    );

    return NextResponse.json({ success: true, certificates: updatedList });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a certificate
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const currentRes = await pool.query(
      "SELECT data FROM app_collections WHERE collection = $1",
      ["certificates"]
    );
    const list = currentRes.rows[0]?.data || [];
    const updatedList = list.filter((c) => (c.certificateId || c.id || c.code) !== id);

    await pool.query(
      `INSERT INTO app_collections (collection, data, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (collection)
       DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      ["certificates", JSON.stringify(updatedList)]
    );

    return NextResponse.json({ success: true, certificates: updatedList });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}