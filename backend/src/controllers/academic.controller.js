const supabase = require('../config/supabase');

// --- DEPARTMENTS ---
const getDepartments = async (req, res) => {
  const { data, error } = await supabase.from('departments').select('*').order('department_name');
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

const createDepartment = async (req, res) => {
  const { department_name, department_code } = req.body;
  const { data, error } = await supabase.from('departments').insert({ department_name, department_code }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
};

// --- PROGRAMS ---
const getPrograms = async (req, res) => {
  const { data, error } = await supabase.from('programs').select('*, departments(department_name)').order('program_name');
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

const createProgram = async (req, res) => {
  const { department_id, program_name, program_code, total_semesters } = req.body;
  const { data, error } = await supabase.from('programs').insert({ department_id, program_name, program_code, total_semesters }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
};

// --- STUDENTS ---
const getStudents = async (req, res) => {
  const { data, error } = await supabase.from('students')
    .select('*, user_accounts(username, email), programs(program_name), departments(department_name)')
    .order('roll_number');
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

const getStudentById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('students')
    .select('*, user_accounts(username, email), programs(program_name), departments(department_name)')
    .eq('student_id', id)
    .single();
  if (error) return res.status(404).json({ error: 'Student not found.' });
  return res.status(200).json(data);
};

const createStudent = async (req, res) => {
  const { roll_number, user_id, program_id, department_id, cnic, phone } = req.body;
  const { data, error } = await supabase.from('students')
    .insert({ roll_number, user_id, program_id, department_id, cnic, phone })
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase.from('students').update(updates).eq('student_id', id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

// --- FACULTY ---
const getFaculty = async (req, res) => {
  const { data, error } = await supabase.from('faculty')
    .select('*, user_accounts(username, email), departments(department_name, department_code)');
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

const createFaculty = async (req, res) => {
  const { username, email, password, department_id, designation, hire_date } = req.body;
  if (!username || !email || !password || !department_id || !designation || !hire_date) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  // Create user account first
  const { data: newUser, error: userErr } = await supabase.from('user_accounts')
    .insert({ username, email: email.toLowerCase(), password_hash, role: 'Faculty' })
    .select().single();
  if (userErr) {
    if (userErr.code === '23505') return res.status(409).json({ error: 'Email already in use.' });
    return res.status(500).json({ error: userErr.message });
  }

  // Create faculty profile linked to user
  const { data, error } = await supabase.from('faculty')
    .insert({ user_id: newUser.id, department_id, designation, hire_date })
    .select('*, user_accounts(username, email), departments(department_name, department_code)').single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
};

// --- COURSES ---
const getCourses = async (req, res) => {
  const { data, error } = await supabase.from('courses')
    .select('*, departments(department_name)').order('course_code');
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

const createCourse = async (req, res) => {
  const { course_code, course_name, credit_hours, department_id } = req.body;
  const { data, error } = await supabase.from('courses')
    .insert({ course_code, course_name, credit_hours, department_id })
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
};

const updateCourse = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase.from('courses').update(updates).eq('course_id', id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('courses').delete().eq('course_id', id);
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ message: 'Course deleted successfully' });
};

// --- SECTIONS ---
const getSections = async (req, res) => {
  const { data, error } = await supabase.from('sections')
    .select('*, courses(course_name, course_code), faculty(user_accounts(username))');
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

const createSection = async (req, res) => {
  const { course_id, faculty_id, semester, capacity } = req.body;
  const { data, error } = await supabase.from('sections')
    .insert({ course_id, faculty_id, semester, capacity, available_seats: capacity })
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
};

const updateSection = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase.from('sections').update(updates).eq('section_id', id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

const deleteSection = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('sections').delete().eq('section_id', id);
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ message: 'Section deleted successfully' });
};

module.exports = {
  getDepartments, createDepartment,
  getPrograms, createProgram,
  getStudents, getStudentById, createStudent, updateStudent,
  getFaculty, createFaculty,
  getCourses, createCourse, updateCourse, deleteCourse,
  getSections, createSection, updateSection, deleteSection,
};
