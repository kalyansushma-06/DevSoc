"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminFetch";

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState([]);

  async function load() {
    const data = await adminFetch("/api/testimonials");
    setItems(data.items.sort((a, b) => (a.approved ? 1 : -1)));
  }
  useEffect(() => { load(); }, []);

  async function setApproved(id, approved) {
    await adminFetch(`/api/testimonials/${id}`, { method: "PATCH", body: JSON.stringify({ approved }) });
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this testimonial?")) return;
    await adminFetch(`/api/testimonials/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Testimonials</h1>
      <p className="mt-1 text-sm text-white/50">Approved stories show up on the public Success Stories page.</p>

      <div className="mt-8 space-y-3">
        {items.map((t) => (
          <div key={t.id} className="glass-panel p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-display text-base font-semibold">{t.name}</p>
                  <span className={`nova-tag ${t.approved ? "!border-nova-cyan/40 !text-nova-cyan" : "!border-yellow-400/40 !text-yellow-300"}`}>
                    {t.approved ? "approved" : "pending"}
                  </span>
                </div>
                <p className="text-xs text-white/40">{t.role}</p>
                <p className="mt-2 max-w-xl text-sm text-white/60">{t.story}</p>
              </div>
              <div className="flex flex-shrink-0 gap-2">
                {!t.approved && (
                  <button onClick={() => setApproved(t.id, true)} className="nova-btn-primary !px-4 !py-1.5 text-xs">
                    Approve
                  </button>
                )}
                {t.approved && (
                  <button onClick={() => setApproved(t.id, false)} className="nova-btn-secondary !px-4 !py-1.5 text-xs">
                    Unpublish
                  </button>
                )}
                <button onClick={() => handleDelete(t.id)} className="rounded-full border border-red-400/30 px-4 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-400/10">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-white/50">No testimonials submitted yet.</p>}
      </div>
    </div>
  );
}
