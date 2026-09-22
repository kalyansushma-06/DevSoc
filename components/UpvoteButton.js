"use client";

import { useEffect, useState } from "react";

function getVoterId() {
  if (typeof window === "undefined") return null;
  let id = localStorage.getItem("devsoc_voter_id");
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("devsoc_voter_id", id);
  }
  return id;
}

export default function UpvoteButton({ projectId, initialUpvotes }) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [upvoted, setUpvoted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const votedKey = `devsoc_voted_${projectId}`;
    setUpvoted(localStorage.getItem(votedKey) === "1");
  }, [projectId]);

  async function toggle() {
    setLoading(true);
    const voterId = getVoterId();
    try {
      const res = await fetch(`/api/projects/${projectId}/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterId })
      });
      const data = await res.json();
      if (res.ok) {
        setUpvotes(data.upvotes);
        setUpvoted(data.upvoted);
        localStorage.setItem(`devsoc_voted_${projectId}`, data.upvoted ? "1" : "0");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
        upvoted
          ? "border-nova-cyan/60 bg-nova-cyan/10 text-nova-cyan"
          : "border-white/15 text-white/60 hover:border-white/30 hover:text-white"
      }`}
    >
      ▲ {upvotes}
    </button>
  );
}
