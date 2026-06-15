import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getHostels, addHostel, addRoom, allocateRoom, getStudentAllotment, vacateRoom, getStudents } from '../api';
import { Home, Plus, X, Loader2, Users, Building2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const Modal = ({ title, onClose, children }) => (
  <div className="modal-backdrop animate-fade-in" onClick={onClose}>
    <div className="modal w-full max-w-lg animate-slide-up" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 font-outfit">{title}</h2>
        <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

const Hostel = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const isStudent = user?.role === 'Student';

  const [hostels, setHostels] = useState([]);
  const [students, setStudents] = useState([]);
  const [myAllotment, setMyAllotment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hostels');
  const [showHostelModal, setShowHostelModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [hostelForm, setHostelForm] = useState({ hostel_name: '', total_capacity: 50 });
  const [roomForm, setRoomForm] = useState({ hostel_id: '', room_number: '', capacity: 2 });
  const [allocateForm, setAllocateForm] = useState({ student_id: '', room_id: '' });
  const [saving, setSaving] = useState(false);

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
    } catch { }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAddHostel = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await addHostel(hostelForm);
      toast.success('Hostel added!');
      setShowHostelModal(false);
      setHostelForm({ hostel_name: '', total_capacity: 50 });
      load();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to add hostel.');
    }
    setSaving(false);
  };

  const handleAddRoom = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await addRoom(roomForm);
      toast.success('Room added!');
      setShowRoomModal(false);
      setRoomForm({ hostel_id: '', room_number: '', capacity: 2 });
      load();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to add room.');
    }
    setSaving(false);
  };

  const handleAllocate = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await allocateRoom(allocateForm);
      toast.success('Room allocated!');
      setShowAllocateModal(false);
      setAllocateForm({ student_id: '', room_id: '' });
      load();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Allocation failed. Room may be full or student already has a room.');
    }
    setSaving(false);
  };

  const handleVacate = async (allotmentId) => {
    if (!window.confirm('Vacate this room?')) return;
    try {
      await vacateRoom(allotmentId);
      toast.success('Room vacated.');
      load();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to vacate.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-outfit">Hostel & Housing</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage residential facilities, rooms, and student allotments.</p>
        </div>
        {isAdmin && (
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => setShowAllocateModal(true)} className="btn bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2">
              <Users size={16} /> Allocate Room
            </button>
            <button onClick={() => setShowRoomModal(true)} className="btn bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2">
              <Plus size={16} /> Add Room
            </button>
            <button onClick={() => setShowHostelModal(true)} className="btn btn-primary shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
              <Building2 size={16} /> Add Hostel
            </button>
          </div>
        )}
      </div>

      {/* Student: My Allotment */}
      {isStudent && (
        <div className="mb-8">
          {myAllotment ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden relative group">
              <div className="absolute inset-0 h-24 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <div className="relative p-6 pt-12 flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-white rounded-full p-2 shadow-lg z-10 -mt-6 md:mt-0 shrink-0">
                  <div className="w-full h-full bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <Home size={40} />
                  </div>
                </div>
                <div className="flex-grow text-center md:text-left z-10 pt-8 md:pt-0">
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{myAllotment.rooms?.hostels?.hostel_name}</h3>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><MapPin size={14} /> Campus Main Site</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 z-10 bg-slate-50 px-6 py-4 rounded-xl border border-slate-100 w-full md:w-auto">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Room</p>
                    <p className="text-2xl font-bold text-slate-900">{myAllotment.rooms?.room_number}</p>
                  </div>
                  <div className="w-px h-12 bg-slate-200"></div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</p>
                    <span className="inline-block mt-1 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">{myAllotment.status}</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
                 <button onClick={() => handleVacate(myAllotment.allotment_id)} className="px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 transition-colors shadow-sm">
                   Request Evacuation
                 </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home size={28} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">No Housing Assigned</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-6">You currently do not have a room assigned in any of the university hostels.</p>
              <button className="btn btn-primary">Apply for Housing</button>
            </div>
          )}
        </div>
      )}

      {/* Admin Tabs */}
      {isAdmin && (
        <>
          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-lg w-fit shadow-inner mb-8">
            <button onClick={() => setActiveTab('hostels')}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                activeTab === 'hostels' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}>
              <Building2 size={16} /> Hostels Overview ({hostels.length})
            </button>
            <button onClick={() => setActiveTab('rooms')}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                activeTab === 'rooms' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}>
              <Home size={16} /> Room Directory ({allRooms.length})
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>
          ) : activeTab === 'hostels' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {hostels.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-white rounded-xl border border-slate-200 border-dashed">
                  <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 font-medium">No hostels available.</p>
                </div>
              ) : hostels.map(h => {
                const totalRooms = (h.rooms || []).length;
                const occupied = (h.rooms || []).reduce((a, r) => a + (r.occupied || 0), 0);
                const capacity = (h.rooms || []).reduce((a, r) => a + (r.capacity || 0), 0);
                const percentage = capacity > 0 ? (occupied / capacity) * 100 : 0;
                
                return (
                  <div key={h.hostel_id} className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                    <div className="h-40 bg-slate-100 relative overflow-hidden shrink-0">
                      <img src="/images/hostel.png" alt="Fallback" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-bold text-white text-lg leading-tight mb-1">{h.hostel_name}</h3>
                        <p className="text-xs text-slate-300">{totalRooms} Rooms Available</p>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Occupancy</p>
                            <p className="text-xl font-bold text-slate-800 leading-none mt-1">{occupied} <span className="text-sm font-normal text-slate-400">/ {capacity}</span></p>
                          </div>
                          <span className={`text-xs font-bold ${percentage >= 100 ? 'text-red-500' : percentage > 80 ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className={`h-full rounded-full ${percentage >= 100 ? 'bg-red-500' : percentage > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-slide-up">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                      <th className="p-4">Hostel Name</th>
                      <th className="p-4">Room No.</th>
                      <th className="p-4">Capacity</th>
                      <th className="p-4">Occupied</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allRooms.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-12 text-slate-400 text-sm">No rooms found.</td></tr>
                    ) : allRooms.map(r => (
                      <tr key={r.room_id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 text-slate-700 font-medium">{r.hostel_name}</td>
                        <td className="p-4 font-bold text-slate-900">Room {r.room_number}</td>
                        <td className="p-4 text-slate-600">{r.capacity}</td>
                        <td className="p-4 text-slate-600">{r.occupied}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${r.occupied >= r.capacity ? 'bg-red-100 text-red-700' : r.occupied > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {r.occupied >= r.capacity ? 'Full' : r.occupied > 0 ? 'Partial' : 'Available'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showHostelModal && (
        <Modal title="Add New Hostel" onClose={() => setShowHostelModal(false)}>
          <form onSubmit={handleAddHostel} className="space-y-4">
            <div className="form-group">
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Hostel Name</label>
              <input className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required placeholder="Boys Hostel Block A"
                value={hostelForm.hostel_name} onChange={e => setHostelForm({ ...hostelForm, hostel_name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Total Capacity (approximate)</label>
              <input type="number" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" min="1" required
                value={hostelForm.total_capacity} onChange={e => setHostelForm({ ...hostelForm, total_capacity: +e.target.value })} />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
              <button type="button" onClick={() => setShowHostelModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Building2 size={16} />} Add Hostel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showRoomModal && (
        <Modal title="Add New Room" onClose={() => setShowRoomModal(false)}>
          <form onSubmit={handleAddRoom} className="space-y-4">
            <div className="form-group">
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Hostel</label>
              <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required value={roomForm.hostel_id}
                onChange={e => setRoomForm({ ...roomForm, hostel_id: e.target.value })}>
                <option value="">Select Hostel</option>
                {hostels.map(h => <option key={h.hostel_id} value={h.hostel_id}>{h.hostel_name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Room Number</label>
                <input className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required placeholder="101"
                  value={roomForm.room_number} onChange={e => setRoomForm({ ...roomForm, room_number: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Capacity</label>
                <input type="number" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" min="1" required
                  value={roomForm.capacity} onChange={e => setRoomForm({ ...roomForm, capacity: +e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
              <button type="button" onClick={() => setShowRoomModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Add Room
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showAllocateModal && (
        <Modal title="Allocate Room to Student" onClose={() => setShowAllocateModal(false)}>
          <form onSubmit={handleAllocate} className="space-y-4">
            <div className="form-group">
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Student</label>
              <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required value={allocateForm.student_id}
                onChange={e => setAllocateForm({ ...allocateForm, student_id: e.target.value })}>
                <option value="">Select Student</option>
                {students.map(s => <option key={s.student_id} value={s.student_id}>{s.user_accounts?.username} — {s.roll_number}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Available Room</label>
              <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required value={allocateForm.room_id}
                onChange={e => setAllocateForm({ ...allocateForm, room_id: e.target.value })}>
                <option value="">Select Room</option>
                {allRooms.filter(r => r.occupied < r.capacity).map(r => (
                  <option key={r.room_id} value={r.room_id}>
                    {r.hostel_name} — Room {r.room_number} ({r.capacity - r.occupied} spots left)
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
              <button type="button" onClick={() => setShowAllocateModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Home size={16} />} Allocate
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Hostel;
