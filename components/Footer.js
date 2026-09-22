import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "@/components/NewsletterForm";
import { readDoc } from "@/lib/db";

export default function Footer() {
  const about = readDoc("about") || {};
  const socials = about.socials || {};

  return (
    <footer className="relative z-10 border-t border-white/5 bg-void-900/80">
      <div className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/logo.jpg" alt="DevSoc logo" width={36} height={36} className="rounded-lg" />
              <span className="font-display text-lg font-bold">
                Dev<span className="gradient-text">Soc</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              {about.mission || "A student developer club for building real things, together."}
            </p>
          </div>

          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-widest text-white/40">
              Explore
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/events" className="hover:text-white">Events</Link></li>
              <li><Link href="/events/archive" className="hover:text-white">Past Events</Link></li>
              <li><Link href="/projects" className="hover:text-white">Projects</Link></li>
              <li><Link href="/teamup" className="hover:text-white">Team Up Board</Link></li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-widest text-white/40">
              Club
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              <li><Link href="/team" className="hover:text-white">Core Team</Link></li>
              <li><Link href="/testimonials" className="hover:text-white">Success Stories</Link></li>
              <li><Link href="/verify" className="hover:text-white">Verify Certificate</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/join" className="hover:text-white">Join DevSoc</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/admin/login" className="hover:text-white">Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-widest text-white/40">
              Newsletter
            </p>
            <p className="mt-4 text-sm text-white/50">
              Occasional email about events and things members shipped. No spam.
            </p>
            <div className="mt-4">
              <NewsletterForm compact />
            </div>
            <div className="mt-6 flex gap-4 text-sm text-white/50">
              {socials.github && <a href={socials.github} className="hover:text-white">GitHub</a>}
              {socials.instagram && <a href={socials.instagram} className="hover:text-white">Instagram</a>}
              {socials.linkedin && <a href={socials.linkedin} className="hover:text-white">LinkedIn</a>}
              {socials.discord && <a href={socials.discord} className="hover:text-white">Discord</a>}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/5 pt-6 text-xs text-white/35 sm:flex-row sm:items-center">
          <p>&copy; {new Date().getFullYear()} DevSoc. Built by members, for members.</p>
          <p>{about.contactEmail}</p>
        </div>
      </div>
    </footer>
  );
}
