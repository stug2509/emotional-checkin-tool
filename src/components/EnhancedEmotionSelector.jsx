import { useState } from 'react'
import { EMOTION_WHEEL } from '../data/emotionWheel'

export default function EnhancedEmotionSelector({ onEmotionSelect, selectedEmotions = [] }) {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState(null)
  const [showIntensitySlider, setShowIntensitySlider] = useState(null)

  const handleCategorySelect = (categoryKey) => {
    setSelectedCategory(categoryKey)
    setSelectedSubcategory(null)
    setShowIntensitySlider(null)
  }

  const handleSubcategorySelect = (subcategoryKey) => {
    setSelectedSubcategory(subcategoryKey)
    setShowIntensitySlider(null)
  }

  const handleEmotionClick = (emotion) => {
    setShowIntensitySlider(emotion)
  }

  const handleIntensitySelect = (emotion, intensity) => {
    const emotionWithIntensity = {
      ...emotion,
      intensity,
      category: EMOTION_WHEEL[selectedCategory].name,
      subcategory: EMOTION_WHEEL[selectedCategory].subcategories[selectedSubcategory].name,
      color: EMOTION_WHEEL[selectedCategory].color,
      icon: EMOTION_WHEEL[selectedCategory].icon,
      timestamp: new Date().toISOString()
    }
    
    onEmotionSelect(emotionWithIntensity)
    setShowIntensitySlider(null)
  }

  const isEmotionSelected = (emotionName) => {
    return selectedEmotions.some(e => e.name === emotionName)
  }

  // Step 1: Category Selection
  if (!selectedCategory) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">How are you feeling?</h3>
          <p className="text-gray-600">Choose the emotion family that best matches your current state</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(EMOTION_WHEEL).map(([key, category]) => (
            <button
              key={key}
              onClick={() => handleCategorySelect(key)}
              className="group p-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-md"
              style={{ '--category-color': category.color }}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-2">{category.name}</h4>
                <p className="text-sm text-gray-600 leading-tight">{category.description}</p>
              </div>
            </button>
          ))}
        </div>

        {selectedEmotions.length > 0 && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Selected Emotions:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedEmotions.map((emotion, index) => (
                <span 
                  key={`${emotion.name}-${index}`}
                  className="px-3 py-1 bg-white rounded-full text-sm font-medium border"
                  style={{ borderColor: emotion.color, color: emotion.color }}
                >
                  {emotion.icon} {emotion.name} ({emotion.intensity}/10)
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const currentCategory = EMOTION_WHEEL[selectedCategory]

  // Step 2: Subcategory Selection
  if (!selectedSubcategory) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => setSelectedCategory(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back
          </button>
          <div>
            <h3 className="text-xl font-semibold flex items-center gap-2">
              {currentCategory.icon} {currentCategory.name}
            </h3>
            <p className="text-gray-600">{currentCategory.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(currentCategory.subcategories).map(([key, subcategory]) => (
            <button
              key={key}
              onClick={() => handleSubcategorySelect(key)}
              className="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all text-left"
            >
              <h4 className="font-semibold mb-2">{subcategory.name}</h4>
              <div className="flex flex-wrap gap-2">
                {subcategory.emotions.map(emotion => (
                  <span 
                    key={emotion.name}
                    className={`px-2 py-1 rounded text-sm ${
                      isEmotionSelected(emotion.name) 
                        ? 'bg-blue-100 text-blue-800 font-medium' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {emotion.name}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const currentSubcategory = currentCategory.subcategories[selectedSubcategory]

  // Step 3: Specific Emotion Selection
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => setSelectedSubcategory(null)}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Back
        </button>
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            {currentCategory.icon} {currentSubcategory.name}
          </h3>
          <p className="text-gray-600">Select the specific emotion and rate its intensity</p>
        </div>
      </div>

      <div className="space-y-4">
        {currentSubcategory.emotions.map(emotion => (
          <div key={emotion.name} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => handleEmotionClick(emotion)}
              className={`w-full p-4 text-left transition-all ${
                isEmotionSelected(emotion.name)
                  ? 'bg-blue-50 border-blue-200'
                  : showIntensitySlider?.name === emotion.name
                  ? 'bg-gray-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{emotion.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{emotion.definition}</p>
                  
                  <div className="text-xs text-gray-500">
                    <div className="mb-1">
                      <strong>Common triggers:</strong> {emotion.triggers.join(', ')}
                    </div>
                    <div>
                      <strong>Physical signs:</strong> {emotion.physicalSigns.join(', ')}
                    </div>
                  </div>
                </div>
                
                {isEmotionSelected(emotion.name) && (
                  <div className="ml-4 text-blue-600 font-medium">
                    ✓ Selected
                  </div>
                )}
              </div>
            </button>

            {/* Intensity Slider */}
            {showIntensitySlider?.name === emotion.name && (
              <div className="p-4 bg-gray-50 border-t">
                <div className="mb-4">
                  <h5 className="font-medium mb-2">Rate the intensity of your {emotion.name.toLowerCase()}:</h5>
                  <div className="text-sm text-gray-600 mb-4">
                    Consider: How strongly are you feeling this right now? How much is it affecting your thoughts and behavior?
                  </div>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(intensity => (
                    <button
                      key={intensity}
                      onClick={() => handleIntensitySelect(emotion, intensity)}
                      className="p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all text-center font-medium hover:bg-blue-50"
                    >
                      <div className="text-lg">{intensity}</div>
                      <div className="text-xs text-gray-500">
                        {intensity <= 3 ? 'Mild' : intensity <= 6 ? 'Moderate' : intensity <= 8 ? 'Strong' : 'Intense'}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-4 text-xs text-gray-600">
                  <div className="grid grid-cols-4 gap-4">
                    <div><strong>1-3:</strong> Mild - barely noticeable</div>
                    <div><strong>4-6:</strong> Moderate - clearly present</div>
                    <div><strong>7-8:</strong> Strong - hard to ignore</div>
                    <div><strong>9-10:</strong> Intense - overwhelming</div>
                  </div>
                </div>

                <button
                  onClick={() => setShowIntensitySlider(null)}
                  className="mt-3 text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Soothing Strategies */}
      {showIntensitySlider && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h5 className="font-medium mb-2">💡 Suggested Soothing Strategies:</h5>
          <ul className="text-sm text-gray-700 space-y-1">
            {showIntensitySlider.soothingStrategies.map((strategy, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                {strategy}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}