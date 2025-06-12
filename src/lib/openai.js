// Secure API client - no direct OpenAI integration
export const identifyEmotions = async (feelingDescription) => {
  try {
    // Input validation
    if (!feelingDescription || typeof feelingDescription !== 'string') {
      throw new Error('Invalid feeling description');
    }

    // Limit input length
    if (feelingDescription.length > 500) {
      throw new Error('Description too long (max 500 characters)');
    }

    const response = await fetch('/api/identify-emotions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ feelingDescription }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.emotions;

  } catch (error) {
    console.error('Emotion identification error:', error);
    
    // Fallback emotions if API fails
    return [
      { name: "Uncertain", definition: "Feeling unsure about your emotional state", intensity: 5 },
      { name: "Contemplative", definition: "In a thoughtful, reflective mood", intensity: 5 },
      { name: "Neutral", definition: "Neither particularly positive nor negative", intensity: 5 },
      { name: "Present", definition: "Aware and grounded in the moment", intensity: 5 },
      { name: "Open", definition: "Receptive to understanding your feelings", intensity: 5 }
    ];
  }
};