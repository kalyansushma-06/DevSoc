"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TeamupForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", author: "", contact: "", neededRoles: "", tags: "" });
  const [state, setState] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/teamup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          neededRoles: form.neededRoles.split(",").map((s) => s.trim()).filter(Boolean),
          tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean)
        })
      });
      if (!res.ok) throw new Error();
      setState("done");
      router.refresh();
    } catch {
      setState("error");
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="nova-btn-primary">
        Post a listing
      </button>
    );
  }

  if (state === "done") {
    return <div className="glass-panel p-6 text-sm text-nova-cyan">Posted! Refresh to see it in the board.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel grid gap-3 p-6 sm:grid-cols-2">
      <input required placeholder="Title (e.g. Need a designer for X)" value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })} className="nova-input sm:col-span-2" />
      <textarea required rows={3} placeholder="What are you building? What do you need help with?" value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })} className="nova-input sm:col-span-2" />
      <input required placeholder="Your name" value={form.author}
        onChange={(e) => setForm({ ...form, author: e.target.value })} className="nova-input" />
      <input required placeholder="Contact (email)" value={form.contact}
        onChange={(e) => setForm({ ...form, contact: e.target.value })} className="nova-input" />
      <input placeholder="Roles needed, comma separated" value={form.neededRoles}
        onChange={(e) => setForm({ ...form, neededRoles: e.target.value })} className="nova-input" />
      <input placeholder="Tags, comma separated" value={form.tags}
        onChange={(e) => setForm({ ...form, tags: e.target.value })} className="nova-input" />
      <div className="flex gap-3 sm:col-span-2">
        <button type="submit" disabled={state === "loading"} className="nova-btn-primary">
          {state === "loading" ? "Posting..." : "Post listing"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="nova-btn-secondary">Cancel</button>
      </div>
      {state === "error" && <p className="text-xs text-red-400 sm:col-span-2">Something went wrong, try again.</p>}
    </form>
  );
}
