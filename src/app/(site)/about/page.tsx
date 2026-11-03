import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = { title: "About Us" };

const goals = [
  "Manage a world-leading community of entrepreneurial Oxford alumni",
  "Leverage our collective expertise, networks, and resources to support one another’s success",
  "Strengthen Oxford University’s presence within the global entrepreneurial ecosystem",
  "Give back by creating opportunities for future generations of entrepreneurs",
  "Promote integrity, sustainability, and responsible business leadership",
];

export default function AboutPage() {
  return (
    <>
      <PageIntro kicker="About Us" title="About the Oxford Entrepreneurs Alumni Network" />
      <section className="shell pb-8">
        <div className="panel flat-copy max-w-3xl p-7 sm:p-10" style={{ lineHeight: 1.7 }}>
          <p>The Oxford Entrepreneurs Alumni Network is the official University of Oxford alumni group for entrepreneurs, business leaders, and those interested in entrepreneurship. Formally recognised by Oxford University’s Alumni Engagement team, it connects alumni across the globe through a thriving entrepreneurial community.</p>
          <p>Our mission is to support Oxford alumni and their ventures by fostering connections, sharing knowledge, creating opportunities, and strengthening engagement with the University of Oxford.</p>
          <p>Through a global network of thousands of members, we deliver virtual and in-person events, training, mentoring, coaching, business resources, and networking opportunities that help entrepreneurs and businesses grow and succeed.</p>
          <h2 className="h2">Our Goals</h2>
          <ul className="list-disc pl-6 marker:text-gold">
            {goals.map((g) => <li key={g}>{g}</li>)}
          </ul>
          <h2 className="h2">Partner with us</h2>
          <p>Looking to expand your reach?</p>
          <p>We welcome new members, sponsors, and strategic partners who want to engage with our global community of Oxford alumni. Through partnership opportunities, your organisation can gain visibility across our events, programmes, and entrepreneurial ecosystem.</p>
          <p>To learn more, contact <a className="font-bold underline" href="mailto:Info@OenAlumni.com">Info@OenAlumni.com</a> or visit <Link className="font-bold underline" href="/partners">Partners &amp; Sponsors</Link>.</p>
        </div>
      </section>
    </>
  );
}
