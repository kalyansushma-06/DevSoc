import { NextResponse } from "next/server";
import { readCollection, writeCollection } from "@/lib/db";

// Public RSVP endpoint. Body: { name, email }
export async function POST(request, { params }) {
  const { name, email } = await request.json();
  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const events = readCollection("events");
  const idx = events.findIndex((e) => e.id === params.id);
  if (idx === -1) return NextResponse.json({ error: "Event not found." }, { status: 404 });

  const event = events[idx];
  event.rsvps = event.rsvps || [];

  if (event.rsvps.some((r) => r.email.toLowerCase() === email.toLowerCase())) {
    return NextResponse.json({ error: "You already RSVP'd with this email." }, { status: 409 });
  }
  if (event.capacity && event.rsvps.length >= event.capacity) {
    return NextResponse.json({ error: "This event is full." }, { status: 409 });
  }

  event.rsvps.push({ name, email, rsvpedAt: new Date().toISOString() });
  events[idx] = event;
  writeCollection("events", events);

  return NextResponse.json({ ok: true, spotsLeft: event.capacity ? event.capacity - event.rsvps.length : null });
}
