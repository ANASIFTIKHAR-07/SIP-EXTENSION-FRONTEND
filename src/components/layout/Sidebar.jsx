import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

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
  // {
  //   key: "ai-agents",
  //   label: "AI Agents",
  //   path: "/ai-agents",
  //   icon: null,
  // },
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
];

export function Sidebar({ activeTab, onTabChange }) {
  const navigate = useNavigate();

  const handleNavClick = (item) => {
    onTabChange(item.key);
    navigate(item.path);
  };
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-slate-200/60 bg-white/60 backdrop-blur-xl font-sans">
      {/* ── LOGO ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-100/60">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-md shrink-0"
          style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1L11.5 4V9L6.5 12L1.5 9V4L6.5 1Z" fill="white" opacity="0.95"/>
            <circle cx="6.5" cy="6.5" r="2" fill="white" opacity="0.6"/>
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-[14px] font-bold text-slate-900 leading-none tracking-tight">
            Miqas
          </span>
          <span className="text-[10px] text-slate-500 leading-none mt-1 tracking-widest uppercase">
            Voice Infra
          </span>
        </div>
      </div>

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 px-3 py-4">
        <p className="px-2 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          Management
        </p>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleNavClick(item)}
              className={`group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-200 ${
                activeTab === item.key
                  ? "bg-emerald-50 text-emerald-800 shadow-sm shadow-emerald-100/50 ring-1 ring-emerald-500/20"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span
                className={`transition-colors ${
                  activeTab === item.key
                    ? "text-emerald-600"
                    : "text-slate-400 group-hover:text-slate-500"
                }`}
              >
                {item.icon}
              </span>
              {item.label}
              {activeTab === item.key && (
                <span className="ml-auto flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <div className="px-4 py-4 border-t border-slate-100/60">
        <div className="flex items-center gap-2.5 px-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[11px] text-slate-500 font-medium tracking-wide">All systems operational</span>
        </div>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};