import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'
import EmotionTrends from '../components/EmotionTrends'
import QuickCheckIn from '../components/QuickCheckIn'

export default function Dashboard() {
  const navigate = useNavigate()
  const [checkIns, setCheckIns] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('trends') // 'trends' or 'history'

  useEffect(() => {
    fetchCheckIns()
  }, [])

  const fetchCheckIns = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('checkins')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCheckIns(data || [])
    } catch (error) {
      console.error('Error fetching check-ins:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading your emotional journey...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Emotional Check-In</h1>
          <button 
            onClick={handleSignOut}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Quick Check-In */}
        <div className="mb-8">
          <QuickCheckIn onComplete={fetchCheckIns} />
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('trends')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'trends'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Trends & Insights
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Check-In History
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'trends' ? (
          <EmotionTrends checkIns={checkIns} />
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Your Check-In History</h2>
          
          {checkIns.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500 mb-4">No check-ins yet. Start your emotional journey today!</p>
              <button 
                onClick={() => navigate('/checkin')}
                className="text-primary hover:underline"
              >
                Create your first check-in
              </button>
            </div>
          ) : (
            checkIns.map((checkIn) => (
              <div key={checkIn.id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <time className="text-sm text-gray-500">
                    {format(new Date(checkIn.created_at), 'PPP p')}
                  </time>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {checkIn.emotions.map((emotion, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {emotion.name} ({emotion.intensity}/10)
                    </span>
                  ))}
                </div>
                
                {checkIn.feeling_description && (
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Felt like:</span> {checkIn.feeling_description}
                  </p>
                )}
                
                {checkIn.reflection && (
                  <p className="text-gray-600 italic">
                    "{checkIn.reflection}"
                  </p>
                )}
              </div>
            ))
          )}
          </div>
        )}
      </main>
    </div>
  )
}