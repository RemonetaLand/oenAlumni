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
      <div className="shell flex items-start justify-between gap-3 py-4 sm:gap-6 sm:py-5">
        <div className="min-w-0">
          <Link href="/" className="display block text-[1.35rem] font-semibold leading-[.95] tracking-[-0.02em] text-oxford sm:text-[1.8rem] md:text-[2.3rem]">
            Oxford Entrepreneurs Network
          </Link>
          {/* Menu sits under the logo, half its size, plain words left to right */}
          <nav aria-label="Primary" className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[.76rem] font-semibold sm:gap-x-6 sm:text-[.95rem] md:text-[1.1rem]">
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
        <Link href="/JoinUs" className="btn mt-1 shrink-0 max-sm:min-h-10 max-sm:px-4 max-sm:py-2 max-sm:text-xs">Join Us</Link>
      </div>
    </header>
  );
}
