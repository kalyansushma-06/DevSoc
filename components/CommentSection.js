"use client";

import { useState } from "react";

export default function CommentSection({ projectId, initialComments }) {
  const [comments, setComments] = useState(initialComments || []);
  const [form, setForm] = useState({ name: "", text: "" });
  const [state, setState] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch(`/api/projects/${projectId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setComments((c) => [...c, data.comment]);
      setForm({ name: "", text: "" });
      setState("idle");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      {comments.length > 0 && (
        <ul className="mb-4 space-y-2">
          {comments.map((c) => (
            <li key={c.id} className="text-sm text-white/60">
              <span className="font-semibold text-white/80">{c.name}:</span> {c.text}
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="nova-input !py-2 text-xs sm:w-32"
        />
        <input
          required
          placeholder="Say something nice (or useful)"
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          className="nova-input !py-2 text-xs"
        />
        <button type="submit" disabled={state === "loading"} className="nova-btn-secondary !px-4 !py-2 text-xs">
          Post
        </button>
      </form>
    </div>
  );
}
