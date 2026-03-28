import PropTypes from "prop-types";
import { Sidebar } from "./Sidebar.jsx";
import { useState } from "react";

export function DashboardLayout({ activeTab, onTabChange, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform lg:w-64 lg:static lg:translate-x-0 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar activeTab={activeTab} onTabChange={(tab) => { onTabChange(tab); setIsSidebarOpen(false); }} />
      </div>

      <main className="relative flex-1 overflow-x-hidden flex flex-col min-h-screen w-full lg:w-[calc(100%-16rem)] max-w-[100vw]">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200/60 dark:border-white/5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-md shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              style={{ background: "linear-gradient(135deg, #10b981, #047857)" }}
            >
               <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                 <path d="M6.5 1L11.5 4V9L6.5 12L1.5 9V4L6.5 1Z" fill="white" opacity="0.95"/>
                 <circle cx="6.5" cy="6.5" r="2" fill="white" opacity="0.6"/>
               </svg>
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">Miqas</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -mr-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Subtle grid texture */}
        <div
          className="pointer-events-none fixed inset-0 lg:left-64 opacity-[0.03] dark:opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />
        
        <div className="relative flex-1 flex flex-col gap-5 p-4 sm:p-6 pb-20 max-w-full">
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