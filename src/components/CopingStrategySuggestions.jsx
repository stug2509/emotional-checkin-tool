import { useMemo } from 'react'

const SOOTHING_STRATEGIES = {
  // Anger-related strategies
  anger: {
    immediate: [
      "Take 10 deep breaths before responding",
      "Step away from the situation for 5-10 minutes",
      "Try progressive muscle relaxation",
      "Use the 'STOP' technique: Stop, Take a breath, Observe, Proceed mindfully"
    ],
    longTerm: [
      "Practice regular exercise to manage stress",
      "Keep an anger journal to identify patterns",
      "Learn assertive communication techniques",
      "Consider anger management counseling"
    ]
  },
  
  // Sadness-related strategies
  sadness: {
    immediate: [
      "Allow yourself to feel the emotion without judgment",
      "Reach out to a trusted friend or family member",
      "Engage in gentle self-care activities",
      "Practice self-compassion and kind self-talk"
    ],
    longTerm: [
      "Establish a daily routine that includes enjoyable activities",
      "Consider counseling or therapy for persistent sadness",
      "Build and maintain supportive relationships",
      "Practice gratitude journaling"
    ]
  },
  
  // Fear/Anxiety-related strategies
  fear: {
    immediate: [
      "Use grounding techniques: 5-4-3-2-1 (5 things you see, 4 you hear, etc.)",
      "Practice box breathing: 4 counts in, hold 4, out 4, hold 4",
      "Challenge anxious thoughts with evidence",
      "Focus on what you can control in the situation"
    ],
    longTerm: [
      "Practice regular mindfulness or meditation",
      "Gradually expose yourself to feared situations",
      "Develop a strong support network",
      "Consider cognitive behavioral therapy (CBT)"
    ]
  },
  
  // Joy-related strategies (maintaining and building)
  joy: {
    immediate: [
      "Savor the moment mindfully",
      "Share your joy with others",
      "Express gratitude for the positive experience",
      "Take a mental snapshot to remember later"
    ],
    longTerm: [
      "Keep a joy journal to track positive experiences",
      "Plan regular activities that bring you happiness",
      "Practice acts of kindness to boost well-being",
      "Build habits that support your mental health"
    ]
  },
  
  // Trigger-specific strategies
  work: [
    "Set clear boundaries between work and personal time",
    "Practice time management and prioritization",
    "Take regular breaks throughout the day",
    "Communicate needs clearly with supervisors"
  ],
  
  family: [
    "Practice active listening in conversations",
    "Set healthy boundaries with family members",
    "Focus on what you can control in relationships",
    "Consider family counseling for persistent issues"
  ],
  
  money: [
    "Create a realistic budget and stick to it",
    "Focus on needs vs. wants when making decisions",
    "Seek financial counseling if needed",
    "Practice gratitude for what you have"
  ],
  
  health: [
    "Focus on healthy habits within your control",
    "Seek appropriate medical care when needed",
    "Practice stress reduction techniques",
    "Build a support network for health challenges"
  ],
  
  relationship: [
    "Practice open and honest communication",
    "Focus on your own growth and well-being",
    "Set healthy boundaries in relationships",
    "Consider couples or relationship counseling"
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
        <h4 className="font-semibold mb-4">🛠️ Personalized Soothing Strategies</h4>
        <p className="text-gray-500">Complete more check-ins to receive personalized soothing strategy suggestions based on your patterns.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h4 className="font-semibold mb-4">🛠️ Personalized Soothing Strategies</h4>
      <p className="text-sm text-gray-600 mb-6">
        Based on your emotional patterns, here are evidence-based strategies that may help you manage your emotions more effectively.
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
                    <h6 className="text-sm font-medium text-green-700 mb-2">⚡ Immediate Strategies</h6>
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
                    <h6 className="text-sm font-medium text-blue-700 mb-2">🌱 Long-term Strategies</h6>
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
                    For your common trigger: <span className="text-red-600 capitalize">{suggestion.trigger}</span>
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
        <h6 className="font-medium text-blue-900 mb-2">📋 Remember:</h6>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Different strategies work for different people - experiment to find what works best for you</li>
          <li>• Practice these techniques regularly, not just during difficult times</li>
          <li>• If you're struggling significantly, consider reaching out to a mental health professional</li>
          <li>• Building emotional regulation skills takes time and patience with yourself</li>
        </ul>
      </div>
    </div>
  )
}