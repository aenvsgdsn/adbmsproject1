import { useEffect, useState } from 'react';
import { getAuditLogs } from '../api';
import { ClipboardList, Loader2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

const actionBadge = (action) => {
  if (action === 'INSERT') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (action === 'UPDATE') return 'bg-blue-100 text-blue-700 border-blue-200';
  if (action === 'DELETE') return 'bg-rose-100 text-rose-700 border-rose-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableFilter, setTableFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (tableFilter) params.table_name = tableFilter;
      if (actionFilter) params.action = actionFilter;
      const res = await getAuditLogs(params);
      setLogs(res.data || []);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { load(); }, [tableFilter, actionFilter]);

  const tables = [...new Set(logs.map(l => l.table_name))].filter(Boolean);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-outfit">System Audit Logs</h1>
          <p className="text-slate-500 mt-1 font-medium">Complete unalterable record of all system actions and data changes.</p>
        </div>
        <button onClick={load} className="btn btn-secondary bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition-all hover:-translate-y-0.5">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh Logs
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="form-group">
            <label className="text-sm font-bold text-slate-700 mb-1">Filter by Table</label>
            <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium" value={tableFilter} onChange={e => setTableFilter(e.target.value)}>
              <option value="">All Database Tables</option>
              {tables.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="text-sm font-bold text-slate-700 mb-1">Filter by Action</label>
            <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium" value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
              <option value="">All Actions (Insert, Update, Delete)</option>
              <option value="INSERT">INSERT</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-slide-up">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold bg-slate-50">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">User Account</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Target Table</th>
                  <th className="p-4">Record ID (UUID)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.length === 0 ? (
                  <tr><td colSpan={5}>
                    <div className="py-20 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
                        <ClipboardList size={28} className="text-slate-300" />
                      </div>
                      <p className="text-base font-bold text-slate-800">No audit logs found</p>
                      <p className="text-sm text-slate-500 mt-1">System actions will be recorded here automatically.</p>
                    </div>
                  </td></tr>
                ) : logs.map(log => (
                  <tr key={log.audit_id} className="hover:bg-slate-50/80 transition-colors font-mono text-sm">
                    <td className="p-4 text-xs font-semibold text-slate-500 tracking-tight">
                      {log.created_at ? format(new Date(log.created_at), 'dd MMM yyyy, HH:mm:ss') : '—'}
                    </td>
                    <td className="p-4 font-bold text-slate-800 font-sans">{log.user_accounts?.username || 'System Administrator'}</td>
                    <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border font-sans tracking-wide ${actionBadge(log.action)}`}>{log.action}</span></td>
                    <td className="p-4"><code className="text-xs bg-slate-100 px-2.5 py-1 rounded-md text-slate-700 font-semibold border border-slate-200">{log.table_name}</code></td>
                    <td className="p-4 text-xs text-slate-400 font-medium">{log.record_id?.slice(0, 18)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
