import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext.jsx";

const NAV_ITEMS = [
  {
    key: "extensions",
    label: "Extensions",
    path: "/",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M7.5 1L13.5 4.5V10.5L7.5 14L1.5 10.5V4.5L7.5 1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        <circle cx="7.5" cy="7.5" r="1.8" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
  },
  {
    key: "rate-limiting",
    label: "Token Rate Limiting",
    path: "/rate-limiting",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M7.5 3V7.5L10 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    key: "cctv-products",
    label: "CCTV Products",
    path: "/cctv-products",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="2" y="3" width="11" height="9" rx="2" stroke="currentColor" strokeWidth="1.3"/>
        <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.3"/>
        <line x1="11.5" y1="3" x2="11.5" y2="12" stroke="currentColor" strokeWidth="1.3"/>
        <line x1="4" y1="1" x2="4" y2="3" stroke="currentColor" strokeWidth="1.3"/>
        <line x1="11" y1="1" x2="11" y2="3" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
  },
];

export function Sidebar({ activeTab, onTabChange }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleNavClick = (item) => {
    onTabChange(item.key);
    navigate(item.path);
  };
  return (
    <aside className="flex h-full w-full flex-col border-r border-slate-200/60 dark:border-white/5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl font-sans transition-colors duration-300 shadow-2xl lg:shadow-none">
      {/* ── LOGO ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-100/60 dark:border-white/5 shrink-0">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-md shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          style={{ background: "linear-gradient(135deg, #10b981, #047857)" }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1L11.5 4V9L6.5 12L1.5 9V4L6.5 1Z" fill="white" opacity="0.95"/>
            <circle cx="6.5" cy="6.5" r="2" fill="white" opacity="0.6"/>
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-[14px] font-bold text-slate-900 dark:text-white leading-none tracking-tight">
            Miqas
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-none mt-1 tracking-widest uppercase font-medium">
            Voice Infra
          </span>
        </div>
      </div>

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <p className="px-2 mb-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Management
        </p>
        <nav className="flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleNavClick(item)}
              className={`group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-300 ${
                activeTab === item.key
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shadow-sm shadow-emerald-100/50 dark:shadow-emerald-900/20 ring-1 ring-emerald-500/20 dark:ring-emerald-500/30"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <span
                className={`transition-colors duration-300 ${
                  activeTab === item.key
                    ? "text-emerald-500 dark:text-emerald-400"
                    : "text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-300"
                }`}
              >
                {item.icon}
              </span>
              {item.label}
              {activeTab === item.key && (
                <span className="ml-auto flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <div className="px-4 py-4 border-t border-slate-100/60 dark:border-white/5 shrink-0 flex flex-col gap-3">
        {/* Toggle Theme */}
        <button 
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-[13px] font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-200 transition-all duration-300"
        >
          <span className="text-slate-400 dark:text-slate-500 flex shrink-0">
            {theme === "dark" ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </span>
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>

        <div className="flex items-center gap-2.5 px-3">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">All systems operational</span>
        </div>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};