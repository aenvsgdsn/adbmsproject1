import { useEffect, useState } from 'react';
import { getAuditLogs } from '../api';
import { ClipboardList, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { PageHeader, Card, SectionCard, TableWrapper, EmptyState, Spinner, FormField } from '../components/UI';

const ACTION_BADGE = {
  INSERT: 'badge-green',
  UPDATE: 'badge-blue',
  DELETE: 'badge-red',
};

const AuditLogs = () => {
  const [logs, setLogs]                   = useState([]);
  const [loading, setLoading]             = useState(true);
  const [tableFilter, setTableFilter]     = useState('');
  const [actionFilter, setActionFilter]   = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (tableFilter)  params.table_name = tableFilter;
      if (actionFilter) params.action     = actionFilter;
      const res = await getAuditLogs(params);
      setLogs(res.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [tableFilter, actionFilter]);

  const tables = [...new Set(logs.map(l => l.table_name))].filter(Boolean);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="System Audit Logs"
        subtitle="Complete unalterable record of all system actions and data changes"
      />

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Filter by Table">
            <select className="form-input form-select" value={tableFilter} onChange={e => setTableFilter(e.target.value)}>
              <option value="">All Database Tables</option>
              {tables.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Filter by Action">
            <select className="form-input form-select" value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
              <option value="">All Actions</option>
              <option value="INSERT">INSERT</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
            </select>
          </FormField>
        </div>
      </Card>

      {loading ? <Spinner /> : (
        <SectionCard 
          title={`${logs.length} Log Entries`}
          actions={
            <button onClick={load} className="btn btn-secondary shrink-0">
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          }
        >
          <TableWrapper>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Target Table</th>
                <th>Record ID</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState icon={ClipboardList} title="No audit logs found" subtitle="System actions will be recorded here automatically." />
                  </td>
                </tr>
              ) : logs.map(log => (
                <tr key={log.audit_id} className="font-mono">
                  <td>
                    <span className="text-xs font-semibold text-slate-500">
                      {log.created_at ? format(new Date(log.created_at), 'dd MMM yyyy, HH:mm:ss') : '—'}
                    </span>
                  </td>
                  <td>
                    <span className="font-bold text-slate-800 font-sans">{log.user_accounts?.username || 'System'}</span>
                  </td>
                  <td>
                    <span className={`badge font-sans ${ACTION_BADGE[log.action] || 'badge-gray'}`}>{log.action}</span>
                  </td>
                  <td>
                    <code className="text-xs px-2.5 py-1 rounded-lg font-semibold"
                      style={{ background: 'rgba(239,246,255,0.80)', border: '1px solid rgba(219,234,254,0.80)', color: '#334155' }}>
                      {log.table_name}
                    </code>
                  </td>
                  <td>
                    <span className="text-xs text-slate-400">{log.record_id?.slice(0, 18)}…</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableWrapper>
        </SectionCard>
      )}
    </div>
  );
};

export default AuditLogs;
