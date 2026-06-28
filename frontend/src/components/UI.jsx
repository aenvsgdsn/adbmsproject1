import { X, Loader2 } from 'lucide-react';

/* ─── Page Header ─────────────────────────────────── */
export const PageHeader = ({ title, subtitle, actions }) => (
  <div className="page-header animate-fade-in">
    <div>
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2.5 flex-wrap">{actions}</div>}
  </div>
);

/* ─── Generic Card ───────────────────────────────── */
export const Card = ({ children, className = '', hover = false, padding = true }) => (
  <div
    className={`card ${hover ? 'card-hover' : ''} ${className}`}
    style={{ padding: padding ? undefined : 0 }}
  >
    {children}
  </div>
);


/* ─── Stat Card ────────────────────────────────────── */
export const StatCard = ({ label, value, icon: Icon, sub, accent = '#7c3aed' }) => (
  <div className="stat-card animate-fade-in">
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#a3a3a3', marginBottom: '6px' }}>
          {label}
        </p>
        <p style={{ fontSize: '26px', fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.04em', fontFamily: 'Plus Jakarta Sans, sans-serif', lineHeight: 1 }}>
          {value ?? '—'}
        </p>
        {sub && <p style={{ fontSize: '12px', color: '#a3a3a3', marginTop: '6px', fontWeight: 500 }}>{sub}</p>}
      </div>
      <div
        className="icon-circle"
        style={{
          background: `${accent}12`,
          border: `1px solid ${accent}20`,
          color: accent,
        }}
      >
        <Icon size={18} />
      </div>
    </div>
  </div>
);

/* ─── BoardTo Card (kept for Dashboard) ───────────── */
export const BoardtoCard = ({ iconColorClass, icon: Icon, title, subtitle, daysLeft, progress }) => (
  <div className="card card-hover flex flex-col items-center text-center p-6 animate-fade-in h-full">
    <div className={`icon-circle mb-4 ${iconColorClass}`}><Icon size={20} /></div>
    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0a0a0a', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '4px' }}>{title}</h3>
    <p style={{ fontSize: '12px', color: '#a3a3a3', marginBottom: '4px' }}>{subtitle}</p>
    <p style={{ fontSize: '11.5px', color: '#a3a3a3', marginBottom: '16px' }}>{daysLeft}</p>
    <div style={{ width: '100%', height: '1px', background: 'rgba(0,0,0,0.06)', margin: '8px 0' }} />
    <div className="w-full flex justify-between items-center mt-3">
      <span style={{ fontSize: '11px', color: '#a3a3a3', fontWeight: 600 }}>Progress</span>
      <span style={{ fontSize: '14px', fontWeight: 700, color: '#0a0a0a' }}>{progress}%</span>
    </div>
    <div style={{ width: '100%', height: '4px', background: '#f0f0f0', borderRadius: '99px', marginTop: '6px', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #7c3aed, #9d5eff)', borderRadius: '99px' }} />
    </div>
  </div>
);

/* ─── Form Field ────────────────────────────────────── */
export const FormField = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label className="form-label">{label}</label>
    {children}
  </div>
);

/* ─── Search Bar ────────────────────────────────────── */
export const SearchBar = ({ value, onChange, placeholder = 'Search...', id }) => (
  <div style={{ position: 'relative' }}>
    <svg
      style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3' }}
      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    >
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
    <input
      id={id}
      className="form-input"
      style={{ paddingLeft: '36px', height: '38px', padding: '0 14px 0 36px' }}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

/* ─── Spinner ────────────────────────────────────────── */
export const Spinner = ({ size = 24 }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 0' }}>
    <Loader2 size={size} className="animate-spin" style={{ color: '#7c3aed' }} />
  </div>
);

/* ─── Section Card ────────────────────────────────────── */
export const SectionCard = ({ title, actions, children, className = '' }) => (
  <section className={`section-card ${className}`}>
    {(title || actions) && (
      <div className="section-card-header">
        {title ? <h2 className="section-card-title">{title}</h2> : <div />}
        {actions && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{actions}</div>}
      </div>
    )}
    <div style={{ padding: '0' }}>{children}</div>
  </section>
);

/* ─── Table Wrapper ────────────────────────────────────── */
export const TableWrapper = ({ children, className = '' }) => (
  <div className={`table-container ${className}`}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>{children}</table>
  </div>
);

/* ─── Empty State ──────────────────────────────────────── */
export const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '56px 0', textAlign: 'center' }}>
    {Icon && (
      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
        <Icon size={20} style={{ color: '#7c3aed' }} />
      </div>
    )}
    <p style={{ fontSize: '14px', fontWeight: 600, color: '#525252' }}>{title}</p>
    {subtitle && <p style={{ fontSize: '13px', color: '#a3a3a3' }}>{subtitle}</p>}
  </div>
);

/* ─── Modal ──────────────────────────────────────────────── */
export const Modal = ({ title, children, onClose, maxWidth = 'max-w-lg' }) => (
  <div
    className="modal-overlay"
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}
  >
    <div className={`modal w-full ${maxWidth}`}>
      <div className="modal-header">
        <h3 className="modal-title">{title}</h3>
        <button
          type="button"
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a3a3a3', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms ease' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#0a0a0a'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#a3a3a3'; }}
        >
          <X size={17} />
        </button>
      </div>
      <div className="modal-body">{children}</div>
    </div>
  </div>
);

/* ─── Modal Footer ────────────────────────────────────────── */
export const ModalFooter = ({ onCancel, submitLabel, loading = false, icon: Icon }) => (
  <div className="modal-footer">
    <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
    <button type="submit" className="btn btn-primary btn-liquid" disabled={loading} style={{ opacity: loading ? 0.75 : 1 }}>
      {loading ? <Loader2 size={14} className="animate-spin" /> : Icon ? <Icon size={14} /> : null}
      {submitLabel}
    </button>
  </div>
);
