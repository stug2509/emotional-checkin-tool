// Vercel API Route for secure OpenAI integration
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Server-side only
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { feelingDescription } = req.body;

    // Input validation
    if (!feelingDescription || typeof feelingDescription !== 'string') {
      return res.status(400).json({ error: 'Invalid feeling description' });
    }

    // Limit input length
    if (feelingDescription.length > 500) {
      return res.status(400).json({ error: 'Description too long (max 500 characters)' });
    }

    // Rate limiting (basic)
    const userAgent = req.headers['user-agent'];
    // TODO: Implement proper rate limiting with Redis/database

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

    // Validate response format
    if (!Array.isArray(emotions) || emotions.length !== 5) {
      throw new Error('Invalid API response format');
    }

    return res.status(200).json({ emotions });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Return fallback emotions
    const fallbackEmotions = [
      { name: "Uncertain", definition: "Feeling unsure about your emotional state", intensity: 5 },
      { name: "Contemplative", definition: "In a thoughtful, reflective mood", intensity: 5 },
      { name: "Neutral", definition: "Neither particularly positive nor negative", intensity: 5 },
      { name: "Present", definition: "Aware and grounded in the moment", intensity: 5 },
      { name: "Open", definition: "Receptive to understanding your feelings", intensity: 5 }
    ];

    return res.status(200).json({ emotions: fallbackEmotions });
  }
}