import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { ExtensionsPage } from "../pages/ExtensionsPage.jsx";
// import { AIAgentsPage } from "../pages/AIAgentsPage.jsx";
import { RateLimitingPage } from "../pages/RateLimitingPage.jsx";
import { CctvProductsPage } from "../pages/CctvProductsPage.jsx";
import { LoginPage } from "../pages/LoginPage.jsx";
import { SignupPage } from "../pages/SignupPage.jsx";

export function AppRouter() {
  const { user, checking } = useAuth();

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-sky-400" />
          <p className="text-xs text-slate-500">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Protected */}
      <Route path="/" element={user ? <ExtensionsPage /> : <Navigate to="/login" replace />} />
      {/* <Route path="/ai-agents" element={user ? <AIAgentsPage /> : <Navigate to="/login" replace />} /> */}
      <Route path="/rate-limiting" element={user ? <RateLimitingPage /> : <Navigate to="/login" replace />} />
      <Route path="/cctv-products" element={user ? <CctvProductsPage /> : <Navigate to="/login" replace />} />

      {/* Public — redirect to / if already logged in */}
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
      <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/" replace />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}