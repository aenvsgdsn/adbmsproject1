const supabase = require('../config/supabase');

// Get all hostels and rooms
const getHostels = async (req, res) => {
  const { data, error } = await supabase.from('hostels')
    .select('*, rooms(room_id, room_number, capacity, occupied)');
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

// Allocate Room (calls stored procedure)
const allocateRoom = async (req, res) => {
  const { student_id, room_id } = req.body;
  const admin_user_id = req.user.id;

  const { error } = await supabase.rpc('allocateroom', {
    p_student_id: student_id,
    p_room_id: room_id,
    p_admin_user_id: admin_user_id,
  });

  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ message: 'Room allocated successfully.' });
};

// Get student allotment
const getStudentAllotment = async (req, res) => {
  const { student_id } = req.params;
  const { data, error } = await supabase.from('hostel_allotments')
    .select('*, rooms(room_number, hostels(hostel_name))')
    .eq('student_id', student_id)
    .eq('status', 'Active')
    .single();
  if (error) return res.status(404).json({ allotment: null });
  return res.status(200).json(data);
};

// Vacate Room
const vacateRoom = async (req, res) => {
  const { allotment_id } = req.params;
  const { data: allotment } = await supabase.from('hostel_allotments')
    .select('room_id').eq('allotment_id', allotment_id).single();

  const { error } = await supabase.from('hostel_allotments')
    .update({ status: 'Vacated' }).eq('allotment_id', allotment_id);
  if (error) return res.status(500).json({ error: error.message });

  await supabase.from('rooms')
    .update({ occupied: supabase.sql`occupied - 1` }).eq('room_id', allotment.room_id);

  return res.status(200).json({ message: 'Room vacated successfully.' });
};

// Add Hostel
const addHostel = async (req, res) => {
  const { hostel_name, total_capacity } = req.body;
  const { data, error } = await supabase.from('hostels')
    .insert({ hostel_name, total_capacity }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
};

// Add Room to Hostel
const addRoom = async (req, res) => {
  const { hostel_id, room_number, capacity } = req.body;
  const { data, error } = await supabase.from('rooms')
    .insert({ hostel_id, room_number, capacity, occupied: 0 }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
};

module.exports = { getHostels, allocateRoom, getStudentAllotment, vacateRoom, addHostel, addRoom };
