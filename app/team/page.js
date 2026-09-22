import { readCollection } from "@/lib/db";

export const metadata = { title: "Team — DevSoc" };

const SUBTEAM_LABEL = {
  management: "Management",
  tech: "Tech",
  design: "Design",
  content: "Content"
};

function initials(name) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export default function TeamPage() {
  const team = readCollection("team");
  const mentors = readCollection("mentors").filter((m) => m.status === "approved");

  return (
    <div className="section">
      <span className="eyebrow">Accountability</span>
      <h1 className="font-display text-4xl font-bold sm:text-5xl">Who runs DevSoc</h1>
      <p className="mt-6 max-w-xl text-white/60">
        Real people, real roles. Every core team member is reachable — click through to LinkedIn or GitHub.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <div key={member.id} className="glass-panel p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-nova-gradient font-display text-lg font-bold">
                {initials(member.name)}
              </div>
              <div>
                <p className="font-display text-base font-semibold">{member.name}</p>
                <p className="text-xs text-white/50">{member.role}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/55">{member.bio}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="nova-tag">{SUBTEAM_LABEL[member.subteam] || member.subteam}</span>
              <div className="flex gap-3 text-xs">
                {member.linkedin && (
                  <a href={member.linkedin} className="text-white/50 hover:text-nova-cyan">LinkedIn</a>
                )}
                {member.github && (
                  <a href={member.github} className="text-white/50 hover:text-nova-cyan">GitHub</a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {mentors.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-semibold">Mentors</h2>
          <p className="mt-2 text-sm text-white/55">
            Alumni and industry folks who volunteer their time to mentor members.
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mentors.map((m) => (
              <div key={m.id} className="glass-panel p-6">
                <p className="font-display text-base font-semibold">{m.name}</p>
                <p className="text-xs text-nova-cyan">{m.expertise}</p>
                <p className="mt-3 text-sm text-white/55">{m.bio}</p>
                {m.linkedin && (
                  <a href={m.linkedin} className="mt-3 inline-block text-xs text-white/50 hover:text-nova-cyan">
                    LinkedIn →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
