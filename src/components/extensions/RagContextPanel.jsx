import { useState, useEffect, useRef } from "react";
import api from "../../api/api.js";

function FileIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
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
    <div className="rounded-xl border border-stone-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
        <div>
          <p className="text-[13px] font-semibold text-stone-800">AI Context</p>
          <p className="text-[11px] text-stone-400 mt-0.5">
            {activeFile ? `Active: ${activeFile.fileName}` : "No active context — AI uses default behaviour"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 shadow-sm transition hover:border-stone-300 hover:text-stone-800 disabled:opacity-50"
        >
          {uploading ? (
            <svg className="animate-spin" width="11" height="11" viewBox="0 0 11 11" fill="none">
              <circle cx="5.5" cy="5.5" r="4" stroke="#d6d3d1" strokeWidth="1.5"/>
              <path d="M5.5 1.5A4 4 0 0 1 9.5 5.5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M5.5 1v7M2 4.5l3.5-3.5L9 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 9.5h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          )}
          {uploading ? "Uploading…" : "Upload file"}
        </button>
        <input ref={fileRef} type="file" accept=".pdf,.txt" className="hidden" onChange={handleUpload} />
      </div>

      {/* Error */}
      {error && (
        <div className="mx-5 mt-3 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
          <button onClick={() => setError(null)} className="ml-3 text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* Edit modal */}
      {editingId && (
        <div className="mx-5 my-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
          <p className="text-[11px] font-medium text-stone-500 mb-1.5">Edit extracted text</p>
          <textarea
            value={editText}
            onChange={e => setEditText(e.target.value)}
            rows={8}
            className="w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-xs text-stone-700 font-mono resize-y focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          <div className="flex gap-2 mt-2 justify-end">
            <button onClick={() => setEditingId(null)} className="text-xs text-stone-400 hover:text-stone-600 px-2 py-1">Cancel</button>
            <button
              onClick={handleSaveEdit}
              disabled={!!savingId}
              className="rounded-md px-3 py-1 text-xs font-medium text-white disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}
            >
              {savingId ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      )}

      {/* File list */}
      <div className="px-5 py-3">
        {loading ? (
          <div className="flex items-center gap-2 py-4 text-xs text-stone-400">
            <svg className="animate-spin" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="#e7e5e4" strokeWidth="1.5"/>
              <path d="M6 1.5A4.5 4.5 0 0 1 10.5 6" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Loading…
          </div>
        ) : files.length === 0 ? (
          <p className="py-4 text-center text-xs text-stone-400">No files uploaded yet</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {files.map(file => (
              <div
                key={file._id}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 border transition ${
                  file.isActive ? "border-green-200 bg-green-50" : "border-stone-100 bg-white hover:bg-stone-50"
                }`}
              >
                <span className={file.isActive ? "text-green-600" : "text-stone-400"}>
                  <FileIcon />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-stone-700 truncate">{file.fileName}</p>
                  <p className="text-[10px] text-stone-400">
                    {new Date(file.createdAt).toLocaleDateString()}
                    {file.isActive && <span className="ml-2 text-green-600 font-medium">● Active</span>}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!file.isActive && (
                    <button
                      onClick={() => handleActivate(file._id)}
                      className="rounded px-2 py-1 text-[10px] font-medium text-stone-500 hover:bg-stone-100 transition"
                    >
                      Activate
                    </button>
                  )}
                  <button
                    onClick={() => startEdit(file)}
                    className="rounded px-2 py-1 text-[10px] font-medium text-stone-500 hover:bg-stone-100 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(file._id)}
                    className="rounded px-2 py-1 text-[10px] font-medium text-red-400 hover:bg-red-50 transition"
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
