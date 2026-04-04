"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/our-story", label: "Our Story" },
  { href: "/invitation", label: "RSVP" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
      {links.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`text-xs sm:text-sm tracking-widest uppercase transition-colors ${isActive
                ? "text-accent font-medium"
                : "text-text-secondary hover:text-foreground"
              }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
