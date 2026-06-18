/**
 * Shared UI Components — used across all pages.
 * Keeps pages clean and DRY.
 */
import { X, Loader2 } from 'lucide-react';

/* ─── Page Header ─────────────────────────────────────────── */
export const PageHeader = ({ title, subtitle, actions }) => (
  <div className="page-header animate-fade-in">
    <div>
      <h1 className="page-title font-outfit">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-3 flex-wrap">{actions}</div>}
  </div>
);

/* ─── Glass Card ──────────────────────────────────────────── */
export const Card = ({ children, className = '', padding = true, hover = false }) => (
  <div
    className={`card ${hover ? 'card-hover' : ''} ${padding ? 'p-6' : ''} ${className}`}
  >
    {children}
  </div>
);

/* ─── Stat Card ───────────────────────────────────────────── */
export const StatCard = ({ label, value, icon: Icon, colorClass = 'text-blue-600', bgClass = 'bg-blue-50', sub }) => (
  <div className="stat-card animate-fade-in">
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">{label}</p>
        <p className="text-3xl font-bold text-slate-800 font-outfit">{value ?? '—'}</p>
        {sub && <p className="text-xs text-slate-400 mt-1.5">{sub}</p>}
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${bgClass}`}>
        <Icon size={21} className={colorClass} />
      </div>
    </div>
  </div>
);

/* ─── Glass Modal ─────────────────────────────────────────── */
export const Modal = ({ title, onClose, children, maxWidth = 'max-w-lg' }) => (
  <div
    className="modal-backdrop"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div
      className={`modal w-full ${maxWidth} animate-slide-up`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-slate-900 font-outfit">{title}</h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

/* ─── Modal Footer ────────────────────────────────────────── */
export const ModalFooter = ({ onCancel, submitLabel = 'Save', loading = false, icon: Icon = null }) => (
  <div
    className="flex gap-3 justify-end pt-4 mt-5"
    style={{ borderTop: '1px solid rgba(226,232,240,0.70)' }}
  >
    <button type="button" onClick={onCancel} className="btn btn-secondary">
      Cancel
    </button>
    <button type="submit" disabled={loading} className="btn btn-primary">
      {loading ? <Loader2 size={15} className="animate-spin" /> : Icon ? <Icon size={15} /> : null}
      {loading ? 'Saving...' : submitLabel}
    </button>
  </div>
);

/* ─── Form Field ──────────────────────────────────────────── */
export const FormField = ({ label, children }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    {children}
  </div>
);

/* ─── Search Bar ──────────────────────────────────────────── */
export const SearchBar = ({ value, onChange, placeholder = 'Search...', id }) => (
  <div className="relative">
    <svg
      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
      width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
    <input
      id={id}
      className="form-input pl-10"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

/* ─── Empty State ─────────────────────────────────────────── */
export const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <div className="py-20 text-center animate-fade-in">
    <div
      className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, rgba(239,246,255,0.80), rgba(238,242,255,0.60))', border: '1px solid rgba(219,234,254,0.60)' }}
    >
      <Icon size={28} className="text-blue-300" />
    </div>
    <p className="font-bold text-slate-700 text-base">{title}</p>
    {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
  </div>
);

/* ─── Spinner ─────────────────────────────────────────────── */
export const Spinner = ({ size = 28 }) => (
  <div className="flex items-center justify-center py-20">
    <Loader2 size={size} className="animate-spin text-blue-500" />
  </div>
);

/* ─── Section Table Wrapper ───────────────────────────────── */
export const TableWrapper = ({ children }) => (
  <div className="table-container animate-slide-up">
    <table className="w-full">
      {children}
    </table>
  </div>
);

/* ─── Table Section Header ─────────────────────────────────── */
export const SectionCard = ({ title, actions, children, className = '' }) => (
  <div className={`card p-0 overflow-hidden animate-slide-up ${className}`}>
    {(title || actions) && (
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{
          background: 'linear-gradient(to right, rgba(239,246,255,0.70), rgba(238,242,255,0.40))',
          borderBottom: '1px solid rgba(219,234,254,0.60)',
        }}
      >
        {title && <h2 className="font-bold text-sm text-slate-800 font-outfit">{title}</h2>}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    )}
    {children}
  </div>
);
