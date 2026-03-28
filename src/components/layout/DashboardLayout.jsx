import PropTypes from "prop-types";
import { Sidebar } from "./Sidebar.jsx";

export function DashboardLayout({ activeTab, onTabChange, children }) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
      <main className="relative flex-1 overflow-y-auto">
        {/* Subtle grid texture */}
        <div
          className="pointer-events-none fixed inset-0 left-56 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #94a3b8 1px, transparent 1px),
              linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative flex flex-col gap-5 px-6 py-6 pb-20">
          {children}
        </div>
      </main>
    </div>
  );
}

DashboardLayout.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  children: PropTypes.node,
};