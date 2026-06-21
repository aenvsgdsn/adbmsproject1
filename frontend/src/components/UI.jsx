import { X, Loader2 } from 'lucide-react';

/* ─── Page Header ─────────────────────────────────────────── */
export const PageHeader = ({ title, subtitle, actions }) => (
  <div className="page-header animate-fade-in">
    <div>
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-3">{actions}</div>}
  </div>
);

/* ─── Generic Card ────────────────────────────────────────── */
export const Card = ({ children, className = '', padding = true, hover = false }) => (
  <div
    className={`card ${hover ? 'card-hover' : ''} ${padding ? 'p-6' : ''} ${className}`}
  >
    {children}
  </div>
);

/* ─── Boardto Style Project Card ──────────────────────────── */
export const BoardtoCard = ({ iconColorClass, icon: Icon, title, subtitle, daysLeft, teamAvatars, progress }) => (
  <div className="card text-center p-8 flex flex-col items-center animate-slide-up h-full">
    {/* Icon */}
    <div className={`icon-circle mb-6 ${iconColorClass}`}>
      <Icon size={24} />
    </div>

    {/* Header */}
    <h3 className="text-lg font-bold text-zinc-800 mb-1">{title}</h3>
    <p className="text-xs font-semibold text-zinc-400 flex items-center justify-center gap-1.5 mb-2">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      {subtitle}
    </p>
    <p className="text-[11px] font-bold text-zinc-400 mb-6 flex items-center gap-1">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
      {daysLeft}
    </p>

    <div className="w-full h-px bg-zinc-100 my-2" />

    {/* Footer (Team & Progress) */}
    <div className="w-full flex justify-between items-center mt-4">
      <div className="text-left">
        <p className="text-[10px] font-extrabold uppercase text-zinc-400 mb-2 tracking-wider">Team Member</p>
        <div className="flex -space-x-2">
          {teamAvatars.map((url, i) => (
            <img key={i} src={url} alt="team" className="w-7 h-7 rounded-full border-2 border-white" />
          ))}
          <div className="w-7 h-7 rounded-full bg-zinc-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-zinc-400">+</div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-extrabold uppercase text-zinc-400 mb-1.5 tracking-wider">Progress</p>
        <p className="text-base font-bold text-zinc-800">{progress}%</p>
      </div>
    </div>
  </div>
);

/* ─── Stat Card ───────────────────────────────────────────── */
export const StatCard = ({ label, value, icon: Icon, colorClass = 'text-blue-600', bgClass = 'bg-blue-50', sub }) => (
  <div className="stat-card animate-fade-in">
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-1">{label}</p>
        <p className="text-3xl font-bold text-zinc-800">{value ?? '—'}</p>
        {sub && <p className="text-xs font-semibold text-zinc-400 mt-1">{sub}</p>}
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${bgClass}`}>
        <Icon size={22} className={colorClass} />
      </div>
    </div>
  </div>
);

/* ─── Form Field ──────────────────────────────────────────── */
export const FormField = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[13px] font-bold text-zinc-600">{label}</label>
    {children}
  </div>
);

/* ─── Search Bar ──────────────────────────────────────────── */
export const SearchBar = ({ value, onChange, placeholder = 'Search...', id }) => (
  <div className="relative">
    <svg
      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
      width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
    <input
      id={id}
      className="form-input pl-10 h-10 py-0"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

/* ─── Spinner ─────────────────────────────────────────────── */
export const Spinner = ({ size = 28 }) => (
  <div className="flex items-center justify-center py-20">
    <Loader2 size={size} className="animate-spin text-cyan-500" />
  </div>
);
