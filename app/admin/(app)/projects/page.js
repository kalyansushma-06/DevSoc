"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminFetch";

export default function AdminProjectsPage() {
  const [items, setItems] = useState([]);

  async function load() {
    const data = await adminFetch("/api/projects");
    setItems(data.items.sort((a, b) => (a.status === "pending" ? -1 : 1)));
  }
  useEffect(() => { load(); }, []);

  async function setStatus(id, status) {
    await adminFetch(`/api/projects/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this project permanently?")) return;
    await adminFetch(`/api/projects/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Projects</h1>
      <p className="mt-1 text-sm text-white/50">Approve submissions to publish them to the public showcase.</p>

      <div className="mt-8 space-y-3">
        {items.map((p) => (
          <div key={p.id} className="glass-panel p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-display text-base font-semibold">{p.title}</p>
                  <span className={`nova-tag ${
                    p.status === "approved" ? "!border-nova-cyan/40 !text-nova-cyan" :
                    p.status === "pending" ? "!border-yellow-400/40 !text-yellow-300" :
                    "!border-red-400/40 !text-red-300"
                  }`}>
                    {p.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-white/40">by {p.author} · {p.domain}</p>
                <p className="mt-2 max-w-xl text-sm text-white/60">{p.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(p.techStack || []).map((t) => <span key={t} className="nova-tag">{t}</span>)}
                </div>
              </div>
              <div className="flex flex-shrink-0 gap-2">
                {p.status !== "approved" && (
                  <button onClick={() => setStatus(p.id, "approved")} className="nova-btn-primary !px-4 !py-1.5 text-xs">
                    Approve
                  </button>
                )}
                {p.status !== "rejected" && (
                  <button onClick={() => setStatus(p.id, "rejected")} className="nova-btn-secondary !px-4 !py-1.5 text-xs">
                    Reject
                  </button>
                )}
                <button onClick={() => handleDelete(p.id)} className="rounded-full border border-red-400/30 px-4 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-400/10">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-white/50">No project submissions yet.</p>}
      </div>
    </div>
  );
}
