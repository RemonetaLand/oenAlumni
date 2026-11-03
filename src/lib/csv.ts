/** Builds a CSV in the browser. Leading = + - @ are prefixed so spreadsheets do not run submitted text as formulas. */
export function toCsv(headers: string[], rows: (string | number | boolean | null)[][]) {
  const cell = (v: string | number | boolean | null) => {
    let s = v === null ? "" : String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return `"${s.replace(/"/g, '""')}"`;
  };
  return [headers, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
}

export function downloadCsv(filename: string, csv: string) {
  const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/** Same output on server and browser (UTC), so server-rendered tables never mismatch on hydration. */
export const fmtDate = (iso: string | null) => (iso ? iso.slice(0, 16).replace("T", " ") : "");
