import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export function LoginPage() {
  const { login } = useAuth();
  const [values, setValues] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await login(values.email, values.password);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* LEFT PANEL - VIBRANT */}
      <div className="relative hidden w-[460px] flex-col justify-between overflow-hidden bg-slate-950 p-10 lg:flex">
        {/* Glow Effects */}
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-emerald-500/20 blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[100px]" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/30">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L12.5 4.25V9.75L7 13L1.5 9.75V4.25L7 1Z" fill="white" />
              <circle cx="7" cy="7" r="2.2" fill="white" />
            </svg>
          </div>
          <div>
            <p className="font-bold tracking-tight text-white leading-none">Miqas Technologies</p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-400">Voice Infra</p>
          </div>
        </div>

        <div className="relative z-10">
          <div className="mb-6">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">Infrastructure Active</span>
            </div>
            <h2 className="text-3xl font-bold leading-[1.15] tracking-tight text-white">
              SIP Extension<br />Management
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 max-w-sm">
              Configure, monitor, and manage your SIP extensions across your entire voice infrastructure with ease.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            {[
              "Real-time extension registration",
              "Multi-domain PBX support",
              "Instant toggle & status monitoring",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                  <svg width="10" height="10" viewBox="0 0 9 9" fill="none">
                    <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-300">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-[11px] text-slate-500">© 2026 Miqas Technologies. All rights reserved.</p>
      </div>

      {/* RIGHT PANEL - FORM */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/30">
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L12.5 4.25V9.75L7 13L1.5 9.75V4.25L7 1Z" fill="white" />
                <circle cx="7" cy="7" r="2.2" fill="white" />
              </svg>
            </div>
            <p className="text-lg font-bold text-slate-900 tracking-tight">Miqas Technologies</p>
          </div>

          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sign in</h1>
            <p className="mt-1.5 text-sm text-slate-500">Enter your credentials to access the admin panel.</p>
          </div>

          {/* Form Container */}
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

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Email</span>
                <input
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition-all outline-none"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Password</span>
                <input
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition-all outline-none"
                />
              </label>

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
                    Signing in…
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>

              <p className="mt-2 text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <Link to="/signup" className="font-semibold text-emerald-600 transition-colors hover:text-emerald-700">
                  Create one
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}