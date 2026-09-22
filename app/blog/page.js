export const dynamic = "force-dynamic";

import Link from "next/link";
import { readCollection } from "@/lib/db";

export const metadata = { title: "Blog — DevSoc" };

export default async function BlogIndexPage() {
  const posts = (await readCollection("blog"))
    .filter((p) => p.status === "published")
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="section">
      <span className="eyebrow">From members</span>
      <h1 className="font-display text-4xl font-bold sm:text-5xl">Blog</h1>
      <p className="mt-6 max-w-xl text-white/60">Tutorials, event recaps, and advice, written by members.</p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="glass-panel group p-6 transition hover:border-nova-cyan/40">
            <p className="text-xs text-white/40">
              {new Date(post.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              {" · "}{post.author}
            </p>
            <h2 className="mt-2 font-display text-xl font-semibold group-hover:text-nova-cyan">{post.title}</h2>
            <p className="mt-2 text-sm text-white/60">{post.excerpt}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(post.tags || []).map((t) => (
                <span key={t} className="nova-tag">{t}</span>
              ))}
            </div>
          </Link>
        ))}
        {posts.length === 0 && <p className="text-white/50">No posts published yet.</p>}
      </div>
    </div>
  );
}
