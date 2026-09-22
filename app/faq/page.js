export const dynamic = "force-dynamic";

import { readCollection } from "@/lib/db";

export const metadata = { title: "FAQ — DevSoc" };

export default async function FaqPage() {
  const faqs = await readCollection("faq");

  return (
    <div className="section max-w-3xl">
      <span className="eyebrow">Common questions</span>
      <h1 className="font-display text-4xl font-bold sm:text-5xl">FAQ</h1>

      <div className="mt-10 space-y-3">
        {faqs.map((f) => (
          <details key={f.id} className="glass-panel group p-5 open:border-nova-cyan/40">
            <summary className="flex cursor-pointer list-none items-center justify-between font-display text-sm font-semibold">
              {f.q}
              <span className="ml-4 text-white/40 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-white/60">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="glass-panel mt-10 flex flex-wrap items-center justify-between gap-4 p-6">
        <p className="text-sm text-white/60">Still have a question?</p>
        <a href="/contact" className="nova-btn-secondary !px-5 !py-2 text-xs">Contact us</a>
      </div>
    </div>
  );
}
