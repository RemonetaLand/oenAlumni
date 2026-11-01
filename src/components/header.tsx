"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["About Us", "/about"],
  ["Contact", "/contact"],
  ["Partners & Sponsors", "/partners"],
] as const;

export function Header() {
  const pathname = usePathname().replace(/\/$/, "") || "/";
  return (
    <header className="border-b border-stone/70 bg-paper/80 backdrop-blur-md">
      <div className="shell flex items-start justify-between gap-6 py-5">
        <div>
          <Link href="/" className="display block text-[1.7rem] font-semibold leading-none tracking-[-0.02em] text-oxford sm:text-[2.3rem]">
            Oxford Entrepreneurs Network
          </Link>
          {/* Menu sits under the logo, half its size, plain words left to right */}
          <nav aria-label="Primary" className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[.8rem] font-semibold sm:text-[1.1rem]">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                className={`border-b-2 pb-0.5 transition-colors ${pathname === href ? "border-gold text-oxford" : "border-transparent text-muted hover:text-oxford"}`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <Link href="/JoinUs" className="btn mt-1 shrink-0">Join Us</Link>
      </div>
    </header>
  );
}
