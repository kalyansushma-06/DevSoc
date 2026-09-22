import { readCollection } from "@/lib/db";
import TeamupForm from "@/components/TeamupForm";

export const metadata = { title: "Team Up Board — DevSoc" };

export default function TeamupPage() {
  const listings = [...readCollection("teamup")].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

  return (
    <div className="section">
      <span className="eyebrow">Find a team</span>
      <h1 className="font-display text-4xl font-bold sm:text-5xl">Team Up Board</h1>
      <p className="mt-6 max-w-xl text-white/60">
        Need a teammate for a hackathon or side project? Post here. Need a project to join instead?
        Browse below.
      </p>

      <div className="mt-8">
        <TeamupForm />
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {listings.map((l) => (
          <div key={l.id} className="glass-panel p-6">
            <h3 className="font-display text-lg font-semibold">{l.title}</h3>
            <p className="mt-2 text-sm text-white/55">{l.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(l.neededRoles || []).map((r) => (
                <span key={r} className="nova-tag !border-nova-purple/40 !text-nova-purple">
                  {r}
                </span>
              ))}
              {(l.tags || []).map((t) => (
                <span key={t} className="nova-tag">{t}</span>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-white/40">
              <span>Posted by {l.author}</span>
              <a href={`mailto:${l.contact}`} className="text-nova-cyan hover:underline">
                Contact →
              </a>
            </div>
          </div>
        ))}
        {listings.length === 0 && (
          <p className="text-white/50">No open listings right now — be the first to post one.</p>
        )}
      </div>
    </div>
  );
}
