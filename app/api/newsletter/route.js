import { NextResponse } from "next/server";
import { readCollection, writeCollection } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request) {
  const { email } = await request.json();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  const subs = readCollection("newsletter");
  if (subs.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
    return NextResponse.json({ ok: true, alreadySubscribed: true });
  }
  subs.push({ email, subscribedAt: new Date().toISOString() });
  writeCollection("newsletter", subs);
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function GET() {
  if (!getSession()) return NextResponse.json({ error: "Admin login required." }, { status: 401 });
  return NextResponse.json({ items: readCollection("newsletter") });
}
