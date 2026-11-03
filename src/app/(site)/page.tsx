import Link from "next/link";

export default function Home() {
  return (
    <section className="shell flex min-h-[62vh] flex-col justify-center py-20 sm:py-28">
      <p className="kicker">University of Oxford</p>
      <h1 className="display mt-5 max-w-4xl text-[clamp(3rem,8vw,6.5rem)] font-medium leading-[.95] tracking-[-0.035em] text-oxford">
        Oxford Entrepreneurs Alumni Network
      </h1>
      <p className="mt-8 max-w-xl text-xl text-muted">
        The official alumni group for entrepreneurs, business leaders and those interested in entrepreneurship.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/JoinUs" className="btn">Join Us</Link>
        <Link href="/about" className="btn btn-ghost">About Us</Link>
      </div>
    </section>
  );
}
