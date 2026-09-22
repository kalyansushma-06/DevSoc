import { notFound } from "next/navigation";
import Link from "next/link";
import { readCollection } from "@/lib/db";

export function generateStaticParams() {
  return readCollection("blog")
    .filter((p) => p.status === "published")
    .map((p) => ({ slug: p.slug }));
}

export default function BlogPostPage({ params }) {
  const post = readCollection("blog").find((p) => p.slug === params.slug && p.status === "published");
  if (!post) notFound();

  return (
    <div className="section max-w-3xl">
      <Link href="/blog" className="text-xs text-white/50 hover:text-white">← Back to blog</Link>
      <p className="mt-4 text-xs text-white/40">
        {new Date(post.date + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        {" · "}{post.author}
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{post.title}</h1>
      <div className="mt-3 flex flex-wrap gap-2">
        {(post.tags || []).map((t) => (
          <span key={t} className="nova-tag">{t}</span>
        ))}
      </div>
      <div className="mt-8 max-w-none text-white/70">
        {post.content.split("\n\n").map((para, i) => (
          <p key={i} className="mb-4 leading-relaxed">{para}</p>
        ))}
      </div>
    </div>
  );
}
