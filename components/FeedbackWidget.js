"use client";

import { useState } from "react";

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/feedback", {
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

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="glass-panel mb-3 w-80 border-white/10 bg-void-800/95 p-5 shadow-glow">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-display text-sm font-semibold">Feedback &amp; suggestions</p>
            <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white" aria-label="Close">
              ✕
            </button>
          </div>

          {state === "done" ? (
            <p className="text-sm text-nova-cyan">Thanks! The core team reads every note.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <input
                required
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="nova-input !py-2 text-sm"
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="nova-input !py-2 text-sm"
              />
              <textarea
                required
                rows={3}
                placeholder="What should we fix or build?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="nova-input !py-2 text-sm"
              />
              <button type="submit" disabled={state === "loading"} className="nova-btn-primary !py-2 text-xs">
                {state === "loading" ? "Sending..." : "Send feedback"}
              </button>
              {state === "error" && <p className="text-xs text-red-400">Couldn't send that, try again.</p>}
            </form>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-nova-gradient text-lg shadow-glow transition hover:brightness-110"
        aria-label="Open feedback form"
        title="Feedback"
      >
        💬
      </button>
    </div>
  );
}
