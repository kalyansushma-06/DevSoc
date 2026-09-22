import { readCollection } from "@/lib/db";
import TestimonialForm from "@/components/TestimonialForm";

export const metadata = { title: "Success Stories — DevSoc" };

export default function TestimonialsPage() {
  const testimonials = readCollection("testimonials").filter((t) => t.approved);

  return (
    <div className="section">
      <span className="eyebrow">Success stories</span>
      <h1 className="font-display text-4xl font-bold sm:text-5xl">Members, in their own words</h1>
      <p className="mt-6 max-w-xl text-white/60">
        Placements, skills picked up, projects shipped — real outcomes from real members.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {testimonials.map((t) => (
          <div key={t.id} className="glass-panel p-7">
            <p className="text-sm leading-relaxed text-white/70">&ldquo;{t.story}&rdquo;</p>
            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
              <div>
                <p className="font-display text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-white/40">{t.role}</p>
              </div>
              {t.highlight && (
                <span className="nova-tag !border-nova-cyan/30 !text-nova-cyan">{t.highlight}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14">
        <h2 className="font-display text-xl font-semibold">Have your own story?</h2>
        <p className="mt-2 text-sm text-white/55">
          Tell us how DevSoc helped — placement, a skill, a project you shipped.
        </p>
        <div className="mt-5">
          <TestimonialForm />
        </div>
      </div>
    </div>
  );
}
