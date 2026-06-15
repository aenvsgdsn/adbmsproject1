require('dotenv').config();
const supabase = require('./src/config/supabase');
const bcrypt = require('bcryptjs');

async function updatePasswords() {
  const accounts = [
    { email: 'student@hisup.edu', pass: 'student123' },
    { email: 'faculty@hisup.edu', pass: 'faculty123' },
    { email: 'finance@hisup.edu', pass: 'finance123' },
  ];

  for (const acc of accounts) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(acc.pass, salt);

    const { data, error } = await supabase
      .from('user_accounts')
      .update({ password_hash: hash })
      .eq('email', acc.email);

    if (error) {
      console.error(`❌ Failed to update ${acc.email}:`, error.message);
    } else {
      console.log(`✅ Successfully updated password for ${acc.email}`);
    }
  }
}

updatePasswords();
