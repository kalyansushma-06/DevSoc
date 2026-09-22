"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminFetch";

const EMPTY = { name: "", expertise: "", bio: "", linkedin: "", status: "approved" };

export default function AdminMentorsPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  async function load() {
    const data = await adminFetch("/api/mentors");
    setItems(data.items.sort((a, b) => (a.status === "pending" ? -1 : 1)));
  }
  useEffect(() => { load(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await adminFetch("/api/mentors", { method: "POST", body: JSON.stringify(form) });
      setForm(EMPTY);
      load();
    } finally {
      setLoading(false);
    }
  }

  async function setStatus(id, status) {
    await adminFetch(`/api/mentors/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Remove this mentor?")) return;
    await adminFetch(`/api/mentors/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Mentors</h1>
      <p className="mt-1 text-sm text-white/50">Approved mentors appear publicly on the Team page.</p>

      <form onSubmit={handleSubmit} className="glass-panel mt-6 grid gap-3 p-6 sm:grid-cols-2">
        <input required placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} className="nova-input" />
        <input required placeholder="Expertise (e.g. Backend & Systems)" value={form.expertise}
          onChange={(e) => setForm({ ...form, expertise: e.target.value })} className="nova-input" />
        <textarea required rows={2} placeholder="Short bio" value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })} className="nova-input sm:col-span-2" />
        <input placeholder="LinkedIn URL" value={form.linkedin}
          onChange={(e) => setForm({ ...form, linkedin: e.target.value })} className="nova-input sm:col-span-2" />
        <button type="submit" disabled={loading} className="nova-btn-primary sm:col-span-2">
          {loading ? "Adding..." : "Add mentor"}
        </button>
      </form>

      <div className="mt-8 space-y-3">
        {items.map((m) => (
          <div key={m.id} className="glass-panel flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-display text-sm font-semibold">{m.name}</p>
                <span className={`nova-tag ${m.status === "approved" ? "!border-nova-cyan/40 !text-nova-cyan" : "!border-yellow-400/40 !text-yellow-300"}`}>
                  {m.status}
                </span>
              </div>
              <p className="text-xs text-white/40">{m.expertise}</p>
            </div>
            <div className="flex gap-2">
              {m.status !== "approved" && (
                <button onClick={() => setStatus(m.id, "approved")} className="nova-btn-primary !px-4 !py-1.5 text-xs">
                  Approve
                </button>
              )}
              <button onClick={() => handleDelete(m.id)} className="rounded-full border border-red-400/30 px-4 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-400/10">
                Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-white/50">No mentors yet.</p>}
      </div>
    </div>
  );
}
