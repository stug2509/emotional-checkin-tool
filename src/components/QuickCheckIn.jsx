import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const QUICK_EMOTIONS = [
  { name: "Happy", color: "bg-yellow-100 text-yellow-800", emoji: "😊" },
  { name: "Calm", color: "bg-blue-100 text-blue-800", emoji: "😌" },
  { name: "Anxious", color: "bg-orange-100 text-orange-800", emoji: "😰" },
  { name: "Tired", color: "bg-gray-100 text-gray-800", emoji: "😴" },
  { name: "Excited", color: "bg-green-100 text-green-800", emoji: "🤗" },
  { name: "Sad", color: "bg-purple-100 text-purple-800", emoji: "😢" },
  { name: "Frustrated", color: "bg-red-100 text-red-800", emoji: "😤" },
  { name: "Content", color: "bg-emerald-100 text-emerald-800", emoji: "☺️" }
]

export default function QuickCheckIn({ onComplete }) {
  const navigate = useNavigate()
  const [selectedEmotion, setSelectedEmotion] = useState(null)
  const [showIntensityModal, setShowIntensityModal] = useState(false)
  const [selectedIntensity, setSelectedIntensity] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion)
    setShowIntensityModal(true)
  }

  const handleIntensitySelect = async (intensity) => {
    setSelectedIntensity(intensity)
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { error } = await supabase.from('checkins').insert({
        user_id: user.id,
        feeling_description: `Quick check-in: feeling ${selectedEmotion.name.toLowerCase()}`,
        emotions: [{ 
          name: selectedEmotion.name, 
          definition: `Quick emotion: ${selectedEmotion.name.toLowerCase()}`,
          intensity: intensity,
          category: 'Quick Check-in',
          subcategory: 'Quick Check-in'
        }],
        reflection: '',
        metadata: {
          quickCheckIn: true,
          timestamp: new Date().toISOString()
        }
      })

      if (error) throw error
      
      // Close modal and show success
      setShowIntensityModal(false)
      setShowSuccess(true)
      
      // Call onComplete callback to refresh data
      if (onComplete) onComplete()
      
      // Hide success message after 2 seconds
      setTimeout(() => {
        setShowSuccess(false)
        setSelectedEmotion(null)
        setSelectedIntensity(null)
        setLoading(false)
      }, 2000)

    } catch (error) {
      console.error('Error saving quick check-in:', error)
      setShowIntensityModal(false)
      setSelectedEmotion(null)
      setSelectedIntensity(null)
      setLoading(false)
    }
  }

  const closeModal = () => {
    setShowIntensityModal(false)
    setSelectedEmotion(null)
    setSelectedIntensity(null)
  }

  return (
    <>
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Quick Check-In</h3>
          <button 
            onClick={() => navigate('/checkin')}
            className="text-sm text-primary hover:underline"
          >
            Full Check-In
          </button>
        </div>
        
        <p className="text-gray-600 mb-4 text-sm">
          How are you feeling right now? Tap an emotion for a quick check-in.
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {QUICK_EMOTIONS.map((emotion) => (
            <button
              key={emotion.name}
              onClick={() => handleEmotionSelect(emotion)}
              disabled={loading}
              className={`p-3 rounded-lg text-sm font-medium transition-all hover:scale-105 hover:shadow-md ${emotion.color} ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="text-center">
                <div className="text-lg mb-1">{emotion.emoji}</div>
                <div className="font-medium">{emotion.name}</div>
              </div>
            </button>
          ))}
        </div>
        
        {showSuccess && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm text-center">
            ✅ Check-in saved! Feeling {selectedEmotion?.name.toLowerCase()} at intensity {selectedIntensity}/10.
          </div>
        )}
      </div>

      {/* Intensity Rating Modal */}
      {showIntensityModal && selectedEmotion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">{selectedEmotion.emoji}</div>
              <h3 className="text-lg font-semibold mb-2">Rate your {selectedEmotion.name.toLowerCase()}</h3>
              <p className="text-sm text-gray-600">
                How intensely are you feeling this emotion right now?
              </p>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(intensity => (
                <button
                  key={intensity}
                  onClick={() => handleIntensitySelect(intensity)}
                  disabled={loading}
                  className={`p-3 rounded-lg border-2 transition-all text-center font-medium hover:bg-blue-50 hover:border-blue-300 ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'border-gray-200'
                  }`}
                >
                  <div className="text-lg font-bold">{intensity}</div>
                  <div className="text-xs text-gray-500">
                    {intensity <= 3 ? 'Mild' : intensity <= 6 ? 'Moderate' : intensity <= 8 ? 'Strong' : 'Intense'}
                  </div>
                </button>
              ))}
            </div>

            <div className="text-xs text-gray-600 mb-4 text-center">
              <div className="grid grid-cols-4 gap-2">
                <div><strong>1-3:</strong> Mild</div>
                <div><strong>4-6:</strong> Moderate</div>
                <div><strong>7-8:</strong> Strong</div>
                <div><strong>9-10:</strong> Intense</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
            
            {loading && (
              <div className="mt-4 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-sm text-gray-600">Saving...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}