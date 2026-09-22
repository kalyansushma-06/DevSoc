import Link from "next/link";
import { readCollection } from "@/lib/db";
import RsvpButton from "@/components/RsvpButton";

export const metadata = { title: "Events — DevSoc" };

export default function EventsPage() {
  const today = new Date().toISOString().slice(0, 10);
  const events = readCollection("events")
    .filter((e) => e.status === "approved" && e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="section">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Event calendar</span>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Upcoming events</h1>
          <p className="mt-4 max-w-xl text-white/60">
            Workshops, build nights, and our flagship hackathon. RSVP to hold your spot.
          </p>
        </div>
        <Link href="/events/archive" className="nova-btn-secondary !px-5 !py-2 text-xs">
          Past events archive →
        </Link>
      </div>

      <div className="mt-10 space-y-5">
        {events.map((event) => {
          const spotsLeft = event.capacity ? event.capacity - (event.rsvps?.length || 0) : null;
          const isFull = spotsLeft !== null && spotsLeft <= 0;
          return (
            <div key={event.id} className="glass-panel flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-5">
                <div className="flex w-16 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-nova-gradient p-3 text-center">
                  <span className="font-display text-xs font-semibold uppercase">
                    {new Date(event.date + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}
                  </span>
                  <span className="font-display text-2xl font-bold">
                    {new Date(event.date + "T00:00:00").getDate()}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold">{event.title}</h3>
                  <p className="mt-1 text-xs text-white/40">
                    {event.time} · {event.location}
                    {spotsLeft !== null && !isFull && ` · ${spotsLeft} spots left`}
                  </p>
                  <p className="mt-2 max-w-xl text-sm text-white/60">{event.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(event.tags || []).map((t) => (
                      <span key={t} className="nova-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 md:pl-4">
                <RsvpButton eventId={event.id} full={isFull} />
              </div>
            </div>
          );
        })}
        {events.length === 0 && (
          <p className="text-white/50">No upcoming events right now — check the archive or check back soon.</p>
        )}
      </div>
    </div>
  );
}
