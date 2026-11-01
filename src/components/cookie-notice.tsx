"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "oen-privacy-choice";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try { setVisible(!localStorage.getItem(KEY)); } catch { setVisible(true); }
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  if (!visible) return null;
  const choose = (value: string) => {
    try { localStorage.setItem(KEY, value); } catch {}
    setVisible(false);
  };
  return (
    <aside aria-label="Privacy approval" className="panel fixed bottom-4 left-1/2 z-50 w-[min(680px,calc(100%-28px))] -translate-x-1/2 p-5">
      <p className="display text-xl font-semibold text-oxford">Oxford Entrepreneurs Alumni Network</p>
      <p className="mt-1 text-sm text-muted">
        We use your details only as described in our <Link className="underline" href="/privacy">privacy policy</Link>. Please approve to continue.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => choose("all")} className="btn">Accept all</button>
        <button onClick={() => choose("none")} className="btn btn-ghost">Decline</button>
      </div>
    </aside>
  );
}
