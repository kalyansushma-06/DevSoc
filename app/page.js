import Link from "next/link";
import Image from "next/image";
import { readCollection, readDoc } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const about = (await readDoc("about")) || {};
  const events = await readCollection("events");
  const projects = (await readCollection("projects")).filter(
  (p) => p.status === "approved"
);
  const testimonials = (await readCollection("testimonials")).filter(
  (t) => t.approved
);
  const team = await readCollection("team");
  const certificates = await readCollection("certificates");

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  const topProjects = [...projects].sort((a, b) => b.upvotes - a.upvotes).slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-nova-radial" />
        <div className="section flex flex-col items-center gap-12 pb-24 pt-16 text-center lg:pt-24">
          <div className="relative">
            <video
              src="/logo-animated.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="mx-auto h-28 w-28 animate-drift rounded-3xl shadow-glow sm:h-36 sm:w-36"
            />
          </div>

          <div>
            <span className="eyebrow">Official Developer Club</span>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-6xl">
              Build. Ship.
              <br className="hidden sm:block" /> <span className="gradient-text">Belong.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-white/60 sm:text-lg">
              {about.mission}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/events" className="nova-btn-primary">
              Explore Events →
            </Link>
            <Link href="/projects" className="nova-btn-secondary">
              View Projects
            </Link>
            <Link href="/join" className="nova-btn-secondary">
              Join DevSoc
            </Link>
          </div>

          {/* stats */}
          <div className="mt-6 grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Members", value: `${team.length}+ core` },
              { label: "Events Run", value: events.length },
              { label: "Projects Shipped", value: projects.length },
              { label: "Certificates Issued", value: certificates.length }
            ].map((stat) => (
              <div key={stat.label} className="glass-panel px-4 py-5">
                <p className="font-display text-2xl font-bold gradient-text">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section">
        <span className="eyebrow">How we operate</span>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">What DevSoc actually does</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {(about.values || []).map((v) => (
            <div key={v.title} className="glass-panel p-6 transition hover:border-nova-cyan/40">
              <h3 className="font-display text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{v.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/about" className="text-sm font-semibold text-nova-cyan hover:underline">
            Read the full story and how we're run →
          </Link>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="section">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">What's next</span>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Upcoming events</h2>
          </div>
          <Link href="/events" className="nova-btn-secondary !px-5 !py-2 text-xs">
            See all events
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {upcoming.length === 0 && (
            <p className="text-white/50">No upcoming events right now — check back soon.</p>
          )}
          {upcoming.map((event) => (
            <Link
              key={event.id}
              href="/events"
              className="glass-panel group flex flex-col p-6 transition hover:border-nova-purple/50"
            >
              <p className="font-display text-xs font-semibold uppercase tracking-widest text-nova-cyan">
                {new Date(event.date + "T00:00:00").toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}{" "}
                · {event.time}
              </p>
              <h3 className="mt-3 font-display text-lg font-semibold group-hover:text-nova-cyan">
                {event.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-white/55">{event.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {event.tags?.map((t) => (
                  <span key={t} className="nova-tag">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section className="section">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Member showcase</span>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Top projects</h2>
          </div>
          <Link href="/projects" className="nova-btn-secondary !px-5 !py-2 text-xs">
            Browse all projects
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {topProjects.map((p) => (
            <div key={p.id} className="glass-panel flex flex-col p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                <span className="flex items-center gap-1 text-sm text-nova-cyan">▲ {p.upvotes}</span>
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-white/55">{p.description}</p>
              <p className="mt-3 text-xs text-white/40">by {p.author}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.techStack?.map((t) => (
                  <span key={t} className="nova-tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <span className="eyebrow">Success stories</span>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Members, in their own words</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.slice(0, 3).map((t) => (
            <div key={t.id} className="glass-panel p-6">
              <p className="text-sm leading-relaxed text-white/70">"{t.story}"</p>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="font-display text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-white/40">{t.role}</p>
                </div>
                <span className="nova-tag !border-nova-cyan/30 !text-nova-cyan">{t.highlight}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="glass-panel flex flex-col items-center gap-6 overflow-hidden p-10 text-center sm:p-14">
          <Image src="/logo.jpg" alt="DevSoc" width={56} height={56} className="rounded-xl" />
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Come build something with us.
          </h2>
          <p className="max-w-lg text-white/60">
            No experience required. Pick a sub-team, show up to a build night, and ship your first
            project this semester.
          </p>
          <Link href="/join" className="nova-btn-primary">
            Apply to join DevSoc →
          </Link>
        </div>
      </section>
    </>
  );
}
