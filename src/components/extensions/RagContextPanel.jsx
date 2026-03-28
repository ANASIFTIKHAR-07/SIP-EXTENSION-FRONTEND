import { useState, useEffect, useRef } from "react";
import api from "../../api/api.js";

function FileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 13 13" fill="none">
      <path d="M3 1h5l3 3v8H3V1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M8 1v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  );
}

export function RagContextPanel() {
  const [files, setFiles]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError]       = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [savingId, setSavingId] = useState(null);
  const fileRef = useRef();

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/v1/rag");
      setFiles(data.data ?? []);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to load context files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFiles(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      setUploading(true);
      setError(null);
      await api.upload("/v1/rag", fd);
      await fetchFiles();
    } catch (e) {
      setError(e.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      fileRef.current.value = "";
    }
  };

  const handleActivate = async (id) => {
    try {
      setError(null);
      await api.patch(`/v1/rag/${id}/activate`, {});
      setFiles(prev => prev.map(f => ({ ...f, isActive: f._id === id })));
    } catch (e) {
      setError(e.response?.data?.message || "Failed to activate");
    }
  };

  const handleDelete = async (id) => {
    try {
      setError(null);
      await api.delete(`/v1/rag/${id}`);
      setFiles(prev => prev.filter(f => f._id !== id));
    } catch (e) {
      setError(e.response?.data?.message || "Failed to delete");
    }
  };

  const startEdit = async (file) => {
    try {
      const { data } = await api.get(`/v1/rag/${file._id}`);
      setEditText(data.data?.extractedText ?? "");
      setEditingId(file._id);
    } catch {
      setEditingId(file._id);
      setEditText("");
    }
  };

  const handleSaveEdit = async () => {
    try {
      setSavingId(editingId);
      setError(null);
      await api.patch(`/v1/rag/${editingId}`, { extractedText: editText });
      setEditingId(null);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to save");
    } finally {
      setSavingId(null);
    }
  };

  const activeFile = files.find(f => f.isActive);

  return (
    <div className="rounded-2xl border border-slate-100/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-900/5">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100/60">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M12.666 4.667v8A1.333 1.333 0 0 1 11.333 14h-8A1.333 1.333 0 0 1 2 12.667v-8A1.333 1.333 0 0 1 3.333 3.333h2.667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.666 4.333a1.667 1.667 0 1 0-3.333 0m4 4-2.666 2.667L6 9.667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 tracking-tight">AI Knowledge Base</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {activeFile ? <span className="text-slate-600">Active context: <strong>{activeFile.fileName}</strong></span> : "No active context — AI uses default behavior"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-xl border-0 ring-1 ring-inset ring-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
        >
          {uploading ? (
            <svg className="animate-spin" width="12" height="12" viewBox="0 0 11 11" fill="none">
              <circle cx="5.5" cy="5.5" r="4" stroke="#e2e8f0" strokeWidth="1.5"/>
              <path d="M5.5 1.5A4 4 0 0 1 9.5 5.5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 11 11" fill="none">
              <path d="M5.5 1v7M2 4.5l3.5-3.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 9.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          )}
          {uploading ? "Uploading…" : "Upload Doc"}
        </button>
        <input ref={fileRef} type="file" accept=".pdf,.txt" className="hidden" onChange={handleUpload} />
      </div>

      {/* Error */}
      {error && (
        <div className="mx-6 mt-4 flex items-center justify-between rounded-xl border border-red-100 bg-red-50/50 px-4 py-3 text-xs text-red-600 shadow-sm">
          <div className="flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 text-red-500">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M6 3.5V6.5M6 8.5V8.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            {error}
          </div>
          <button onClick={() => setError(null)} className="ml-3 text-red-400 hover:text-red-600 transition-colors">✕</button>
        </div>
      )}

      {/* Edit modal */}
      {editingId && (
        <div className="mx-6 mt-4 rounded-2xl border border-slate-200/60 bg-slate-50 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">Edit Extracted Text</p>
          <textarea
            value={editText}
            onChange={e => setEditText(e.target.value)}
            rows={8}
            className="w-full rounded-xl border-0 ring-1 ring-inset ring-slate-200 bg-white px-4 py-3 text-xs leading-relaxed text-slate-800 font-mono resize-y shadow-sm outline-none transition-all placeholder:text-slate-300 focus:ring-2 focus:ring-inset focus:ring-emerald-500"
          />
          <div className="flex gap-2 mt-3 justify-end border-t border-slate-200/60 pt-3">
            <button onClick={() => setEditingId(null)} className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 transition-colors">Cancel</button>
            <button
              onClick={handleSaveEdit}
              disabled={!!savingId}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:opacity-90 disabled:opacity-50"
            >
              {savingId ? (
                <>
                  <svg className="animate-spin" width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" stroke="white" strokeWidth="1.5" strokeDasharray="12 4"/></svg>
                  Saving…
                </>
              ) : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* File list */}
      <div className="px-6 py-4">
        {loading ? (
          <div className="flex items-center gap-2.5 py-6 text-xs font-medium text-slate-500 justify-center">
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="#e2e8f0" strokeWidth="1.5"/>
              <path d="M8 2A6 6 0 0 1 14 8" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Loading knowledge base…
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-300">
              <FileIcon />
            </div>
            <p className="text-sm font-semibold text-slate-700">No context documents</p>
            <p className="mt-1 text-xs text-slate-500">Upload a PDF or TXT file to give AI context about your business.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {files.map(file => (
              <div
                key={file._id}
                className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-colors ${
                  file.isActive ? "border border-emerald-200 bg-emerald-50/50 shadow-sm" : "border-0 ring-1 ring-inset ring-slate-100/80 bg-white hover:bg-slate-50"
                }`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${file.isActive ? "bg-emerald-100 text-emerald-600" : "bg-slate-100/80 text-slate-400"}`}>
                  <FileIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{file.fileName}</p>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                    Uploaded on {new Date(file.createdAt).toLocaleDateString()}
                    {file.isActive && <span className="ml-2 inline-flex items-center gap-1 font-bold text-emerald-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"/> Active</span>}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {!file.isActive && (
                    <button
                      onClick={() => handleActivate(file._id)}
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 transition-colors"
                    >
                      Activate
                    </button>
                  )}
                  <button
                    onClick={() => startEdit(file)}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(file._id)}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
