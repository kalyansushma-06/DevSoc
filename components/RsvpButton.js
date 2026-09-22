"use client";

import { useState } from "react";

export default function RsvpButton({ eventId, full }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not RSVP.");
      setState("done");
      setMessage("You're in! See you there.");
    } catch (err) {
      setState("error");
      setMessage(err.message);
    }
  }

  if (full) {
    return <span className="nova-tag !border-red-400/30 !text-red-300">Full</span>;
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="nova-btn-primary !px-5 !py-2 text-xs">
        RSVP
      </button>
    );
  }

  if (state === "done") {
    return <p className="text-xs font-medium text-nova-cyan">{message}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <input
        required
        placeholder="Your name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="nova-input !py-2 text-xs"
      />
      <input
        required
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="nova-input !py-2 text-xs"
      />
      <button type="submit" disabled={state === "loading"} className="nova-btn-primary !px-4 !py-2 text-xs">
        {state === "loading" ? "..." : "Confirm"}
      </button>
      {state === "error" && <p className="text-xs text-red-400 sm:self-center">{message}</p>}
    </form>
  );
}
