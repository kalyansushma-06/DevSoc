"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/mentors", label: "Mentors" },
  { href: "/admin/certificates", label: "Certificates" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/inbox", label: "Inbox" },
];

export default function AdminSidebar({ admin }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-white/10 bg-void-950 p-5">
      <div className="mb-8">
        <h1 className="font-display text-xl font-bold">
          Dev<span className="text-nova-cyan">Soc</span>
        </h1>

        <p className="mt-1 text-xs text-white/40">
          Admin Panel
        </p>
      </div>

      <nav className="space-y-1">
        {LINKS.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/admin" &&
              pathname.startsWith(`${link.href}/`));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-lg px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-nova-cyan/10 text-nova-cyan"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 border-t border-white/10 pt-5">
        <p className="mb-3 truncate text-xs text-white/40">
          {admin?.email || "Admin"}
        </p>

        <LogoutButton />
      </div>
    </aside>
  );
}