import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout.jsx";
import api from "../api/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";

export function DynamicDataPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dynamic-data");
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [syncingId, setSyncingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  
  const [uploadType, setUploadType] = useState("google_sheet"); // "google_sheet" or "file"
  const [nameInput, setNameInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [fileInput, setFileInput] = useState(null);

  const fetchSheets = useCallback(async () => {
    try {
      setFetching(true);
      const { data } = await api.get(`/v1/dynamic-data`);
      setSheets(data.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dynamic data sources.");
      setSheets([]);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchSheets();
  }, [fetchSheets]);

  const handleAddSheet = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    if (uploadType === "google_sheet" && !urlInput.trim()) return;
    if (uploadType === "file" && !fileInput) return;
    
    try {
      setLoading(true);
      setError(null);

      if (uploadType === "file") {
        const formData = new FormData();
        formData.append("name", nameInput);
        formData.append("file", fileInput);
        await api.upload("/v1/dynamic-data", formData);
      } else {
        await api.post("/v1/dynamic-data", {
          name: nameInput,
          googleSheetUrl: urlInput
        });
      }

      setNameInput("");
      setUrlInput("");
      setFileInput(null);
      await fetchSheets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to link data source.");
    } finally {
      setLoading(false);
    }
  };

  const handleResync = async (id) => {
    try {
      setSyncingId(id);
      setError(null);
      await api.post(`/v1/dynamic-data/${id}/sync`);
      await fetchSheets(); // fetch to get updated timestamps
    } catch (err) {
      setError(err.response?.data?.message || "Failed to re-sync sheet. Ensure the link is still public.");
    } finally {
      setSyncingId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      setError(null);
      await api.delete(`/v1/dynamic-data/${id}`);
      setSheets(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete dynamic data source.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="flex flex-col gap-6 w-full overflow-x-hidden">
        {/* ── TOPBAR ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight drop-shadow-sm">
              Dynamic Tabular Data
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
              Link Public Google Sheets here. The AI sales agent will use this live data for pricing, inventory, or specs.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
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

        {/* ── ERROR ───────────────────────────────────────────────────────── */}
        {error && (
          <div className="flex items-center justify-between rounded-xl border border-red-100 dark:border-red-900/50 bg-red-50/50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400 shadow-sm w-full mx-auto max-w-full overflow-hidden">
            <div className="flex items-center gap-2 font-medium w-full">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 flex-none">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3" />
                <path d="M7 4.5V7M7 9.5V9.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="truncate w-full pr-4">{error}</span>
            </div>
            <button onClick={() => setError(null)} className="ml-2 text-red-400 hover:text-red-600 shrink-0">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>
        )}

        {/* ── ADD NEW SHEET FORM ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 w-full max-w-4xl rounded-2xl border border-slate-200/60 dark:border-white/5 bg-white/80 dark:bg-slate-800/40 backdrop-blur-md p-5 shadow-sm">
          {/* Toggle Type */}
          <div className="flex bg-slate-100/80 dark:bg-slate-900/50 p-1 rounded-xl w-max self-start border border-slate-200/50 dark:border-slate-700/50">
            <button
              type="button"
              onClick={() => setUploadType("google_sheet")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                uploadType === "google_sheet" 
                  ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              Public Google Sheet
            </button>
            <button
              type="button"
              onClick={() => setUploadType("file")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                uploadType === "file" 
                  ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              Upload Excel / CSV
            </button>
          </div>

          <form onSubmit={handleAddSheet} className="flex flex-col sm:flex-row gap-3 w-full">
            <input
              type="text"
              placeholder="Source Name (e.g. Mobile Phones)"
              className="flex-1 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-colors"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              disabled={loading}
              required
            />
            {uploadType === "google_sheet" ? (
              <input
                type="url"
                placeholder="Public Google Sheets Link"
                className="flex-[2] rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-colors"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                disabled={loading}
                required
              />
            ) : (
              <input
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                className="flex-[2] rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 px-2.5 py-2 text-sm text-slate-700 dark:text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-600 dark:file:bg-emerald-500/10 dark:file:text-emerald-400 hover:file:bg-emerald-100 dark:hover:file:bg-emerald-500/20 file:transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-colors"
                onChange={e => setFileInput(e.target.files[0])}
                disabled={loading}
                required
              />
            )}
            
            <button
              type="submit"
              disabled={loading || (uploadType === "file" && !fileInput)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:shadow-lg hover:opacity-95 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              ) : (
                uploadType === "google_sheet" ? "Link Sheet" : "Upload File"
              )}
            </button>
          </form>
        </div>

        {/* ── CONNECTED SHEETS ────────────────────────────────────────────── */}
        <div className="w-full">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 px-1">
            Connected Data Sources
          </h2>
          
          {fetching ? (
            <div className="flex items-center justify-center rounded-2xl border border-slate-100/60 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-20">
              <div className="flex flex-col items-center gap-3">
                <svg className="animate-spin text-emerald-500" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          ) : sheets.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/60 dark:border-white/5 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md px-6 py-20 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-4 shadow-inner ring-1 ring-slate-200 dark:ring-white/10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400 dark:text-slate-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                No Datasources Linked
              </h3>
              <p className="max-w-[20rem] text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                Paste a public Google Sheet URL above to give your AI agent access to live dynamic tabular data.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sheets.map((sheet) => (
                <div key={sheet._id} className="relative flex flex-col gap-3 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-white/80 dark:bg-slate-800/40 backdrop-blur-md p-5 shadow-sm transition-all hover:shadow-md hover:border-emerald-500/30">
                  
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <h3 className="font-bold text-slate-900 dark:text-white drop-shadow-sm truncate pr-2" title={sheet.name}>
                        {sheet.name}
                      </h3>
                      {sheet.sourceType === "file" ? (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 flex items-center gap-1">
                          <svg className="flex-shrink-0" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16h16V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                          <span className="truncate">Uploaded: {sheet.fileName || 'Static File'}</span>
                        </span>
                      ) : (
                        <a href={sheet.googleSheetUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 truncate mt-0.5 flex items-center gap-1 group">
                          Open Sheet
                          <svg className="opacity-0 group-hover:opacity-100 transition-opacity" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-2.5 mt-auto">
                    <svg className="mr-1.5 flex-shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                    Synced {new Date(sheet.lastSyncedAt).toLocaleDateString()} at {new Date(sheet.lastSyncedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    {sheet.sourceType !== "file" && (
                      <button
                        onClick={() => handleResync(sheet._id)}
                        disabled={syncingId === sheet._id}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 disabled:opacity-50"
                      >
                        {syncingId === sheet._id ? (
                           <div className="h-3 w-3 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                        ) : (
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                        )}
                        Sync Now
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(sheet._id)}
                      disabled={deletingId === sheet._id}
                      className="flex-1 inline-flex items-center justify-center rounded-xl bg-red-50/50 dark:bg-red-500/10 h-8 w-max text-red-500 transition-colors hover:bg-red-100 dark:hover:bg-red-500/20 disabled:opacity-50"
                      title="Remove source"
                    >
                      {deletingId === sheet._id ? (
                         <div className="h-3 w-3 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                      ) : (
                        <>
                          <svg className="mr-1.5" width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M1 3.5H13M4.5 3.5V2C4.5 1.72386 4.72386 1.5 5 1.5H9C9.27614 1.5 9.5 1.72386 9.5 2V3.5M6 6V10M8 6V10M2.5 3.5H11.5V11.5C11.5 12.0523 11.0523 12.5 10.5 12.5H3.5C2.94772 12.5 2.5 12.0523 2.5 11.5V3.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          <span className="text-xs font-semibold">Delete</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
