import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { SignUpForm } from './components/auth/SignUpForm'
import { SignInForm } from './components/auth/SignInForm'
import { Dashboard } from './components/Dashboard'
import { DictionaryApp } from './components/DictionaryApp'
import { Navigation } from './components/Navigation'
import { JokesGenerator } from './components/JokesGenerator'
import { CaptionGenerator } from './components/CaptionGenerator'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<DictionaryApp />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/signin" element={<SignInForm />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/jokes" 
              element={
                <ProtectedRoute requireSubscription={true}>
                  <JokesGenerator />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/captions" 
              element={
                <ProtectedRoute requireSubscription={true}>
                  <CaptionGenerator />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
