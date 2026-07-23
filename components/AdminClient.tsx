"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import AdminAnalytics from "@/components/AdminAnalytics";

type ManifestPhoto = {
  id: string;
  kind: "static" | "blob";
  src?: string;
  contentType?: string;
  alt: string;
};

type Status = "checking" | "login" | "ready";

function thumbUrl(p: ManifestPhoto): string {
  return p.kind === "blob" ? `/api/gallery/${p.id}` : (p.src ?? "");
}

export default function AdminClient() {
  const [status, setStatus] = useState<Status>("checking");
  const [photos, setPhotos] = useState<ManifestPhoto[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  // ---- session -----------------------------------------------------------
  const loadPhotos = useCallback(async () => {
    const res = await fetch("/api/admin/gallery");
    if (res.ok) {
      const data = (await res.json()) as { photos: ManifestPhoto[] };
      setPhotos(data.photos);
    }
  }, []);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then(async (d: { authed: boolean }) => {
        if (d.authed) {
          await loadPhotos();
          setStatus("ready");
        } else {
          setStatus("login");
        }
      })
      .catch(() => setStatus("login"));
  }, [loadPhotos]);

  if (status === "checking") {
    return (
      <main className="min-h-[60vh] grid place-items-center">
        <p className="text-ink-soft">Loading…</p>
      </main>
    );
  }

  if (status === "login") {
    return (
      <LoginForm
        onSuccess={async () => {
          await loadPhotos();
          setStatus("ready");
        }}
      />
    );
  }

  // ---- logged-in panel ---------------------------------------------------
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold uppercase text-3xl">
            Gallery Admin
          </h1>
          <p className="text-ink-soft text-sm mt-1">
            Add, caption, reorder, or remove the photos shown on the site.
          </p>
        </div>
        <button
          type="button"
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" });
            setStatus("login");
          }}
          className="text-sm font-semibold text-ink underline hover:text-primary-dark"
        >
          Log out
        </button>
      </div>

      {notice && (
        <p className="mb-6 rounded-md bg-primary/15 border border-primary px-4 py-2 text-sm">
          {notice}
        </p>
      )}

      <div className="mb-8">
        <AdminAnalytics />
      </div>

      <UploadForm
        onUploaded={async () => {
          await loadPhotos();
          setNotice("Photo added.");
        }}
      />

      <h2 className="font-display font-bold uppercase text-xl mt-10 mb-4">
        Photos ({photos.length})
      </h2>

      {photos.length === 0 ? (
        <p className="text-ink-soft">No photos yet. Add one above.</p>
      ) : (
        <ul className="space-y-4">
          {photos.map((p, i) => (
            <PhotoRow
              key={p.id}
              photo={p}
              isFirst={i === 0}
              isLast={i === photos.length - 1}
              onMove={async (dir) => {
                const next = [...photos];
                const j = dir === "up" ? i - 1 : i + 1;
                [next[i], next[j]] = [next[j], next[i]];
                setPhotos(next);
                await fetch("/api/admin/gallery", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ order: next.map((x) => x.id) }),
                });
              }}
              onSaveAlt={async (alt) => {
                await fetch(`/api/admin/gallery/${p.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ alt }),
                });
                setPhotos((cur) =>
                  cur.map((x) => (x.id === p.id ? { ...x, alt } : x)),
                );
                setNotice("Caption saved.");
              }}
              onDelete={async () => {
                if (!confirm("Remove this photo from the site?")) return;
                await fetch(`/api/admin/gallery/${p.id}`, { method: "DELETE" });
                setPhotos((cur) => cur.filter((x) => x.id !== p.id));
                setNotice("Photo removed.");
              }}
            />
          ))}
        </ul>
      )}

      <div className="mt-10 text-sm">
        <Link href="/gallery" className="text-ink underline hover:text-primary-dark">
          View the live gallery →
        </Link>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resetMsg, setResetMsg] = useState<string | null>(null);
  const [resetBusy, setResetBusy] = useState(false);

  async function requestReset() {
    setResetBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/forgot", { method: "POST" });
      const d = await res.json().catch(() => ({}));
      setResetMsg(
        d.message ??
          "If an admin account exists, a reset link has been sent to the owner's email.",
      );
    } catch {
      setResetMsg("Couldn't send a reset link right now. Please try again.");
    } finally {
      setResetBusy(false);
    }
  }

  return (
    <main className="min-h-[60vh] grid place-items-center px-4">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError(null);
          const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
          });
          setBusy(false);
          if (res.ok) {
            onSuccess();
          } else {
            const d = await res.json().catch(() => ({}));
            setError(d.error ?? "Login failed.");
          }
        }}
        className="w-full max-w-sm bg-paper border-2 border-ink rounded-lg p-6 shadow-sm"
      >
        <h1 className="font-display font-bold uppercase text-2xl mb-1">
          Admin Login
        </h1>
        <p className="text-ink-soft text-sm mb-5">
          Enter the admin password to manage the gallery.
        </p>
        <label className="block text-sm font-semibold mb-1" htmlFor="pw">
          Password
        </label>
        <input
          id="pw"
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border-2 border-ink px-3 py-2 mb-4 focus:outline-none focus:border-primary-dark"
        />
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <button
          type="submit"
          disabled={busy || !password}
          className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-ink font-display font-bold uppercase tracking-wide px-5 py-2.5 rounded-md border-2 border-ink transition-colors"
        >
          {busy ? "Checking…" : "Log in"}
        </button>

        {resetMsg ? (
          <p className="mt-4 text-sm text-center rounded-md bg-primary/15 border border-primary px-3 py-2">
            {resetMsg}
          </p>
        ) : (
          <button
            type="button"
            onClick={requestReset}
            disabled={resetBusy}
            className="mt-4 w-full text-sm text-ink-soft hover:text-ink underline disabled:opacity-50"
          >
            {resetBusy ? "Sending…" : "Forgot password?"}
          </button>
        )}
      </form>
    </main>
  );
}

// ---------------------------------------------------------------------------

function UploadForm({ onUploaded }: { onUploaded: () => void }) {
  const [alt, setAlt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const file = fileRef.current?.files?.[0];
        if (!file) {
          setError("Choose a photo first.");
          return;
        }
        setBusy(true);
        setError(null);
        const fd = new FormData();
        fd.append("file", file);
        fd.append("alt", alt);
        const res = await fetch("/api/admin/gallery", {
          method: "POST",
          body: fd,
        });
        setBusy(false);
        if (res.ok) {
          setAlt("");
          if (fileRef.current) fileRef.current.value = "";
          onUploaded();
        } else {
          const d = await res.json().catch(() => ({}));
          setError(d.error ?? "Upload failed.");
        }
      }}
      className="bg-paper border-2 border-ink rounded-lg p-5"
    >
      <h2 className="font-display font-bold uppercase text-xl mb-4">
        Add a Photo
      </h2>
      <div className="grid gap-4 sm:grid-cols-[1fr_2fr] sm:items-end">
        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="file">
            Photo
          </label>
          <input
            id="file"
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="w-full text-sm file:mr-3 file:rounded-md file:border-2 file:border-ink file:bg-primary file:px-3 file:py-1.5 file:font-semibold file:text-ink hover:file:bg-primary-dark"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="alt">
            Caption / description{" "}
            <span className="font-normal text-ink-soft">
              (helps screen readers & SEO)
            </span>
          </label>
          <input
            id="alt"
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="e.g. Cleared brush line along a back fence in Statesville"
            className="w-full rounded-md border-2 border-ink px-3 py-2 focus:outline-none focus:border-primary-dark"
          />
        </div>
      </div>
      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="mt-4 bg-ink hover:bg-black disabled:opacity-50 text-paper font-display font-bold uppercase tracking-wide px-5 py-2.5 rounded-md border-2 border-ink transition-colors"
      >
        {busy ? "Uploading…" : "Add photo"}
      </button>
      <p className="text-xs text-ink-soft mt-3">
        JPG, PNG, WebP, or GIF up to 10&nbsp;MB. New photos appear at the top of
        the gallery.
      </p>
    </form>
  );
}

// ---------------------------------------------------------------------------

function PhotoRow({
  photo,
  isFirst,
  isLast,
  onMove,
  onSaveAlt,
  onDelete,
}: {
  photo: ManifestPhoto;
  isFirst: boolean;
  isLast: boolean;
  onMove: (dir: "up" | "down") => void;
  onSaveAlt: (alt: string) => void;
  onDelete: () => void;
}) {
  const [alt, setAlt] = useState(photo.alt);
  const dirty = alt.trim() !== photo.alt && alt.trim().length > 0;

  return (
    <li className="flex gap-4 bg-paper border-2 border-ink rounded-lg p-3">
      <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-md border border-ink/30 bg-ink/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbUrl(photo)}
          alt={photo.alt}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <label className="block text-xs font-semibold text-ink-soft mb-1">
          Caption
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="flex-1 min-w-0 rounded-md border-2 border-ink px-2 py-1.5 text-sm focus:outline-none focus:border-primary-dark"
          />
          <button
            type="button"
            disabled={!dirty}
            onClick={() => onSaveAlt(alt.trim())}
            className="shrink-0 text-sm font-semibold px-3 rounded-md border-2 border-ink disabled:opacity-40 hover:bg-primary hover:text-ink transition-colors"
          >
            Save
          </button>
        </div>
        <div className="flex items-center gap-3 mt-2 text-sm">
          <button
            type="button"
            disabled={isFirst}
            onClick={() => onMove("up")}
            className="disabled:opacity-30 hover:text-primary-dark"
            aria-label="Move up"
          >
            ↑ Up
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={() => onMove("down")}
            className="disabled:opacity-30 hover:text-primary-dark"
            aria-label="Move down"
          >
            ↓ Down
          </button>
          <span className="text-ink/20">|</span>
          <button
            type="button"
            onClick={onDelete}
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            Remove
          </button>
          {photo.kind === "static" && (
            <span className="ml-auto text-xs text-ink-soft italic">
              original photo
            </span>
          )}
        </div>
      </div>
    </li>
  );
}
