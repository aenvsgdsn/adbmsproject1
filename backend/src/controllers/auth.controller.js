const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/jwt');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const { data: user, error } = await supabase
      .from('user_accounts')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is deactivated. Contact admin.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    if (user.role === 'Student') {
      const { data: student } = await supabase.from('students').select('student_id').eq('user_id', user.id).single();
      if (student) userData.student_id = student.student_id;
    } else if (user.role === 'Faculty') {
      const { data: faculty } = await supabase.from('faculty').select('faculty_id').eq('user_id', user.id).single();
      if (faculty) userData.faculty_id = faculty.faculty_id;
    }

    const token = generateToken(userData);

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: userData,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const validRoles = ['Admin', 'Student', 'Faculty', 'Finance'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const { data, error } = await supabase
      .from('user_accounts')
      .insert({ username, email: email.toLowerCase(), password_hash, role })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Email or username already exists.' });
      }
      throw error;
    }

    return res.status(201).json({
      message: 'User created successfully.',
      user: { id: data.id, username: data.username, email: data.email, role: data.role },
    });
  } catch (err) {
    console.error('Create user error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

const getMe = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('user_accounts')
      .select('id, username, email, role, is_active, created_at')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const userData = { ...user };

    if (user.role === 'Student') {
      const { data: student } = await supabase.from('students').select('student_id').eq('user_id', user.id).single();
      if (student) userData.student_id = student.student_id;
    } else if (user.role === 'Faculty') {
      const { data: faculty } = await supabase.from('faculty').select('faculty_id').eq('user_id', user.id).single();
      if (faculty) userData.faculty_id = faculty.faculty_id;
    }

    return res.status(200).json({ user: userData });
  } catch (err) {
    console.error('Get me error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { login, createUser, getMe };
