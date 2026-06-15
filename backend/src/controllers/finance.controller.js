const supabase = require('../config/supabase');

// Get Student Fee Status
const getStudentFees = async (req, res) => {
  const { student_id } = req.params;
  const { data, error } = await supabase.from('student_fees')
    .select('*').eq('student_id', student_id).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

// Submit Payment Proof (Student)
const submitPayment = async (req, res) => {
  try {
    const { student_id, student_fee_id, amount, method } = req.body;
    const proof_url = req.file ? req.file.path : req.body.proof_url;

    const { data, error } = await supabase.from('fee_payments')
      .insert({ student_id, student_fee_id, amount, method, proof_url, status: 'Pending' })
      .select().single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ message: 'Payment submitted. Awaiting verification.', data });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Approve Payment (Finance)
const approvePayment = async (req, res) => {
  try {
    const { payment_id } = req.params;
    const user_id = req.user.id;

    const { error } = await supabase.rpc('approvepayment', {
      p_payment_id: payment_id,
      p_user_id: user_id,
    });

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ message: 'Payment approved and receipt generated.' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Reject Payment
const rejectPayment = async (req, res) => {
  const { payment_id } = req.params;
  const { error } = await supabase.from('fee_payments')
    .update({ status: 'Rejected' }).eq('payment_id', payment_id);
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ message: 'Payment rejected.' });
};

// Get All Pending Payments (Finance Dashboard)
const getPendingPayments = async (req, res) => {
  const { data, error } = await supabase.from('fee_payments')
    .select('*, students(roll_number, user_accounts(username))')
    .eq('status', 'Pending').order('created_at', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

// Get Finance Dashboard Stats
const getFinanceDashboard = async (req, res) => {
  const { data, error } = await supabase.from('vw_finance_dashboard').select('*').single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

// Create Fee Structure
const createFeeStructure = async (req, res) => {
  const { program_id, semester, amount } = req.body;
  const { data, error } = await supabase.from('fee_structures')
    .insert({ program_id, semester, amount }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
};

// Get All Fee Structures
const getFeeStructures = async (req, res) => {
  const { data, error } = await supabase.from('fee_structures')
    .select('*, programs(program_name, department_id, departments(department_name))')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
};

// Assign Fee to Student for a Semester
const assignStudentFee = async (req, res) => {
  const { student_id, semester } = req.body;

  // Get fee structure from student's program
  const { data: student } = await supabase.from('students').select('program_id').eq('student_id', student_id).single();
  const { data: structure } = await supabase.from('fee_structures')
    .select('amount').eq('program_id', student.program_id).eq('semester', semester).single();

  if (!structure) return res.status(404).json({ error: 'Fee structure not found for this program/semester.' });

  const { data, error } = await supabase.from('student_fees')
    .insert({ student_id, semester, total_amount: structure.amount, remaining: structure.amount })
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
};

module.exports = {
  getStudentFees, submitPayment, approvePayment, rejectPayment,
  getPendingPayments, getFinanceDashboard, createFeeStructure, getFeeStructures, assignStudentFee
};
