const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function seed() {
  console.log('Starting comprehensive database seeding...');
  const salt = await bcrypt.genSalt(10);
  const admin_hash = await bcrypt.hash('admin123', salt);
  const default_hash = await bcrypt.hash('password123', salt);

  // 1. Seed Users
  const users = [
    { username: 'System Admin', email: 'admin@hisup.edu', password_hash: admin_hash, role: 'Admin' },
    { username: 'Finance Officer', email: 'finance@hisup.edu', password_hash: default_hash, role: 'Finance' },
    { username: 'John Student', email: 'student@hisup.edu', password_hash: default_hash, role: 'Student' },
    { username: 'Alice Student', email: 'alice@hisup.edu', password_hash: default_hash, role: 'Student' },
    { username: 'Dr. Smith', email: 'faculty@hisup.edu', password_hash: default_hash, role: 'Faculty' },
    { username: 'Prof. Johnson', email: 'johnson@hisup.edu', password_hash: default_hash, role: 'Faculty' },
  ];

  console.log('Seeding user accounts...');
  for (const user of users) {
    await supabase.from('user_accounts').upsert(user, { onConflict: 'email' });
  }

  // Fetch users mapping
  const { data: dbUsers } = await supabase.from('user_accounts').select('id, email');
  const userMap = dbUsers.reduce((acc, u) => ({ ...acc, [u.email]: u.id }), {});

  // 2. Seed Departments
  const departments = [
    { department_name: 'Computer Science', department_code: 'CS' },
    { department_name: 'Electrical Engineering', department_code: 'EE' },
    { department_name: 'Business Administration', department_code: 'BBA' },
    { department_name: 'Mathematics', department_code: 'MATH' }
  ];
  
  console.log('Seeding departments...');
  for (const dept of departments) {
    await supabase.from('departments').upsert(dept, { onConflict: 'department_code' });
  }
  const { data: dbDepts } = await supabase.from('departments').select('department_id, department_code');
  const deptMap = dbDepts.reduce((acc, d) => ({ ...acc, [d.department_code]: d.department_id }), {});

  // 3. Seed Programs
  const programs = [
    { department_id: deptMap['CS'], program_name: 'BS Computer Science', program_code: 'BSCS', total_semesters: 8 },
    { department_id: deptMap['CS'], program_name: 'MS Computer Science', program_code: 'MSCS', total_semesters: 4 },
    { department_id: deptMap['EE'], program_name: 'BS Electrical Engineering', program_code: 'BSEE', total_semesters: 8 },
    { department_id: deptMap['BBA'], program_name: 'Bachelor of Business Admin', program_code: 'BBA', total_semesters: 8 },
    { department_id: deptMap['MATH'], program_name: 'BS Mathematics', program_code: 'BSMATH', total_semesters: 8 },
  ];

  console.log('Seeding programs...');
  for (const prog of programs) {
    await supabase.from('programs').upsert(prog, { onConflict: 'program_code' });
  }
  const { data: dbProgs } = await supabase.from('programs').select('program_id, program_code');
  const progMap = dbProgs.reduce((acc, p) => ({ ...acc, [p.program_code]: p.program_id }), {});

  // 4. Seed Courses
  const courses = [
    { course_code: 'CS101', course_name: 'Introduction to Programming', credit_hours: 3, department_id: deptMap['CS'] },
    { course_code: 'CS201', course_name: 'Data Structures', credit_hours: 4, department_id: deptMap['CS'] },
    { course_code: 'EE101', course_name: 'Circuit Analysis', credit_hours: 3, department_id: deptMap['EE'] },
    { course_code: 'MGT101', course_name: 'Principles of Management', credit_hours: 3, department_id: deptMap['BBA'] },
    { course_code: 'MATH101', course_name: 'Calculus I', credit_hours: 3, department_id: deptMap['MATH'] },
  ];

  console.log('Seeding courses...');
  for (const crs of courses) {
    await supabase.from('courses').upsert(crs, { onConflict: 'course_code' });
  }

  // 5. Seed Students
  console.log('Seeding students...');
  const students = [
    { roll_number: 'CS-2026-001', user_id: userMap['student@hisup.edu'], program_id: progMap['BSCS'], department_id: deptMap['CS'], cnic: '11111-1111111-1', phone: '03001111111' },
    { roll_number: 'EE-2026-001', user_id: userMap['alice@hisup.edu'], program_id: progMap['BSEE'], department_id: deptMap['EE'], cnic: '22222-2222222-2', phone: '03002222222' }
  ];
  for (const std of students) {
    await supabase.from('students').upsert(std, { onConflict: 'roll_number' });
  }

  // 6. Seed Faculty
  console.log('Seeding faculty...');
  const faculties = [
    { user_id: userMap['faculty@hisup.edu'], department_id: deptMap['CS'], designation: 'Associate Professor', hire_date: '2020-01-15' },
    { user_id: userMap['johnson@hisup.edu'], department_id: deptMap['BBA'], designation: 'Assistant Professor', hire_date: '2022-08-01' }
  ];
  for (const fac of faculties) {
    // Basic deduplication approach for seed
    const { data: existing } = await supabase.from('faculty').select('*').eq('user_id', fac.user_id).single();
    if (!existing) {
      await supabase.from('faculty').insert(fac);
    }
  }

  console.log('Seeding complete! Lots of dummy data has been added.');
}

seed();
