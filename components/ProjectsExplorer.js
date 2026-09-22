"use client";

import { useMemo, useState } from "react";
import UpvoteButton from "@/components/UpvoteButton";
import CommentSection from "@/components/CommentSection";

const DOMAINS = ["all", "web", "mobile", "ml", "tools", "games", "other"];

export default function ProjectsExplorer({ projects }) {
  const [domain, setDomain] = useState("all");
  const [tech, setTech] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const allTech = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => (p.techStack || []).forEach((t) => set.add(t)));
    return ["all", ...Array.from(set).sort()];
  }, [projects]);

  const filtered = projects
    .filter((p) => domain === "all" || p.domain === domain)
    .filter((p) => tech === "all" || (p.techStack || []).includes(tech))
    .sort((a, b) => b.upvotes - a.upvotes);

  return (
    <div>
      <div className="flex flex-wrap gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">Domain</p>
          <div className="flex flex-wrap gap-2">
            {DOMAINS.map((d) => (
              <button
                key={d}
                onClick={() => setDomain(d)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition ${
                  domain === d
                    ? "border-nova-cyan/60 bg-nova-cyan/10 text-nova-cyan"
                    : "border-white/15 text-white/55 hover:border-white/30"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">Tech stack</p>
          <div className="flex flex-wrap gap-2">
            {allTech.slice(0, 10).map((t) => (
              <button
                key={t}
                onClick={() => setTech(t)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  tech === t
                    ? "border-nova-purple/60 bg-nova-purple/10 text-nova-purple"
                    : "border-white/15 text-white/55 hover:border-white/30"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {filtered.map((p) => (
          <div key={p.id} className="glass-panel p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-1 text-xs text-white/40">by {p.author}</p>
              </div>
              <UpvoteButton projectId={p.id} initialUpvotes={p.upvotes} />
            </div>
            <p className="mt-3 text-sm text-white/60">{p.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(p.techStack || []).map((t) => (
                <span key={t} className="nova-tag">{t}</span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs">
              {p.link && (
                <a href={p.link} className="text-nova-cyan hover:underline">
                  View project →
                </a>
              )}
              <button
                onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                className="text-white/50 hover:text-white"
              >
                {p.comments?.length || 0} comment{(p.comments?.length || 0) === 1 ? "" : "s"}
              </button>
            </div>
            {expanded === p.id && <CommentSection projectId={p.id} initialComments={p.comments} />}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-white/50">No projects match those filters yet.</p>
        )}
      </div>
    </div>
  );
}
