"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight } from "lucide-react";

const ADMIN_EMAIL_DOMAIN = "madinabasketball.com";

function buildAdminEmail(localPart: string): string {
  const trimmed = localPart.trim().toLowerCase();
  if (!trimmed) return "";
  if (trimmed.includes("@")) {
    const [local] = trimmed.split("@");
    return `${local}@${ADMIN_EMAIL_DOMAIN}`;
  }
  return `${trimmed}@${ADMIN_EMAIL_DOMAIN}`;
}

export default function AdminLogin() {
  const router = useRouter();
  const [localPart, setLocalPart] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check if already logged in
  useEffect(() => {
    fetch('/api/auth/check')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          router.push('/admin');
        }
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = buildAdminEmail(localPart);
    if (!email) {
      setError("Enter your admin username.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Redirect to admin dashboard
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#121418] text-sm text-white/70">
        Loading…
      </div>
    );
  }

  return (
    <div className="grid min-h-screen bg-[#f4f5f7] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="hidden flex-col justify-between bg-[#121418] px-12 py-12 text-white lg:flex">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Madina Basketball</p>
          <h1 className="mt-6 max-w-sm text-4xl font-semibold tracking-tight">Backoffice</h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            Registrations, bookings, messages, and the court calendar in one place.
          </p>
        </div>
        <p className="text-sm text-white/40">madinabasketball.com</p>
      </div>
      <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="mb-8">
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Sign in</h1>
          <p className="mt-1 text-sm text-slate-500">Use your admin name. The domain is already filled.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email-local" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative flex rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent overflow-hidden">
              <div className="relative flex-1 min-w-0">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  id="email-local"
                  type="text"
                  autoComplete="username"
                  value={localPart}
                  onChange={(e) => setLocalPart(e.target.value.replace(/@.*/, ""))}
                  required
                  className="w-full pl-10 pr-2 py-3 border-0 focus:ring-0 focus:outline-none"
                  placeholder="admin"
                  aria-describedby="email-domain"
                />
              </div>
              <span
                id="email-domain"
                className="shrink-0 self-stretch flex items-center px-3 bg-gray-50 text-gray-600 text-sm border-l border-gray-300 select-none"
              >
                @{ADMIN_EMAIL_DOMAIN}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span>Logging in...</span>
            ) : (
              <>
                <span>Login</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-slate-950"
          >
            ← Back to website
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}

