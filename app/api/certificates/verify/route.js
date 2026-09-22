import { NextResponse } from "next/server";
import { readCollection } from "@/lib/db";

// Public certificate verification lookup - GET /api/certificates/verify?certId=DEVSOC-2026-0001
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const certId = (searchParams.get("certId") || "").trim();
  if (!certId) {
    return NextResponse.json({ error: "Provide a certificate ID to look up." }, { status: 400 });
  }

  const certificates = readCollection("certificates");
  const match = certificates.find(
    (c) => c.certId.toLowerCase() === certId.toLowerCase()
  );

  if (!match) {
    return NextResponse.json({ found: false });
  }

  return NextResponse.json({
    found: true,
    certificate: {
      certId: match.certId,
      name: match.name,
      issuedFor: match.issuedFor,
      issuedBy: match.issuedBy,
      dateIssued: match.dateIssued,
      status: match.status
    }
  });
}
