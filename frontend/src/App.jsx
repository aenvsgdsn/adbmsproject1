import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Faculty from './pages/Faculty';
import Courses from './pages/Courses';
import Enrollments from './pages/Enrollments';
import Attendance from './pages/Attendance';
import Results from './pages/Results';
import Finance from './pages/Finance';
import LibraryPage from './pages/LibraryPage';
import Hostel from './pages/Hostel';
import AuditLogs from './pages/AuditLogs';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: '6px',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* Academic */}
            <Route path="students" element={
              <ProtectedRoute roles={['Admin', 'Faculty', 'Finance']}>
                <Students />
              </ProtectedRoute>
            } />
            <Route path="faculty" element={
              <ProtectedRoute roles={['Admin']}>
                <Faculty />
              </ProtectedRoute>
            } />
            <Route path="courses" element={<Courses />} />

            {/* Enrollment */}
            <Route path="enrollments" element={<Enrollments />} />

            {/* Attendance */}
            <Route path="attendance" element={<Attendance />} />

            {/* Results */}
            <Route path="results" element={<Results />} />

            {/* Finance */}
            <Route path="finance" element={
              <ProtectedRoute roles={['Admin', 'Finance', 'Student']}>
                <Finance />
              </ProtectedRoute>
            } />

            {/* Library */}
            <Route path="library" element={<LibraryPage />} />

            {/* Hostel */}
            <Route path="hostel" element={<Hostel />} />

            {/* Admin only */}
            <Route path="audit-logs" element={
              <ProtectedRoute roles={['Admin']}>
                <AuditLogs />
              </ProtectedRoute>
            } />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

