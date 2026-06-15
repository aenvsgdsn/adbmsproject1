const supabase = require('../config/supabase');

// Enroll Student in Course (calls the stored procedure)
const enrollStudent = async (req, res) => {
  try {
    const { student_id, section_id } = req.body;
    const user_id = req.user.id;

    if (!student_id || !section_id) {
      return res.status(400).json({ error: 'student_id and section_id are required.' });
    }

    // Call the stored procedure
    const { error } = await supabase.rpc('enrollstudentincourse', {
      p_student_id: student_id,
      p_section_id: section_id,
      p_user_id: user_id,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({ message: 'Successfully enrolled in the course.' });
  } catch (err) {
    console.error('Enrollment error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Get Enrollments for a Student
const getStudentEnrollments = async (req, res) => {
  const { student_id } = req.params;
  const { data, error } = await supabase.from('enrollments')
    .select('*, sections(semester, capacity, available_seats, courses(course_name, course_code, credit_hours), faculty(user_accounts(username)))')
    .eq('student_id', student_id);
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

// Get all Enrollments for a Section
const getSectionEnrollments = async (req, res) => {
  const { section_id } = req.params;
  const { data, error } = await supabase.from('enrollments')
    .select('*, students(roll_number, user_accounts(username))')
    .eq('section_id', section_id);
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

// Withdraw from Course
const withdrawEnrollment = async (req, res) => {
  const { enrollment_id } = req.params;
  const { data: enrollment, error: fetchErr } = await supabase
    .from('enrollments').select('section_id, status').eq('enrollment_id', enrollment_id).single();
  if (fetchErr) return res.status(404).json({ error: 'Enrollment not found.' });
  if (enrollment.status === 'Withdrawn') return res.status(400).json({ error: 'Already withdrawn.' });

  const { error: updateErr } = await supabase.from('enrollments')
    .update({ status: 'Withdrawn' }).eq('enrollment_id', enrollment_id);
  if (updateErr) return res.status(500).json({ error: updateErr.message });

  // Re-increase available seats
  const { data: section } = await supabase.from('sections').select('available_seats, capacity').eq('section_id', enrollment.section_id).single();
  if (section) {
    const newSeats = Math.min(section.available_seats + 1, section.capacity);
    await supabase.from('sections').update({ available_seats: newSeats }).eq('section_id', enrollment.section_id);
  }

  return res.status(200).json({ message: 'Enrollment withdrawn successfully.' });
};

module.exports = { enrollStudent, getStudentEnrollments, getSectionEnrollments, withdrawEnrollment };
