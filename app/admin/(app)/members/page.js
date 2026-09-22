"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminFetch";

export default function AdminMembersPage() {
  const [items, setItems] = useState([]);

  async function load() {
    const data = await adminFetch("/api/members");
    setItems(data.items.sort((a, b) => (a.status === "pending" ? -1 : 1)));
  }
  useEffect(() => { load(); }, []);

  async function setStatus(id, status) {
    await adminFetch(`/api/members/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this application?")) return;
    await adminFetch(`/api/members/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Recruitment applications</h1>
      <p className="mt-1 text-sm text-white/50">
        Review sub-team applications. Approving here doesn't auto-create a Core Team entry — add
        them from the Core Team page once they're onboarded.
      </p>

      <div className="mt-8 space-y-3">
        {items.map((m) => (
          <div key={m.id} className="glass-panel p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-display text-base font-semibold">{m.name}</p>
                  <span className={`nova-tag ${
                    m.status === "approved" ? "!border-nova-cyan/40 !text-nova-cyan" :
                    m.status === "pending" ? "!border-yellow-400/40 !text-yellow-300" :
                    "!border-red-400/40 !text-red-300"
                  }`}>
                    {m.status}
                  </span>
                  <span className="nova-tag capitalize">{m.subteam}</span>
                </div>
                <p className="mt-1 text-xs text-white/40">
                  {m.email} · {m.year} · {m.branch} · applied {m.appliedAt}
                </p>
                <p className="mt-2 max-w-xl text-sm text-white/60">{m.why}</p>
              </div>
              <div className="flex flex-shrink-0 gap-2">
                {m.status !== "approved" && (
                  <button onClick={() => setStatus(m.id, "approved")} className="nova-btn-primary !px-4 !py-1.5 text-xs">
                    Approve
                  </button>
                )}
                {m.status !== "rejected" && (
                  <button onClick={() => setStatus(m.id, "rejected")} className="nova-btn-secondary !px-4 !py-1.5 text-xs">
                    Reject
                  </button>
                )}
                <button onClick={() => handleDelete(m.id)} className="rounded-full border border-red-400/30 px-4 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-400/10">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-white/50">No applications yet.</p>}
      </div>
    </div>
  );
}
