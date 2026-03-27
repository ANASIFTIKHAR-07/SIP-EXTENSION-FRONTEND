import PropTypes from "prop-types";
import { Sidebar } from "./Sidebar.jsx";

export function DashboardLayout({ activeTab, onTabChange, children }) {
  return (
    <div
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
      className="flex min-h-screen bg-stone-50 text-stone-900"
    >
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
      <main className="relative flex-1 overflow-y-auto bg-stone-50">
        {/* Subtle grid texture */}
        <div
          className="pointer-events-none fixed inset-0 left-56 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #374151 1px, transparent 1px),
              linear-gradient(to bottom, #374151 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative flex flex-col gap-5 px-6 py-6">
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