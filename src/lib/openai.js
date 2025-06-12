import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for MVP
});

export const identifyEmotions = async (feelingDescription) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an empathetic emotional check-in assistant. Based on the user's description, suggest exactly 5 specific, nuanced emotions they might be experiencing. Return ONLY a JSON array with this exact format: [{"name": "Emotion Name", "definition": "Brief 10-15 word definition", "intensity": 5}]. Intensity should be 1-10. Focus on specific emotions like "overwhelmed", "content", "melancholic" rather than basic ones like "sad" or "happy".`
        },
        {
          role: "user",
          content: feelingDescription
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const emotions = JSON.parse(response.choices[0].message.content);
    return emotions;
  } catch (error) {
    console.error('OpenAI Error:', error);
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