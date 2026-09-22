"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CARDS = [
  { key: "events", label: "Events" },
  { key: "projects", label: "Projects" },
  { key: "members", label: "Applications" },
  { key: "mentors", label: "Mentors" },
  { key: "certificates", label: "Certificates issued" },
  { key: "blogPosts", label: "Blog posts" },
  { key: "teamup", label: "Team-up listings" },
  { key: "newsletter", label: "Newsletter subs" }
];

const PENDING_LINKS = [
  { key: "members", label: "Recruitment applications awaiting review", href: "/admin/members" },
  { key: "mentors", label: "Mentor applications awaiting review", href: "/admin/mentors" },
  { key: "projects", label: "Projects awaiting approval", href: "/admin/projects" },
  { key: "testimonials", label: "Testimonials awaiting approval", href: "/admin/testimonials" }
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats);
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-white/50">A quick snapshot of everything happening on the site.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CARDS.map((c) => (
          <div key={c.key} className="glass-panel p-5">
            <p className="font-display text-2xl font-bold gradient-text">
              {stats ? stats.totals[c.key] ?? 0 : "—"}
            </p>
            <p className="mt-1 text-xs text-white/50">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold">Needs your attention</h2>
        <div className="mt-4 space-y-3">
          {PENDING_LINKS.map((p) => {
            const count = stats?.pending?.[p.key] ?? 0;
            if (!count) return null;
            return (
              <Link
                key={p.key}
                href={p.href}
                className="glass-panel flex items-center justify-between p-4 transition hover:border-nova-cyan/40"
              >
                <span className="text-sm text-white/70">{p.label}</span>
                <span className="rounded-full bg-nova-purple px-3 py-1 text-xs font-bold">{count}</span>
              </Link>
            );
          })}
          {stats && PENDING_LINKS.every((p) => !stats.pending[p.key]) && (
            <p className="text-sm text-white/40">Nothing pending — you're all caught up.</p>
          )}
        </div>
      </div>

      {stats && (stats.inbox.feedback > 0 || stats.inbox.contact > 0) && (
        <div className="mt-10">
          <h2 className="font-display text-lg font-semibold">Inbox</h2>
          <Link href="/admin/inbox" className="glass-panel mt-4 flex items-center justify-between p-4 hover:border-nova-cyan/40">
            <span className="text-sm text-white/70">
              {stats.inbox.feedback} feedback note{stats.inbox.feedback === 1 ? "" : "s"}, {stats.inbox.contact}{" "}
              contact message{stats.inbox.contact === 1 ? "" : "s"}
            </span>
            <span className="text-xs text-nova-cyan">Open inbox →</span>
          </Link>
        </div>
      )}
    </div>
  );
}
