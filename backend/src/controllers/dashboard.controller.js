const supabase = require('../config/supabase');

// Get notifications for logged-in user
const getNotifications = async (req, res) => {
  const { data, error } = await supabase.from('notifications')
    .select('*').eq('user_id', req.user.id).order('created_at', { ascending: false }).limit(50);
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

// Mark notification as read
const markRead = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('notifications')
    .update({ is_read: true }).eq('notification_id', id).eq('user_id', req.user.id);
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ message: 'Marked as read.' });
};

// Mark all as read
const markAllRead = async (req, res) => {
  const { error } = await supabase.from('notifications')
    .update({ is_read: true }).eq('user_id', req.user.id);
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ message: 'All notifications marked as read.' });
};

// Get Audit Logs (Admin only)
const getAuditLogs = async (req, res) => {
  const { table_name, limit = 100 } = req.query;
  let query = supabase.from('audit_logs').select('*, user_accounts(username)').order('created_at', { ascending: false }).limit(Number(limit));
  if (table_name) query = query.eq('table_name', table_name);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

// Get Admin Dashboard
const getAdminDashboard = async (req, res) => {
  const { data, error } = await supabase.from('vw_admin_dashboard').select('*').single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

// Get Student Dashboard
const getStudentDashboard = async (req, res) => {
  const { student_id } = req.params;
  const { data, error } = await supabase.from('vw_student_dashboard')
    .select('*').eq('student_id', student_id).single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

module.exports = { getNotifications, markRead, markAllRead, getAuditLogs, getAdminDashboard, getStudentDashboard };
