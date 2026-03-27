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
    <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-[0.1em]">
      {label}{required && <span className="text-green-600 ml-0.5">*</span>}
    </span>
    <input
      {...props}
      required={required}
      className="rounded-md border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 placeholder-stone-300 outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500/15 hover:border-stone-300 shadow-sm"
    />
    {hint && <span className="text-[10px] text-stone-400">{hint}</span>}
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
    <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-stone-100 bg-white px-6 py-4">
        <div
          style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}
          className="flex h-7 w-7 items-center justify-center rounded-md shadow-sm"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1.5L10.5 4.5V8.5L6 11L1.5 8.5V4.5L6 1.5Z" stroke="white" strokeWidth="1.2" strokeLinejoin="round"/>
            <circle cx="6" cy="6" r="1.5" fill="white"/>
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-stone-800">New SIP Extension</h2>
          <p className="text-[11px] text-stone-400 mt-0.5">Register a new extension to your workspace</p>
        </div>
        <button
          type="button"
          onClick={() => { setValues(INITIAL_VALUES); onCancel?.(); }}
          className="ml-auto rounded-md p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <form className="p-6" onSubmit={handleSubmit}>
        {/* Required fields */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-stone-100" />
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-stone-400 px-1">Required</p>
            <div className="h-px flex-1 bg-stone-100" />
          </div>
          <div className="grid gap-3.5 sm:grid-cols-2">
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
        <div className="flex justify-end gap-2.5 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={() => { setValues(INITIAL_VALUES); onCancel?.(); }}
            className="rounded-md border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-600 transition hover:bg-stone-50 hover:border-stone-300 hover:text-stone-800 shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{ background: loading ? undefined : "linear-gradient(135deg, #16a34a, #15803d)" }}
            className="rounded-md px-5 py-2 text-xs font-bold text-white shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-green-300 hover:opacity-90"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin" width="11" height="11" viewBox="0 0 11 11" fill="none">
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