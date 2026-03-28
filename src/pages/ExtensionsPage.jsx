import { useState, useCallback, useEffect } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout.jsx";
import { ExtensionForm } from "../components/extensions/ExtensionForm.jsx";
import { ExtensionTable } from "../components/extensions/ExtensionTable.jsx";
import { RagContextPanel } from "../components/extensions/RagContextPanel.jsx";
import api from "../api/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";

function StatCard({ label, value, loading }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-white/80 dark:bg-slate-800/40 backdrop-blur-md shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] ring-1 ring-inset ring-slate-900/5 dark:ring-white/5 px-4 sm:px-6 py-4 sm:py-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/40 dark:hover:shadow-black/50">
      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</span>
      {loading ? (
        <div className="h-8 w-12 animate-pulse rounded-md bg-slate-100 dark:bg-slate-700 mt-1" />
      ) : (
        <span
          className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight mt-0.5 drop-shadow-sm"
        >
          {value}
        </span>
      )}
    </div>
  );
}

export function ExtensionsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("extensions");
  const [extensions, setExtensions] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [registeringId, setRegisteringId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExtensions = async () => {
      try {
        setFetching(true);
        const { data } = await api.get("/v1/sip");
        setExtensions(data.data ?? []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load extensions.");
        setExtensions([]);
      } finally {
        setFetching(false);
      }
    };
    fetchExtensions();
  }, []);

  const handleAddExtension = useCallback(async (values, resetForm) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post("/v1/sip", values);
      setExtensions((prev) => [data.data, ...prev]);
      resetForm();
      setIsAdding(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create extension.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      setDeletingId(id);
      setError(null);
      await api.delete(`/v1/sip/${id}`);
      setExtensions((prev) => prev.filter((ext) => ext._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete extension.");
    } finally {
      setDeletingId(null);
    }
  }, []);

  const handleRegister = useCallback(async (extension) => {
    try {
      const ext = extensions.find(e => e.extension === extension);
      if (!ext) return;
      
      setRegisteringId(ext._id);
      setError(null);
      await api.post("/v1/sip/register", { extension });
      
      // Update the extension in state
      setExtensions((prev) =>
        prev.map((e) =>
          e.extension === extension
            ? { ...e, isRegistered: true, registeredAt: new Date().toISOString() }
            : e
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register extension.");
    } finally {
      setRegisteringId(null);
    }
  }, [extensions]);

  const handleUnregister = useCallback(async (extension) => {
    try {
      const ext = extensions.find(e => e.extension === extension);
      if (!ext) return;
      
      setRegisteringId(ext._id);
      setError(null);
      await api.post("/v1/sip/unregister", { extension });
      
      // Update the extension in state
      setExtensions((prev) =>
        prev.map((e) =>
          e.extension === extension
            ? { ...e, isRegistered: false, registeredAt: null }
            : e
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to unregister extension.");
    } finally {
      setRegisteringId(null);
    }
  }, [extensions]);

  const uniqueDomains = new Set(extensions.map((e) => e.domain)).size;

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="flex flex-col gap-6">
        {/* ── TOPBAR ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left: title + subtitle */}
          <div>
            <h1
              className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight drop-shadow-sm"
            >
              Extensions
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
              {fetching
                ? "Loading your extensions…"
                : `${extensions.length} extension${extensions.length !== 1 ? "s" : ""} across ${uniqueDomains} domain${uniqueDomains !== 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Right: user + actions */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* User */}
            <div className="hidden sm:flex items-center gap-2.5 rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/80 dark:bg-slate-800/50 backdrop-blur-md px-3 py-1.5 shadow-sm">
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-[0_0_10px_rgba(52,211,153,0.4)]"
                style={{ background: "linear-gradient(135deg, #34d399, #0f766e)" }}
              >
                {user?.fullName?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[140px] truncate">
                {user?.email}
              </span>
            </div>

            {/* Sign out */}
            <button
              type="button"
              onClick={logout}
              className="hidden sm:block rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/80 dark:bg-slate-800/50 backdrop-blur-md px-3 py-2.5 text-xs font-bold text-slate-500 dark:text-slate-400 shadow-sm transition-all hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              Sign out
            </button>

            {/* Add */}
            {!isAdding && (
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 dark:shadow-emerald-900/40 transition-all hover:shadow-lg hover:opacity-95 active:scale-[0.98]"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M5 1V9M1 5H9"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
                Add extension
              </button>
            )}
            
            {/* Mobile Sign out */}
            <button
              type="button"
              onClick={logout}
              className="sm:hidden flex items-center justify-center rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/80 dark:bg-slate-800/50 backdrop-blur-md px-3 py-2.5 text-xs font-bold text-slate-500 dark:text-slate-400 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* ── STATS ───────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <StatCard
            label="Total extensions"
            value={extensions.length}
            loading={fetching}
          />
          <StatCard
            label="Unique domains"
            value={uniqueDomains}
            loading={fetching}
          />
          <StatCard
            label="Last registered"
            value={
              extensions.length > 0 ? (extensions[0]?.extension ?? "—") : "—"
            }
            loading={fetching}
          />
        </div>

        {/* ── ERROR ───────────────────────────────────────────────────────── */}
        {error && (
          <div className="flex items-center justify-between rounded-xl border border-red-100 dark:border-red-900/50 bg-red-50/50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400 shadow-sm">
            <div className="flex items-center gap-2 font-medium">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="shrink-0"
              >
                <circle
                  cx="7"
                  cy="7"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
                <path
                  d="M7 4.5V7M7 9.5V9.4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              {error}
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-300 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M1 1L11 11M11 1L1 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        )}

        {/* ── FORM ────────────────────────────────────────────────────────── */}
        {isAdding && (
          <div className="w-full overflow-x-hidden">
            <ExtensionForm
              onSubmit={handleAddExtension}
              onCancel={() => setIsAdding(false)}
              loading={loading}
            />
          </div>
        )}

        {/* ── TABLE ───────────────────────────────────────────────────────── */}
        <div className="w-full">
        {fetching ? (
          <div className="flex items-center justify-center rounded-2xl border border-slate-100/60 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none ring-1 ring-inset ring-slate-900/5 dark:ring-white/5">
            <div className="flex flex-col items-center gap-3">
              <svg
                className="animate-spin text-emerald-500"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeOpacity="0.2"
                  strokeWidth="3"
                />
                <path
                  d="M12 2a10 10 0 0 1 10 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wide uppercase">Loading extensions…</p>
            </div>
          </div>
        ) : (
          <ExtensionTable
            extensions={extensions}
            onDelete={handleDelete}
            deletingId={deletingId}
            onRegister={handleRegister}
            onUnregister={handleUnregister}
            registeringId={registeringId}
          />
        )}
        </div>

        {/* ── RAG CONTEXT ─────────────────────────────────────────────────── */}
        <div className="w-full">
          <RagContextPanel />
        </div>
      </div>
    </DashboardLayout>
  );
}
