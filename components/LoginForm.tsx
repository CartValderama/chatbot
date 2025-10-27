'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        // Get the user from localStorage to check their type
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const user = JSON.parse(storedUser)
          // Redirect based on user type
          if (user.userType === 'Elder') {
            router.push('/chatbot')
          } else if (user.userType === 'Doctor') {
            router.push('/dashboard')
          } else {
            // Default fallback
            router.push('/dashboard')
          }
        } else {
          // Fallback if no user found
          router.push('/dashboard')
        }
      } else {
        setError('Invalid email or password. Please ensure password is at least 6 characters.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Medication Reminder
            </h2>
            <p className="text-gray-600">
              Sign in as a patient or healthcare provider
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 mb-3">Available Accounts:</p>

              <div className="mb-4">
                <p className="text-xs font-semibold text-indigo-600 mb-2">PATIENTS (directed to chatbot):</p>
                <div className="bg-indigo-50 rounded-lg p-3 text-sm text-gray-600 space-y-2">
                  <div>
                    <p className="font-semibold text-gray-800">Anna Hansen</p>
                    <p className="font-mono text-xs">anna.hansen@email.no</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Per Olsen</p>
                    <p className="font-mono text-xs">per.olsen@email.no</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Kari Larsen</p>
                    <p className="font-mono text-xs">kari.larsen@email.no</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-green-600 mb-2">DOCTORS/NURSES (directed to dashboard):</p>
                <div className="bg-green-50 rounded-lg p-3 text-sm text-gray-600 space-y-2">
                  <div>
                    <p className="font-semibold text-gray-800">Dr. Sarah Johnson</p>
                    <p className="font-mono text-xs">sarah.johnson@hospital.no</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Dr. Michael Chen</p>
                    <p className="font-mono text-xs">michael.chen@hospital.no</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Dr. Emma Wilson</p>
                    <p className="font-mono text-xs">emma.wilson@hospital.no</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-3">Any password works (min 6 characters)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}