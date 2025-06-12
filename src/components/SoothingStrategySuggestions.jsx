import { useMemo } from 'react'

const SOOTHING_STRATEGIES = {
  // Anger-related strategies
  anger: {
    immediate: [
      "Take 10 deep breaths, counting slowly on each exhale",
      "Step away from the situation for 5-10 minutes",
      "Try progressive muscle relaxation: tense and release each muscle group",
      "Use the 'STOP' technique: Stop, Take a breath, Observe, Proceed mindfully"
    ],
    longTerm: [
      "Practice regular physical exercise (walking, swimming, or yoga)",
      "Keep an emotion journal to identify triggers and patterns",
      "Learn assertive communication techniques through practice",
      "Establish daily mindfulness or meditation practice"
    ]
  },
  
  // Sadness-related strategies
  sadness: {
    immediate: [
      "Allow yourself to feel the emotion without judgment",
      "Reach out to a trusted friend or family member for support",
      "Engage in gentle self-care (warm bath, soft music, favorite tea)",
      "Practice self-compassion with kind, understanding self-talk"
    ],
    longTerm: [
      "Establish a daily routine that includes one enjoyable activity",
      "Build and maintain supportive social connections",
      "Practice gratitude by writing down three positive things daily",
      "Consider professional counseling for persistent sadness"
    ]
  },
  
  // Fear/Anxiety-related strategies
  fear: {
    immediate: [
      "Use 5-4-3-2-1 grounding: name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste",
      "Practice box breathing: inhale 4 counts, hold 4, exhale 4, hold 4",
      "Challenge anxious thoughts by asking 'What evidence supports this worry?'",
      "Focus on actions within your control in this moment"
    ],
    longTerm: [
      "Practice daily mindfulness meditation (even 5-10 minutes helps)",
      "Gradually face feared situations in small, manageable steps",
      "Develop a strong support network of understanding people",
      "Learn cognitive behavioral techniques for thought management"
    ]
  },
  
  // Joy-related strategies (maintaining and building)
  joy: {
    immediate: [
      "Take a moment to fully experience and appreciate this feeling",
      "Share your positive experience with someone you care about",
      "Express gratitude for what brought you this joy",
      "Create a mental or physical snapshot to remember this moment"
    ],
    longTerm: [
      "Keep a joy journal to track and remember positive experiences",
      "Schedule regular activities that consistently bring you happiness",
      "Practice random acts of kindness to boost well-being",
      "Build daily habits that support your mental health and joy"
    ]
  },
  
  // Trigger-specific strategies
  work: [
    "Set specific times for checking work emails and stick to them",
    "Use time management techniques like the Pomodoro method",
    "Take 5-10 minute breaks every hour to reset your mind",
    "Practice clear, direct communication about your needs and boundaries"
  ],
  
  family: [
    "Practice active listening by reflecting back what you hear",
    "Set healthy boundaries using 'I' statements about your needs",
    "Focus on your own responses rather than trying to change others",
    "Take breaks from family interactions when feeling overwhelmed"
  ],
  
  money: [
    "Create a simple budget and review it weekly",
    "Practice distinguishing between needs and wants before purchases",
    "Focus on what you can control: your spending and saving habits",
    "Express gratitude for what you currently have"
  ],
  
  health: [
    "Focus on healthy habits you can control: sleep, nutrition, movement",
    "Seek appropriate medical care when needed without delay",
    "Practice stress-reduction techniques like deep breathing or meditation",
    "Build a support network for health challenges"
  ],
  
  relationship: [
    "Practice expressing your feelings using 'I' statements",
    "Focus on your own personal growth and self-care",
    "Set clear, kind boundaries about your needs",
    "Take responsibility only for your own actions and responses"
  ]
}

export default function SoothingStrategySuggestions({ checkIns, emotionFrequency, triggerPatterns }) {
  const suggestions = useMemo(() => {
    const strategies = []
    
    // Based on most frequent emotions
    if (emotionFrequency && emotionFrequency.length > 0) {
      const topEmotions = emotionFrequency.slice(0, 3)
      
      topEmotions.forEach(emotion => {
        const emotionName = emotion.name.toLowerCase()
        let categoryKey = null
        
        // Map specific emotions to categories
        if (['angry', 'mad', 'furious', 'irritated', 'frustrated', 'annoyed', 'resentful', 'enraged', 'livid'].includes(emotionName)) {
          categoryKey = 'anger'
        } else if (['sad', 'disappointed', 'down', 'melancholic', 'dejected', 'grief', 'despair', 'anguish', 'wistful'].includes(emotionName)) {
          categoryKey = 'sadness'
        } else if (['afraid', 'anxious', 'worried', 'concerned', 'uneasy', 'nervous', 'terrified', 'panic', 'petrified'].includes(emotionName)) {
          categoryKey = 'fear'
        } else if (['happy', 'cheerful', 'delighted', 'content', 'pleased', 'satisfied', 'ecstatic', 'euphoric', 'elated'].includes(emotionName)) {
          categoryKey = 'joy'
        }
        
        if (categoryKey && SOOTHING_STRATEGIES[categoryKey]) {
          strategies.push({
            type: 'emotion',
            emotion: emotion.name,
            category: categoryKey,
            immediate: SOOTHING_STRATEGIES[categoryKey].immediate,
            longTerm: SOOTHING_STRATEGIES[categoryKey].longTerm,
            frequency: emotion.count
          })
        }
      })
    }
    
    // Based on trigger patterns
    if (triggerPatterns) {
      const topTriggers = Object.entries(triggerPatterns)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
      
      topTriggers.forEach(([trigger, count]) => {
        if (SOOTHING_STRATEGIES[trigger]) {
          strategies.push({
            type: 'trigger',
            trigger,
            strategies: SOOTHING_STRATEGIES[trigger],
            frequency: count
          })
        }
      })
    }
    
    return strategies
  }, [emotionFrequency, triggerPatterns, checkIns])

  if (suggestions.length === 0) {
    return (
      <div className="card">
        <h4 className="font-semibold mb-4">🌱 Personalized Soothing Strategies</h4>
        <p className="text-gray-500">Complete more check-ins to receive personalized soothing strategy suggestions based on your patterns.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h4 className="font-semibold mb-4">🌱 Personalized Soothing Strategies</h4>
      <p className="text-sm text-gray-600 mb-6">
        Based on your emotional patterns, here are evidence-based strategies that may help you soothe and manage your emotions more effectively.
      </p>
      
      <div className="space-y-6">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            {suggestion.type === 'emotion' ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">
                    For your frequent emotion: <span className="text-blue-600">{suggestion.emotion}</span>
                  </h5>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {suggestion.frequency} times
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="text-sm font-medium text-green-700 mb-2">⚡ Immediate Soothing</h6>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {suggestion.immediate.map((strategy, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          {strategy}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h6 className="text-sm font-medium text-blue-700 mb-2">🌱 Long-term Building</h6>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {suggestion.longTerm.map((strategy, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          {strategy}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">
                    For your common trigger: <span className="text-orange-600 capitalize">{suggestion.trigger}</span>
                  </h5>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {suggestion.frequency} mentions
                  </span>
                </div>
                
                <ul className="text-sm text-gray-700 space-y-1">
                  {suggestion.strategies.map((strategy, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      {strategy}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h6 className="font-medium text-blue-900 mb-2">💙 Remember:</h6>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Different soothing strategies work for different people - experiment to find what works best for you</li>
          <li>• Practice these techniques regularly, especially when you're feeling calm</li>
          <li>• If you're struggling significantly, consider reaching out to a mental health professional</li>
          <li>• Building emotional self-soothing skills takes time and patience with yourself</li>
        </ul>
      </div>
    </div>
  )
}