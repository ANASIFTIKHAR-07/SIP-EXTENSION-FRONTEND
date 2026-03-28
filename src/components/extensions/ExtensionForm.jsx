import { useState } from "react";
import PropTypes from "prop-types";

const INITIAL_VALUES = {
  domain: "",
  password: "",
  extension: "",
  displayName: "",
};

const InputField = ({ label, required, hint, ...props }) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
      {label}{required && <span className="text-emerald-500 ml-0.5">*</span>}
    </span>
    <input
      {...props}
      required={required}
      className="rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition-all outline-none"
    />
    {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
  </label>
);

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  hint: PropTypes.string,
};

export function ExtensionForm({ onSubmit, onCancel, loading }) {
  const [values, setValues] = useState(INITIAL_VALUES);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values, () => setValues(INITIAL_VALUES));
  };

  return (
    <div className="rounded-2xl border border-slate-100/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-900/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100/60 bg-white px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-sm">
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
            <path d="M6 1.5L10.5 4.5V8.5L6 11L1.5 8.5V4.5L6 1.5Z" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/>
            <circle cx="6" cy="6" r="1.5" fill="white"/>
          </svg>
        </div>
        <div>
          <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">New SIP Extension</h2>
          <p className="text-xs text-slate-500 mt-0.5">Register a new extension to your workspace</p>
        </div>
        <button
          type="button"
          onClick={() => { setValues(INITIAL_VALUES); onCancel?.(); }}
          className="ml-auto rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <form className="p-6" onSubmit={handleSubmit}>
        {/* Required fields */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-slate-100" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2">Required Fields</p>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Extension"
              name="extension"
              value={values.extension}
              onChange={handleChange}
              placeholder="1001"
              required
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
            <InputField
              label="Domain"
              name="domain"
              value={values.domain}
              onChange={handleChange}
              placeholder="sip.yourdomain.com"
              required
            />
            <InputField
              label="Display Name"
              name="displayName"
              value={values.displayName}
              onChange={handleChange}
              placeholder="Support Line 1"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-5 border-t border-slate-100/60">
          <button
            type="button"
            onClick={() => { setValues(INITIAL_VALUES); onCancel?.(); }}
            className="rounded-xl border-0 ring-1 ring-inset ring-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition-all hover:shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin" width="12" height="12" viewBox="0 0 11 11" fill="none">
                  <circle cx="5.5" cy="5.5" r="4.5" stroke="white" strokeWidth="1.5" strokeDasharray="14 6"/>
                </svg>
                Saving…
              </span>
            ) : "Save Extension"}
          </button>
        </div>
      </form>
    </div>
  );
}

ExtensionForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  loading: PropTypes.bool,
};