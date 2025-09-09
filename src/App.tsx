import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SupabaseAuthProvider, useSupabaseAuth } from './contexts/SupabaseAuthContext';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import MFAPage from './pages/auth/MFAPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/students/StudentsPage';
import StudentForm from './components/forms/StudentForm';
import FacultyPage from './pages/faculty/FacultyPage';
import FacultyForm from './components/forms/FacultyForm';
import CoursesPage from './pages/courses/CoursesPage';
import CourseForm from './components/forms/CourseForm';
import DepartmentsPage from './pages/departments/DepartmentsPage';
import DepartmentForm from './components/forms/DepartmentForm';
import AttendancePage from './pages/attendance/AttendancePage';
import AttendanceForm from './components/forms/AttendanceForm';
import ExamsPage from './pages/exams/ExamsPage';
import ExamForm from './components/forms/ExamForm';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from './pages/settings/SettingsPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useSupabaseAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #e0e0e0',
          borderTop: '4px solid #1976d2',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '20px', color: '#666' }}>Loading S-ERP...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

// Main App Component
const AppContent: React.FC = () => {
  return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mfa" element={<MFAPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <StudentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/new"
          element={
            <ProtectedRoute>
              <StudentForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/:id"
          element={
            <ProtectedRoute>
              <StudentForm />
            </ProtectedRoute>
          }
        />
                        <Route
                  path="/students/:id/edit"
                  element={
                    <ProtectedRoute>
                      <StudentForm />
                    </ProtectedRoute>
                  }
                />
                {/* Faculty Routes */}
                <Route
                  path="/faculty"
                  element={
                    <ProtectedRoute>
                      <FacultyPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/faculty/new"
                  element={
                    <ProtectedRoute>
                      <FacultyForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/faculty/:id"
                  element={
                    <ProtectedRoute>
                      <FacultyForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/faculty/:id/edit"
                  element={
                    <ProtectedRoute>
                      <FacultyForm />
                    </ProtectedRoute>
                  }
                />
                {/* Course Routes */}
                <Route
                  path="/courses"
                  element={
                    <ProtectedRoute>
                      <CoursesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/new"
                  element={
                    <ProtectedRoute>
                      <CourseForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/:id"
                  element={
                    <ProtectedRoute>
                      <CourseForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/:id/edit"
                  element={
                    <ProtectedRoute>
                      <CourseForm />
                    </ProtectedRoute>
                  }
                />
                {/* Department Routes */}
                <Route
                  path="/departments"
                  element={
                    <ProtectedRoute>
                      <DepartmentsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/departments/new"
                  element={
                    <ProtectedRoute>
                      <DepartmentForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/departments/:id"
                  element={
                    <ProtectedRoute>
                      <DepartmentForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/departments/:id/edit"
                  element={
                    <ProtectedRoute>
                      <DepartmentForm />
                    </ProtectedRoute>
                  }
                />
                {/* Attendance Routes */}
                <Route
                  path="/attendance"
                  element={
                    <ProtectedRoute>
                      <AttendancePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/attendance/new"
                  element={
                    <ProtectedRoute>
                      <AttendanceForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/attendance/:id"
                  element={
                    <ProtectedRoute>
                      <AttendanceForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/attendance/:id/edit"
                  element={
                    <ProtectedRoute>
                      <AttendanceForm />
                    </ProtectedRoute>
                  }
                />
                {/* Exam Routes */}
                <Route
                  path="/exams"
                  element={
                    <ProtectedRoute>
                      <ExamsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/exams/new"
                  element={
                    <ProtectedRoute>
                      <ExamForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/exams/:id"
                  element={
                    <ProtectedRoute>
                      <ExamForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/exams/:id/edit"
                  element={
                    <ProtectedRoute>
                      <ExamForm />
                    </ProtectedRoute>
                  }
                />
                {/* Profile Routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                {/* Settings Routes */}
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
      </Routes>
  );
};

// App Component with Providers
const App: React.FC = () => {
  return (
    <SupabaseAuthProvider>
      <AppContent />
    </SupabaseAuthProvider>
  );
};

export default App;

