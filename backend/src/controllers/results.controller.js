const supabase = require('../config/supabase');

// Upload/Update Grades for a student
const uploadGrades = async (req, res) => {
  try {
    const { student_id, section_id, marks } = req.body;

    if (!student_id || !section_id || marks === undefined) {
      return res.status(400).json({ error: 'student_id, section_id, and marks are required.' });
    }

    // Calculate grade and grade_points
    let grade, grade_points;
    if (marks >= 90) { grade = 'A+'; grade_points = 4.0; }
    else if (marks >= 85) { grade = 'A'; grade_points = 4.0; }
    else if (marks >= 80) { grade = 'A-'; grade_points = 3.7; }
    else if (marks >= 75) { grade = 'B+'; grade_points = 3.3; }
    else if (marks >= 70) { grade = 'B'; grade_points = 3.0; }
    else if (marks >= 65) { grade = 'B-'; grade_points = 2.7; }
    else if (marks >= 60) { grade = 'C+'; grade_points = 2.3; }
    else if (marks >= 55) { grade = 'C'; grade_points = 2.0; }
    else if (marks >= 50) { grade = 'C-'; grade_points = 1.7; }
    else { grade = 'F'; grade_points = 0.0; }

    const { data, error } = await supabase.from('grades')
      .upsert({ student_id, section_id, marks, grade, grade_points }, { onConflict: 'student_id,section_id' })
      .select().single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: 'Grade uploaded successfully.', data });
  } catch (err) {
    console.error('Upload grades error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Get Grades for a student
const getStudentGrades = async (req, res) => {
  const { student_id } = req.params;
  const { data, error } = await supabase.from('grades')
    .select('*, sections(semester, courses(course_name, course_code, credit_hours))')
    .eq('student_id', student_id);
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

// Get Results (GPA/CGPA) for a student
const getStudentResults = async (req, res) => {
  const { student_id } = req.params;
  const { data, error } = await supabase.from('results')
    .select('*')
    .eq('student_id', student_id)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

// Get grades for a section (faculty view)
const getSectionGrades = async (req, res) => {
  const { section_id } = req.params;
  const { data, error } = await supabase.from('grades')
    .select('*, students(roll_number, user_accounts(username))')
    .eq('section_id', section_id);
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

module.exports = { uploadGrades, getStudentGrades, getStudentResults, getSectionGrades };
