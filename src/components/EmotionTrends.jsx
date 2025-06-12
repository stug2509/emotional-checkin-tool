import { useState, useMemo } from 'react'
import { format, subDays, isAfter, startOfDay } from 'date-fns'
import SoothingStrategySuggestions from './SoothingStrategySuggestions'

export default function EmotionTrends({ checkIns }) {
  const [timeRange, setTimeRange] = useState('7d') // 7d, 30d, 90d

  // Filter check-ins by time range
  const filteredCheckIns = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    const cutoffDate = startOfDay(subDays(new Date(), days))
    
    return checkIns.filter(checkIn => 
      isAfter(new Date(checkIn.created_at), cutoffDate)
    )
  }, [checkIns, timeRange])

  // Calculate emotion frequency
  const emotionFrequency = useMemo(() => {
    const frequency = {}
    
    filteredCheckIns.forEach(checkIn => {
      checkIn.emotions.forEach(emotion => {
        if (!frequency[emotion.name]) {
          frequency[emotion.name] = { count: 0, totalIntensity: 0 }
        }
        frequency[emotion.name].count++
        frequency[emotion.name].totalIntensity += emotion.intensity
      })
    })

    // Convert to array and sort by frequency
    return Object.entries(frequency)
      .map(([name, data]) => ({
        name,
        count: data.count,
        avgIntensity: Math.round(data.totalIntensity / data.count * 10) / 10,
        percentage: Math.round((data.count / filteredCheckIns.length) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Top 10 emotions
  }, [filteredCheckIns])

  // Calculate weekly pattern
  const weeklyPattern = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const pattern = {}
    
    days.forEach(day => {
      pattern[day] = { count: 0, totalIntensity: 0 }
    })

    filteredCheckIns.forEach(checkIn => {
      const dayName = format(new Date(checkIn.created_at), 'EEEE')
      const avgIntensity = checkIn.emotions.reduce((sum, e) => sum + e.intensity, 0) / checkIn.emotions.length
      
      pattern[dayName].count++
      pattern[dayName].totalIntensity += avgIntensity
    })

    return days.map(day => ({
      day,
      count: pattern[day].count,
      avgIntensity: pattern[day].count > 0 
        ? Math.round(pattern[day].totalIntensity / pattern[day].count * 10) / 10 
        : 0
    }))
  }, [filteredCheckIns])

  // Calculate emotional intelligence progress metrics
  const progressMetrics = useMemo(() => {
    if (filteredCheckIns.length === 0) return null

    // Enhanced check-ins (with reflection data)
    const enhancedCheckIns = filteredCheckIns.filter(checkIn => 
      checkIn.metadata?.enhancedVersion && checkIn.metadata?.reflectionData
    )

    // Emotion diversity (variety of emotions identified)
    const uniqueEmotions = new Set()
    const emotionCategories = new Set()
    
    filteredCheckIns.forEach(checkIn => {
      checkIn.emotions.forEach(emotion => {
        uniqueEmotions.add(emotion.name)
        if (emotion.category) {
          emotionCategories.add(emotion.category)
        }
      })
    })

    // Reflection engagement
    const totalReflectionPrompts = enhancedCheckIns.reduce((total, checkIn) => {
      return total + (checkIn.metadata?.reflectionData?.responses?.length || 0)
    }, 0)

    // Emotional granularity (specificity of emotion identification)
    const granularityScore = uniqueEmotions.size / Math.max(filteredCheckIns.length, 1)

    // Consistency (regular check-ins)
    const timeSpan = filteredCheckIns.length > 1 ? 
      (new Date(filteredCheckIns[0].created_at) - new Date(filteredCheckIns[filteredCheckIns.length - 1].created_at)) / (1000 * 60 * 60 * 24) :
      0
    const consistencyScore = timeSpan > 0 ? Math.min(filteredCheckIns.length / timeSpan, 1) : 0

    return {
      totalCheckIns: filteredCheckIns.length,
      enhancedCheckIns: enhancedCheckIns.length,
      uniqueEmotions: uniqueEmotions.size,
      emotionCategories: emotionCategories.size,
      totalReflections: totalReflectionPrompts,
      granularityScore: Math.round(granularityScore * 100) / 100,
      consistencyScore: Math.round(consistencyScore * 100) / 100,
      enhancedUsagePercent: Math.round((enhancedCheckIns.length / filteredCheckIns.length) * 100)
    }
  }, [filteredCheckIns])

  // Calculate trigger patterns
  const triggerPatterns = useMemo(() => {
    return filteredCheckIns
      .filter(checkIn => checkIn.metadata?.reflectionData?.responses)
      .reduce((patterns, checkIn) => {
        const triggerResponses = checkIn.metadata.reflectionData.responses
          .filter(response => response.category === 'trigger')
        
        triggerResponses.forEach(response => {
          const triggerKeywords = ['work', 'family', 'money', 'health', 'relationship', 'time', 'stress', 'sleep', 'social', 'change']
          triggerKeywords.forEach(keyword => {
            if (response.response.toLowerCase().includes(keyword)) {
              patterns[keyword] = (patterns[keyword] || 0) + 1
            }
          })
        })
        return patterns
      }, {})
  }, [filteredCheckIns])

  // Calculate insights
  const insights = useMemo(() => {
    if (filteredCheckIns.length === 0) return []

    const insights = []
    
    // Most frequent emotion
    if (emotionFrequency.length > 0) {
      const topEmotion = emotionFrequency[0]
      insights.push({
        type: 'frequency',
        text: `Your most frequent emotion is "${topEmotion.name}" (${topEmotion.count} times, avg intensity ${topEmotion.avgIntensity}/10)`
      })
    }

    // Emotional intelligence insights
    if (progressMetrics) {
      if (progressMetrics.uniqueEmotions >= 10) {
        insights.push({
          type: 'growth',
          text: `Great emotional vocabulary! You've identified ${progressMetrics.uniqueEmotions} different emotions.`
        })
      }

      if (progressMetrics.enhancedUsagePercent >= 50) {
        insights.push({
          type: 'growth',
          text: `Excellent self-reflection practice! You're using the enhanced system ${progressMetrics.enhancedUsagePercent}% of the time.`
        })
      }

      if (progressMetrics.granularityScore >= 2) {
        insights.push({
          type: 'growth',
          text: `You're developing emotional granularity - identifying multiple emotions per check-in.`
        })
      }
    }

    // Trigger pattern insights
    const topTrigger = Object.entries(triggerPatterns)
      .sort(([,a], [,b]) => b - a)[0]
    
    if (topTrigger && topTrigger[1] >= 2) {
      insights.push({
        type: 'trigger',
        text: `Pattern detected: "${topTrigger[0]}" appears frequently in your emotional triggers (${topTrigger[1]} times).`
      })
    }

    // Busiest day
    const busiestDay = weeklyPattern.reduce((max, day) => 
      day.count > max.count ? day : max
    )
    if (busiestDay.count > 0) {
      insights.push({
        type: 'pattern',
        text: `You check in most often on ${busiestDay.day}s (${busiestDay.count} times)`
      })
    }

    // High intensity emotions
    const highIntensityEmotions = emotionFrequency.filter(e => e.avgIntensity >= 8)
    if (highIntensityEmotions.length > 0) {
      insights.push({
        type: 'intensity',
        text: `High-intensity emotions: ${highIntensityEmotions.map(e => e.name).join(', ')}`
      })
    }

    return insights
  }, [emotionFrequency, weeklyPattern, filteredCheckIns, progressMetrics])

  if (checkIns.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Emotion Trends</h3>
        <p className="text-gray-500">Complete a few check-ins to see your emotional patterns!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">📊 Emotional Analytics & Growth</h3>
            <p className="text-sm text-gray-600">Track your emotional intelligence development</p>
          </div>
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded text-sm ${
                  timeRange === range 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range === '7d' ? '7 days' : range === '30d' ? '30 days' : '90 days'}
              </button>
            ))}
          </div>
        </div>

        {filteredCheckIns.length === 0 ? (
          <p className="text-gray-500">No check-ins in the selected time range.</p>
        ) : (
          <div className="text-sm text-gray-600">
            {filteredCheckIns.length} check-ins in the last {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '90 days'}
          </div>
        )}
      </div>

      {filteredCheckIns.length > 0 && (
        <>
          {/* Top Emotions */}
          <div className="card">
            <h4 className="font-semibold mb-4">Most Frequent Emotions</h4>
            <div className="space-y-3">
              {emotionFrequency.slice(0, 5).map((emotion, index) => (
                <div key={emotion.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500 w-4">
                      #{index + 1}
                    </span>
                    <span className="font-medium">{emotion.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                      {emotion.count} times
                    </div>
                    <div className="text-sm text-gray-600">
                      Avg: {emotion.avgIntensity}/10
                    </div>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(emotion.count / filteredCheckIns.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Pattern */}
          <div className="card">
            <h4 className="font-semibold mb-4">Weekly Check-in Pattern</h4>
            <div className="grid grid-cols-7 gap-2">
              {weeklyPattern.map(day => (
                <div key={day.day} className="text-center">
                  <div className="text-xs text-gray-600 mb-1">
                    {day.day.slice(0, 3)}
                  </div>
                  <div 
                    className="w-full bg-gray-200 rounded h-8 flex items-end justify-center relative"
                  >
                    <div 
                      className="bg-primary rounded w-full"
                      style={{ 
                        height: `${Math.max(10, (day.count / Math.max(...weeklyPattern.map(d => d.count))) * 100)}%` 
                      }}
                    />
                    <span className="absolute text-xs text-white font-medium">
                      {day.count}
                    </span>
                  </div>
                  {day.avgIntensity > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {day.avgIntensity}/10
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Trigger Patterns */}
          {Object.keys(triggerPatterns).length > 0 && (
            <div className="card">
              <h4 className="font-semibold mb-4">🎯 Trigger Patterns & Context Analysis</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium mb-3">Most Common Triggers</h5>
                  <div className="space-y-2">
                    {Object.entries(triggerPatterns)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([trigger, count]) => (
                        <div key={trigger} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm font-medium capitalize">{trigger}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-600">{count} times</span>
                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-red-500 h-1.5 rounded-full"
                                style={{ width: `${(count / Math.max(...Object.values(triggerPatterns))) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-sm text-yellow-800">
                    <strong>💡 Insight:</strong> Recognizing your triggers is the first step to emotional regulation. 
                    Consider what soothing strategies work best for your most common triggers.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Emotional Intelligence Progress */}
          {progressMetrics && (
            <div className="card">
              <h4 className="font-semibold mb-4">🧠 Emotional Intelligence Progress</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{progressMetrics.uniqueEmotions}</div>
                  <div className="text-sm text-blue-800">Unique emotions identified</div>
                  <div className="text-xs text-blue-600 mt-1">Building emotional vocabulary</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{progressMetrics.emotionCategories}/7</div>
                  <div className="text-sm text-green-800">Emotion categories explored</div>
                  <div className="text-xs text-green-600 mt-1">Diversifying emotional awareness</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{progressMetrics.totalReflections}</div>
                  <div className="text-sm text-purple-800">Reflection prompts answered</div>
                  <div className="text-xs text-purple-600 mt-1">Deepening self-understanding</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{progressMetrics.enhancedUsagePercent}%</div>
                  <div className="text-sm text-orange-800">Enhanced check-ins</div>
                  <div className="text-xs text-orange-600 mt-1">Using structured approach</div>
                </div>
              </div>
              
              {/* Progress bars */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Emotional Granularity</span>
                    <span>{Math.min(100, Math.round(progressMetrics.granularityScore * 50))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.round(progressMetrics.granularityScore * 50))}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Ability to identify multiple, specific emotions</div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Reflection Engagement</span>
                    <span>{Math.min(100, Math.round((progressMetrics.totalReflections / (progressMetrics.totalCheckIns * 3)) * 100))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.round((progressMetrics.totalReflections / (progressMetrics.totalCheckIns * 3)) * 100))}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Participation in guided reflection exercises</div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Check-in Consistency</span>
                    <span>{Math.min(100, Math.round(progressMetrics.consistencyScore * 100))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.round(progressMetrics.consistencyScore * 100))}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Regular emotional self-monitoring</div>
                </div>
              </div>
            </div>
          )}

          {/* Insights */}
          {insights.length > 0 && (
            <div className="card">
              <h4 className="font-semibold mb-4">💡 Insights & Patterns</h4>
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      insight.type === 'frequency' ? 'bg-blue-500' :
                      insight.type === 'pattern' ? 'bg-green-500' :
                      insight.type === 'growth' ? 'bg-purple-500' :
                      insight.type === 'trigger' ? 'bg-red-500' : 'bg-orange-500'
                    }`} />
                    <p className="text-sm text-gray-700">{insight.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personalized Soothing Strategies */}
          <SoothingStrategySuggestions 
            checkIns={filteredCheckIns}
            emotionFrequency={emotionFrequency}
            triggerPatterns={triggerPatterns}
          />
        </>
      )}
    </div>
  )
}