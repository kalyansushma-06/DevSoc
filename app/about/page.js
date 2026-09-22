export const dynamic = "force-dynamic";

import { readDoc } from "@/lib/db";

export const metadata = { title: "About — DevSoc" };

export default async function AboutPage() {
  const about = (await readDoc("about")) || {};

  return (
    <div className="section">
      <span className="eyebrow">Transparency</span>
      <h1 className="font-display text-4xl font-bold sm:text-5xl">About DevSoc</h1>
      <p className="mt-6 max-w-2xl text-lg text-white/60">{about.mission}</p>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <div className="glass-panel p-8">
          <h2 className="font-display text-xl font-semibold text-nova-cyan">Our mission</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60">{about.mission}</p>
        </div>
        <div className="glass-panel p-8">
          <h2 className="font-display text-xl font-semibold text-nova-cyan">Our vision</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60">{about.vision}</p>
        </div>
      </div>

      <div className="mt-10 glass-panel p-8">
        <h2 className="font-display text-xl font-semibold">Our story</h2>
        <p className="mt-3 text-sm leading-relaxed text-white/60">{about.story}</p>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-2xl font-semibold">What we stand for</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {(about.values || []).map((v) => (
            <div key={v.title} className="glass-panel p-6">
              <h3 className="font-display text-base font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-white/55">{v.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-2xl font-semibold">How we operate</h2>
        <ul className="mt-6 space-y-3">
          {(about.howWeOperate || []).map((line, i) => (
            <li key={i} className="glass-panel flex gap-3 p-4 text-sm text-white/65">
              <span className="font-display font-bold text-nova-purple">{String(i + 1).padStart(2, "0")}</span>
              {line}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 glass-panel flex flex-wrap items-center justify-between gap-4 p-8">
        <div>
          <p className="font-display text-lg font-semibold">Have a question about how we run things?</p>
          <p className="mt-1 text-sm text-white/50">Reach the core team directly — we answer everything.</p>
        </div>
        <a href={`mailto:${about.contactEmail}`} className="nova-btn-primary">
          {about.contactEmail}
        </a>
      </div>
    </div>
  );
}
