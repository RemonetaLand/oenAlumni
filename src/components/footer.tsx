import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 bg-oxford text-white">
      <div className="shell flex flex-col gap-6 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="display text-2xl font-semibold">Oxford Entrepreneurs Alumni Network</p>
          <p className="mt-1 text-sm text-white/65">
            <a className="underline-offset-4 hover:underline" href="mailto:Info@OenAlumni.com">Info@OenAlumni.com</a>
          </p>
        </div>
        <div className="flex flex-col gap-1 text-sm text-white/65 sm:items-end">
          <Link className="text-white underline-offset-4 hover:underline" href="/privacy">Privacy policy &amp; cookies</Link>
          <p>© 2026 Oxford Entrepreneurs Alumni Network</p>
        </div>
      </div>
    </footer>
  );
}
