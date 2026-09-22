"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminFetch";

const EMPTY = { q: "", a: "" };

export default function AdminFaqPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    const data = await adminFetch("/api/faq");
    setItems(data.items);
  }
  useEffect(() => { load(); }, []);

  function startEdit(item) {
    setEditingId(item.id);
    setForm({ q: item.q, a: item.a });
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
        await adminFetch(`/api/faq/${editingId}`, { method: "PATCH", body: JSON.stringify(form) });
      } else {
        await adminFetch("/api/faq", { method: "POST", body: JSON.stringify(form) });
      }
      resetForm();
      load();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this question?")) return;
    await adminFetch(`/api/faq/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">FAQ</h1>
      <p className="mt-1 text-sm text-white/50">Add, edit, or remove questions shown on the public FAQ page.</p>

      <form onSubmit={handleSubmit} className="glass-panel mt-6 grid gap-3 p-6">
        <input required placeholder="Question" value={form.q}
          onChange={(e) => setForm({ ...form, q: e.target.value })} className="nova-input" />
        <textarea required rows={3} placeholder="Answer" value={form.a}
          onChange={(e) => setForm({ ...form, a: e.target.value })} className="nova-input" />
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="nova-btn-primary">
            {editingId ? "Save changes" : "Add question"}
          </button>
          {editingId && <button type="button" onClick={resetForm} className="nova-btn-secondary">Cancel</button>}
        </div>
      </form>

      <div className="mt-8 space-y-3">
        {items.map((f) => (
          <div key={f.id} className="glass-panel p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-sm font-semibold">{f.q}</p>
                <p className="mt-1 text-xs text-white/50">{f.a}</p>
              </div>
              <div className="flex flex-shrink-0 gap-2">
                <button onClick={() => startEdit(f)} className="nova-btn-secondary !px-3 !py-1.5 text-xs">Edit</button>
                <button onClick={() => handleDelete(f.id)} className="rounded-full border border-red-400/30 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-400/10">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-white/50">No FAQ entries yet.</p>}
      </div>
    </div>
  );
}
