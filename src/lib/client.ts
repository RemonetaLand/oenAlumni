/** POSTs JSON to an API route. Returns an error message to show, or null on success. */
export async function postJson(url: string, body: unknown): Promise<string | null> {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  return res.ok && data.ok ? null : data.error ?? "Something went wrong. Please try again.";
}
