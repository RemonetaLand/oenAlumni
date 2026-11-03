"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { downloadCsv, fmtDate, toCsv } from "@/lib/csv";

export type PartnerRow = { id: string; firstName: string; surname: string; company: string; telephone: string; email: string; request: string; createdAt: string };

export function PartnersTable({ rows }: { rows: PartnerRow[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const shown = useMemo(() => {
    const n = q.trim().toLowerCase();
    return rows.filter((r) => !n || [r.firstName, r.surname, r.company, r.email, r.request].join(" ").toLowerCase().includes(n));
  }, [rows, q]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="field grow"><label htmlFor="pq">Search</label><input id="pq" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, company, email…" /></div>
        <button className="btn" disabled={!shown.length} onClick={() => downloadCsv(`oen-partners-${new Date().toISOString().slice(0, 10)}.csv`,
          toCsv(["First name", "Surname", "Company", "Telephone", "Email", "Request", "Received"], shown.map((r) => [r.firstName, r.surname, r.company, r.telephone, r.email, r.request, fmtDate(r.createdAt)])))}>
          Export CSV ({shown.length})
        </button>
      </div>
      <div className="grid gap-3">
        {shown.map((r) => (
          <article key={r.id} className="panel grid gap-1 p-4 text-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold">{r.firstName} {r.surname}{r.company && <span className="font-normal text-muted"> · {r.company}</span>}</p>
              <p className="text-xs text-muted">{fmtDate(r.createdAt)} UTC</p>
            </div>
            <p className="break-all">{r.email} · {r.telephone}</p>
            {r.request && <p className="mt-1 whitespace-pre-wrap">{r.request}</p>}
            <p className="mt-1"><button className="text-[#a33a2d] underline" onClick={async () => {
              if (!window.confirm(`Delete the enquiry from ${r.firstName} ${r.surname}?`)) return;
              const res = await fetch(`/api/admin/partners/${r.id}`, { method: "DELETE" });
              if (res.ok) router.refresh(); else window.alert("Could not delete. Please try again.");
            }}>Delete</button></p>
          </article>
        ))}
        {!shown.length && <p className="panel p-6 text-center text-muted">{rows.length ? "No enquiries match." : "No partner enquiries yet."}</p>}
      </div>
    </div>
  );
}
