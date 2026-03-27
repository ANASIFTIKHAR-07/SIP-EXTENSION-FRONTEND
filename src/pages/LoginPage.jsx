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
    <div
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
      className="flex min-h-screen bg-stone-50"
    >
     
      <div
        className="hidden lg:flex lg:w-[420px] flex-col justify-between p-10 border-r border-stone-200 bg-white"
      >
        <div className="flex items-center gap-3">
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

        <div>
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-semibold text-green-700 uppercase tracking-wider">Infrastructure Active</span>
            </div>
            <h2
              style={{ letterSpacing: "-0.04em", lineHeight: "1.15" }}
              className="text-3xl font-bold text-stone-900"
            >
              SIP Extension<br />Management
            </h2>
            <p className="mt-3 text-sm text-stone-500 leading-relaxed">
              Configure, monitor, and manage your SIP extensions across your entire voice infrastructure.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-2.5">
            {[
              "Real-time extension registration",
              "Multi-domain PBX support",
              "Instant toggle & status monitoring",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-xs text-stone-600 font-medium">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-stone-300">© 2025 Miqas Technologies. All rights reserved.</p>
      </div>

      {/* Right panel - form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-2.5 mb-8">
            <div
              style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}
              className="flex h-9 w-9 items-center justify-center rounded-xl shadow-sm"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L12.5 4.25V9.75L7 13L1.5 9.75V4.25L7 1Z" fill="white" opacity="0.9"/>
                <circle cx="7" cy="7" r="2.2" fill="white"/>
              </svg>
            </div>
            <p className="text-sm font-bold text-stone-900">Miqas Technologies</p>
          </div>

          <div className="mb-7">
            <h1
              style={{ letterSpacing: "-0.03em" }}
              className="text-2xl font-bold text-stone-900"
            >
              Sign in
            </h1>
            <p className="mt-1 text-sm text-stone-500">Enter your credentials to access the admin panel.</p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
            <form className="flex flex-col gap-4 p-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-600 flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M6 3.5V6.5M6 8.5V8.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                  {error}
                </div>
              )}

              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-stone-500">Email</span>
                <input
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="rounded-md border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 placeholder-stone-300 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/15 hover:border-stone-300 shadow-sm"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-stone-500">Password</span>
                <input
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="rounded-md border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 placeholder-stone-300 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/15 hover:border-stone-300 shadow-sm"
                />
              </label>

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
                    Signing in…
                  </span>
                ) : "Sign In"}
              </button>

              <p className="text-center text-xs text-stone-400">
                No account?{" "}
                <Link to="/signup" className="font-semibold text-green-600 hover:text-green-700 transition-colors">
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