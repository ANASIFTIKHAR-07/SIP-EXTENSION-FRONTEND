import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Field must be defined OUTSIDE the page component to prevent remounting on every render
const Field = ({ label, name, type = "text", placeholder, value, onChange }) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-stone-500">{label}</span>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="rounded-md border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 placeholder-stone-300 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/15 hover:border-stone-300 shadow-sm"
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
    <div
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
      className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-10"
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-7">
          <div
            style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}
            className="flex h-9 w-9 items-center justify-center rounded-xl shadow-sm"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L12.5 4.25V9.75L7 13L1.5 9.75V4.25L7 1Z" fill="white" opacity="0.9"/>
              <circle cx="7" cy="7" r="2.2" fill="white"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-stone-900 tracking-tight leading-none">Miqas Technologies</p>
            <p className="text-[10px] text-stone-400 mt-0.5 tracking-widest uppercase">Voice Infra</p>
          </div>
        </div>

        <div className="mb-5">
          <h1 style={{ letterSpacing: "-0.03em" }} className="text-2xl font-bold text-stone-900">
            Create account
          </h1>
          <p className="mt-1 text-sm text-stone-500">Set up access to the admin panel.</p>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
          <form className="flex flex-col gap-3.5 p-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-600 flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M6 3.5V6.5M6 8.5V8.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Field label="Full Name" name="fullName" placeholder="John Doe" value={values.fullName} onChange={handleChange} />
              <Field label="Username" name="userName" placeholder="johndoe" value={values.userName} onChange={handleChange} />
            </div>
            <Field label="Email" name="email" type="email" placeholder="you@example.com" value={values.email} onChange={handleChange} />
            <Field label="Password" name="password" type="password" placeholder="••••••••" value={values.password} onChange={handleChange} />
            <Field label="Confirm Password" name="confirmPassword" type="password" placeholder="••••••••" value={values.confirmPassword} onChange={handleChange} />

            <button
              type="submit"
              disabled={loading}
              style={{ background: loading ? undefined : "linear-gradient(135deg, #16a34a, #15803d)" }}
              className="mt-1 rounded-md py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-green-300"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <circle cx="6.5" cy="6.5" r="5.5" stroke="white" strokeWidth="1.5" strokeDasharray="17 7"/>
                  </svg>
                  Creating account…
                </span>
              ) : "Create Account"}
            </button>

            <p className="text-center text-xs text-stone-400">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-green-600 hover:text-green-700 transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}