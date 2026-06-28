# HiSUP 2.0 — University ERP System

## Overview
HiSUP 2.0 is a university enterprise resource planning (ERP) system built as a React frontend and Node.js/Express backend. The backend is powered by Supabase for PostgreSQL storage and authentication. The system supports academic management, enrollments, attendance, results, finance, library, hostel, and dashboard reporting.

## Project Structure

- `backend/`
  - `src/app.js` — Express server setup and API route registration.
  - `src/config/supabase.js` — Supabase client initialization using environment variables.
  - `src/config/jwt.js` — JWT generation and verification configuration.
  - `src/routes/` — Route definitions for each module.
  - `src/controllers/` — Controller logic that maps HTTP routes to Supabase database operations.
  - `src/middlewares/auth.middleware.js` — JWT authentication and role-based authorization.
  - `db/` — SQL schema and stored procedures for database objects.
  - `seed.js` — Supabase seeding script to populate initial data.
  - `fix_schema.js` — Schema fixes / migrations for existing tables.

- `frontend/`
  - `src/App.jsx` — Main React router with public and protected routes.
  - `src/api/index.js` — Axios API client for the backend.
  - `src/context/AuthContext.jsx` — Authentication state and user persistence.
  - `src/components/` — Layout, protected route wrapper, sidebar, topbar, and UI helpers.
  - `src/pages/` — Application screens such as Dashboard, Students, Finance, Library, Hostel, etc.

## Backend Architecture

### Server Setup
- `backend/src/app.js` initializes Express.
- Enables `cors`, JSON body parsing, and URL-encoded body parsing.
- Registers route groups under `/api/*`.
- Includes a health check endpoint at `/api/health`.
- Includes 404 and global error handling.

### Authentication
- `backend/src/routes/auth.routes.js` exposes:
  - `POST /api/auth/login` — login and JWT issuance.
  - `POST /api/auth/register` — create a new user (Admin only).
  - `GET /api/auth/me` — fetch current authenticated user.
- `backend/src/controllers/auth.controller.js` uses Supabase to read `user_accounts` and validate passwords with `bcryptjs`.
- JWT token is generated using `backend/src/config/jwt.js` and stored by the client in `localStorage`.

### Supabase / Database Connection
- `backend/src/config/supabase.js` uses `@supabase/supabase-js` to connect to the database.
- It reads `SUPABASE_URL` and `SUPABASE_KEY` from `.env`.
- All controllers use this client to query tables and call Supabase RPC functions.

## Database Schema

### Key Data Models
- `user_accounts` — core users with roles: `Admin`, `Student`, `Faculty`, `Finance`.
- `departments` — academic departments.
- `programs` — degree programs linked to departments.
- `students` — student profiles linked to `user_accounts`, program, department.
- `faculty` — faculty profiles linked to `user_accounts` and department.
- `courses` — course definitions linked to departments.
- `sections` — course offerings taught by faculty, with capacity and available seats.
- `enrollments` — student enrollment records for sections.
- `attendance_records` — attendance per student, section, and date.
- `grades` and `results` — grade entries and term-level result summaries.
- `fee_structures`, `student_fees`, `fee_payments` — finance module tables.
- `library_items`, `library_issues` — book inventory and issue records.
- `hostels`, `rooms`, `hostel_allotments` — hostel assignment and room tracking.
- `notifications`, `audit_logs` — notification feeds and action audit trails.

### Stored Procedures and Views
- Enrollment, library issue/return, payment approval, and room allocation use Supabase RPC calls.
- Example procedures referenced in controllers:
  - `enrollstudentincourse`
  - `approvepayment`
  - `issuebook`
  - `returnbook`
  - `allocateroom`
- Dashboard controllers read materialized or view-based data like `vw_admin_dashboard`, `vw_student_dashboard`, `vw_faculty_dashboard`, and `vw_finance_dashboard`.

## API Flow and Query Connections

### Frontend API Client
- `frontend/src/api/index.js` creates an Axios instance with `baseURL` from environment.
- Intercepts requests to attach `Authorization: Bearer <token>` from `localStorage`.
- Intercepts responses to handle `401 Unauthorized` by clearing auth state and redirecting to `/login`.
- Exports functions grouped by feature area:
  - Auth: `loginUser`, `getMe`, `registerUser`
  - Academic: departments, programs, students, faculty, courses, sections
  - Enrollments, attendance, results, finance, library, hostel, dashboard

### Academic Management
- Department, program, course, section, student and faculty endpoints are protected with JWT authentication.
- Admin-only actions include creation of departments, programs, students, faculty records, and some course/section actions.
- Many queries use Supabase relational selects to return joined data, for example:
  - `students` returns user account and program/department metadata.
  - `sections` return course and faculty information.

### Enrollment Workflow
- Student enrollment is handled by `POST /api/enrollments`.
- Backend calls `supabase.rpc('enrollstudentincourse', ...)` to validate seat availability and create enrollment.
- When a student withdraws, enrollment status is updated and section seat availability is restored.

### Attendance Workflow
- `POST /api/attendance` inserts or updates attendance records using `upsert`.
- Student attendance queries return a record list and compute attendance percentage.
- Section attendance queries support filtering by section and date.

### Results Workflow
- Grades are uploaded through `POST /api/results/grades`.
- Student results are fetched from `GET /api/results/results/student/:id` and grade summaries per section from `GET /api/results/grades/section/:id`.

### Finance Workflow
- `GET /api/finance/student/:id/fees` fetches student fee status.
- Payments are submitted with `POST /api/finance/payment` and verified by finance users through `PUT /api/finance/payment/:id/approve` or rejected via `PUT /api/finance/payment/:id/reject`.
- Fee structures can be created and assigned to students.
- `GET /api/finance/dashboard` returns summary analytics.

### Library Workflow
- Book inventory is retrieved from `GET /api/library`.
- Books are issued via `POST /api/library/issue` and returned via `PUT /api/library/return/:id`.
- User-specific issued books are returned with `GET /api/library/user/:userId`.

### Hostel Workflow
- Hostels and rooms are managed with `GET /api/hostel`, `POST /api/hostel/add`, and `POST /api/hostel/rooms/add`.
- Room allocation uses `POST /api/hostel/allocate`.
- Student allotment status is fetched with `GET /api/hostel/student/:id`.
- Vacating a room updates allotment status and decrements room occupancy.

### Dashboard and Notifications
- Admin, student, and faculty dashboard endpoints return role-specific summary data.
- Notifications are fetched and marked read by API endpoints.
- Audit logs are available to Admin users.

## Frontend Application Behavior

### Routing
- Public routes: `/`, `/login`, `/unauthorized`.
- Protected routes are wrapped by `ProtectedRoute` and require a valid JWT.
- Role-based access control is implemented at route level for pages such as `Faculty`, `Finance`, and `Audit Logs`.

### Auth State
- `AuthContext` stores the authenticated user and token.
- Login stores `hisup_token` and `hisup_user` in `localStorage`.
- API requests attach the JWT automatically.
- Unauthorized responses clear local state and redirect to `/login`.

### UI Pages
- `Dashboard` shows analytics and summaries for the current role.
- `Students`, `Faculty`, `Courses`, `Enrollments`, `Attendance`, `Results`, `Finance`, `Library`, and `Hostel` pages connect to backend APIs through the shared `api/index.js` client.
- `AuditLogs` is restricted to Admin and reads the audit history.

## Setup and Run Instructions

### Backend
1. Copy `.env.example` to `.env` and set:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `FRONTEND_URL`
   - `JWT_SECRET`
   - `PORT`
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Start the backend:
   ```bash
   npm run dev
   ```

### Frontend
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the frontend:
   ```bash
   npm run dev
   ```
3. Open the Vite URL shown in the terminal.

## Data Flow Summary

- User logs in from the frontend.
- Frontend stores JWT and attaches it to each API call.
- Backend authenticates requests, then runs Supabase queries or RPC functions.
- Data updates travel through Supabase tables and stored procedures.
- Results are returned to the frontend, which renders pages and tables.

## Notes
- The system uses Supabase as a Postgres-compatible backend with RPC support.
- `backend/seed.js` and `backend/fix_schema.js` help bootstrap or repair the database.
- Most business rules are enforced in the backend controllers and Supabase stored procedures.
- Role checks are enforced in routes and via the `authorize` middleware.

## Recommended Improvements
- Add detailed `.env.example` and schema documentation for deployment.
- Add end-to-end tests for route authorization, student enrollment, and payments.
- Document Supabase RPC procedures and views in `db/` or a separate developer guide.
- Add user-friendly error handling in the frontend pages.
