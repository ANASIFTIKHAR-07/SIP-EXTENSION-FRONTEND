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
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-200 bg-white py-16 text-center">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-stone-50">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1.5L15.5 5.25V12.75L9 16.5L2.5 12.75V5.25L9 1.5Z" stroke="#a8a29e" strokeWidth="1.2" strokeLinejoin="round"/>
            <circle cx="9" cy="9" r="2.5" stroke="#a8a29e" strokeWidth="1.2"/>
          </svg>
        </div>
        <p className="text-sm font-semibold text-stone-600">No extensions registered</p>
        <p className="mt-1 text-xs text-stone-400">
          Click <span className="font-semibold text-green-600">+ Add Extension</span> to get started
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-stone-100 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L12.5 4.25V9.75L7 13L1.5 9.75V4.25L7 1Z" stroke="#16a34a" strokeWidth="1.3" strokeLinejoin="round"/>
            <circle cx="7" cy="7" r="1.8" stroke="#16a34a" strokeWidth="1.3"/>
          </svg>
          <h2 className="text-sm font-semibold text-stone-800">SIP Extensions</h2>
        </div>
        <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-[11px] font-bold text-green-700">
          {extensions.length} {extensions.length === 1 ? "extension" : "extensions"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              {["Extension", "Display Name", "Domain", "Registered", "Status", ""].map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-2.5 text-left text-[9px] font-bold uppercase tracking-[0.12em] text-stone-400"
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
                  className={`border-b border-stone-100 transition-colors hover:bg-green-50/30 ${
                    index % 2 === 0 ? "bg-white" : "bg-stone-50/40"
                  }`}
                >
                  {/* Extension badge */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-bold text-green-700 font-mono tracking-wide">
                      {ext.extension}
                    </span>
                  </td>

                  {/* Display Name */}
                  <td className="px-4 py-3">
                    {ext.displayName ? (
                      <span className="font-medium text-stone-800">{ext.displayName}</span>
                    ) : (
                      <span className="text-stone-300 text-xs">—</span>
                    )}
                  </td>

                  {/* Domain */}
                  <td className="px-4 py-3 text-xs text-stone-500">{ext.domain}</td>

                  {/* Registered At */}
                  <td className="px-4 py-3">
                    {ext.registeredAt ? (
                      <span className="text-xs text-stone-500">
                        {new Date(ext.registeredAt).toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-stone-300 text-xs">—</span>
                    )}
                  </td>

                  {/* Registration Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        ext.isRegistered
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-stone-100 text-stone-500 border border-stone-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          ext.isRegistered ? "bg-green-500 animate-pulse" : "bg-stone-400"
                        }`}
                      />
                      {ext.isRegistered ? "REGISTERED" : "OFFLINE"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Register/Unregister button */}
                      {ext.isRegistered ? (
                        <button
                          type="button"
                          onClick={() => onUnregister(ext.extension)}
                          disabled={registeringId === ext._id}
                          className="rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-600 transition hover:bg-orange-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {registeringId === ext._id ? (
                            <span className="flex items-center gap-1.5">
                              <svg className="animate-spin" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="12 4"/>
                              </svg>
                              Unregistering
                            </span>
                          ) : "Unregister"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onRegister(ext.extension)}
                          disabled={registeringId === ext._id}
                          className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-600 transition hover:bg-green-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {registeringId === ext._id ? (
                            <span className="flex items-center gap-1.5">
                              <svg className="animate-spin" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="12 4"/>
                              </svg>
                              Registering
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
                            className="rounded-md border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-500 transition hover:bg-stone-50 hover:text-stone-700"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(ext._id)}
                            disabled={deletingId === ext._id}
                            className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {deletingId === ext._id ? (
                              <span className="flex items-center gap-1.5">
                                <svg className="animate-spin" width="10" height="10" viewBox="0 0 10 10" fill="none">
                                  <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="12 4"/>
                                </svg>
                                Deleting
                              </span>
                            ) : "Confirm"}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(ext._id)}
                          disabled={deletingId === ext._id}
                          className="rounded-md border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed"
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