"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminFetch";

const EMPTY = { name: "", role: "", subteam: "tech", bio: "", linkedin: "", github: "" };

export default function AdminTeamPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    const data = await adminFetch("/api/team");
    setItems(data.items);
  }
  useEffect(() => { load(); }, []);

  function startEdit(member) {
    setEditingId(member.id);
    setForm({
      name: member.name, role: member.role, subteam: member.subteam,
      bio: member.bio, linkedin: member.linkedin || "", github: member.github || ""
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await adminFetch(`/api/team/${editingId}`, { method: "PATCH", body: JSON.stringify(form) });
      } else {
        await adminFetch("/api/team", { method: "POST", body: JSON.stringify(form) });
      }
      resetForm();
      load();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Remove this person from the Core Team page?")) return;
    await adminFetch(`/api/team/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Core team</h1>
      <p className="mt-1 text-sm text-white/50">Shown publicly on the Team page.</p>

      <form onSubmit={handleSubmit} className="glass-panel mt-6 grid gap-3 p-6 sm:grid-cols-2">
        <input required placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} className="nova-input" />
        <input required placeholder="Role (e.g. Events Coordinator)" value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })} className="nova-input" />
        <select value={form.subteam} onChange={(e) => setForm({ ...form, subteam: e.target.value })} className="nova-input">
          <option value="tech">Tech</option>
          <option value="design">Design</option>
          <option value="content">Content</option>
          <option value="management">Management</option>
        </select>
        <input placeholder="GitHub URL" value={form.github}
          onChange={(e) => setForm({ ...form, github: e.target.value })} className="nova-input" />
        <input placeholder="LinkedIn URL" value={form.linkedin}
          onChange={(e) => setForm({ ...form, linkedin: e.target.value })} className="nova-input sm:col-span-2" />
        <textarea rows={2} placeholder="Short bio" value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })} className="nova-input sm:col-span-2" />
        <div className="flex gap-3 sm:col-span-2">
          <button type="submit" disabled={loading} className="nova-btn-primary">
            {editingId ? "Save changes" : "Add to team"}
          </button>
          {editingId && <button type="button" onClick={resetForm} className="nova-btn-secondary">Cancel</button>}
        </div>
      </form>

      <div className="mt-8 space-y-3">
        {items.map((m) => (
          <div key={m.id} className="glass-panel flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-display text-sm font-semibold">{m.name}</p>
              <p className="text-xs text-white/40">{m.role} · {m.subteam}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(m)} className="nova-btn-secondary !px-4 !py-1.5 text-xs">Edit</button>
              <button onClick={() => handleDelete(m.id)} className="rounded-full border border-red-400/30 px-4 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-400/10">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
