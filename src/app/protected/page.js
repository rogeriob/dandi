"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

const STORAGE_KEY = "api_key_to_validate";

function IconCheck({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function IconX({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function IconMenu({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export default function ProtectedPage() {
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const key = typeof window !== "undefined" ? window.sessionStorage.getItem(STORAGE_KEY) : null;

    if (!key) {
      setValidationResult(false);
      setLoading(false);
      setToast({ type: "invalid", message: "Invalid API key" });
      return;
    }

    fetch("/api/validate-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    })
      .then((res) => res.json())
      .then((data) => {
        const valid = data.valid === true;
        setValidationResult(valid);
        setToast({
          type: valid ? "valid" : "invalid",
          message: valid
            ? "Valid API key, /protected can be accessed"
            : "Invalid API key",
        });
      })
      .catch(() => {
        setValidationResult(false);
        setToast({ type: "invalid", message: "Invalid API key" });
      })
      .finally(() => {
        setLoading(false);
        if (typeof window !== "undefined") {
          window.sessionStorage.removeItem(STORAGE_KEY);
        }
      });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="flex min-h-screen bg-zinc-100 dark:bg-zinc-950 font-sans">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-auto">
        <header className="shrink-0 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between gap-4 px-6 py-4">
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  aria-label="Show sidebar"
                >
                  <IconMenu className="h-5 w-5" />
                </button>
              )}
              <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Protected</h1>
            </div>
            <Link
              href="/"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              ← Back home
            </Link>
          </div>
        </header>

        <main className="flex-1 px-6 py-8">
          <div className="mx-auto max-w-2xl">
            {loading ? (
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-zinc-600 dark:text-zinc-400">Validating API key…</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Protected Area
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {validationResult === true
                    ? "You have successfully validated your API key. This area is accessible."
                    : "API key validation failed. Please submit a valid API key from the playground."}
                </p>
                <Link
                  href="/playground"
                  className="mt-4 inline-block text-sm font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                >
                  Go to API Playground →
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="alert"
          className={`fixed top-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-xl px-5 py-4 shadow-lg ${
            toast.type === "valid"
              ? "bg-[#388E3C] text-zinc-900"
              : "bg-red-600 text-white"
          }`}
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ${
              toast.type === "valid" ? "bg-emerald-800/80" : "bg-red-800/80"
            }`}
          >
            {toast.type === "valid" ? (
              <IconCheck className="h-5 w-5" />
            ) : (
              <IconX className="h-5 w-5" />
            )}
          </span>
          <span className="font-medium">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className={`ml-2 rounded p-1 hover:opacity-80 ${
              toast.type === "valid" ? "text-zinc-800" : "text-white"
            }`}
            aria-label="Dismiss"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
