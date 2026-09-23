// app/api/certificates/verify/route.js
import { NextResponse } from "next/server";
import * as dbModule from "@/lib/db";
import fs from "fs";
import path from "path";

const pool = dbModule.default || dbModule.pool;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id") || searchParams.get("code");

    if (!id) {
      return NextResponse.json(
        { message: "Certificate ID is required." },
        { status: 400 }
      );
    }

    const cleanId = id.trim().toLowerCase();
    let certificates = [];

    // 1. Fetch from PostgreSQL app_collections
    if (pool && typeof pool.query === "function") {
      try {
        const result = await pool.query(
          "SELECT data FROM app_collections WHERE collection = $1",
          ["certificates"]
        );
        certificates = result.rows[0]?.data || [];
      } catch (dbErr) {
        console.error("DB fetch error in verify:", dbErr);
      }
    }

    // 2. Fallback to local certificates.json if database had no matches
    if (!certificates || certificates.length === 0) {
      try {
        const filePath = path.join(process.cwd(), "data", "certificates.json");
        if (fs.existsSync(filePath)) {
          certificates = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        }
      } catch (fsErr) {
        console.error("FS fallback error in verify:", fsErr);
      }
    }

    // 3. Search case-insensitively across certificateId, id, and code
    const cert = certificates.find((c) => {
      const matchId = (c.certificateId || c.id || c.code || "").trim().toLowerCase();
      return matchId === cleanId;
    });

    if (!cert) {
      return NextResponse.json(
        { message: "Certificate not found or invalid ID." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      certificate: cert,
      isValid: cert.status !== "revoked",
    });
  } catch (error) {
    console.error("Verification API error:", error);
    return NextResponse.json(
      { message: "An error occurred while verifying the certificate." },
      { status: 500 }
    );
  }
}

// Support POST requests as well
export async function POST(req) {
  try {
    const body = await req.json();
    const id = body.id || body.code || body.certificateId;
    const url = new URL(req.url);
    if (id) url.searchParams.set("id", id);
    return GET(new Request(url.toString(), { method: "GET" }));
  } catch (err) {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }
}