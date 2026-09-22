"use client";

import { useState } from "react";

export default function NewsletterForm({ compact = false }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | loading | done | error
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setMessage(data.alreadySubscribed ? "You're already on the list!" : "Subscribed! Welcome aboard.");
      setState("done");
      setEmail("");
    } catch (err) {
      setMessage(err.message);
      setState("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "flex flex-col gap-2" : "flex flex-col gap-3 sm:flex-row"}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.edu"
        className="nova-input"
      />
      <button type="submit" disabled={state === "loading"} className="nova-btn-primary whitespace-nowrap">
        {state === "loading" ? "Subscribing..." : "Subscribe"}
      </button>
      {message && (
        <p className={`text-xs ${state === "error" ? "text-red-400" : "text-nova-cyan"}`}>{message}</p>
      )}
    </form>
  );
}
