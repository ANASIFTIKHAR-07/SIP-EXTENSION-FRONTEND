import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import api from "../api/api.js";

const AGENT_TYPES = [
  { value: "customer_support", label: "Customer Support" },
  { value: "sales", label: "Sales" },
  { value: "receptionist", label: "Receptionist" },
  { value: "appointment_booking", label: "Appointment Booking" },
  { value: "faq", label: "FAQ" },
  { value: "custom", label: "Custom" },
];

const MODEL_OPTIONS = {
  openai: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
  anthropic: ["claude-3-5-sonnet-20241022", "claude-3-haiku-20240307"],
  google: ["gemini-1.5-pro", "gemini-1.5-flash"],
};

const PROVIDER_LABELS = { openai: "OpenAI", anthropic: "Anthropic", google: "Google" };

const EMPTY_FORM = {
  name: "", purpose: "customer_support", modelProvider: "openai",
  modelName: "gpt-4o", systemPrompt: "",
};

function AgentForm({ onSubmit, onCancel, loading, initial }) {
  const [values, setValues] = useState(initial || EMPTY_FORM);

  const set = (k, v) => setValues((p) => ({ ...p, [k]: v }));

  const handleProviderChange = (provider) => {
    set("modelProvider", provider);
    set("modelName", MODEL_OPTIONS[provider][0]);
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b border-stone-100 px-6 py-4">
        <div style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }} className="flex h-7 w-7 items-center justify-center rounded-md shadow-sm">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1.5" y="1.5" width="9" height="9" rx="1.5" stroke="white" strokeWidth="1.2"/>
            <circle cx="4" cy="5" r="0.8" fill="white"/>
            <circle cx="8" cy="5" r="0.8" fill="white"/>
            <path d="M3.5 7.5C3.5 7.5 4.5 9 6 9C7.5 9 8.5 7.5 8.5 7.5" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-stone-800">{initial ? "Edit Agent" : "New AI Agent"}</h2>
          <p className="text-[11px] text-stone-400 mt-0.5">Configure an AI agent for voice interactions</p>
        </div>
        <button type="button" onClick={onCancel} className="ml-auto rounded-md p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </div>
      <form className="p-6 flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); onSubmit(values); }}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-stone-500">Agent Name <span className="text-green-600">*</span></span>
            <input required value={values.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Support Bot" className="rounded-md border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 placeholder-stone-300 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/15 hover:border-stone-300 shadow-sm" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-stone-500">Purpose <span className="text-green-600">*</span></span>
            <select value={values.purpose} onChange={(e) => set("purpose", e.target.value)} className="rounded-md border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/15 hover:border-stone-300 shadow-sm">
              {AGENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-stone-500">Model Provider</span>
            <select value={values.modelProvider} onChange={(e) => handleProviderChange(e.target.value)} className="rounded-md border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/15 hover:border-stone-300 shadow-sm">
              {Object.entries(PROVIDER_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-stone-500">Model</span>
            <select value={values.modelName} onChange={(e) => set("modelName", e.target.value)} className="rounded-md border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/15 hover:border-stone-300 shadow-sm">
              {MODEL_OPTIONS[values.modelProvider].map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-stone-500">System Prompt</span>
          <textarea value={values.systemPrompt} onChange={(e) => set("systemPrompt", e.target.value)} rows={4} placeholder="You are a helpful voice assistant..." className="rounded-md border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 placeholder-stone-300 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/15 hover:border-stone-300 shadow-sm resize-none" />
        </label>
        <div className="flex justify-end gap-2.5 pt-2 border-t border-stone-100">
          <button type="button" onClick={onCancel} className="rounded-md border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-600 transition hover:bg-stone-50 shadow-sm">Cancel</button>
          <button type="submit" disabled={loading} style={{ background: loading ? undefined : "linear-gradient(135deg, #16a34a, #15803d)" }} className="rounded-md px-5 py-2 text-xs font-bold text-white shadow-sm transition disabled:opacity-50 disabled:bg-green-300 hover:opacity-90">
            {loading ? "Saving…" : (initial ? "Update Agent" : "Create Agent")}
          </button>
        </div>
      </form>
    </div>
  );
}

function RagFilesPanel({ agent, onAdd, onRemove, loading }) {
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!fileName || !fileUrl) return;
    onAdd(agent._id, { fileName, fileUrl }, () => { setFileName(""); setFileUrl(""); });
  };

  return (
    <div className="mt-3 rounded-lg border border-stone-100 bg-stone-50 p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">RAG Context Files</p>
      {agent.ragFiles?.length > 0 ? (
        <ul className="flex flex-col gap-1.5 mb-3">
          {agent.ragFiles.map((f) => (
            <li key={f._id} className="flex items-center justify-between rounded-md border border-stone-200 bg-white px-3 py-2">
              <div className="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 1.5H7.5L10 4V10.5H2V1.5Z" stroke="#a8a29e" strokeWidth="1.1" strokeLinejoin="round"/><path d="M7.5 1.5V4H10" stroke="#a8a29e" strokeWidth="1.1" strokeLinejoin="round"/></svg>
                <span className="text-xs text-stone-700 font-medium">{f.fileName}</span>
              </div>
              <button type="button" onClick={() => onRemove(agent._id, f._id)} className="text-stone-300 hover:text-red-500 transition-colors">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1 1L10 10M10 1L1 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-stone-400 mb-3">No RAG files attached yet.</p>
      )}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="File name" className="flex-1 rounded-md border border-stone-200 bg-white px-2.5 py-1.5 text-xs text-stone-800 placeholder-stone-300 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/15" />
        <input value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="File URL" className="flex-1 rounded-md border border-stone-200 bg-white px-2.5 py-1.5 text-xs text-stone-800 placeholder-stone-300 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/15" />
        <button type="submit" disabled={loading} style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }} className="rounded-md px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50 hover:opacity-90 transition">Add</button>
      </form>
    </div>
  );
}

function AgentCard({ agent, onDelete, onEdit, onAddRag, onRemoveRag, deletingId, ragLoading }) {
  const [expanded, setExpanded] = useState(false);
  const purposeLabel = AGENT_TYPES.find((t) => t.value === agent.purpose)?.label || agent.purpose;

  return (
    <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="12" height="12" rx="2" stroke="#16a34a" strokeWidth="1.3"/>
            <circle cx="5.5" cy="7" r="1" fill="#16a34a"/>
            <circle cx="10.5" cy="7" r="1" fill="#16a34a"/>
            <path d="M5 10C5 10 6.2 11.5 8 11.5C9.8 11.5 11 10 11 10" stroke="#16a34a" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-stone-800 truncate">{agent.name}</p>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold border ${agent.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-stone-100 text-stone-500 border-stone-200"}`}>
              {agent.isActive ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-stone-400">{purposeLabel}</span>
            <span className="text-stone-200">·</span>
            <span className="text-[11px] text-stone-400">{PROVIDER_LABELS[agent.modelProvider]} / {agent.modelName}</span>
            <span className="text-stone-200">·</span>
            <span className="text-[11px] text-stone-400">{agent.ragFiles?.length || 0} RAG file{agent.ragFiles?.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button type="button" onClick={() => setExpanded((p) => !p)} className="rounded-md border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-500 hover:bg-stone-50 hover:text-stone-700 transition">
            {expanded ? "Collapse" : "Expand"}
          </button>
          <button type="button" onClick={() => onEdit(agent)} className="rounded-md border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-500 hover:bg-stone-50 hover:text-stone-700 transition">Edit</button>
          <button type="button" onClick={() => onDelete(agent._id)} disabled={deletingId === agent._id} className="rounded-md border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition disabled:opacity-40">
            {deletingId === agent._id ? "…" : "Delete"}
          </button>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-stone-100 px-5 pb-4">
          {agent.systemPrompt && (
            <div className="mt-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5">System Prompt</p>
              <p className="text-xs text-stone-600 bg-stone-50 rounded-md p-3 border border-stone-100 whitespace-pre-wrap">{agent.systemPrompt}</p>
            </div>
          )}
          <RagFilesPanel agent={agent} onAdd={onAddRag} onRemove={onRemoveRag} loading={ragLoading} />
        </div>
      )}
    </div>
  );
}

export function AIAgentsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("ai-agents");
  const [agents, setAgents] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [ragLoading, setRagLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        setFetching(true);
        const { data } = await api.get("/v1/ai-agents");
        setAgents(data.data ?? []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load agents.");
      } finally {
        setFetching(false);
      }
    };
    fetch_();
  }, []);

  const handleCreate = useCallback(async (values) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post("/v1/ai-agents", values);
      setAgents((p) => [data.data, ...p]);
      setIsAdding(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create agent.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdate = useCallback(async (values) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.patch(`/v1/ai-agents/${editingAgent._id}`, values);
      setAgents((p) => p.map((a) => (a._id === editingAgent._id ? data.data : a)));
      setEditingAgent(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update agent.");
    } finally {
      setLoading(false);
    }
  }, [editingAgent]);

  const handleDelete = useCallback(async (id) => {
    try {
      setDeletingId(id);
      await api.delete(`/v1/ai-agents/${id}`);
      setAgents((p) => p.filter((a) => a._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete agent.");
    } finally {
      setDeletingId(null);
    }
  }, []);

  const handleAddRag = useCallback(async (agentId, { fileName, fileUrl }, reset) => {
    try {
      setRagLoading(true);
      const { data } = await api.post(`/v1/ai-agents/${agentId}/rag-files`, { fileName, fileUrl });
      setAgents((p) => p.map((a) => (a._id === agentId ? data.data : a)));
      reset?.();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add RAG file.");
    } finally {
      setRagLoading(false);
    }
  }, []);

  const handleRemoveRag = useCallback(async (agentId, fileId) => {
    try {
      setRagLoading(true);
      const { data } = await api.delete(`/v1/ai-agents/${agentId}/rag-files/${fileId}`);
      setAgents((p) => p.map((a) => (a._id === agentId ? data.data : a)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove RAG file.");
    } finally {
      setRagLoading(false);
    }
  }, []);

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-semibold text-stone-900 leading-tight" style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.025em" }}>AI Agents</h1>
            <p className="mt-0.5 text-sm text-stone-400">{fetching ? "Loading agents…" : `${agents.length} agent${agents.length !== 1 ? "s" : ""} configured`}</p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 shadow-sm">
              <div className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}>{user?.fullName?.[0]?.toUpperCase() || "U"}</div>
              <span className="text-xs font-medium text-stone-600 max-w-[120px] truncate">{user?.email}</span>
            </div>
            <button type="button" onClick={logout} className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-500 shadow-sm transition hover:border-stone-300 hover:text-stone-700">Sign out</button>
            {!isAdding && !editingAgent && (
              <button type="button" onClick={() => setIsAdding(true)} style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }} className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1V9M1 5H9" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>
                New Agent
              </button>
            )}
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

        {isAdding && <AgentForm onSubmit={handleCreate} onCancel={() => setIsAdding(false)} loading={loading} />}
        {editingAgent && <AgentForm initial={editingAgent} onSubmit={handleUpdate} onCancel={() => setEditingAgent(null)} loading={loading} />}

        {fetching ? (
          <div className="flex items-center justify-center rounded-xl border border-stone-200 bg-white py-20">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin" width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#e7e5e4" strokeWidth="2"/><path d="M10 2A8 8 0 0 1 18 10" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/></svg>
              <p className="text-xs text-stone-400">Loading agents…</p>
            </div>
          </div>
        ) : agents.length === 0 && !isAdding ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-200 bg-white py-16 text-center">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-stone-50">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2.5" stroke="#a8a29e" strokeWidth="1.3"/><circle cx="7" cy="9" r="1.2" fill="#a8a29e"/><circle cx="13" cy="9" r="1.2" fill="#a8a29e"/><path d="M6.5 13C6.5 13 8 15 10 15C12 15 13.5 13 13.5 13" stroke="#a8a29e" strokeWidth="1.3" strokeLinecap="round"/></svg>
            </div>
            <p className="text-sm font-semibold text-stone-600">No agents yet</p>
            <p className="mt-1 text-xs text-stone-400">Click <span className="font-semibold text-green-600">+ New Agent</span> to create your first AI agent</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {agents.map((agent) => (
              <AgentCard key={agent._id} agent={agent} onDelete={handleDelete} onEdit={(a) => { setEditingAgent(a); setIsAdding(false); }} onAddRag={handleAddRag} onRemoveRag={handleRemoveRag} deletingId={deletingId} ragLoading={ragLoading} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
