import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Field must be defined OUTSIDE the page component to prevent remounting on every render
const Field = ({ label, name, type = "text", placeholder, value, onChange }) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition-all outline-none"
    />
  </label>
);

export function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await register(values.fullName, values.userName, values.email, values.password);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 font-sans">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/30">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L12.5 4.25V9.75L7 13L1.5 9.75V4.25L7 1Z" fill="white" />
              <circle cx="7" cy="7" r="2.2" fill="white" />
            </svg>
          </div>
          <p className="text-lg font-bold tracking-tight text-slate-900">Miqas Technologies</p>
        </div>

        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create account</h1>
          <p className="mt-1.5 text-sm text-slate-500">Set up access to the admin panel.</p>
        </div>

        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100">
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center gap-2.5 rounded-lg border border-red-100 bg-red-50/50 px-4 py-3 text-sm text-red-600">
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" className="shrink-0 text-red-500">
                  <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M6 3.5V6.5M6 8.5V8.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Name" name="fullName" placeholder="John Doe" value={values.fullName} onChange={handleChange} />
              <Field label="Username" name="userName" placeholder="johndoe" value={values.userName} onChange={handleChange} />
            </div>
            <Field label="Email" name="email" type="email" placeholder="you@example.com" value={values.email} onChange={handleChange} />
            <Field label="Password" name="password" type="password" placeholder="••••••••" value={values.password} onChange={handleChange} />
            <Field label="Confirm Password" name="confirmPassword" type="password" placeholder="••••••••" value={values.confirmPassword} onChange={handleChange} />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition-all hover:opacity-90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 13 13" fill="none">
                    <circle cx="6.5" cy="6.5" r="5.5" stroke="white" strokeWidth="1.5" strokeDasharray="17 7" />
                  </svg>
                  Creating account…
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            <p className="mt-2 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-emerald-600 transition-colors hover:text-emerald-700">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}