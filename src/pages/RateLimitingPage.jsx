import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import api from "../api/api.js";

const DEFAULT_CONFIG = { maxTokensPerCall: 1000, maxTokensPerMinute: 5000, maxTokensPerHour: 50000, warningThreshold: 80 };

function NumberInput({ label, value, onChange, min = 0, max }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-stone-500">{label}</span>
      <input type="number" value={value} onChange={(e) => onChange(parseInt(e.target.value) || 0)} min={min} max={max} className="rounded-md border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/15 hover:border-stone-300 shadow-sm" />
    </label>
  );
}

function ExtensionRateCard({ ext, onSave, onReset, saving }) {
  const [config, setConfig] = useState(ext.config || DEFAULT_CONFIG);
  const [dirty, setDirty] = useState(false);

  const set = (k, v) => { setConfig((p) => ({ ...p, [k]: v })); setDirty(true); };

  const handleSave = () => onSave(ext.extensionId, config, () => setDirty(false));
  const handleReset = () => { setConfig(DEFAULT_CONFIG); setDirty(true); };

  return (
    <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b border-stone-100 px-5 py-3.5">
        <span className="inline-flex items-center rounded border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-bold text-green-700 font-mono">{ext.extension}</span>
        {ext.displayName && <span className="text-sm font-medium text-stone-700">{ext.displayName}</span>}
        {!ext.config && <span className="ml-auto text-[10px] text-stone-400 italic">Using defaults</span>}
        {dirty && <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-amber-600"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Unsaved changes</span>}
      </div>
      <div className="p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NumberInput label="Max Tokens / Call" value={config.maxTokensPerCall} onChange={(v) => set("maxTokensPerCall", v)} />
          <NumberInput label="Max Tokens / Minute" value={config.maxTokensPerMinute} onChange={(v) => set("maxTokensPerMinute", v)} />
          <NumberInput label="Max Tokens / Hour" value={config.maxTokensPerHour} onChange={(v) => set("maxTokensPerHour", v)} />
          <NumberInput label="Warning Threshold (%)" value={config.warningThreshold} onChange={(v) => set("warningThreshold", v)} min={0} max={100} />
        </div>
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-stone-100">
          <button type="button" onClick={handleReset} className="rounded-md border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition shadow-sm">Reset</button>
          <button type="button" onClick={handleSave} disabled={saving} style={{ background: saving ? undefined : "linear-gradient(135deg, #16a34a, #15803d)" }} className="rounded-md px-4 py-1.5 text-xs font-bold text-white shadow-sm transition disabled:opacity-50 disabled:bg-green-300 hover:opacity-90">
            {saving ? (
              <span className="flex items-center gap-1.5">
                <svg className="animate-spin" width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke="white" strokeWidth="1.5" strokeDasharray="14 6"/></svg>
                Saving…
              </span>
            ) : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function RateLimitingPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("rate-limiting");
  const [extensions, setExtensions] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setFetching(true);
        const { data } = await api.get("/v1/rate-limits");
        setExtensions(data.data ?? []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load rate limits.");
      } finally {
        setFetching(false);
      }
    };
    load();
  }, []);

  const handleSave = useCallback(async (extensionId, config, onDone) => {
    try {
      setSavingId(extensionId);
      setError(null);
      const { data } = await api.post(`/v1/rate-limits/${extensionId}`, config);
      setExtensions((prev) =>
        prev.map((e) =>
          e.extensionId === extensionId
            ? { ...e, config: { _id: data.data._id, maxTokensPerCall: data.data.maxTokensPerCall, maxTokensPerMinute: data.data.maxTokensPerMinute, maxTokensPerHour: data.data.maxTokensPerHour, warningThreshold: data.data.warningThreshold } }
            : e
        )
      );
      setSuccess("Rate limit saved.");
      setTimeout(() => setSuccess(null), 2500);
      onDone?.();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save rate limit.");
    } finally {
      setSavingId(null);
    }
  }, []);

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-semibold text-stone-900 leading-tight" style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.025em" }}>Token Rate Limiting</h1>
            <p className="mt-0.5 text-sm text-stone-400">Set per-extension AI token limits for voice calls</p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 shadow-sm">
              <div className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}>{user?.fullName?.[0]?.toUpperCase() || "U"}</div>
              <span className="text-xs font-medium text-stone-600 max-w-[120px] truncate">{user?.email}</span>
            </div>
            <button type="button" onClick={logout} className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-500 shadow-sm transition hover:border-stone-300 hover:text-stone-700">Sign out</button>
          </div>
        </div>

        {error && (
          <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-4 text-red-400 hover:text-red-600">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M4 7L6 9L10 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {success}
          </div>
        )}

        {fetching ? (
          <div className="flex items-center justify-center rounded-xl border border-stone-200 bg-white py-20">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin" width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#e7e5e4" strokeWidth="2"/><path d="M10 2A8 8 0 0 1 18 10" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/></svg>
              <p className="text-xs text-stone-400">Loading extensions…</p>
            </div>
          </div>
        ) : extensions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-200 bg-white py-16 text-center">
            <p className="text-sm font-semibold text-stone-600">No extensions found</p>
            <p className="mt-1 text-xs text-stone-400">Add SIP extensions first to configure their token limits.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {extensions.map((ext) => (
              <ExtensionRateCard key={ext.extensionId} ext={ext} onSave={handleSave} saving={savingId === ext.extensionId} />
            ))}
          </div>
        )}

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-blue-600 mt-0.5"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M8 6V10M8 4V3.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <div>
              <p className="text-xs font-semibold text-blue-900 mb-1">How Token Limits Work</p>
              <p className="text-[11px] text-blue-700 leading-relaxed">Each extension can have its own token budget. Per Call limits the tokens consumed in a single voice call. Per Minute and Per Hour are aggregate limits across all concurrent calls on that extension. Warning threshold triggers alerts when usage approaches the limit.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
