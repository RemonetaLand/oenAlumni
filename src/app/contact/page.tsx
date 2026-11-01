import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = { title: "Contact" };

const leaders = [
  {
    initials: "HB", name: "Hadley Barrett, Chairman", subtitle: [],
    bio: [
      "Starting at the age of 14, Hadley has owned, founded, built, sold, managed, invested in and supported companies, projects and teams across Europe.",
      "He has chaired and sat as a non-executive director on the boards of private funds.",
      "He has owned companies in sustainable real estate, land management, agriculture, technology, sustainable consultancy and media, in the UK, Estonia, Latvia, Norway, Finland, Romania, The Netherlands, Guernsey, US, amongst others and achieved a number of industry firsts and awards.",
      "Hadley currently runs Oxford Sustainable - an innovative start-up with a 20-year brand history, disrupting sustainability spend, by transforming it from slow, complex and loss-making to “4-clicks and done” simple and profitable - aiming to be the gold standard for global sustainable infrastructure - a Fort Knox of environmental value.",
    ],
    links: [["Info@OxfordSustainable.com", "mailto:Info@OxfordSustainable.com"], ["LinkedIn profile", "https://www.linkedin.com/in/hadleybarrett/"]],
  },
  {
    initials: "MGJ", name: "Manjiri Gokhale Joshi, CEO", subtitle: ["Co-Founder, Elephant Connect Education", "Co-Founder, Maya CARE Foundation"],
    bio: [
      "Former Head of Equality, Diversity and Inclusion at Saïd Business School, University of Oxford, Mentoring Coordinator at Oxford’s Radcliffe Department of Medicine, and CEO of Global Talent Track, Manjiri specialises in leadership development, management training, executive coaching, and project management consulting.",
      "She is currently pursuing a PhD in Leadership and Inclusion, focusing on disability, on a scholarship from Queen Mary University of London. She was also selected as one of 30 mentors to mark the 30th anniversary of Saïd Business School.",
      "Manjiri spent a decade in journalism with The Indian Express, Dataquest, and In Mumbai TV and held leadership roles at Zensar Technologies, ICICI Lombard, and Informa PLC in London.",
      "Manjiri holds an MSc in Major Programme Management from Saïd Business School, Oxford, and was awarded the prestigious Chevening Scholarship for Leadership and Management.",
      "She received the UK She Inspires “Agent of Change” National Award for building a leadership team of visually impaired and wheelchair users at Maya CARE, the charity she co-founded. Maya CARE supports the elderly across India, the UK, and Nepal.",
      "She was also one of only 12 professionals selected from more than 13,000 LinkedIn applicants to work with Sir Richard Branson in evaluating and mentoring entrepreneurs competing for a £1 million fund.",
      "Manjiri is the author of six published books, three of which are used as core resources in leadership development programmes.",
    ],
    links: [["LinkedIn profile", "https://linkedin.com/in/manjirigokhalejoshi"]],
  },
];

export default function ContactPage() {
  return (
    <>
      <PageIntro kicker="Contact" title="Contacts in the Alumni network leadership team" />
      <section className="shell grid gap-6 pb-8 lg:grid-cols-2">
        {leaders.map((p) => (
          <article key={p.name} className="panel grid gap-6 p-6 sm:grid-cols-[150px_1fr] sm:p-8">
            {/* Photo slot: swap for a real portrait; Hadley's to be supplied */}
            <div className="grid aspect-[4/5] w-full max-w-[150px] place-items-center rounded bg-oxford/10 sm:max-w-none" role="img" aria-label={`Photo of ${p.name} to be added`}>
              <span className="display text-5xl font-semibold text-oxford/40">{p.initials}</span>
            </div>
            <div className="space-y-3 text-[.93rem] leading-7 text-ink/85">
              <h2 className="h2">{p.name}</h2>
              {p.subtitle.length > 0 && <p className="italic text-muted">{p.subtitle.map((s) => <span key={s} className="block">{s}</span>)}</p>}
              {p.bio.map((t) => <p key={t}>{t}</p>)}
              <p className="flex flex-col gap-1 pt-2 font-bold text-oxford">
                {p.links.map(([l, h]) => <a key={h} className="underline underline-offset-4" href={h} target={h.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{l}</a>)}
              </p>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
