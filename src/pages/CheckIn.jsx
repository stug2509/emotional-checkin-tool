import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { identifyEmotions } from '../lib/openai'

export default function CheckIn() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [checkInData, setCheckInData] = useState({
    feelingDescription: '',
    suggestedEmotions: [],
    selectedEmotions: [],
    reflection: ''
  })

  // Step 1: Describe feelings
  const handleFeelingSubmit = async (e) => {
    e.preventDefault()
    if (!checkInData.feelingDescription.trim()) return

    setLoading(true)
    try {
      const emotions = await identifyEmotions(checkInData.feelingDescription)
      setCheckInData(prev => ({ ...prev, suggestedEmotions: emotions }))
      setStep(2)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Select emotions
  const toggleEmotion = (emotion) => {
    setCheckInData(prev => {
      const isSelected = prev.selectedEmotions.some(e => e.name === emotion.name)
      return {
        ...prev,
        selectedEmotions: isSelected
          ? prev.selectedEmotions.filter(e => e.name !== emotion.name)
          : [...prev.selectedEmotions, emotion]
      }
    })
  }

  // Step 3: Save check-in
  const handleSaveCheckIn = async () => {
    if (checkInData.selectedEmotions.length === 0) return

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { error } = await supabase.from('checkins').insert({
        user_id: user.id,
        feeling_description: checkInData.feelingDescription,
        emotions: checkInData.selectedEmotions,
        reflection: checkInData.reflection
      })

      if (error) throw error
      navigate('/')
    } catch (error) {
      console.error('Error saving check-in:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {step} of 3</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Describe feelings */}
        {step === 1 && (
          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">How are you feeling right now?</h2>
            <p className="text-gray-600 mb-6">
              Take a moment to tune in. Describe what you're experiencing physically or emotionally.
            </p>
            <form onSubmit={handleFeelingSubmit}>
              <textarea
                value={checkInData.feelingDescription}
                onChange={(e) => setCheckInData(prev => ({ ...prev, feelingDescription: e.target.value }))}
                placeholder="I'm feeling... (e.g., tightness in my chest, restless, like I'm waiting for something)"
                className="input-field min-h-[120px] mb-4"
                required
              />
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Processing...' : 'Continue'}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Select emotions */}
        {step === 2 && (
          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">Which emotions resonate with you?</h2>
            <p className="text-gray-600 mb-6">
              Based on your description, here are some emotions you might be experiencing. Select all that feel true.
            </p>
            <div className="space-y-3 mb-6">
              {checkInData.suggestedEmotions.map((emotion) => {
                const isSelected = checkInData.selectedEmotions.some(e => e.name === emotion.name)
                return (
                  <button
                    key={emotion.name}
                    onClick={() => toggleEmotion(emotion)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      isSelected 
                        ? 'border-primary bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{emotion.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{emotion.definition}</p>
                      </div>
                      <span className="text-sm text-gray-500 ml-4">
                        Intensity: {emotion.intensity}/10
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setStep(1)} 
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button 
                onClick={() => setStep(3)} 
                disabled={checkInData.selectedEmotions.length === 0}
                className="btn-primary"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Reflection */}
        {step === 3 && (
          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">Take a moment to reflect</h2>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">You're feeling:</p>
              <div className="flex flex-wrap gap-2">
                {checkInData.selectedEmotions.map(emotion => (
                  <span key={emotion.name} className="px-3 py-1 bg-white rounded-full text-sm font-medium">
                    {emotion.name}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Would you like to add any thoughts or reflections about these feelings?
            </p>
            <textarea
              value={checkInData.reflection}
              onChange={(e) => setCheckInData(prev => ({ ...prev, reflection: e.target.value }))}
              placeholder="Any thoughts, patterns you notice, or things you want to remember... (optional)"
              className="input-field min-h-[100px] mb-6"
            />
            <div className="flex gap-3">
              <button 
                onClick={() => setStep(2)} 
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button 
                onClick={handleSaveCheckIn} 
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Saving...' : 'Complete Check-In'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}