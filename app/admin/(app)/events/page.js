"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminFetch";

const EMPTY = {
  title: "", description: "", date: "", time: "", location: "",
  tags: "", capacity: 50, status: "approved"
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const data = await adminFetch("/api/events");
    setEvents(data.items.sort((a, b) => b.date.localeCompare(a.date)));
  }

  useEffect(() => { load(); }, []);

  function startEdit(event) {
    setEditingId(event.id);
    setForm({
      title: event.title, description: event.description, date: event.date, time: event.time,
      location: event.location, tags: (event.tags || []).join(", "), capacity: event.capacity,
      status: event.status
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const payload = {
      ...form,
      capacity: Number(form.capacity) || null,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean)
    };
    try {
      if (editingId) {
        await adminFetch(`/api/events/${editingId}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        await adminFetch("/api/events", {
          method: "POST",
          body: JSON.stringify({ ...payload, rsvps: [] })
        });
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    await adminFetch(`/api/events/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Events</h1>
      <p className="mt-1 text-sm text-white/50">Create, edit, and remove events. Deleting an event also removes its RSVPs.</p>

      <form onSubmit={handleSubmit} className="glass-panel mt-6 grid gap-3 p-6 sm:grid-cols-2">
        <input required placeholder="Title" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} className="nova-input sm:col-span-2" />
        <textarea required rows={2} placeholder="Description" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} className="nova-input sm:col-span-2" />
        <input required type="date" value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })} className="nova-input" />
        <input required type="time" value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })} className="nova-input" />
        <input required placeholder="Location" value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })} className="nova-input" />
        <input type="number" placeholder="Capacity" value={form.capacity}
          onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="nova-input" />
        <input placeholder="Tags, comma separated" value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })} className="nova-input sm:col-span-2" />
        <div className="flex gap-3 sm:col-span-2">
          <button type="submit" disabled={loading} className="nova-btn-primary">
            {editingId ? "Save changes" : "Create event"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="nova-btn-secondary">Cancel edit</button>
          )}
        </div>
        {error && <p className="text-xs text-red-400 sm:col-span-2">{error}</p>}
      </form>

      <div className="mt-8 space-y-3">
        {events.map((event) => (
          <div key={event.id} className="glass-panel flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-display text-sm font-semibold">{event.title}</p>
              <p className="text-xs text-white/40">
                {event.date} · {event.time} · {event.location} · {(event.rsvps || []).length}/{event.capacity || "∞"} RSVPs
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(event)} className="nova-btn-secondary !px-4 !py-1.5 text-xs">Edit</button>
              <button onClick={() => handleDelete(event.id)} className="rounded-full border border-red-400/30 px-4 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-400/10">
                Delete
              </button>
            </div>
          </div>
        ))}
        {events.length === 0 && <p className="text-white/50">No events yet.</p>}
      </div>
    </div>
  );
}
