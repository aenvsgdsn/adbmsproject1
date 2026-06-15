const supabase = require('../config/supabase');

// Get all library items
const getBooks = async (req, res) => {
  const { data, error } = await supabase.from('library_items').select('*').order('title');
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

// Issue a Book (calls stored procedure)
const issueBook = async (req, res) => {
  const { book_id, user_id } = req.body;
  const admin_user_id = req.user.id;

  const { error } = await supabase.rpc('issuebook', {
    p_book_id: book_id,
    p_user_id: user_id,
    p_admin_user_id: admin_user_id,
  });

  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ message: 'Book issued successfully.' });
};

// Return a Book (calls stored procedure)
const returnBook = async (req, res) => {
  const { issue_id } = req.params;
  const admin_user_id = req.user.id;

  const { error } = await supabase.rpc('returnbook', {
    p_issue_id: issue_id,
    p_admin_user_id: admin_user_id,
  });

  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ message: 'Book returned successfully.' });
};

// Get user's issued books
const getUserBooks = async (req, res) => {
  const { user_id } = req.params;
  const { data, error } = await supabase.from('library_issues')
    .select('*, library_items(title, author)')
    .eq('user_id', user_id)
    .order('issue_date', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

// Add new book
const addBook = async (req, res) => {
  const { title, author, copies } = req.body;
  const { data, error } = await supabase.from('library_items')
    .insert({ title, author, copies, available: copies }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
};

module.exports = { getBooks, issueBook, returnBook, getUserBooks, addBook };
