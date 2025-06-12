import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import LoginForm from './components/LoginForm'
import Dashboard from './pages/Dashboard'
import CheckIn from './pages/CheckIn'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Handle auth callback from magic link
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (data?.session) {
        console.log('User logged in:', data.session.user)
        setSession(data.session)
      }
      if (error) {
        console.error('Auth error:', error)
      }
      setLoading(false)
    }

    handleAuthCallback()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      setSession(session)
      
      // Clear URL hash after successful auth
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={!session ? <LoginForm /> : <Navigate to="/" />} 
          />
          <Route
            path="/"
            element={session ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/checkin"
            element={session ? <CheckIn /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App