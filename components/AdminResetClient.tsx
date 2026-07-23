"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const MIN_LENGTH = 8;

type State = "checking" | "invalid" | "form" | "done";

export default function AdminResetClient({ token }: { token: string }) {
  // No token → invalid without an effect round-trip.
  const [state, setState] = useState<State>(token ? "checking" : "invalid");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) return;
    let active = true;
    async function check() {
      try {
        const res = await fetch(
          `/api/admin/reset?token=${encodeURIComponent(token)}`,
        );
        const d = (await res.json()) as { valid: boolean };
        if (active) setState(d.valid ? "form" : "invalid");
      } catch {
        if (active) setState("invalid");
      }
    }
    check();
    return () => {
      active = false;
    };
  }, [token]);

  const shell = (children: React.ReactNode) => (
    <main className="min-h-[60vh] grid place-items-center px-4">
      <div className="w-full max-w-sm bg-paper border-2 border-ink rounded-lg p-6 shadow-sm">
        {children}
      </div>
    </main>
  );

  if (state === "checking") {
    return shell(<p className="text-ink-soft text-center">Checking link…</p>);
  }

  if (state === "invalid") {
    return shell(
      <>
        <h1 className="font-display font-bold uppercase text-2xl mb-2">
          Link expired
        </h1>
        <p className="text-ink-soft text-sm mb-5">
          This reset link is invalid or has expired. Reset links last 30
          minutes — request a new one from the login page.
        </p>
        <Link
          href="/admin"
          className="inline-block bg-primary hover:bg-primary-dark text-ink font-display font-bold uppercase tracking-wide px-5 py-2.5 rounded-md border-2 border-ink transition-colors"
        >
          Back to login
        </Link>
      </>,
    );
  }

  if (state === "done") {
    return shell(
      <>
        <h1 className="font-display font-bold uppercase text-2xl mb-2">
          Password updated
        </h1>
        <p className="text-ink-soft text-sm mb-5">
          Your new password is set. You can log in with it now.
        </p>
        <Link
          href="/admin"
          className="inline-block bg-primary hover:bg-primary-dark text-ink font-display font-bold uppercase tracking-wide px-5 py-2.5 rounded-md border-2 border-ink transition-colors"
        >
          Go to login
        </Link>
      </>,
    );
  }

  return shell(
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        if (password.length < MIN_LENGTH) {
          setError(`Password must be at least ${MIN_LENGTH} characters.`);
          return;
        }
        if (password !== confirm) {
          setError("Passwords don't match.");
          return;
        }
        setBusy(true);
        const res = await fetch("/api/admin/reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        });
        setBusy(false);
        if (res.ok) {
          setState("done");
        } else {
          const d = await res.json().catch(() => ({}));
          setError(d.error ?? "Something went wrong.");
        }
      }}
    >
      <h1 className="font-display font-bold uppercase text-2xl mb-1">
        Set a new password
      </h1>
      <p className="text-ink-soft text-sm mb-5">
        Choose a new admin password (at least {MIN_LENGTH} characters).
      </p>

      <label className="block text-sm font-semibold mb-1" htmlFor="pw">
        New password
      </label>
      <input
        id="pw"
        type="password"
        autoFocus
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-md border-2 border-ink px-3 py-2 mb-4 focus:outline-none focus:border-primary-dark"
      />

      <label className="block text-sm font-semibold mb-1" htmlFor="pw2">
        Confirm password
      </label>
      <input
        id="pw2"
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="w-full rounded-md border-2 border-ink px-3 py-2 mb-4 focus:outline-none focus:border-primary-dark"
      />

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <button
        type="submit"
        disabled={busy || !password || !confirm}
        className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-ink font-display font-bold uppercase tracking-wide px-5 py-2.5 rounded-md border-2 border-ink transition-colors"
      >
        {busy ? "Saving…" : "Update password"}
      </button>
    </form>,
  );
}
