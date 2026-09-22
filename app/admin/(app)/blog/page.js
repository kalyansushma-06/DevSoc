"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminFetch";

const EMPTY = { title: "", slug: "", author: "", date: "", tags: "", excerpt: "", content: "", status: "draft" };

function slugify(title) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminBlogPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    const data = await adminFetch("/api/blog");
    setItems(data.items.sort((a, b) => b.date.localeCompare(a.date)));
  }
  useEffect(() => { load(); }, []);

  function startEdit(post) {
    setEditingId(post.id);
    setForm({ ...post, tags: (post.tags || []).join(", ") });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean)
    };
    try {
      if (editingId) {
        await adminFetch(`/api/blog/${editingId}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        await adminFetch("/api/blog", { method: "POST", body: JSON.stringify(payload) });
      }
      resetForm();
      load();
    } finally {
      setLoading(false);
    }
  }

  async function togglePublish(post) {
    const status = post.status === "published" ? "draft" : "published";
    await adminFetch(`/api/blog/${post.id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this post?")) return;
    await adminFetch(`/api/blog/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Blog</h1>
      <p className="mt-1 text-sm text-white/50">Write posts as drafts, publish when ready.</p>

      <form onSubmit={handleSubmit} className="glass-panel mt-6 grid gap-3 p-6 sm:grid-cols-2">
        <input required placeholder="Title" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} className="nova-input sm:col-span-2" />
        <input placeholder="Slug (auto from title if blank)" value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })} className="nova-input" />
        <input required placeholder="Author" value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })} className="nova-input" />
        <input required type="date" value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })} className="nova-input" />
        <input placeholder="Tags, comma separated" value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })} className="nova-input" />
        <textarea required rows={2} placeholder="Excerpt" value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="nova-input sm:col-span-2" />
        <textarea required rows={8} placeholder="Full content (blank line = new paragraph)" value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })} className="nova-input sm:col-span-2" />
        <div className="flex gap-3 sm:col-span-2">
          <button type="submit" disabled={loading} className="nova-btn-primary">
            {editingId ? "Save changes" : "Save as draft"}
          </button>
          {editingId && <button type="button" onClick={resetForm} className="nova-btn-secondary">Cancel</button>}
        </div>
      </form>

      <div className="mt-8 space-y-3">
        {items.map((p) => (
          <div key={p.id} className="glass-panel flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-display text-sm font-semibold">{p.title}</p>
                <span className={`nova-tag ${p.status === "published" ? "!border-nova-cyan/40 !text-nova-cyan" : ""}`}>
                  {p.status}
                </span>
              </div>
              <p className="text-xs text-white/40">{p.date} · {p.author} · /blog/{p.slug}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => togglePublish(p)} className="nova-btn-secondary !px-4 !py-1.5 text-xs">
                {p.status === "published" ? "Unpublish" : "Publish"}
              </button>
              <button onClick={() => startEdit(p)} className="nova-btn-secondary !px-4 !py-1.5 text-xs">Edit</button>
              <button onClick={() => handleDelete(p.id)} className="rounded-full border border-red-400/30 px-4 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-400/10">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
