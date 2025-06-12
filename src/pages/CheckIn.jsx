import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { validateReflection } from '../utils/validation'
import EnhancedEmotionSelector from '../components/EnhancedEmotionSelector'
import GuidedReflection from '../components/GuidedReflection'

export default function CheckIn() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: emotions, 2: reflection, 3: summary
  const [loading, setLoading] = useState(false)
  const [checkInData, setCheckInData] = useState({
    selectedEmotions: [],
    reflectionData: null,
    quickNotes: ''
  })
  const [errors, setErrors] = useState({})

  // Handle emotion selection
  const handleEmotionSelect = (emotion) => {
    setCheckInData(prev => ({
      ...prev,
      selectedEmotions: [...prev.selectedEmotions, emotion]
    }))
  }

  // Handle reflection completion
  const handleReflectionComplete = (reflectionData) => {
    setCheckInData(prev => ({
      ...prev,
      reflectionData
    }))
    setStep(3)
  }

  // Remove emotion
  const removeEmotion = (emotionIndex) => {
    setCheckInData(prev => ({
      ...prev,
      selectedEmotions: prev.selectedEmotions.filter((_, index) => index !== emotionIndex)
    }))
  }

  // Save enhanced check-in
  const handleSaveCheckIn = async () => {
    if (checkInData.selectedEmotions.length === 0) return

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      // Prepare enhanced check-in data
      const checkInRecord = {
        user_id: user.id,
        emotions: checkInData.selectedEmotions,
        feeling_description: `Enhanced check-in with ${checkInData.selectedEmotions.length} emotions`,
        reflection: checkInData.quickNotes || '',
        // Store reflection data as metadata
        metadata: {
          reflectionData: checkInData.reflectionData,
          emotionCategories: [...new Set(checkInData.selectedEmotions.map(e => e.category))],
          avgIntensity: Math.round(
            checkInData.selectedEmotions.reduce((sum, e) => sum + e.intensity, 0) / 
            checkInData.selectedEmotions.length * 10
          ) / 10,
          enhancedVersion: true
        }
      }

      const { error } = await supabase.from('checkins').insert(checkInRecord)
      if (error) throw error
      
      navigate('/')
    } catch (error) {
      console.error('Error saving check-in:', error)
      setErrors({ save: 'Failed to save check-in. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Step {step} of 3: {
                step === 1 ? 'Select Emotions' :
                step === 2 ? 'Guided Reflection' : 'Review & Save'
              }
            </span>
            <button 
              onClick={() => navigate('/')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Enhanced Emotion Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <EnhancedEmotionSelector 
              onEmotionSelect={handleEmotionSelect}
              selectedEmotions={checkInData.selectedEmotions}
            />
            
            {checkInData.selectedEmotions.length > 0 && (
              <div className="card">
                <h4 className="font-semibold mb-4">Selected Emotions:</h4>
                <div className="space-y-3 mb-6">
                  {checkInData.selectedEmotions.map((emotion, index) => (
                    <div key={`${emotion.name}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{emotion.icon}</span>
                        <div>
                          <div className="font-medium">{emotion.name}</div>
                          <div className="text-sm text-gray-600">{emotion.category} • Intensity: {emotion.intensity}/10</div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeEmotion(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between">
                  <button
                    onClick={() => setCheckInData(prev => ({ ...prev, selectedEmotions: [] }))}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="btn-primary"
                  >
                    Continue to Reflection
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Guided Reflection */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <button 
                onClick={() => setStep(1)}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back to Emotions
              </button>
              <button 
                onClick={() => setStep(3)}
                className="text-blue-600 hover:text-blue-800 ml-auto"
              >
                Skip to Summary →
              </button>
            </div>
            
            <GuidedReflection 
              selectedEmotions={checkInData.selectedEmotions}
              onReflectionComplete={handleReflectionComplete}
            />
          </div>
        )}

        {/* Step 3: Summary & Save */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-2xl font-semibold mb-6">Check-In Summary</h2>
              
              {/* Emotions Summary */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Your Emotions ({checkInData.selectedEmotions.length})</h3>
                <div className="grid gap-3">
                  {checkInData.selectedEmotions.map((emotion, index) => (
                    <div key={`${emotion.name}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{emotion.icon}</span>
                        <div>
                          <div className="font-medium">{emotion.name}</div>
                          <div className="text-sm text-gray-600">
                            {emotion.category} • {emotion.subcategory} • Intensity: {emotion.intensity}/10
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-800">
                    <strong>Average Intensity:</strong> {
                      Math.round(checkInData.selectedEmotions.reduce((sum, e) => sum + e.intensity, 0) / 
                      checkInData.selectedEmotions.length * 10) / 10
                    }/10
                  </div>
                  <div className="text-sm text-blue-800">
                    <strong>Categories:</strong> {[...new Set(checkInData.selectedEmotions.map(e => e.category))].join(', ')}
                  </div>
                </div>
              </div>

              {/* Reflection Summary */}
              {checkInData.reflectionData && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Reflection Insights</h3>
                  <div className="text-sm text-gray-600 mb-2">
                    You answered {checkInData.reflectionData.responses.length} reflection prompts across different categories.
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-sm text-green-800">
                    Great job taking time for deeper reflection! This will help you build emotional awareness over time.
                  </div>
                </div>
              )}

              {/* Quick Notes */}
              <div className="mb-6">
                <label className="block font-semibold mb-2">Additional Notes (Optional)</label>
                <textarea
                  value={checkInData.quickNotes}
                  onChange={(e) => setCheckInData(prev => ({ ...prev, quickNotes: e.target.value }))}
                  placeholder="Any additional thoughts, context, or notes you'd like to remember..."
                  className="input-field min-h-[80px]"
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {checkInData.quickNotes.length}/500 characters
                </div>
              </div>

              {errors.save && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {errors.save}
                </div>
              )}

              <div className="flex gap-3">
                <button 
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back to Reflection
                </button>
                <button 
                  onClick={handleSaveCheckIn}
                  disabled={loading || checkInData.selectedEmotions.length === 0}
                  className="btn-primary flex-1"
                >
                  {loading ? 'Saving Check-In...' : 'Complete Check-In'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}