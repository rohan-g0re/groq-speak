import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireSubscription?: boolean
}

export function ProtectedRoute({ children, requireSubscription = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />
  }

  if (requireSubscription) {
    // TODO: Check subscription status
    // For now, allow access - we'll implement subscription checking later
    return <>{children}</>
  }

  return <>{children}</>
}
