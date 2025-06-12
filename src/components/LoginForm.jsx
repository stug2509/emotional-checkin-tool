import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setMessage('Please enter your email')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase().trim(),
        options: {
          emailRedirectTo: window.location.origin,
        },
      })

      if (error) throw error
      
      setMessage('Check your email for the login link!')
      setEmail('')
    } catch (error) {
      setMessage(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Emotional Check-In</h1>
          <p className="mt-2 text-gray-600">Track your emotional journey with clarity</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
              disabled={loading}
            />
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Sending...' : 'Send Login Link'}
          </button>
        </form>
        
        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm text-center ${
            message.includes('error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            {message}
          </div>
        )}
        
        <p className="mt-6 text-center text-xs text-gray-500">
          We'll send you a magic link to sign in. No password needed.
        </p>
      </div>
    </div>
  )
}