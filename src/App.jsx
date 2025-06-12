import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import LoginForm from './components/LoginForm'
import Dashboard from './pages/Dashboard'
import CheckIn from './pages/CheckIn'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
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
  )
}

export default App