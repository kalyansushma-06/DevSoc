"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/projects", label: "Projects" },
  { href: "/team", label: "Team" },
  { href: "/blog", label: "Blog" },
  { href: "/verify", label: "Verify Certificate" },
  { href: "/join", label: "Join" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-void-900/70 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
  <Image
    src="/logo.jpg"
    alt="DevSoc logo"
    width={46}
    height={46}
    className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-cover shadow-sm"
    priority
  />
  <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
    Dev<span className="gradient-text">Soc</span>
  </span>
</Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                pathname === link.href
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/admin/login" className="nova-btn-secondary !px-5 !py-2 text-xs">
            Admin Login
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-void-900/95 px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg border border-white/15 px-3 py-2 text-center text-sm font-medium text-white/80"
            >
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
