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
    <aside
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
      className="flex w-52 shrink-0 flex-col border-r border-stone-200 bg-white"
    >
      {/* ── LOGO ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-stone-100">
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
          <span className="text-[13px] font-semibold text-stone-800 leading-none tracking-tight">
            Miqas
          </span>
          <span className="text-[10px] text-stone-400 leading-none mt-0.5 tracking-wide">
            Voice Infra
          </span>
        </div>
      </div>

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 px-2 py-3">
        <p className="px-2 mb-1 text-[10px] font-medium text-stone-400 uppercase tracking-widest">
          Management
        </p>
        <nav className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleNavClick(item)}
              className={`group w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-all duration-100 ${
                activeTab === item.key
                  ? "bg-stone-100 text-stone-900"
                  : "text-stone-500 hover:bg-stone-50 hover:text-stone-800"
              }`}
            >
              <span
                className={`transition-colors ${
                  activeTab === item.key
                    ? "text-green-600"
                    : "text-stone-400 group-hover:text-stone-500"
                }`}
              >
                {item.icon}
              </span>
              {item.label}
              {activeTab === item.key && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <div className="px-3 py-3 border-t border-stone-100">
        <div className="flex items-center gap-2 px-2 py-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-[11px] text-stone-400 font-medium">All systems operational</span>
        </div>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};