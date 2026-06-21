import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getHostels, addHostel, addRoom, allocateRoom, getStudentAllotment, vacateRoom, getStudents } from '../api';
import { Home, Plus, Users, Building2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader, SectionCard, TableWrapper, Modal, ModalFooter, FormField, EmptyState, Spinner } from '../components/UI';

const Hostel = () => {
  const { user } = useAuth();
  const isAdmin   = user?.role === 'Admin';
  const isStudent = user?.role === 'Student';

  const [hostels, setHostels] = useState([]);
  const [students, setStudents] = useState([]);
  const [myAllotment, setMyAllotment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hostels');
  const [showHostelModal, setShowHostelModal]     = useState(false);
  const [showRoomModal, setShowRoomModal]         = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [hostelForm, setHostelForm]               = useState({ hostel_name: '', total_capacity: 50 });
  const [roomForm, setRoomForm]                   = useState({ hostel_id: '', room_number: '', capacity: 2 });
  const [allocateForm, setAllocateForm]           = useState({ student_id: '', room_id: '' });
  const [saving, setSaving]                       = useState(false);

  const allRooms = hostels.flatMap(h => (h.rooms || []).map(r => ({ ...r, hostel_name: h.hostel_name })));

  const load = async () => {
    setLoading(true);
    try {
      const [hostelRes] = await Promise.all([getHostels()]);
      setHostels(hostelRes.data || []);
      if (isAdmin) {
        const stdRes = await getStudents();
        setStudents(stdRes.data || []);
      }
      if (isStudent && user?.student_id) {
        const allotRes = await getStudentAllotment(user.student_id);
        setMyAllotment(allotRes.data || null);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAddHostel = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await addHostel(hostelForm); toast.success('Hostel added!'); setShowHostelModal(false); setHostelForm({ hostel_name: '', total_capacity: 50 }); load(); }
    catch (err) { toast.error(err?.response?.data?.error || 'Failed to add hostel.'); }
    setSaving(false);
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await addRoom(roomForm); toast.success('Room added!'); setShowRoomModal(false); setRoomForm({ hostel_id: '', room_number: '', capacity: 2 }); load(); }
    catch (err) { toast.error(err?.response?.data?.error || 'Failed to add room.'); }
    setSaving(false);
  };

  const handleAllocate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await allocateRoom(allocateForm); toast.success('Room allocated!'); setShowAllocateModal(false); setAllocateForm({ student_id: '', room_id: '' }); load(); }
    catch (err) { toast.error(err?.response?.data?.error || 'Allocation failed. Room may be full or student already has a room.'); }
    setSaving(false);
  };

  const handleVacate = async (allotmentId) => {
    if (!window.confirm('Vacate this room?')) return;
    try { await vacateRoom(allotmentId); toast.success('Room vacated.'); load(); }
    catch (err) { toast.error(err?.response?.data?.error || 'Failed to vacate.'); }
  };

  const TAB_BTN = (tab, label, Icon) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${activeTab === tab ? 'text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
      style={activeTab === tab ? { background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(147,197,253,0.50)', boxShadow: '0 2px 8px rgba(37,99,235,0.10)' } : { border: '1px solid transparent' }}
    >
      <Icon size={15} />{label}
    </button>
  );

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Hostel & Housing"
        subtitle="Manage residential facilities, rooms, and student allotments"
      />

      {isStudent && (
        <div className="mb-8">
          {myAllotment ? (
            <div className="rounded-2xl p-6 relative overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', boxShadow: '0 8px 32px rgba(37,99,235,0.20)' }}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/30">
                    <Home size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight mb-1">{myAllotment.rooms?.hostels?.hostel_name}</h3>
                    <p className="text-blue-200 text-sm flex items-center gap-1.5"><MapPin size={14} /> Campus Main Site</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur px-5 py-3 rounded-xl border border-white/20">
                  <div className="text-center px-2">
                    <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">Room</p>
                    <p className="text-2xl font-bold">{myAllotment.rooms?.room_number}</p>
                  </div>
                  <div className="w-px h-10 bg-blue-300/30"></div>
                  <div className="text-center px-2">
                    <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">Status</p>
                    <span className="badge badge-green mt-0.5">{myAllotment.status}</span>
                  </div>
                </div>
              </div>
              <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex justify-end">
                 <button onClick={() => handleVacate(myAllotment.allotment_id)} className="btn bg-white/10 hover:bg-white/20 text-white border-white/20 btn-sm">
                   Request Evacuation
                 </button>
              </div>
            </div>
          ) : (
            <div className="card text-center py-12">
              <EmptyState icon={Home} title="No Housing Assigned" subtitle="You currently do not have a room assigned in any hostel." />
            </div>
          )}
        </div>
      )}

      {isAdmin && (
        <>
          <div className="card mb-7 p-4 bg-white rounded-2xl shadow-sm border border-zinc-100">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex gap-1.5 p-1.5 rounded-xl w-full md:w-fit overflow-x-auto" style={{ background: 'rgba(239,246,255,0.70)', border: '1px solid rgba(219,234,254,0.60)' }}>
                {TAB_BTN('hostels', `Overview (${hostels.length})`, Building2)}
                {TAB_BTN('rooms', `Room Directory (${allRooms.length})`, Home)}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button onClick={() => setShowAllocateModal(true)} className="btn btn-secondary w-full sm:w-auto"><Users size={15} /> Allocate</button>
                <button onClick={() => setShowRoomModal(true)} className="btn btn-secondary w-full sm:w-auto"><Plus size={15} /> Add Room</button>
                <button onClick={() => setShowHostelModal(true)} className="btn btn-primary shrink-0 w-full sm:w-auto"><Building2 size={15} /> Add Hostel</button>
              </div>
            </div>
          </div>

          {loading ? <Spinner /> : activeTab === 'hostels' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {hostels.length === 0 ? (
                <div className="col-span-full"><EmptyState icon={Building2} title="No hostels available" /></div>
              ) : hostels.map(h => {
                const totalRooms = (h.rooms || []).length;
                const occupied   = (h.rooms || []).reduce((a, r) => a + (r.occupied || 0), 0);
                const capacity   = (h.rooms || []).reduce((a, r) => a + (r.capacity || 0), 0);
                const percentage = capacity > 0 ? (occupied / capacity) * 100 : 0;
                
                return (
                  <div key={h.hostel_id} className="card p-0 flex flex-col group overflow-hidden">
                    <div className="h-32 bg-slate-100 flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(239,246,255,0.60), rgba(219,234,254,0.40))' }}>
                      <Building2 size={40} className="text-blue-300 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-5 flex-grow">
                      <h3 className="font-bold text-slate-800 text-base mb-1">{h.hostel_name}</h3>
                      <p className="text-xs text-slate-400 mb-5">{totalRooms} Rooms Available</p>
                      
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Occupancy</p>
                            <p className="text-lg font-bold text-slate-800 mt-0.5">{occupied} <span className="text-xs font-normal text-slate-400">/ {capacity}</span></p>
                          </div>
                          <span className={`text-xs font-bold ${percentage >= 100 ? 'text-red-500' : percentage > 80 ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div className={`h-full rounded-full ${percentage >= 100 ? 'bg-red-500' : percentage > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <SectionCard title="Room Directory">
              <TableWrapper>
                <thead>
                  <tr><th>Hostel</th><th>Room No.</th><th>Capacity</th><th>Occupied</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {allRooms.length === 0 ? (
                    <tr><td colSpan={5}><EmptyState icon={Home} title="No rooms found" /></td></tr>
                  ) : allRooms.map(r => (
                    <tr key={r.room_id}>
                      <td className="font-semibold text-slate-700">{r.hostel_name}</td>
                      <td><span className="badge badge-gray font-mono">Room {r.room_number}</span></td>
                      <td className="text-slate-600">{r.capacity}</td>
                      <td className="text-slate-600">{r.occupied}</td>
                      <td>
                        <span className={`badge ${r.occupied >= r.capacity ? 'badge-red' : r.occupied > 0 ? 'badge-yellow' : 'badge-green'}`}>
                          {r.occupied >= r.capacity ? 'Full' : r.occupied > 0 ? 'Partial' : 'Available'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TableWrapper>
            </SectionCard>
          )}
        </>
      )}

      {showHostelModal && (
        <Modal title="Add New Hostel" onClose={() => setShowHostelModal(false)}>
          <form onSubmit={handleAddHostel} className="space-y-4">
            <FormField label="Hostel Name">
              <input className="form-input" required placeholder="Boys Hostel Block A" value={hostelForm.hostel_name} onChange={e => setHostelForm({ ...hostelForm, hostel_name: e.target.value })} />
            </FormField>
            <FormField label="Approx. Total Capacity">
              <input type="number" className="form-input" min="1" required value={hostelForm.total_capacity} onChange={e => setHostelForm({ ...hostelForm, total_capacity: +e.target.value })} />
            </FormField>
            <ModalFooter onCancel={() => setShowHostelModal(false)} submitLabel="Add Hostel" loading={saving} icon={Building2} />
          </form>
        </Modal>
      )}

      {showRoomModal && (
        <Modal title="Add New Room" onClose={() => setShowRoomModal(false)}>
          <form onSubmit={handleAddRoom} className="space-y-4">
            <FormField label="Hostel">
              <select className="form-input form-select" required value={roomForm.hostel_id} onChange={e => setRoomForm({ ...roomForm, hostel_id: e.target.value })}>
                <option value="">Select Hostel</option>
                {hostels.map(h => <option key={h.hostel_id} value={h.hostel_id}>{h.hostel_name}</option>)}
              </select>
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Room Number">
                <input className="form-input" required placeholder="101" value={roomForm.room_number} onChange={e => setRoomForm({ ...roomForm, room_number: e.target.value })} />
              </FormField>
              <FormField label="Capacity">
                <input type="number" className="form-input" min="1" required value={roomForm.capacity} onChange={e => setRoomForm({ ...roomForm, capacity: +e.target.value })} />
              </FormField>
            </div>
            <ModalFooter onCancel={() => setShowRoomModal(false)} submitLabel="Add Room" loading={saving} icon={Plus} />
          </form>
        </Modal>
      )}

      {showAllocateModal && (
        <Modal title="Allocate Room to Student" onClose={() => setShowAllocateModal(false)}>
          <form onSubmit={handleAllocate} className="space-y-4">
            <FormField label="Student">
              <select className="form-input form-select" required value={allocateForm.student_id} onChange={e => setAllocateForm({ ...allocateForm, student_id: e.target.value })}>
                <option value="">Select Student</option>
                {students.map(s => <option key={s.student_id} value={s.student_id}>{s.user_accounts?.username} — {s.roll_number}</option>)}
              </select>
            </FormField>
            <FormField label="Available Room">
              <select className="form-input form-select" required value={allocateForm.room_id} onChange={e => setAllocateForm({ ...allocateForm, room_id: e.target.value })}>
                <option value="">Select Room</option>
                {allRooms.filter(r => r.occupied < r.capacity).map(r => (
                  <option key={r.room_id} value={r.room_id}>{r.hostel_name} — Room {r.room_number} ({r.capacity - r.occupied} spots left)</option>
                ))}
              </select>
            </FormField>
            <ModalFooter onCancel={() => setShowAllocateModal(false)} submitLabel="Allocate" loading={saving} icon={Home} />
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Hostel;
