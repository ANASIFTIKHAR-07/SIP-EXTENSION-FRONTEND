import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import api from "../api/api.js";

const DEFAULT_CONFIG = { maxTokensPerCall: 1000, maxTokensPerMinute: 5000, maxTokensPerHour: 50000, warningThreshold: 80 };

function NumberInput({ label, value, onChange, min = 0, max }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      <input 
        type="number" 
        value={value} 
        onChange={(e) => onChange(parseInt(e.target.value) || 0)} 
        min={min} 
        max={max} 
        className="rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition-all outline-none" 
      />
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
    <div className="rounded-2xl border border-slate-100/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-900/5 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/40 overflow-hidden">
      <div className="flex items-center gap-3 border-b border-slate-100/60 px-6 py-4">
        <span className="inline-flex items-center rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 font-mono tracking-tight">{ext.extension}</span>
        {ext.displayName && <span className="text-sm font-semibold text-slate-800">{ext.displayName}</span>}
        {!ext.config && <span className="ml-auto text-[11px] text-slate-400 italic">Using defaults</span>}
        {dirty && (
          <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Unsaved changes
          </span>
        )}
      </div>
      <div className="p-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <NumberInput label="Max Tokens / Call" value={config.maxTokensPerCall} onChange={(v) => set("maxTokensPerCall", v)} />
          <NumberInput label="Max Tokens / Minute" value={config.maxTokensPerMinute} onChange={(v) => set("maxTokensPerMinute", v)} />
          <NumberInput label="Max Tokens / Hour" value={config.maxTokensPerHour} onChange={(v) => set("maxTokensPerHour", v)} />
          <NumberInput label="Warning Threshold (%)" value={config.warningThreshold} onChange={(v) => set("warningThreshold", v)} min={0} max={100} />
        </div>
        <div className="flex justify-end gap-3 mt-5 pt-5 border-t border-slate-100/60">
          <button 
            type="button" 
            onClick={handleReset} 
            className="rounded-xl border-0 ring-1 ring-inset ring-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
          >
            Reset
          </button>
          <button 
            type="button" 
            onClick={handleSave} 
            disabled={saving} 
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin" width="12" height="12" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke="white" strokeWidth="1.5" strokeDasharray="14 6"/></svg>
                Saving…
              </span>
            ) : "Save Limits"}
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
      setSuccess("Rate limit saved successfully.");
      setTimeout(() => setSuccess(null), 3000);
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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Token Rate Limiting</h1>
            <p className="mt-1 text-sm text-slate-500">Set per-extension AI token limits for voice calls</p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-2.5 rounded-xl border border-slate-200/60 bg-white/80 backdrop-blur-md px-3 py-1.5 shadow-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white bg-gradient-to-br from-emerald-400 to-teal-600 shadow-sm">{user?.fullName?.[0]?.toUpperCase() || "U"}</div>
              <span className="text-xs font-semibold text-slate-700 max-w-[140px] truncate">{user?.email}</span>
            </div>
            <button type="button" onClick={logout} className="rounded-xl border border-slate-200/60 bg-white/80 backdrop-blur-md px-3 py-2.5 text-xs font-semibold text-slate-500 shadow-sm transition-all hover:border-slate-300 hover:text-slate-800 hover:bg-slate-50">Sign out</button>
          </div>
        </div>

        {error && (
          <div className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50/50 px-4 py-3 text-sm text-red-600 shadow-sm">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" className="shrink-0 text-red-500">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M6 3.5V6.5M6 8.5V8.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              {error}
            </div>
            <button onClick={() => setError(null)} className="ml-4 text-red-400 hover:text-red-600 transition-colors">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-3 text-sm text-emerald-700 shadow-sm">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-emerald-500"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M4 7L6 9L10 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {success}
          </div>
        )}

        {fetching ? (
          <div className="flex items-center justify-center rounded-2xl border border-slate-100/60 bg-white py-20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-900/5">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin" width="24" height="24" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#f1f5f9" strokeWidth="2"/><path d="M10 2A8 8 0 0 1 18 10" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/></svg>
              <p className="text-sm font-medium text-slate-500">Loading configurations…</p>
            </div>
          </div>
        ) : extensions.length === 0 ? (
           <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/60 bg-white py-20 text-center shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 mb-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-slate-400">
                <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-base font-semibold text-slate-700">No extensions found</p>
            <p className="mt-1.5 text-sm text-slate-500 max-w-sm">Add SIP extensions in the Extensions tab first to configure their AI token limits.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {extensions.map((ext) => (
              <ExtensionRateCard key={ext.extensionId} ext={ext} onSave={handleSave} saving={savingId === ext.extensionId} />
            ))}
          </div>
        )}

        <div className="mt-2 rounded-2xl border border-indigo-100/60 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 p-5 shadow-sm">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100/50">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-indigo-600"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M8 6V10M8 4V3.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </div>
            <div>
              <p className="text-[13px] font-bold text-indigo-900 mb-1.5 tracking-tight">How Token Limits Work</p>
              <p className="text-sm text-indigo-700/80 leading-relaxed max-w-3xl">Each extension maintains its own token budget. <strong>Per Call</strong> limits restrict usage during a single voice session. <strong>Per Minute</strong> and <strong>Per Hour</strong> act as rolling aggregate limits across all concurrent calls on that extension. The warning threshold provides early alerts before a call gets interrupted.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
