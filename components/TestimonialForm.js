"use client";

import { useState } from "react";

export default function TestimonialForm() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", story: "", highlight: "" });
  const [state, setState] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, approved: false })
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="nova-btn-secondary">
        Share your story
      </button>
    );
  }

  if (state === "done") {
    return (
      <div className="glass-panel p-6 text-sm text-nova-cyan">
        Thanks for sharing! It'll show up here once an admin approves it.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel grid gap-3 p-6 sm:grid-cols-2">
      <input required placeholder="Your name" value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} className="nova-input" />
      <input required placeholder="Role / year (e.g. 3rd Year, CSE)" value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })} className="nova-input" />
      <input placeholder="One-line highlight (e.g. Landed an internship)" value={form.highlight}
        onChange={(e) => setForm({ ...form, highlight: e.target.value })} className="nova-input sm:col-span-2" />
      <textarea required rows={4} placeholder="How did DevSoc help you?" value={form.story}
        onChange={(e) => setForm({ ...form, story: e.target.value })} className="nova-input sm:col-span-2" />
      <div className="flex gap-3 sm:col-span-2">
        <button type="submit" disabled={state === "loading"} className="nova-btn-primary">
          {state === "loading" ? "Sending..." : "Submit story"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="nova-btn-secondary">
          Cancel
        </button>
      </div>
      {state === "error" && <p className="text-xs text-red-400 sm:col-span-2">Something went wrong, try again.</p>}
    </form>
  );
}
