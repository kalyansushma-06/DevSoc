"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error();
      setState("done");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return <p className="glass-panel p-6 text-sm text-nova-cyan">Message sent — we'll reply by email soon.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel grid gap-3 p-6">
      <input required placeholder="Name" value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} className="nova-input" />
      <input required type="email" placeholder="Email" value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} className="nova-input" />
      <textarea required rows={5} placeholder="What's up?" value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })} className="nova-input" />
      <button type="submit" disabled={state === "loading"} className="nova-btn-primary">
        {state === "loading" ? "Sending..." : "Send message"}
      </button>
      {state === "error" && <p className="text-xs text-red-400">Something went wrong, try again.</p>}
    </form>
  );
}
