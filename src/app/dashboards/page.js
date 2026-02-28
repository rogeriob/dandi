"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

const API_KEYS_URL = "/api/api-keys";

function IconMenu({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function maskKey(key) {
  if (!key || key.length < 12) return "****";
  return key.slice(0, 9) + "*".repeat(Math.min(key.length - 9, 27));
}

function IconEye({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function IconCopy({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function IconPencil({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

function IconTrash({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function IconDoc({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function IconPlus({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function IconInfo({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconChat({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

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

export default function DashboardsPage() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [type, setType] = useState("dev");
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState(new Set());
  const [payAsYouGo, setPayAsYouGo] = useState(false);
  const [usage] = useState(0);
  const [creditsLimit] = useState(1000);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [actionToast, setActionToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const res = await fetch(API_KEYS_URL);
      const data = await res.json();
      setApiKeys(data.apiKeys || []);
    } catch (err) {
      console.error("Failed to fetch API keys:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await fetch(API_KEYS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, key, type }),
      });
      setName("");
      setKey("");
      setType("dev");
      setShowModal(false);
      fetchApiKeys();
      setActionToast({ message: "API key created", type: "success" });
    } catch (err) {
      console.error("Failed to create API key:", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      await fetch(`${API_KEYS_URL}?id=${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, key, type }),
      });
      setEditingId(null);
      setName("");
      setKey("");
      setType("dev");
      setShowModal(false);
      fetchApiKeys();
      setActionToast({ message: "API key updated", type: "success" });
    } catch (err) {
      console.error("Failed to update API key:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this API key?")) return;
    try {
      await fetch(`${API_KEYS_URL}?id=${id}`, { method: "DELETE" });
      fetchApiKeys();
      setActionToast({ message: "API key deleted", type: "delete" });
    } catch (err) {
      console.error("Failed to delete API key:", err);
    }
  };

  const copyKey = (keyValue) => {
    navigator.clipboard.writeText(keyValue);
    setShowCopyToast(true);
  };

  useEffect(() => {
    if (!showCopyToast) return;
    const t = setTimeout(() => setShowCopyToast(false), 4000);
    return () => clearTimeout(t);
  }, [showCopyToast]);

  useEffect(() => {
    if (!actionToast) return;
    const t = setTimeout(() => setActionToast(null), 4000);
    return () => clearTimeout(t);
  }, [actionToast]);

  const toggleReveal = (id) => {
    setRevealedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setKey(item.key);
    setType(item.type || "dev");
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setName("");
    setKey("");
    setType("dev");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

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
              <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Dashboard</h1>
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
          <div className="mx-auto max-w-4xl space-y-6">
        {/* CURRENT PLAN Card */}
        <section className="relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div
            className="absolute inset-0 opacity-30 dark:opacity-20"
            style={{
              backgroundImage: "linear-gradient(135deg, #93c5fd 0%, #86efac 50%, #fef3c7 100%)",
              filter: "blur(60px)",
            }}
          />
          <div className="relative p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 mb-3">
                  CURRENT PLAN
                </span>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Researcher</h2>
              </div>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 dark:bg-zinc-700 text-white text-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-600"
              >
                <IconDoc className="w-4 h-4" />
                Manage Plan
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">API Usage</h3>
                <button type="button" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
                  <IconInfo className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Monthly plan</p>
              <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden mb-2">
                <div
                  className="h-full rounded-full bg-zinc-400 dark:bg-zinc-500 transition-all"
                  style={{ width: `${Math.min((usage / creditsLimit) * 100, 100)}%` }}
                />
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 text-right">
                {usage}/{creditsLimit.toLocaleString()} Credits
              </p>
              <div className="flex items-center gap-2 mt-4">
                <button
                  type="button"
                  role="switch"
                  aria-checked={payAsYouGo}
                  onClick={() => setPayAsYouGo(!payAsYouGo)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                    payAsYouGo
                      ? "bg-zinc-800 dark:bg-zinc-600"
                      : "bg-zinc-200 dark:bg-zinc-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                      payAsYouGo ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Pay as you go</span>
                <button type="button" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
                  <IconInfo className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* API Keys Card */}
        <section className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">API Keys</h2>
            <button
              type="button"
              onClick={openAddModal}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <IconPlus className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-zinc-500">Loading…</div>
          ) : apiKeys.length === 0 ? (
            <div className="p-12 text-center text-zinc-500">No API keys yet. Click + to add one.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Usage
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Key
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Options
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                        {item.type || "dev"}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                        {item.usage ?? 0}
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
                          {revealedKeys.has(item.id) ? item.key : maskKey(item.key)}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleReveal(item.id)}
                            className="p-1.5 rounded text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100"
                            title="View"
                          >
                            <IconEye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => copyKey(item.key)}
                            className="p-1.5 rounded text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100"
                            title="Copy"
                          >
                            <IconCopy className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className="p-1.5 rounded text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100"
                            title="Edit"
                          >
                            <IconPencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-red-600 dark:hover:text-red-400"
                            title="Delete"
                          >
                            <IconTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              {editingId ? "Edit API Key" : "Add API Key"}
            </h3>
            <form
              onSubmit={editingId ? handleUpdate : handleCreate}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. default"
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Key
                </label>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  required
                  placeholder="e.g. tvly-dev-..."
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                >
                  <option value="dev">dev</option>
                  <option value="prod">prod</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-zinc-800 dark:bg-zinc-700 text-white font-medium hover:bg-zinc-700 dark:hover:bg-zinc-600"
                >
                  {editingId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Action toast (create / update / delete) */}
      {actionToast && (
        <div
          role="alert"
          className={`fixed top-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-xl px-5 py-4 shadow-lg ${
            actionToast.type === "delete"
              ? "bg-red-600 text-white"
              : "bg-[#388E3C] text-zinc-900"
          }`}
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ${
              actionToast.type === "delete" ? "bg-red-800/80" : "bg-emerald-800/80"
            }`}
          >
            <IconCheck className="h-5 w-5" />
          </span>
          <span className="font-medium">{actionToast.message}</span>
          <button
            type="button"
            onClick={() => setActionToast(null)}
            className={`ml-2 rounded p-1 hover:opacity-80 ${
              actionToast.type === "delete" ? "text-white" : "text-zinc-800 hover:bg-emerald-800/30"
            }`}
            aria-label="Dismiss"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Copy success toast */}
      {showCopyToast && (
        <div
          role="alert"
          className="fixed top-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-xl bg-[#388E3C] px-5 py-4 text-zinc-900 shadow-lg"
          style={{ marginTop: actionToast ? "4.5rem" : 0 }}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-800/80 text-white">
            <IconCheck className="h-5 w-5" />
          </span>
          <span className="font-medium">Copied API Key to clipboard</span>
          <button
            type="button"
            onClick={() => setShowCopyToast(false)}
            className="ml-2 rounded p-1 text-zinc-800 hover:bg-emerald-800/30"
            aria-label="Dismiss"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Floating action button */}
      <button
        type="button"
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-500 z-40"
      >
        <IconChat className="w-6 h-6" />
      </button>
    </div>
  );
}
