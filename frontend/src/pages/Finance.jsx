import { useEffect, useState } from 'react';
import { getStudentFees, getPendingPayments, approvePayment, rejectPayment, getFinanceDashboard, assignStudentFee, getStudents, getPrograms, createFeeStructure, getFeeStructures } from '../api';
import { useAuth } from '../context/AuthContext';
import { Loader2, CheckCircle, XCircle, DollarSign, Clock, TrendingUp, Users, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const statusColors = { 
  Pending: 'bg-amber-100 text-amber-700 border-amber-200', 
  Verified: 'bg-emerald-100 text-emerald-700 border-emerald-200', 
  Rejected: 'bg-rose-100 text-rose-700 border-rose-200' 
};
const feeStatusColors = { 
  Pending: 'bg-rose-100 text-rose-700 border-rose-200', 
  Partial: 'bg-amber-100 text-amber-700 border-amber-200', 
  Paid: 'bg-emerald-100 text-emerald-700 border-emerald-200' 
};

const Finance = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('payments');
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [feeForm, setFeeForm] = useState({ program_id: '', semester: '', amount: '' });
  const [assignForm, setAssignForm] = useState({ student_id: '', semester: '' });
  const [feeStructures, setFeeStructures] = useState([]);
  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);

  const isFinance = user?.role === 'Finance' || user?.role === 'Admin';

  const load = async () => {
    setLoading(true);
    try {
      if (isFinance) {
        const [p, s, pr, fs, std] = await Promise.all([
          getPendingPayments(),
          getFinanceDashboard(),
          getPrograms(),
          getFeeStructures(),
          getStudents()
        ]);
        setPayments(p.data || []);
        setStats(s.data);
        setPrograms(pr.data || []);
        setFeeStructures(fs.data || []);
        setStudents(std.data || []);
      } else {
        const { data } = await getStudentFees(user.student_id);
        setPayments(data || []);
      }
    } catch {
      toast.error('Failed to load finance data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    try {
      await approvePayment(id);
      toast.success('Payment approved!');
      load();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to approve.');
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectPayment(id);
      toast.success('Payment rejected.');
      load();
    } catch {
      toast.error('Failed to reject.');
    }
  };

  const handleCreateFeeStructure = async (e) => {
    e.preventDefault();
    try {
      await createFeeStructure(feeForm);
      toast.success('Fee structure created!');
      setShowFeeModal(false);
      setFeeForm({ program_id: '', semester: '', amount: '' });
      load();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed.');
    }
  };

  const handleAssignFee = async (e) => {
    e.preventDefault();
    try {
      await assignStudentFee(assignForm);
      toast.success('Fee assigned to student!');
      setShowAssignModal(false);
      setAssignForm({ student_id: '', semester: '' });
      load();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to assign fee. Please check if the fee structure exists for the student\'s program and semester.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-outfit">Financial Center</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage fees, monitor transactions, and process payment verifications.</p>
        </div>
        {isFinance && (
          <div className="flex gap-3">
            <button id="assign-fee-btn" onClick={() => setShowAssignModal(true)} className="btn bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2">
              <Users size={16} /> Assign Fee
            </button>
            <button id="add-fee-structure-btn" onClick={() => setShowFeeModal(true)} className="btn btn-primary shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all">
              <Plus size={16} /> Create Fee Structure
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { label: 'Total Revenue', value: `PKR ${Number(stats.total_revenue || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200/50' },
            { label: 'Pending Verification', value: stats.pending_payments, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200/50' },
            { label: 'Outstanding Fees', value: `PKR ${Number(stats.total_outstanding_fees || 0).toLocaleString()}`, icon: DollarSign, color: 'text-rose-600', bg: 'bg-rose-100', border: 'border-rose-200/50' },
            { label: 'Monthly Collection', value: `PKR ${Number(stats.monthly_collection || 0).toLocaleString()}`, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-200/50' },
          ].map(({ label, value, icon: Icon, color, bg, border }, i) => (
            <div key={label} className={`bg-white rounded-2xl p-5 shadow-sm border ${border} animate-slide-up hover:shadow-md transition-shadow`} style={{animationDelay: `${i*100}ms`}}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-2 font-outfit">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-slide-up delay-150">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-bold text-base text-slate-800 font-outfit">Pending Verifications</h2>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold bg-slate-50">
                  <th className="p-4">Student</th>
                  <th className="p-4">Roll No.</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  {isFinance && <th className="p-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.length === 0 ? (
                  <tr><td colSpan={7} className="text-center text-slate-400 py-16 font-medium">No pending payments requiring verification.</td></tr>
                ) : payments.map(p => (
                  <tr key={p.payment_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-800">{p.students?.user_accounts?.username}</td>
                    <td className="p-4 font-mono text-sm font-medium text-slate-600">{p.students?.roll_number}</td>
                    <td className="p-4 font-bold text-slate-900">PKR {Number(p.amount).toLocaleString()}</td>
                    <td className="p-4 text-sm font-semibold text-slate-600">{p.method}</td>
                    <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusColors[p.status]}`}>{p.status}</span></td>
                    <td className="p-4 text-slate-500 text-xs font-medium">{new Date(p.created_at).toLocaleDateString()}</td>
                    {isFinance && (
                      <td className="p-4 text-right">
                        {p.status === 'Pending' ? (
                          <div className="flex gap-2 justify-end">
                            <button id={`approve-${p.payment_id}`} onClick={() => handleApprove(p.payment_id)} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 rounded-lg text-xs font-bold transition-colors border border-emerald-200 flex items-center gap-1.5 shadow-sm">
                              <CheckCircle size={14} /> Approve
                            </button>
                            <button id={`reject-${p.payment_id}`} onClick={() => handleReject(p.payment_id)} className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 rounded-lg text-xs font-bold transition-colors border border-rose-200 flex items-center gap-1.5 shadow-sm">
                              <XCircle size={14} /> Reject
                            </button>
                          </div>
                        ) : <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Processed</span>}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Fee Structures Table */}
      {isFinance && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-slide-up mt-8">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-base text-slate-800 font-outfit">Active Fee Structures</h2>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold bg-slate-50">
                    <th className="p-4">Program</th>
                    <th className="p-4">Semester</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Date Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {feeStructures.length === 0 ? (
                    <tr><td colSpan={4} className="text-center text-slate-400 py-10 font-medium">No fee structures found.</td></tr>
                  ) : feeStructures.map(fs => (
                    <tr key={fs.fee_structure_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-800">{fs.programs?.program_name}</td>
                      <td className="p-4 font-medium text-slate-600">{fs.semester}</td>
                      <td className="p-4 font-bold text-slate-900">PKR {Number(fs.amount).toLocaleString()}</td>
                      <td className="p-4 text-slate-500 text-xs font-medium">{new Date(fs.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Fee Structure Modal */}
      {showFeeModal && (
        <div className="modal-backdrop animate-fade-in" onClick={e => e.target === e.currentTarget && setShowFeeModal(false)}>
          <div className="modal w-full max-w-lg animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 font-outfit">Create Fee Structure</h2>
              <button onClick={() => setShowFeeModal(false)} className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateFeeStructure} className="space-y-5">
              <div className="form-group">
                <label className="text-sm font-bold text-slate-700 mb-1">Program</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required value={feeForm.program_id} onChange={e => setFeeForm({...feeForm, program_id: e.target.value})}>
                  <option value="">Select Program</option>
                  {programs.map(p => <option key={p.program_id} value={p.program_id}>{p.program_name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="text-sm font-bold text-slate-700 mb-1">Semester</label>
                <input placeholder="e.g. Fall 2026" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required value={feeForm.semester} onChange={e => setFeeForm({...feeForm, semester: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="text-sm font-bold text-slate-700 mb-1">Amount (PKR)</label>
                <input type="number" placeholder="0" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required value={feeForm.amount} onChange={e => setFeeForm({...feeForm, amount: e.target.value})} />
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setShowFeeModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">Create Structure</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Assign Fee Modal */}
      {showAssignModal && (
        <div className="modal-backdrop animate-fade-in" onClick={e => e.target === e.currentTarget && setShowAssignModal(false)}>
          <div className="modal w-full max-w-lg animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 font-outfit">Assign Fee to Student</h2>
              <button onClick={() => setShowAssignModal(false)} className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleAssignFee} className="space-y-5">
              <div className="form-group">
                <label className="text-sm font-bold text-slate-700 mb-1">Student</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required value={assignForm.student_id} onChange={e => setAssignForm({...assignForm, student_id: e.target.value})}>
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s.student_id} value={s.student_id}>{s.user_accounts?.username} — {s.roll_number}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="text-sm font-bold text-slate-700 mb-1">Semester</label>
                <input placeholder="e.g. Fall 2026" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required value={assignForm.semester} onChange={e => setAssignForm({...assignForm, semester: e.target.value})} />
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setShowAssignModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">Assign Fee</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
