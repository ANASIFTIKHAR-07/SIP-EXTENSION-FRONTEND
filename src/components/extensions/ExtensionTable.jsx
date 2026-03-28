import PropTypes from "prop-types";
import { useState } from "react";

export function ExtensionTable({ extensions, onDelete, deletingId, onRegister, onUnregister, registeringId }) {
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDeleteClick = (id) => {
    if (confirmDelete === id) {
      onDelete(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete((cur) => cur === id ? null : cur), 3000);
    }
  };

  if (extensions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/60 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-16 text-center shadow-sm">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800">
          <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
            <path d="M9 1.5L15.5 5.25V12.75L9 16.5L2.5 12.75V5.25L9 1.5Z" stroke="currentColor" className="text-slate-400 dark:text-slate-500" strokeWidth="1.2" strokeLinejoin="round"/>
            <circle cx="9" cy="9" r="2.5" stroke="currentColor" className="text-slate-400 dark:text-slate-500" strokeWidth="1.2"/>
          </svg>
        </div>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 tracking-tight">No extensions registered</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Click <span className="font-semibold text-emerald-600 dark:text-emerald-400">+ Add Extension</span> to get started
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-white/5 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md overflow-hidden shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] ring-1 ring-inset ring-slate-900/5 dark:ring-white/5 w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100/60 dark:border-white/5 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L12.5 4.25V9.75L7 13L1.5 9.75V4.25L7 1Z" stroke="currentColor" className="text-emerald-500 dark:text-emerald-400" strokeWidth="1.5" strokeLinejoin="round"/>
              <circle cx="7" cy="7" r="1.8" fill="currentColor" className="text-emerald-500 dark:text-emerald-400"/>
            </svg>
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">SIP Extensions</h2>
        </div>
        <span className="inline-flex items-center rounded-md border border-slate-200/60 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest shadow-sm">
          {extensions.length} {extensions.length === 1 ? "ext" : "exts"}
        </span>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100/60 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50">
              {["Extension", "Display Name", "Domain", "Registered", "Status", ""].map((h, i) => (
                <th
                  key={i}
                  className="px-4 sm:px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {extensions.map((ext, index) => {
              const isConfirming = confirmDelete === ext._id;
              return (
                <tr
                  key={ext._id}
                  className={`border-b border-slate-100/60 dark:border-white/5 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50 ${
                    index % 2 === 0 ? "bg-white/40 dark:bg-transparent" : "bg-slate-50/30 dark:bg-slate-900/30"
                  }`}
                >
                  {/* Extension badge */}
                  <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-md border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/80 dark:bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 font-mono tracking-tight shadow-sm">
                      {ext.extension}
                    </span>
                  </td>

                  {/* Display Name */}
                  <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
                    {ext.displayName ? (
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{ext.displayName}</span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600 text-xs font-medium italic">None</span>
                    )}
                  </td>

                  {/* Domain */}
                  <td className="px-4 sm:px-6 py-3.5 text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">{ext.domain}</td>

                  {/* Registered At */}
                  <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
                    {ext.registeredAt ? (
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {new Date(ext.registeredAt).toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600 text-xs">—</span>
                    )}
                  </td>

                  {/* Registration Status */}
                  <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide border shadow-sm ${
                        ext.isRegistered
                          ? "bg-emerald-50/80 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/60 dark:border-white/10"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          ext.isRegistered ? "bg-emerald-500 dark:bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-slate-400 dark:bg-slate-500"
                        }`}
                      />
                      {ext.isRegistered ? "REGISTERED" : "OFFLINE"}
                    </span>
                  </td>

                  <td className="px-4 sm:px-6 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      {/* Register/Unregister button */}
                      {ext.isRegistered ? (
                        <button
                          type="button"
                          onClick={() => onUnregister(ext.extension)}
                          disabled={registeringId === ext._id}
                          className="rounded-lg border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 transition-all hover:bg-amber-100 dark:hover:bg-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                        >
                          {registeringId === ext._id ? (
                            <span className="flex items-center gap-1.5">
                              <svg className="animate-spin" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="12 4"/>
                              </svg>
                              Wait…
                            </span>
                          ) : "Unregister"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onRegister(ext.extension)}
                          disabled={registeringId === ext._id}
                          className="rounded-lg border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 transition-all hover:bg-emerald-100 dark:hover:bg-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                        >
                          {registeringId === ext._id ? (
                            <span className="flex items-center gap-1.5">
                              <svg className="animate-spin" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="12 4"/>
                              </svg>
                              Wait…
                            </span>
                          ) : "Register"}
                        </button>
                      )}

                      {/* Delete button */}
                      {isConfirming ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(null)}
                            className="rounded-lg border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-800 px-3 py-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 transition hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(ext._id)}
                            disabled={deletingId === ext._id}
                            className="rounded-lg border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-3 py-1.5 text-[11px] font-bold text-red-600 dark:text-red-400 transition hover:bg-red-100 dark:hover:bg-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                          >
                            {deletingId === ext._id ? (
                              <svg className="animate-spin" width="14" height="14" viewBox="0 0 10 10" fill="none">
                                <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="12 4"/>
                              </svg>
                            ) : "Confirm"}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(ext._id)}
                          disabled={deletingId === ext._id}
                          className="rounded-lg border-0 bg-transparent px-3 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 transition hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

ExtensionTable.propTypes = {
  extensions: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      domain: PropTypes.string.isRequired,
      extension: PropTypes.string.isRequired,
      displayName: PropTypes.string,
      isRegistered: PropTypes.bool,
      registeredAt: PropTypes.string,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
  deletingId: PropTypes.string,
  onRegister: PropTypes.func.isRequired,
  onUnregister: PropTypes.func.isRequired,
  registeringId: PropTypes.string,
};