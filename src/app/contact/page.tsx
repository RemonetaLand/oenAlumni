import type { Metadata } from "next";
import Image from "next/image";
import { Mail } from "lucide-react";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = { title: "Contact" };

const leaders = [
  {
    initials: "HB", photo: "/team/hadley.jpg", name: "Hadley Barrett", role: "Chairman", highlights: ["Founder since age 14", "Boards of private funds", "Oxford Sustainable"], subtitle: [],
    bio: [
      "Starting at the age of 14, Hadley has owned, founded, built, sold, managed, invested in and supported companies, projects and teams across Europe.",
      "He has chaired and sat as a non-executive director on the boards of private funds.",
      "He has owned companies in sustainable real estate, land management, agriculture, technology, sustainable consultancy and media, in the UK, Estonia, Latvia, Norway, Finland, Romania, The Netherlands, Guernsey, US, amongst others and achieved a number of industry firsts and awards.",
      "Hadley currently runs Oxford Sustainable - an innovative start-up with a 20-year brand history, disrupting sustainability spend, by transforming it from slow, complex and loss-making to “4-clicks and done” simple and profitable - aiming to be the gold standard for global sustainable infrastructure - a Fort Knox of environmental value.",
    ],
    linkedin: "https://www.linkedin.com/in/hadleybarrett/",
    website: "https://oxfordsustainable.com/",
  },
  {
    initials: "MGJ", photo: "/team/manjiri.jpg", name: "Manjiri Gokhale Joshi", role: "CEO", highlights: ["Chevening Scholar", "Author of six books", "Maya CARE co-founder"], subtitle: ["Co-Founder, Elephant Connect Education", "Co-Founder, Maya CARE Foundation"],
    bio: [
      "Former Head of Equality, Diversity and Inclusion at Saïd Business School, University of Oxford, Mentoring Coordinator at Oxford’s Radcliffe Department of Medicine, and CEO of Global Talent Track, Manjiri specialises in leadership development, management training, executive coaching, and project management consulting.",
      "She is currently pursuing a PhD in Leadership and Inclusion, focusing on disability, on a scholarship from Queen Mary University of London. She was also selected as one of 30 mentors to mark the 30th anniversary of Saïd Business School.",
      "Manjiri spent a decade in journalism with The Indian Express, Dataquest, and In Mumbai TV and held leadership roles at Zensar Technologies, ICICI Lombard, and Informa PLC in London.",
      "Manjiri holds an MSc in Major Programme Management from Saïd Business School, Oxford, and was awarded the prestigious Chevening Scholarship for Leadership and Management.",
      "She received the UK She Inspires “Agent of Change” National Award for building a leadership team of visually impaired and wheelchair users at Maya CARE, the charity she co-founded. Maya CARE supports the elderly across India, the UK, and Nepal.",
      "She was also one of only 12 professionals selected from more than 13,000 LinkedIn applicants to work with Sir Richard Branson in evaluating and mentoring entrepreneurs competing for a £1 million fund.",
      "Manjiri is the author of six published books, three of which are used as core resources in leadership development programmes.",
    ],
    linkedin: "https://linkedin.com/in/manjirigokhalejoshi",
    website: null,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageIntro kicker="Contact" title="Contacts in the Alumni network leadership team" />
      <section className="shell pb-6">
        <a href="mailto:Info@OenAlumni.com" className="panel flex items-center gap-4 p-5 transition-transform hover:-translate-y-0.5 sm:w-fit sm:pr-10">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-oxford text-white"><Mail size={18} /></span>
          <span><span className="kicker block">General enquiries</span><span className="font-bold text-oxford">Info@OenAlumni.com</span></span>
        </a>
      </section>
      <section className="shell grid gap-6 pb-8 lg:grid-cols-2">
        {leaders.map((p) => (
          <article key={p.name} className="panel overflow-hidden">
            <div className="flex items-center gap-5 bg-oxford p-6 text-white sm:p-8">
              {/* Portrait; falls back to initials if a leader has no photo */}
              <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-white/30 bg-white/10 sm:h-28 sm:w-28" role="img" aria-label={p.photo ? `Photo of ${p.name}` : `Photo of ${p.name} to be added`}>
                {p.photo
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${p.photo}`} alt="" className="h-full w-full object-cover object-top" />
                  : <span className="display text-3xl font-semibold text-white/70">{p.initials}</span>}
              </div>
              <div>
                <p className="kicker !text-[#e6c48f]">{p.role}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <h2 className="display text-3xl font-semibold leading-tight sm:text-4xl">{p.name}</h2>
                  <a
                    href={p.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${p.name} on LinkedIn`}
                    className="grid h-8 w-8 place-items-center rounded-sm bg-[#0a66c2] text-sm font-extrabold leading-none text-white transition-transform hover:-translate-y-0.5"
                  >
                    in
                  </a>
                </div>
                {p.subtitle.length > 0 && <p className="mt-2 text-sm italic text-white/70">{p.subtitle.map((s) => <span key={s} className="block">{s}</span>)}</p>}
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <ul className="mb-6 flex flex-wrap gap-2">
                {p.highlights.map((h) => <li key={h} className="rounded-full border border-stone bg-white px-3 py-1 text-xs font-bold text-oxford">{h}</li>)}
              </ul>
              <div className="space-y-3 text-[.93rem] leading-7 text-ink/85">
                {p.bio.map((t, i) => <p key={t} className={i === 0 ? "text-base font-medium text-ink" : ""}>{t}</p>)}
              </div>
              {p.website && (
                <p className="mt-6 flex items-center gap-3 border-t border-stone pt-5 text-sm font-bold text-oxford">
                  <span>Contact Hadley:</span>
                  <a href={p.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 underline-offset-4 hover:underline">
                    <Image src="https://oxfordsustainable.com/favicon.png" width={24} height={24} alt="Oxford Sustainable" />
                    <span>OxfordSustainable.com</span>
                  </a>
                </p>
              )}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
