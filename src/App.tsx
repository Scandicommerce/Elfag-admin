import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './components/Auth/Signin'
import Register from './components/Auth/Signup'
import AdminDashboard from './components/Dashboard'
import './App.css'

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="loading">Loading...</div>
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />
}

// Public Route Component (redirect to dashboard if logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="loading">Loading...</div>
  }
  
  return user ? <Navigate to="/" /> : <>{children}</>
}

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <div className="app">
                <div className="auth-wrapper">
                  <Login onSuccess={() => {}} />
                  <p className="auth-switch">
                    Don't have an account?{' '}
                    <a href="/register" className="switch-button">
                      Register here
                    </a>
                  </p>
                </div>
              </div>
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <div className="app">
                <div className="auth-wrapper">
                  <Register onSuccess={() => {}} />
                  <p className="auth-switch">
                    Already have an account?{' '}
                    <a href="/login" className="switch-button">
                      Login here
                    </a>
                  </p>
                </div>
              </div>
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
