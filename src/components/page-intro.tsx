export function PageIntro({ kicker, title, text }: { kicker: string; title: string; text?: string }) {
  return (
    <section className="shell pb-10 pt-14 sm:pt-20">
      <p className="kicker">{kicker}</p>
      <h1 className="page-title mt-4 max-w-4xl">{title}</h1>
      {text && <p className="mt-6 max-w-2xl text-lg text-muted">{text}</p>}
    </section>
  );
}
