import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudentFees, getPendingPayments, approvePayment, rejectPayment, getFinanceDashboard, assignStudentFee, getStudents, getPrograms, createFeeStructure, getFeeStructures } from '../api';
import { DollarSign, Clock, TrendingUp, Users, Plus, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader, StatCard, SectionCard, TableWrapper, Modal, ModalFooter, FormField, EmptyState, Spinner } from '../components/UI';

const STATUS_BADGE = {
  Pending:  'badge-yellow',
  Verified: 'badge-green',
  Rejected: 'badge-red',
};


const Finance = () => {
  const { user } = useAuth();
  const [payments, setPayments]           = useState([]);
  const [stats, setStats]                 = useState(null);
  const [loading, setLoading]             = useState(true);
  const [showFeeModal, setShowFeeModal]   = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [feeForm, setFeeForm]             = useState({ program_id: '', semester: '', amount: '' });
  const [assignForm, setAssignForm]       = useState({ student_id: '', semester: '' });
  const [feeStructures, setFeeStructures] = useState([]);
  const [students, setStudents]           = useState([]);
  const [programs, setPrograms]           = useState([]);

  const isFinance = user?.role === 'Finance' || user?.role === 'Admin';

  const load = async () => {
    setLoading(true);
    try {
      if (isFinance) {
        const [p, s, pr, fs, std] = await Promise.all([getPendingPayments(), getFinanceDashboard(), getPrograms(), getFeeStructures(), getStudents()]);
        setPayments(p.data || []);
        setStats(s.data);
        setPrograms(pr.data || []);
        setFeeStructures(fs.data || []);
        setStudents(std.data || []);
      } else if (user?.student_id) {
        const { data } = await getStudentFees(user.student_id);
        setPayments(data || []);
      }
    } catch (err) {
      if (isFinance) toast.error('Failed to load finance data.');
    }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    try { await approvePayment(id); toast.success('Payment approved!'); load(); }
    catch (err) { toast.error(err?.response?.data?.error || 'Failed to approve.'); }
  };
  const handleReject = async (id) => {
    try { await rejectPayment(id); toast.success('Payment rejected.'); load(); }
    catch { toast.error('Failed to reject.'); }
  };
  const handleCreateFeeStructure = async (e) => {
    e.preventDefault();
    try { await createFeeStructure(feeForm); toast.success('Fee structure created!'); setShowFeeModal(false); setFeeForm({ program_id: '', semester: '', amount: '' }); load(); }
    catch (err) { toast.error(err?.response?.data?.error || 'Failed.'); }
  };
  const handleAssignFee = async (e) => {
    e.preventDefault();
    try { await assignStudentFee(assignForm); toast.success('Fee assigned!'); setShowAssignModal(false); setAssignForm({ student_id: '', semester: '' }); load(); }
    catch (err) { toast.error(err?.response?.data?.error || 'Failed to assign fee.'); }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Financial Center"
        subtitle="Manage fees, monitor transactions, and process payment verifications"
      />

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          <StatCard label="Total Revenue"     value={`PKR ${Number(stats.total_revenue || 0).toLocaleString()}`}         icon={TrendingUp}  bgClass="bg-emerald-50" colorClass="text-emerald-600" />
          <StatCard label="Pending"           value={stats.pending_payments}                                              icon={Clock}       bgClass="bg-amber-50"   colorClass="text-amber-600" />
          <StatCard label="Outstanding Fees"  value={`PKR ${Number(stats.total_outstanding_fees || 0).toLocaleString()}`} icon={DollarSign}  bgClass="bg-rose-50"    colorClass="text-rose-600" />
          <StatCard label="Monthly"           value={`PKR ${Number(stats.monthly_collection || 0).toLocaleString()}`}    icon={Users}       bgClass="bg-blue-50"    colorClass="text-blue-600" />
        </div>
      )}

      {/* Payments Table */}
      <SectionCard 
        title="Pending Verifications" 
        className="mb-7"
        actions={isFinance && (
          <button id="assign-fee-btn" onClick={() => setShowAssignModal(true)} className="btn btn-secondary shrink-0">
            <Users size={15} /> Assign Fee
          </button>
        )}
      >
        {loading ? <Spinner /> : (
          <TableWrapper>
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No.</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
                {isFinance && <th className="text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan={7}><EmptyState icon={DollarSign} title="No pending payments" subtitle="All payments have been processed." /></td></tr>
              ) : payments.map(p => (
                <tr key={p.payment_id}>
                  <td><span className="font-semibold text-slate-800">{p.students?.user_accounts?.username}</span></td>
                  <td><code className="text-xs font-mono text-slate-600">{p.students?.roll_number}</code></td>
                  <td><span className="font-bold text-slate-900">PKR {Number(p.amount).toLocaleString()}</span></td>
                  <td><span className="badge badge-gray">{p.method}</span></td>
                  <td><span className={`badge ${STATUS_BADGE[p.status] || 'badge-gray'}`}>{p.status}</span></td>
                  <td className="text-slate-400 text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
                  {isFinance && (
                    <td className="text-right">
                      {p.status === 'Pending' ? (
                        <div className="grid grid-cols-2 gap-2 w-full max-w-[200px] ml-auto">
                          <button id={`approve-${p.payment_id}`} onClick={() => handleApprove(p.payment_id)} className="btn bg-emerald-500 hover:bg-emerald-600 text-white w-full py-1.5 px-2 rounded-lg text-xs font-bold justify-center">
                            <CheckCircle size={13} /> Approve
                          </button>
                          <button id={`reject-${p.payment_id}`} onClick={() => handleReject(p.payment_id)} className="btn bg-rose-500 hover:bg-rose-600 text-white w-full py-1.5 px-2 rounded-lg text-xs font-bold justify-center">
                            <XCircle size={13} /> Reject
                          </button>
                        </div>
                      ) : <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Processed</span>}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </TableWrapper>
        )}
      </SectionCard>

      {/* Fee Structures */}
      {isFinance && (
        <SectionCard 
          title="Active Fee Structures"
          actions={
            <button id="add-fee-structure-btn" onClick={() => setShowFeeModal(true)} className="btn btn-primary shrink-0">
              <Plus size={15} /> Fee Structure
            </button>
          }
        >
          {loading ? <Spinner /> : (
            <TableWrapper>
              <thead>
                <tr>
                  <th>Program</th>
                  <th>Semester</th>
                  <th>Amount</th>
                  <th>Date Created</th>
                </tr>
              </thead>
              <tbody>
                {feeStructures.length === 0 ? (
                  <tr><td colSpan={4}><EmptyState icon={DollarSign} title="No fee structures found" /></td></tr>
                ) : feeStructures.map(fs => (
                  <tr key={fs.fee_structure_id}>
                    <td><span className="font-semibold text-slate-800">{fs.programs?.program_name}</span></td>
                    <td><span className="badge badge-gray">{fs.semester}</span></td>
                    <td><span className="font-bold text-slate-900">PKR {Number(fs.amount).toLocaleString()}</span></td>
                    <td className="text-slate-400 text-xs">{new Date(fs.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </TableWrapper>
          )}
        </SectionCard>
      )}

      {/* Fee Structure Modal */}
      {showFeeModal && (
        <Modal title="Create Fee Structure" onClose={() => setShowFeeModal(false)}>
          <form onSubmit={handleCreateFeeStructure} className="space-y-4">
            <FormField label="Program">
              <select className="form-input form-select" required value={feeForm.program_id} onChange={e => setFeeForm({ ...feeForm, program_id: e.target.value })}>
                <option value="">Select Program</option>
                {programs.map(p => <option key={p.program_id} value={p.program_id}>{p.program_name}</option>)}
              </select>
            </FormField>
            <FormField label="Semester">
              <input className="form-input" placeholder="e.g. Fall 2026" required value={feeForm.semester} onChange={e => setFeeForm({ ...feeForm, semester: e.target.value })} />
            </FormField>
            <FormField label="Amount (PKR)">
              <input type="number" className="form-input" placeholder="0" required value={feeForm.amount} onChange={e => setFeeForm({ ...feeForm, amount: e.target.value })} />
            </FormField>
            <ModalFooter onCancel={() => setShowFeeModal(false)} submitLabel="Create Structure" />
          </form>
        </Modal>
      )}

      {/* Assign Fee Modal */}
      {showAssignModal && (
        <Modal title="Assign Fee to Student" onClose={() => setShowAssignModal(false)}>
          <form onSubmit={handleAssignFee} className="space-y-4">
            <FormField label="Student">
              <select className="form-input form-select" required value={assignForm.student_id} onChange={e => setAssignForm({ ...assignForm, student_id: e.target.value })}>
                <option value="">Select Student</option>
                {students.map(s => <option key={s.student_id} value={s.student_id}>{s.user_accounts?.username} — {s.roll_number}</option>)}
              </select>
            </FormField>
            <FormField label="Semester">
              <input className="form-input" placeholder="e.g. Fall 2026" required value={assignForm.semester} onChange={e => setAssignForm({ ...assignForm, semester: e.target.value })} />
            </FormField>
            <ModalFooter onCancel={() => setShowAssignModal(false)} submitLabel="Assign Fee" />
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Finance;
