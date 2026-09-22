export const dynamic = "force-dynamic";

import Link from "next/link";
import { readCollection } from "@/lib/db";

export const metadata = { title: "Past Events — DevSoc" };

export default async function EventsArchivePage() {
  const today = new Date().toISOString().slice(0, 10);
  const past = (await readCollection("events"))
    .filter((e) => e.date < today)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="section">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Archive</span>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Past events</h1>
        </div>
        <Link href="/events" className="nova-btn-secondary !px-5 !py-2 text-xs">
          Upcoming events →
        </Link>
      </div>

      <div className="mt-10 space-y-5">
        {past.map((event) => (
          <div key={event.id} className="glass-panel p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-lg font-semibold">{event.title}</h3>
              <span className="text-xs text-white/40">
                {new Date(event.date + "T00:00:00").toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric"
                })}
              </span>
            </div>
            <p className="mt-2 text-sm text-white/60">{event.description}</p>
            <p className="mt-2 text-xs text-white/40">
              {event.rsvps?.length || 0} attendee{(event.rsvps?.length || 0) === 1 ? "" : "s"} RSVP'd
            </p>
            {event.archive?.summary && (
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-nova-cyan">Recap</p>
                {event.archive.summary}
              </div>
            )}
            {event.archive?.recording && (
              <a href={event.archive.recording} className="mt-3 inline-block text-xs text-nova-cyan hover:underline">
                Watch recording →
              </a>
            )}
          </div>
        ))}
        {past.length === 0 && <p className="text-white/50">No past events logged yet.</p>}
      </div>
    </div>
  );
}
