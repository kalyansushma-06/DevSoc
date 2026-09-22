"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminFetch";

const TABS = [
  { key: "feedback", label: "Feedback box" },
  { key: "contact", label: "Contact messages" },
  { key: "newsletter", label: "Newsletter subscribers" }
];

export default function AdminInboxPage() {
  const [tab, setTab] = useState("feedback");
  const [data, setData] = useState({ feedback: [], contact: [], newsletter: [] });
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [feedback, contact, newsletter] = await Promise.all([
      adminFetch("/api/feedback"),
      adminFetch("/api/contact"),
      adminFetch("/api/newsletter")
    ]);
    setData({
      feedback: feedback.items.slice().reverse(),
      contact: contact.items.slice().reverse(),
      newsletter: newsletter.items.slice().reverse()
    });
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleDelete(collection, id) {
    if (!confirm("Delete this entry?")) return;
    await adminFetch(`/api/${collection}/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Inbox</h1>
      <p className="mt-1 text-sm text-white/50">
        Everything visitors sent through the feedback widget, contact form, and newsletter signup.
      </p>

      <div className="mt-6 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
              tab === t.key
                ? "border-nova-cyan/60 bg-nova-cyan/10 text-nova-cyan"
                : "border-white/15 text-white/55 hover:border-white/30"
            }`}
          >
            {t.label} ({data[t.key].length})
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {loading && <p className="text-white/50">Loading...</p>}

        {!loading && tab === "newsletter" &&
          data.newsletter.map((s, i) => (
            <div key={i} className="glass-panel flex items-center justify-between p-4">
              <span className="text-sm">{s.email}</span>
              <span className="text-xs text-white/40">{new Date(s.subscribedAt).toLocaleDateString()}</span>
            </div>
          ))}

        {!loading && tab !== "newsletter" &&
          data[tab].map((m) => (
            <div key={m.id} className="glass-panel p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{m.name} {m.email && <span className="font-normal text-white/40">· {m.email}</span>}</p>
                  <p className="mt-1 text-sm text-white/60">{m.message}</p>
                  <p className="mt-2 text-xs text-white/30">{new Date(m.createdAt).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => handleDelete(tab, m.id)}
                  className="flex-shrink-0 rounded-full border border-red-400/30 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-400/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

        {!loading && data[tab].length === 0 && <p className="text-white/50">Nothing here yet.</p>}
      </div>
    </div>
  );
}
