import { useState, useCallback, useEffect } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout.jsx";
import { ExtensionForm } from "../components/extensions/ExtensionForm.jsx";
import { ExtensionTable } from "../components/extensions/ExtensionTable.jsx";
import api from "../api/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";

function StatCard({ label, value, loading }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-stone-200 bg-white px-5 py-4">
      <span className="text-xs font-medium text-stone-400">{label}</span>
      {loading ? (
        <div className="h-7 w-10 animate-pulse rounded bg-stone-100 mt-0.5" />
      ) : (
        <span
          className="text-2xl font-semibold text-stone-900 tabular-nums"
          style={{ letterSpacing: "-0.03em" }}
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
        <div className="flex items-center justify-between">
          {/* Left: title + subtitle */}
          <div>
            <h1
              className="text-[22px] font-semibold text-stone-900 leading-tight"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: "-0.025em",
              }}
            >
              Extensions
            </h1>
            <p className="mt-0.5 text-sm text-stone-400">
              {fetching
                ? "Loading your extensions…"
                : `${extensions.length} extension${extensions.length !== 1 ? "s" : ""} across ${uniqueDomains} domain${uniqueDomains !== 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Right: user + actions */}
          <div className="flex items-center gap-2.5">
            {/* User */}
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 shadow-sm">
              <div
                className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                }}
              >
                {user?.fullName?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="text-xs font-medium text-stone-600 max-w-[120px] truncate">
                {user?.email}
              </span>
            </div>

            {/* Sign out */}
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-500 shadow-sm transition hover:border-stone-300 hover:text-stone-700"
            >
              Sign out
            </button>

            {/* Add */}
            {!isAdding && (
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                style={{
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                }}
                className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-[0.98]"
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
          </div>
        </div>

        {/* ── STATS ───────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
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
          <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <div className="flex items-center gap-2">
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
              className="ml-4 text-red-400 hover:text-red-600 transition-colors"
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
          <ExtensionForm
            onSubmit={handleAddExtension}
            onCancel={() => setIsAdding(false)}
            loading={loading}
          />
        )}

        {/* ── TABLE ───────────────────────────────────────────────────────── */}
        {fetching ? (
          <div className="flex items-center justify-center rounded-xl border border-stone-200 bg-white py-20">
            <div className="flex flex-col items-center gap-3">
              <svg
                className="animate-spin"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="8"
                  stroke="#e7e5e4"
                  strokeWidth="2"
                />
                <path
                  d="M10 2A8 8 0 0 1 18 10"
                  stroke="#16a34a"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-xs text-stone-400">Loading extensions…</p>
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
    </DashboardLayout>
  );
}
