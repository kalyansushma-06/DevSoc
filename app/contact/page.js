export const dynamic = "force-dynamic";

import { readDoc } from "@/lib/db";
import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Contact — DevSoc" };

export default async function ContactPage() {
  const about = (await readDoc("about")) || {};
  const socials = about.socials || {};

  return (
    <div className="section max-w-4xl">
      <span className="eyebrow">Get in touch</span>
      <h1 className="font-display text-4xl font-bold sm:text-5xl">Contact DevSoc</h1>
      <p className="mt-6 max-w-xl text-white/60">
        Questions, partnership ideas, sponsorships, or just want to say hi — send a message and the
        core team will get back to you.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-[1fr_1.1fr]">
        <div className="glass-panel h-fit p-7">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-white/40">
            Reach us directly
          </p>
          <a href={`mailto:${about.contactEmail}`} className="mt-3 block text-lg font-semibold text-nova-cyan">
            {about.contactEmail}
          </a>
          <div className="mt-6 flex flex-col gap-2 text-sm text-white/60">
            {socials.instagram && <a href={socials.instagram} className="hover:text-white">Instagram</a>}
            {socials.linkedin && <a href={socials.linkedin} className="hover:text-white">LinkedIn</a>}
            {socials.github && <a href={socials.github} className="hover:text-white">GitHub</a>}
            {socials.discord && <a href={socials.discord} className="hover:text-white">Discord</a>}
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
