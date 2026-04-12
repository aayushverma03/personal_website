"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { prelegalApi } from "../../lib/prelegal-api";

export default function PrelegalAuthForm({ mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const rawNext = params.get("next") ?? "/ai-projects/prelegal/creator";
  const next =
    rawNext.startsWith("/ai-projects/prelegal/") &&
    !rawNext.startsWith("//")
      ? rawNext
      : "/ai-projects/prelegal/creator";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const title = mode === "login" ? "Sign in" : "Create account";
  const lede =
    mode === "login"
      ? "Welcome back to LexDraft."
      : "Start drafting with LexDraft.";
  const alt =
    mode === "login"
      ? {
          label: "Create an account",
          href: "/ai-projects/prelegal/signup",
        }
      : {
          label: "Already have an account? Sign in",
          href: "/ai-projects/prelegal/login",
        };

  async function submit(event) {
    event.preventDefault();
    setError(null);
    setBusy(true);

    try {
      if (mode === "login") {
        await prelegalApi.login(email, password);
      } else {
        await prelegalApi.signup(email, password);
      }
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="pl-auth-shell">
      <div className="pl-auth-wrap">
        <Link href="/ai-projects/prelegal" className="pl-logo-link">
          LexDraft
        </Link>

        <div className="pl-auth-card-wrap">
          <h1 className="pl-auth-title">{title}</h1>
          <p className="pl-auth-lede">{lede}</p>

          <form onSubmit={submit} className="pl-auth-card">
            <div className="pl-auth-field">
              <label htmlFor={`${mode}-email`} className="pl-auth-label">
                Email
              </label>
              <input
                id={`${mode}-email`}
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="pl-auth-input"
              />
            </div>

            <div className="pl-auth-field">
              <label htmlFor={`${mode}-password`} className="pl-auth-label">
                Password
              </label>
              <input
                id={`${mode}-password`}
                type="password"
                required
                minLength={8}
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="pl-auth-input"
              />
            </div>

            {error ? <p className="pl-auth-error">{error}</p> : null}

            <button
              type="submit"
              disabled={busy}
              className="pl-btn-primary pl-btn-full pl-auth-submit"
            >
              {busy ? "Working..." : title}
            </button>

            <button
              type="button"
              disabled
              title="Google sign-in coming soon"
              className="pl-btn-muted pl-btn-full pl-auth-google"
            >
              Continue with Google (coming soon)
            </button>
          </form>

          <div className="pl-auth-alt">
            <Link href={alt.href}>{alt.label}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
