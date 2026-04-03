import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout.jsx";
import api from "../api/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";

function StatCard({ label, value, loading }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-white/80 dark:bg-slate-800/40 backdrop-blur-md shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] ring-1 ring-inset ring-slate-900/5 dark:ring-white/5 px-4 sm:px-6 py-4 sm:py-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/40 dark:hover:shadow-black/50">
      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</span>
      {loading ? (
        <div className="h-8 w-12 animate-pulse rounded-md bg-slate-100 dark:bg-slate-700 mt-1" />
      ) : (
        <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight mt-0.5 drop-shadow-sm">
          {value}
        </span>
      )}
    </div>
  );
}

export function CctvProductsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("cctv-products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const [filterBrand, setFilterBrand] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setFetching(true);
      const { data } = await api.get(`/v1/cctv-products${filterBrand ? `?brand=${encodeURIComponent(filterBrand)}` : ""}`);
      setProducts(data.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load CCTV products.");
      setProducts([]);
    } finally {
      setFetching(false);
    }
  }, [filterBrand]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSync = async () => {
    try {
      setLoading(true);
      setError(null);
      await api.post("/v1/cctv-products/sync", {});
      await fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to sync catalog.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      setError(null);
      await api.delete(`/v1/cctv-products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  const uniqueBrands = [...new Set(products.map(p => p.brand))];
  const allBrandsDropdown = ["Hikvision", "Dahua", "CP Plus", "Uniview (UNV)", "TP-Link VIGI"];

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="flex flex-col gap-6 w-full overflow-x-hidden">
        {/* ── TOPBAR ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight drop-shadow-sm">
              CCTV Product Catalog
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
              Products synced here will be referenced by the AI Sales Agent during calls.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* User */}
            <div className="hidden sm:flex items-center gap-2.5 rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/80 dark:bg-slate-800/50 backdrop-blur-md px-3 py-1.5 shadow-sm">
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-[0_0_10px_rgba(52,211,153,0.4)]"
                style={{ background: "linear-gradient(135deg, #34d399, #0f766e)" }}
              >
                {user?.fullName?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[140px] truncate">
                {user?.email}
              </span>
            </div>

            {/* Sync Button */}
            <button
              type="button"
              onClick={handleSync}
              disabled={loading}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 dark:shadow-emerald-900/40 transition-all hover:shadow-lg hover:opacity-95 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                </svg>
              )}
              {loading ? "Syncing..." : "Sync Catalog"}
            </button>
            
            {/* Mobile Sign out */}
            <button
              type="button"
              onClick={logout}
              className="sm:hidden flex items-center justify-center rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/80 dark:bg-slate-800/50 backdrop-blur-md px-3 py-2.5 text-xs font-bold text-slate-500 dark:text-slate-400 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* ── STATS ───────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <StatCard
            label="Total Products"
            value={products.length}
            loading={fetching}
          />
          <StatCard
            label="Brands Covered"
            value={uniqueBrands.length}
            loading={fetching}
          />
          <StatCard
            label="Sales Agent Status"
            value={products.length > 0 ? "Armed & Ready" : "Awaiting Products"}
            loading={fetching}
          />
        </div>

        {/* ── ERROR ───────────────────────────────────────────────────────── */}
        {error && (
          <div className="flex items-center justify-between rounded-xl border border-red-100 dark:border-red-900/50 bg-red-50/50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400 shadow-sm w-full mx-auto max-w-full overflow-hidden">
            <div className="flex items-center gap-2 font-medium w-full">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 flex-none">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3" />
                <path d="M7 4.5V7M7 9.5V9.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="truncate w-full pr-4">{error}</span>
            </div>
            <button onClick={() => setError(null)} className="ml-2 text-red-400 hover:text-red-600 shrink-0">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>
        )}

        {/* ── FILTER ──────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-2 w-full max-w-xs">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">
            Filter by Brand
          </label>
          <select 
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="flex-1 appearance-none w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
          >
            <option value="">All Brands</option>
            {allBrandsDropdown.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* ── TABLE ───────────────────────────────────────────────────────── */}
        <div className="w-full">
          {fetching ? (
            <div className="flex items-center justify-center rounded-2xl border border-slate-100/60 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-20">
              <div className="flex flex-col items-center gap-3">
                <svg className="animate-spin text-emerald-500" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wide uppercase">Loading catalog…</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/60 dark:border-white/5 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md px-6 py-20 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-4 shadow-inner ring-1 ring-slate-200 dark:ring-white/10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400 dark:text-slate-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                No Products Found
              </h3>
              <p className="max-w-[16rem] text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                Click "Sync Catalog" to populate the database with CCTV products and arm your sales agent.
              </p>
              <button
                type="button"
                onClick={handleSync}
                className="inline-flex items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 transition-colors hover:bg-emerald-100 dark:hover:bg-emerald-500/20 shadow-sm"
              >
                Sync Catalog
              </button>
            </div>
          ) : (
            <div className="w-full rounded-2xl border border-slate-200/60 dark:border-white/5 bg-white/80 dark:bg-slate-800/40 backdrop-blur-md shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm whitespace-nowrap lg:whitespace-normal">
                  <thead className="border-b border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50">
                    <tr>
                      <th className="px-4 lg:px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest min-w-[120px]">Brand</th>
                      <th className="px-4 lg:px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest min-w-[120px]">Model</th>
                      <th className="px-4 lg:px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Type</th>
                      <th className="px-4 lg:px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right min-w-[120px]">Price (PKR)</th>
                      <th className="px-4 py-4 w-12" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {products.map((product) => (
                      <tr key={product._id} className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60">
                        <td className="px-4 lg:px-6 py-4">
                          <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-700/50 px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {product.brand}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 dark:text-white drop-shadow-sm">{product.model}</span>
                            <span className="text-[11px] text-slate-500 truncate max-w-[200px]">{product.resolution} • {product.features[0]}</span>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400 capitalize">
                          {product.category.replace("_", " ")}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-right font-semibold text-slate-900 dark:text-white tabular-nums">
                          {product.priceMin.toLocaleString()} - {product.priceMax.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={() => handleDelete(product._id)}
                            disabled={deletingId === product._id}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all focus:outline-none"
                            title="Delete product"
                          >
                            {deletingId === product._id ? (
                              <div className="h-3 w-3 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M1 3.5H13M4.5 3.5V2C4.5 1.72386 4.72386 1.5 5 1.5H9C9.27614 1.5 9.5 1.72386 9.5 2V3.5M6 6V10M8 6V10M2.5 3.5H11.5V11.5C11.5 12.0523 11.0523 12.5 10.5 12.5H3.5C2.94772 12.5 2.5 12.0523 2.5 11.5V3.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
