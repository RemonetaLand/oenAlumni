"use client";
import { Fragment, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { downloadCsv, fmtDate, toCsv } from "@/lib/csv";

export type MemberRow = {
  id: string; firstName: string; surname: string; email: string; telephone: string; address: string; college: string;
  matriculationYear: string; alumniNumber: string; notes: string; status: "pending" | "confirmed" | "unsubscribed";
  consentEvents: boolean; consentShareOxford: boolean; consentShareThirdParties: boolean; consentCommGroups: boolean;
  consentVolunteer: boolean; consentTextVersion: string; createdAt: string; confirmedAt: string | null;
};

const consents: [keyof MemberRow, string][] = [
  ["consentEvents", "Events"], ["consentShareOxford", "Oxford office"], ["consentShareThirdParties", "Third parties"],
  ["consentCommGroups", "Groups"], ["consentVolunteer", "Volunteer"],
];
const pill: Record<string, string> = { confirmed: "bg-[#dcefe3] text-[#1f5a3a]", pending: "bg-[#f6ebd0] text-[#7a5a12]", unsubscribed: "bg-[#e7e7e7] text-[#555]" };

export function MembersTable({ rows }: { rows: MemberRow[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [consent, setConsent] = useState("any");
  const [open, setOpen] = useState<string | null>(null);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) =>
      (status === "all" || r.status === status) &&
      (consent === "any" || r[consent as keyof MemberRow] === true) &&
      (!needle || [r.firstName, r.surname, r.email, r.college, r.matriculationYear, r.alumniNumber, r.telephone].join(" ").toLowerCase().includes(needle)));
  }, [rows, q, status, consent]);

  const stat = (label: string, n: number) => <div className="panel px-4 py-3"><p className="text-2xl font-semibold text-oxford">{n}</p><p className="text-xs text-muted">{label}</p></div>;

  function exportCsv() {
    downloadCsv(`oen-members-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(
      ["First name", "Surname", "Email", "Telephone", "Address", "College", "Matriculation year", "Alumni number", "Notes", "Status", "Events", "Share with Oxford office", "Share with third parties", "Comm groups", "Volunteer", "Consent version", "Joined", "Confirmed"],
      shown.map((r) => [r.firstName, r.surname, r.email, r.telephone, r.address, r.college, r.matriculationYear, r.alumniNumber, r.notes, r.status,
        r.consentEvents, r.consentShareOxford, r.consentShareThirdParties, r.consentCommGroups, r.consentVolunteer, r.consentTextVersion, fmtDate(r.createdAt), fmtDate(r.confirmedAt)]),
    ));
  }

  async function remove(r: MemberRow) {
    if (!window.confirm(`Permanently delete ${r.firstName} ${r.surname} (${r.email})? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/members/${r.id}`, { method: "DELETE" });
    if (res.ok) router.refresh(); else window.alert("Could not delete. Please try again.");
  }

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stat("Total", rows.length)}
        {stat("Confirmed", rows.filter((r) => r.status === "confirmed").length)}
        {stat("Pending", rows.filter((r) => r.status === "pending").length)}
        {stat("Open to volunteer", rows.filter((r) => r.consentVolunteer).length)}
        {stat("Event invitations", rows.filter((r) => r.consentEvents).length)}
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="field grow"><label htmlFor="q">Search</label><input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, email, college, year…" /></div>
        <div className="field"><label htmlFor="st">Status</label>
          <select id="st" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All</option><option value="confirmed">Confirmed</option><option value="pending">Pending</option><option value="unsubscribed">Unsubscribed</option></select></div>
        <div className="field"><label htmlFor="co">Agreed to</label>
          <select id="co" value={consent} onChange={(e) => setConsent(e.target.value)}><option value="any">Any</option>{consents.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></div>
        <button className="btn" onClick={exportCsv} disabled={!shown.length}>Export CSV ({shown.length})</button>
      </div>
      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-stone text-xs uppercase tracking-wider text-muted">
            <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">College / year</th><th className="p-3">Status</th><th className="p-3">Joined (UTC)</th><th className="p-3" /></tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <Fragment key={r.id}>
                <tr className="border-b border-stone/60 align-top">
                  <td className="p-3 font-semibold">{r.firstName} {r.surname}</td>
                  <td className="p-3 break-all">{r.email}</td>
                  <td className="p-3">{r.college}, {r.matriculationYear}</td>
                  <td className="p-3"><span className={`rounded px-2 py-0.5 text-xs font-semibold ${pill[r.status]}`}>{r.status}</span></td>
                  <td className="p-3 whitespace-nowrap">{fmtDate(r.createdAt)}</td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <button className="underline" onClick={() => setOpen(open === r.id ? null : r.id)}>{open === r.id ? "Hide" : "Details"}</button>
                  </td>
                </tr>
                {open === r.id && (
                  <tr className="border-b border-stone/60 bg-[#faf9f6]">
                    <td colSpan={6} className="grid gap-2 p-4 text-sm sm:grid-cols-2">
                      <p><b>Telephone:</b> {r.telephone}</p>
                      <p><b>Alumni number:</b> {r.alumniNumber || "-"}</p>
                      <p className="sm:col-span-2"><b>Address:</b> {r.address || "-"}</p>
                      <p className="sm:col-span-2"><b>Notes:</b> {r.notes || "-"}</p>
                      <p className="sm:col-span-2"><b>Agreed to:</b> necessary emails, data processing{consents.filter(([k]) => r[k]).map(([, l]) => `, ${l.toLowerCase()}`).join("")} <span className="text-muted">(wording {r.consentTextVersion}, confirmed {r.confirmedAt ? fmtDate(r.confirmedAt) : "not yet"})</span></p>
                      <p className="sm:col-span-2"><button className="text-[#a33a2d] underline" onClick={() => remove(r)}>Delete this member</button></p>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {!shown.length && <tr><td colSpan={6} className="p-6 text-center text-muted">{rows.length ? "No members match these filters." : "No members yet. They appear here after someone submits the Join form."}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
