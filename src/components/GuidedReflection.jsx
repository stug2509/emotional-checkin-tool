import { useState } from 'react'

const REFLECTION_PROMPTS = {
  trigger: [
    "What specific event or situation triggered this emotion?",
    "Was there a particular moment when you first noticed this feeling?",
    "What was happening in your environment when this emotion arose?",
    "Who was present or involved in the situation?",
    "What thoughts were going through your mind just before you felt this way?"
  ],
  
  context: [
    "How long have you been feeling this way?",
    "Is this a familiar emotion for you in similar situations?",
    "What time of day is it, and how might that be affecting your emotions?",
    "How is your physical health today (sleep, food, exercise)?",
    "What other stresses or pressures are you dealing with right now?"
  ],
  
  physical: [
    "Where do you feel this emotion in your body?",
    "What physical sensations are you noticing?",
    "How is this emotion affecting your posture or movement?",
    "Are you feeling tense, relaxed, energized, or drained?",
    "What would feel good for your body right now?"
  ],
  
  thoughts: [
    "What thoughts keep coming up as you feel this emotion?",
    "Are these thoughts helpful or unhelpful right now?",
    "What story are you telling yourself about this situation?",
    "How might someone else view this same situation?",
    "What would you say to a friend experiencing this same emotion?"
  ],
  
  needs: [
    "What do you need most right now?",
    "What would help you feel more balanced or supported?",
    "What boundaries might you need to set?",
    "Who could you reach out to for support?",
    "What self-care activities would serve you right now?"
  ],
  
  growth: [
    "What might this emotion be trying to tell you?",
    "How has experiencing this emotion helped you in the past?",
    "What strengths are you drawing on to cope with this feeling?",
    "What are you learning about yourself through this experience?",
    "How might you handle a similar situation differently in the future?"
  ],
  
  action: [
    "What's one small step you could take to care for yourself right now?",
    "Is there any action this emotion is motivating you to take?",
    "What would help you feel more empowered in this situation?",
    "How can you honor this emotion while also taking care of your well-being?",
    "What would help you feel more connected to others right now?"
  ]
}

const PROMPT_CATEGORIES = {
  trigger: { name: "Situation & Triggers", icon: "🎯", color: "bg-red-50 border-red-200" },
  context: { name: "Context & Patterns", icon: "🔍", color: "bg-blue-50 border-blue-200" },
  physical: { name: "Body & Sensations", icon: "🫀", color: "bg-orange-50 border-orange-200" },
  thoughts: { name: "Thoughts & Beliefs", icon: "🧠", color: "bg-purple-50 border-purple-200" },
  needs: { name: "Needs & Support", icon: "🤝", color: "bg-green-50 border-green-200" },
  growth: { name: "Learning & Growth", icon: "🌱", color: "bg-emerald-50 border-emerald-200" },
  action: { name: "Next Steps", icon: "⚡", color: "bg-yellow-50 border-yellow-200" }
}

export default function GuidedReflection({ selectedEmotions, onReflectionComplete }) {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [responses, setResponses] = useState({})
  const [currentResponse, setCurrentResponse] = useState('')

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setCurrentPromptIndex(0)
    setCurrentResponse('')
  }

  const handleResponseSave = () => {
    if (!currentResponse.trim()) return

    const promptKey = `${selectedCategory}_${currentPromptIndex}`
    const newResponses = {
      ...responses,
      [promptKey]: {
        category: selectedCategory,
        prompt: REFLECTION_PROMPTS[selectedCategory][currentPromptIndex],
        response: currentResponse.trim(),
        timestamp: new Date().toISOString()
      }
    }
    setResponses(newResponses)
    setCurrentResponse('')

    // Move to next prompt or back to categories
    if (currentPromptIndex < REFLECTION_PROMPTS[selectedCategory].length - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1)
    } else {
      setSelectedCategory(null)
    }
  }

  const handleSkipPrompt = () => {
    if (currentPromptIndex < REFLECTION_PROMPTS[selectedCategory].length - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1)
    } else {
      setSelectedCategory(null)
    }
  }

  const handleComplete = () => {
    const reflectionData = {
      emotions: selectedEmotions,
      responses: Object.values(responses),
      completedAt: new Date().toISOString()
    }
    onReflectionComplete(reflectionData)
  }

  const getCompletedPromptsCount = (category) => {
    return Object.values(responses).filter(r => r.category === category).length
  }

  const getTotalResponses = () => Object.keys(responses).length

  // Category selection view
  if (!selectedCategory) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold mb-2">Guided Reflection</h3>
          <p className="text-gray-600 mb-4">
            Deepen your emotional awareness by exploring different aspects of your experience
          </p>
          
          {selectedEmotions.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {selectedEmotions.map((emotion, index) => (
                <span 
                  key={`${emotion.name}-${index}`}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {emotion.icon} {emotion.name} ({emotion.intensity}/10)
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(PROMPT_CATEGORIES).map(([key, category]) => {
            const completedCount = getCompletedPromptsCount(key)
            const totalCount = REFLECTION_PROMPTS[key].length
            
            return (
              <button
                key={key}
                onClick={() => handleCategorySelect(key)}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-md text-left ${category.color}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{category.icon}</span>
                      <h4 className="font-semibold">{category.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {REFLECTION_PROMPTS[key][0]}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{completedCount}/{totalCount} prompts answered</span>
                  {completedCount > 0 && (
                    <span className="text-green-600 font-medium">✓ Started</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {getTotalResponses() > 0 && (
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-green-800">Great progress!</h4>
                <p className="text-sm text-green-700">
                  You've answered {getTotalResponses()} reflection prompts
                </p>
              </div>
              <button
                onClick={handleComplete}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Complete Reflection
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Individual prompt view
  const currentPrompts = REFLECTION_PROMPTS[selectedCategory]
  const currentPrompt = currentPrompts[currentPromptIndex]
  const categoryInfo = PROMPT_CATEGORIES[selectedCategory]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => setSelectedCategory(null)}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Back to Categories
        </button>
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            {categoryInfo.icon} {categoryInfo.name}
          </h3>
          <p className="text-gray-600">
            Question {currentPromptIndex + 1} of {currentPrompts.length}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-4">{currentPrompt}</h4>
          
          <textarea
            value={currentResponse}
            onChange={(e) => setCurrentResponse(e.target.value)}
            placeholder="Take your time to reflect... There are no right or wrong answers."
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleSkipPrompt}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Skip this question
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={handleResponseSave}
              disabled={!currentResponse.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentPromptIndex < currentPrompts.length - 1 ? 'Next Question' : 'Finish Category'}
            </button>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentPromptIndex + 1) / currentPrompts.length) * 100}%` }}
        />
      </div>

      {/* Previous responses in this category */}
      {Object.values(responses).filter(r => r.category === selectedCategory).length > 0 && (
        <div className="mt-8">
          <h5 className="font-medium mb-3">Your previous reflections in this category:</h5>
          <div className="space-y-3">
            {Object.values(responses)
              .filter(r => r.category === selectedCategory)
              .map((response, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                  <p className="font-medium text-gray-800 mb-1">{response.prompt}</p>
                  <p className="text-gray-600">{response.response}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}