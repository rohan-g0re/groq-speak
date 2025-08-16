import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

interface UserProfile {
  username: string
  email: string
  full_name: string | null
  created_at: string
}

interface Subscription {
  status: string
  plan_name: string
  end_date: string
}

export function Dashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return

      try {
        // Fetch user profile
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('username, email, full_name, created_at')
          .eq('id', user.id)
          .single()

        if (profileData) {
          setProfile(profileData)
        }

        // Fetch subscription info
        const { data: subscriptionData } = await supabase
          .from('user_subscriptions')
          .select(`
            status,
            end_date,
            subscription_plans(name)
          `)
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single()

        if (subscriptionData) {
          setSubscription({
            status: subscriptionData.status,
            plan_name: subscriptionData.subscription_plans.name,
            end_date: subscriptionData.end_date
          })
        }

      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Welcome back, {profile?.username || 'User'}!
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Username:</span>
                    <p className="text-gray-900">{profile?.username}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email:</span>
                    <p className="text-gray-900">{profile?.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Member since:</span>
                    <p className="text-gray-900">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Subscription Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription</h2>
                {subscription ? (
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Plan:</span>
                      <p className="text-gray-900">{subscription.plan_name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        subscription.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subscription.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Expires:</span>
                      <p className="text-gray-900">
                        {new Date(subscription.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-500 mb-4">No active subscription</p>
                    <Link
                      to="/subscription"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                      Upgrade to Premium
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/"
                  className="bg-indigo-600 text-white p-4 rounded-lg text-center hover:bg-indigo-700 transition-colors"
                >
                  <h3 className="font-semibold">Dictionary</h3>
                  <p className="text-sm opacity-90">Look up words and definitions</p>
                </Link>
                <Link
                  to="/jokes"
                  className="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700 transition-colors"
                >
                  <h3 className="font-semibold">Jokes Generator</h3>
                  <p className="text-sm opacity-90">Generate funny jokes</p>
                </Link>
                <Link
                  to="/captions"
                  className="bg-purple-600 text-white p-4 rounded-lg text-center hover:bg-purple-700 transition-colors"
                >
                  <h3 className="font-semibold">Caption Generator</h3>
                  <p className="text-sm opacity-90">Create Instagram captions</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
