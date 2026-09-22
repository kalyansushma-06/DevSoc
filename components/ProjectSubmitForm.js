"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProjectSubmitForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    techStack: "",
    domain: "web",
    link: ""
  });
  const [state, setState] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          techStack: form.techStack.split(",").map((s) => s.trim()).filter(Boolean),
          upvotes: 0,
          upvotedBy: [],
          comments: [],
          status: "pending"
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
        Submit your project
      </button>
    );
  }

  if (state === "done") {
    return (
      <div className="glass-panel p-6 text-sm text-nova-cyan">
        Submitted! It'll appear in the showcase once an admin approves it.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel grid gap-3 p-6 sm:grid-cols-2">
      <input required placeholder="Project title" value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })} className="nova-input" />
      <input required placeholder="Your name" value={form.author}
        onChange={(e) => setForm({ ...form, author: e.target.value })} className="nova-input" />
      <textarea required placeholder="What does it do?" rows={3} value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="nova-input sm:col-span-2" />
      <input placeholder="Tech stack, comma separated" value={form.techStack}
        onChange={(e) => setForm({ ...form, techStack: e.target.value })} className="nova-input" />
      <select value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} className="nova-input">
        <option value="web">Web</option>
        <option value="mobile">Mobile</option>
        <option value="ml">ML / Data</option>
        <option value="tools">Tools / CLI</option>
        <option value="games">Games</option>
        <option value="other">Other</option>
      </select>
      <input placeholder="Link (GitHub, live demo, etc.)" value={form.link}
        onChange={(e) => setForm({ ...form, link: e.target.value })} className="nova-input sm:col-span-2" />
      <div className="flex gap-3 sm:col-span-2">
        <button type="submit" disabled={state === "loading"} className="nova-btn-primary">
          {state === "loading" ? "Submitting..." : "Submit for review"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="nova-btn-secondary">
          Cancel
        </button>
      </div>
      {state === "error" && <p className="text-xs text-red-400 sm:col-span-2">Something went wrong, try again.</p>}
    </form>
  );
}
