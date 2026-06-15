const supabase = require('../config/supabase');

// Mark Attendance for a section
const markAttendance = async (req, res) => {
  try {
    const { section_id, date, records } = req.body;
    // records: [{ student_id, status }]

    if (!section_id || !date || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'section_id, date, and records array are required.' });
    }

    const rows = records.map(r => ({
      student_id: r.student_id,
      section_id,
      date,
      status: r.status,
    }));

    const { data, error } = await supabase.from('attendance_records')
      .upsert(rows, { onConflict: 'student_id,section_id,date' })
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: 'Attendance marked successfully.', data });
  } catch (err) {
    console.error('Attendance error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Get Attendance for a student in a section
const getStudentAttendance = async (req, res) => {
  const { student_id, section_id } = req.params;

  const { data, error } = await supabase.from('attendance_records')
    .select('*')
    .eq('student_id', student_id)
    .eq('section_id', section_id)
    .order('date', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  const total = data.length;
  const present = data.filter(r => r.status === 'Present').length;
  const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

  return res.status(200).json({ records: data, total, present, percentage: parseFloat(percentage) });
};

// Get all attendance for a section on a date
const getSectionAttendance = async (req, res) => {
  const { section_id, date } = req.params;
  const { data, error } = await supabase.from('attendance_records')
    .select('*, students(roll_number, user_accounts(username))')
    .eq('section_id', section_id)
    .eq('date', date);
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

module.exports = { markAttendance, getStudentAttendance, getSectionAttendance };
