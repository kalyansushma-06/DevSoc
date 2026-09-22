"use client";

import { useState } from "react";

const SUBTEAMS = [
  { value: "tech", label: "Tech" },
  { value: "design", label: "Design" },
  { value: "content", label: "Content" },
  { value: "management", label: "Management" }
];

export default function JoinForm() {
  const [form, setForm] = useState({
    name: "", email: "", year: "", branch: "", subteam: "tech", why: ""
  });
  const [state, setState] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status: "pending",
          appliedAt: new Date().toISOString().slice(0, 10)
        })
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="glass-panel p-8 text-center">
        <p className="font-display text-xl font-semibold text-nova-cyan">Application received!</p>
        <p className="mt-2 text-sm text-white/60">
          The {form.subteam} coordinator will review it and reach out by email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel grid gap-4 p-8 sm:grid-cols-2">
      <input required placeholder="Full name" value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} className="nova-input" />
      <input required type="email" placeholder="Email" value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} className="nova-input" />
      <input required placeholder="Year (e.g. 2nd Year)" value={form.year}
        onChange={(e) => setForm({ ...form, year: e.target.value })} className="nova-input" />
      <input required placeholder="Branch / major" value={form.branch}
        onChange={(e) => setForm({ ...form, branch: e.target.value })} className="nova-input" />

      <div className="sm:col-span-2">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">
          Which sub-team fits you best?
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SUBTEAMS.map((s) => (
            <button
              type="button"
              key={s.value}
              onClick={() => setForm({ ...form, subteam: s.value })}
              className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                form.subteam === s.value
                  ? "border-nova-cyan/60 bg-nova-cyan/10 text-nova-cyan"
                  : "border-white/15 text-white/60 hover:border-white/30"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <textarea required rows={4} placeholder="Why do you want to join DevSoc?" value={form.why}
        onChange={(e) => setForm({ ...form, why: e.target.value })} className="nova-input sm:col-span-2" />

      <button type="submit" disabled={state === "loading"} className="nova-btn-primary sm:col-span-2">
        {state === "loading" ? "Submitting..." : "Submit application"}
      </button>
      {state === "error" && (
        <p className="text-xs text-red-400 sm:col-span-2">Something went wrong, try again.</p>
      )}
    </form>
  );
}
