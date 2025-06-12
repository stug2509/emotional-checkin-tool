// Enhanced Emotion Wheel Data Structure
// Based on Plutchik's Wheel of Emotions and emotional intelligence research

export const EMOTION_WHEEL = {
  anger: {
    name: "Anger",
    color: "#DC2626", // red-600
    description: "A response to perceived threat, injustice, or frustration",
    icon: "😠",
    subcategories: {
      mild: {
        name: "Mild Anger",
        emotions: [
          {
            name: "Irritated",
            definition: "Mildly annoyed or bothered by something",
            triggers: ["Minor inconveniences", "Delays", "Interruptions"],
            physicalSigns: ["Slight tension", "Furrowed brow"],
            soothingStrategies: ["Deep breathing", "Brief pause", "Address the issue directly"]
          },
          {
            name: "Frustrated",
            definition: "Feeling blocked from achieving something important",
            triggers: ["Obstacles to goals", "Repeated failures", "Lack of progress"],
            physicalSigns: ["Clenched jaw", "Restlessness"],
            soothingStrategies: ["Problem-solving", "Break tasks down", "Seek help"]
          },
          {
            name: "Annoyed",
            definition: "Mildly displeased by someone or something",
            triggers: ["Repetitive behaviors", "Minor rule-breaking", "Noise"],
            physicalSigns: ["Eye rolling", "Sighing"],
            soothingStrategies: ["Remove yourself", "Communicate needs", "Practice tolerance"]
          }
        ]
      },
      moderate: {
        name: "Moderate Anger",
        emotions: [
          {
            name: "Angry",
            definition: "Strong displeasure and hostility toward a situation",
            triggers: ["Injustice", "Betrayal", "Disrespect"],
            physicalSigns: ["Raised voice", "Rapid heartbeat", "Heat in face"],
            soothingStrategies: ["Time out", "Physical exercise", "Assertive communication"]
          },
          {
            name: "Mad",
            definition: "Intense anger that affects thinking and behavior",
            triggers: ["Personal attacks", "Violation of values", "Broken promises"],
            physicalSigns: ["Clenched fists", "Muscle tension", "Pacing"],
            soothingStrategies: ["Cool down period", "Journal feelings", "Seek mediation"]
          },
          {
            name: "Resentful",
            definition: "Persistent anger about past wrongs or unfairness",
            triggers: ["Unresolved conflicts", "Perceived unfairness", "Holding grudges"],
            physicalSigns: ["Chronic tension", "Fatigue", "Cynical expressions"],
            soothingStrategies: ["Forgiveness work", "Therapy", "Focus on present"]
          }
        ]
      },
      intense: {
        name: "Intense Anger",
        emotions: [
          {
            name: "Furious",
            definition: "Extremely angry with potential for aggressive behavior",
            triggers: ["Major violations", "Threats to loved ones", "Extreme injustice"],
            physicalSigns: ["Shaking", "Hot flashes", "Tunnel vision"],
            soothingStrategies: ["Immediate removal", "Professional help", "Anger management"]
          },
          {
            name: "Enraged",
            definition: "Peak anger that overwhelms rational thinking",
            triggers: ["Extreme provocation", "Accumulated stress", "Feeling powerless"],
            physicalSigns: ["Uncontrolled movement", "Loud volume", "Aggressive posture"],
            soothingStrategies: ["Crisis intervention", "Safety first", "Professional support"]
          },
          {
            name: "Livid",
            definition: "Extremely angry with visible physical manifestations",
            triggers: ["Betrayal by trusted person", "Threats to safety", "Violation of core values"],
            physicalSigns: ["Red face", "Visible shaking", "Rapid breathing"],
            soothingStrategies: ["Immediate cooling off", "Physical release", "Support system"]
          }
        ]
      }
    }
  },

  sadness: {
    name: "Sadness",
    color: "#2563EB", // blue-600
    description: "A response to loss, disappointment, or unmet needs",
    icon: "😢",
    subcategories: {
      mild: {
        name: "Mild Sadness",
        emotions: [
          {
            name: "Disappointed",
            definition: "Feeling let down when expectations aren't met",
            triggers: ["Unmet expectations", "Cancelled plans", "Failed attempts"],
            physicalSigns: ["Slight drooping", "Lower energy", "Quiet voice"],
            soothingStrategies: ["Adjust expectations", "Self-compassion", "Make new plans"]
          },
          {
            name: "Down",
            definition: "Temporarily feeling low or blue",
            triggers: ["Gloomy weather", "Temporary setbacks", "Missing someone"],
            physicalSigns: ["Less smiling", "Slower movement", "Seeking comfort"],
            soothingStrategies: ["Self-care activities", "Connect with others", "Engage in hobbies"]
          },
          {
            name: "Wistful",
            definition: "Gentle sadness mixed with longing for something",
            triggers: ["Nostalgia", "Memories", "Missing past experiences"],
            physicalSigns: ["Distant gaze", "Gentle sighing", "Soft expression"],
            soothingStrategies: ["Honor memories", "Create new experiences", "Practice gratitude"]
          }
        ]
      },
      moderate: {
        name: "Moderate Sadness",
        emotions: [
          {
            name: "Sad",
            definition: "Clear feelings of unhappiness and emotional pain",
            triggers: ["Loss", "Rejection", "Failure", "Loneliness"],
            physicalSigns: ["Tears", "Heavy feeling", "Withdrawn posture"],
            soothingStrategies: ["Allow the feeling", "Seek support", "Gentle activities"]
          },
          {
            name: "Melancholic",
            definition: "Thoughtful sadness with a reflective quality",
            triggers: ["Life transitions", "Contemplating mortality", "Seasonal changes"],
            physicalSigns: ["Contemplative posture", "Slow speech", "Introspection"],
            soothingStrategies: ["Creative expression", "Philosophy", "Meaningful conversations"]
          },
          {
            name: "Dejected",
            definition: "Feeling discouraged and low in spirits",
            triggers: ["Repeated failures", "Criticism", "Feeling unworthy"],
            physicalSigns: ["Slumped posture", "Avoiding eye contact", "Low energy"],
            soothingStrategies: ["Self-affirmation", "Skill building", "Supportive relationships"]
          }
        ]
      },
      intense: {
        name: "Intense Sadness",
        emotions: [
          {
            name: "Grief",
            definition: "Deep sorrow typically associated with loss",
            triggers: ["Death", "End of relationships", "Major life changes"],
            physicalSigns: ["Deep crying", "Physical pain", "Exhaustion"],
            soothingStrategies: ["Grief counseling", "Ritual and ceremony", "Time and patience"]
          },
          {
            name: "Despair",
            definition: "Complete loss of hope and overwhelming sadness",
            triggers: ["Chronic problems", "Feeling trapped", "Accumulated losses"],
            physicalSigns: ["Inability to function", "Physical symptoms", "Isolation"],
            soothingStrategies: ["Professional help", "Crisis support", "Medical evaluation"]
          },
          {
            name: "Anguish",
            definition: "Severe emotional pain and distress",
            triggers: ["Trauma", "Extreme loss", "Betrayal"],
            physicalSigns: ["Physical pain", "Crying spells", "Sleep disturbance"],
            soothingStrategies: ["Trauma therapy", "Medical support", "Crisis intervention"]
          }
        ]
      }
    }
  },

  fear: {
    name: "Fear",
    color: "#7C2D12", // amber-800
    description: "A response to perceived danger or threat",
    icon: "😨",
    subcategories: {
      mild: {
        name: "Mild Fear",
        emotions: [
          {
            name: "Concerned",
            definition: "Mildly worried about a potential problem",
            triggers: ["Upcoming challenges", "Uncertainty", "Others' wellbeing"],
            physicalSigns: ["Slight tension", "Increased attention", "Protective behavior"],
            soothingStrategies: ["Information gathering", "Planning", "Positive self-talk"]
          },
          {
            name: "Uneasy",
            definition: "Feeling slightly uncomfortable or uncertain",
            triggers: ["New situations", "Unclear expectations", "Subtle threats"],
            physicalSigns: ["Restlessness", "Fidgeting", "Scanning environment"],
            soothingStrategies: ["Clarify situation", "Relaxation techniques", "Gradual exposure"]
          },
          {
            name: "Nervous",
            definition: "Anxious or worried about upcoming events",
            triggers: ["Performance situations", "Social events", "Important decisions"],
            physicalSigns: ["Butterflies", "Restless energy", "Rapid speech"],
            soothingStrategies: ["Preparation", "Breathing exercises", "Positive visualization"]
          }
        ]
      },
      moderate: {
        name: "Moderate Fear",
        emotions: [
          {
            name: "Afraid",
            definition: "Clear fear about specific threats or dangers",
            triggers: ["Real dangers", "Past traumas", "Threatening situations"],
            physicalSigns: ["Rapid heartbeat", "Sweating", "Alert posture"],
            soothingStrategies: ["Safety planning", "Gradual exposure", "Support systems"]
          },
          {
            name: "Anxious",
            definition: "Persistent worry about future events or outcomes",
            triggers: ["Uncertainty", "Performance pressure", "Health concerns"],
            physicalSigns: ["Muscle tension", "Racing thoughts", "Sleep issues"],
            soothingStrategies: ["Mindfulness", "Cognitive restructuring", "Relaxation training"]
          },
          {
            name: "Worried",
            definition: "Concerned about potential negative outcomes",
            triggers: ["Loved ones' safety", "Financial security", "Health issues"],
            physicalSigns: ["Furrowed brow", "Repetitive behaviors", "Distracted attention"],
            soothingStrategies: ["Problem-solving", "Support seeking", "Worry time limits"]
          }
        ]
      },
      intense: {
        name: "Intense Fear",
        emotions: [
          {
            name: "Terrified",
            definition: "Extreme fear that overwhelms normal functioning",
            triggers: ["Life-threatening situations", "Phobic objects", "Trauma triggers"],
            physicalSigns: ["Paralysis", "Extreme physical symptoms", "Irrational behavior"],
            soothingStrategies: ["Immediate safety", "Professional help", "Grounding techniques"]
          },
          {
            name: "Panic",
            definition: "Sudden overwhelming fear with physical symptoms",
            triggers: ["Panic triggers", "Overwhelming stress", "Phobic situations"],
            physicalSigns: ["Racing heart", "Difficulty breathing", "Feeling of doom"],
            soothingStrategies: ["Panic management techniques", "Medical evaluation", "Therapy"]
          },
          {
            name: "Petrified",
            definition: "So frightened that normal function is impossible",
            triggers: ["Extreme threats", "Trauma responses", "Overwhelming situations"],
            physicalSigns: ["Complete stillness", "Inability to move", "Blank stare"],
            soothingStrategies: ["Trauma therapy", "Medical support", "Safety establishment"]
          }
        ]
      }
    }
  },

  joy: {
    name: "Joy",
    color: "#059669", // emerald-600
    description: "A response to positive experiences and fulfillment",
    icon: "😊",
    subcategories: {
      mild: {
        name: "Mild Joy",
        emotions: [
          {
            name: "Content",
            definition: "Peaceful satisfaction with current circumstances",
            triggers: ["Comfort", "Security", "Simple pleasures"],
            physicalSigns: ["Relaxed posture", "Gentle smile", "Calm breathing"],
            soothingStrategies: ["Savor the moment", "Gratitude practice", "Mindful appreciation"]
          },
          {
            name: "Pleased",
            definition: "Mildly happy about something positive",
            triggers: ["Compliments", "Small successes", "Nice gestures"],
            physicalSigns: ["Light smile", "Brighter eyes", "Upright posture"],
            soothingStrategies: ["Share the joy", "Record positive moments", "Express gratitude"]
          },
          {
            name: "Satisfied",
            definition: "Feeling fulfilled after achieving something",
            triggers: ["Completed tasks", "Met goals", "Good decisions"],
            physicalSigns: ["Relaxed shoulders", "Confident posture", "Deep breath"],
            soothingStrategies: ["Celebrate achievements", "Reflect on growth", "Set new goals"]
          }
        ]
      },
      moderate: {
        name: "Moderate Joy",
        emotions: [
          {
            name: "Happy",
            definition: "Clear positive emotions and well-being",
            triggers: ["Good news", "Social connection", "Personal success"],
            physicalSigns: ["Bright smile", "Energetic movement", "Animated speech"],
            soothingStrategies: ["Share with others", "Engage in activities", "Create memories"]
          },
          {
            name: "Cheerful",
            definition: "Lively and positive mood that affects others",
            triggers: ["Beautiful weather", "Fun activities", "Positive interactions"],
            physicalSigns: ["Laughter", "Quick movements", "Engaging behavior"],
            soothingStrategies: ["Spread positivity", "Engage socially", "Active participation"]
          },
          {
            name: "Delighted",
            definition: "Taking great pleasure in something wonderful",
            triggers: ["Surprises", "Achievements", "Beautiful experiences"],
            physicalSigns: ["Wide smile", "Clapping", "Bouncy movement"],
            soothingStrategies: ["Full engagement", "Share enthusiasm", "Create similar experiences"]
          }
        ]
      },
      intense: {
        name: "Intense Joy",
        emotions: [
          {
            name: "Ecstatic",
            definition: "Overwhelming feeling of great happiness",
            triggers: ["Major achievements", "Life events", "Peak experiences"],
            physicalSigns: ["Full body engagement", "Tears of joy", "Uncontrollable smiling"],
            soothingStrategies: ["Full expression", "Share widely", "Document the moment"]
          },
          {
            name: "Euphoric",
            definition: "Intense state of happiness and well-being",
            triggers: ["Major successes", "Spiritual experiences", "Love"],
            physicalSigns: ["Energy surge", "Feeling invincible", "Heightened senses"],
            soothingStrategies: ["Ground the experience", "Make positive decisions", "Connect with others"]
          },
          {
            name: "Elated",
            definition: "Extremely happy and excited",
            triggers: ["Major victories", "Life milestones", "Dream fulfillment"],
            physicalSigns: ["Jumping", "Loud celebration", "Radiant expression"],
            soothingStrategies: ["Celebration rituals", "Share the joy", "Plan next steps"]
          }
        ]
      }
    }
  },

  disgust: {
    name: "Disgust",
    color: "#065F46", // emerald-800
    description: "A response to something offensive or repulsive",
    icon: "🤢",
    subcategories: {
      mild: {
        name: "Mild Disgust",
        emotions: [
          {
            name: "Dislike",
            definition: "Finding something unpleasant or disagreeable",
            triggers: ["Unpleasant tastes", "Annoying behaviors", "Poor quality"],
            physicalSigns: ["Wrinkled nose", "Turned away", "Slight grimace"],
            soothingStrategies: ["Avoidance", "Express preferences", "Find alternatives"]
          },
          {
            name: "Aversion",
            definition: "Strong dislike that causes avoidance",
            triggers: ["Unpleasant stimuli", "Moral conflicts", "Past negative experiences"],
            physicalSigns: ["Physical withdrawal", "Closed posture", "Protective gestures"],
            soothingStrategies: ["Honor boundaries", "Gradual exposure if needed", "Communicate limits"]
          }
        ]
      },
      moderate: {
        name: "Moderate Disgust",
        emotions: [
          {
            name: "Revolted",
            definition: "Strong disgust that causes rejection",
            triggers: ["Offensive behavior", "Moral violations", "Unpleasant experiences"],
            physicalSigns: ["Visible recoil", "Nausea", "Strong facial expressions"],
            soothingStrategies: ["Remove from situation", "Cleansing rituals", "Seek support"]
          },
          {
            name: "Repulsed",
            definition: "Intense rejection and desire to get away",
            triggers: ["Gross stimuli", "Ethical violations", "Threatening behavior"],
            physicalSigns: ["Physical backing away", "Protective posture", "Visible distress"],
            soothingStrategies: ["Immediate removal", "Boundary setting", "Self-care"]
          }
        ]
      },
      intense: {
        name: "Intense Disgust",
        emotions: [
          {
            name: "Sickened",
            definition: "Disgust so strong it affects physical well-being",
            triggers: ["Extreme violations", "Traumatic experiences", "Moral outrage"],
            physicalSigns: ["Nausea", "Vomiting", "Physical illness"],
            soothingStrategies: ["Medical attention", "Trauma therapy", "Complete avoidance"]
          },
          {
            name: "Loathing",
            definition: "Intense hatred mixed with disgust",
            triggers: ["Extreme betrayal", "Abusive behavior", "Deep moral violations"],
            physicalSigns: ["Complete rejection", "Aggressive avoidance", "Physical symptoms"],
            soothingStrategies: ["Professional help", "Complete boundaries", "Healing work"]
          }
        ]
      }
    }
  },

  surprise: {
    name: "Surprise",
    color: "#7C3AED", // violet-600
    description: "A response to unexpected events or information",
    icon: "😮",
    subcategories: {
      mild: {
        name: "Mild Surprise",
        emotions: [
          {
            name: "Curious",
            definition: "Interested in something unexpected or new",
            triggers: ["New information", "Unusual events", "Mysteries"],
            physicalSigns: ["Raised eyebrows", "Leaning forward", "Alert posture"],
            soothingStrategies: ["Explore further", "Ask questions", "Stay open"]
          },
          {
            name: "Intrigued",
            definition: "Fascinated by something mysterious or interesting",
            triggers: ["Puzzles", "New people", "Unexpected connections"],
            physicalSigns: ["Focused attention", "Slight smile", "Engaged posture"],
            soothingStrategies: ["Investigate", "Learn more", "Embrace mystery"]
          }
        ]
      },
      moderate: {
        name: "Moderate Surprise",
        emotions: [
          {
            name: "Surprised",
            definition: "Unexpected reaction to sudden events",
            triggers: ["Unexpected news", "Sudden changes", "Surprises"],
            physicalSigns: ["Wide eyes", "Open mouth", "Startled posture"],
            soothingStrategies: ["Take time to process", "Ask for clarification", "Adapt plans"]
          },
          {
            name: "Amazed",
            definition: "Wonder and astonishment at something remarkable",
            triggers: ["Impressive achievements", "Natural wonders", "Human capabilities"],
            physicalSigns: ["Wide eyes", "Open expression", "Leaning in"],
            soothingStrategies: ["Savor the wonder", "Share the experience", "Learn from it"]
          }
        ]
      },
      intense: {
        name: "Intense Surprise",
        emotions: [
          {
            name: "Shocked",
            definition: "Overwhelming surprise that temporarily stops functioning",
            triggers: ["Traumatic news", "Extreme events", "Life-changing information"],
            physicalSigns: ["Frozen posture", "Pale color", "Difficulty speaking"],
            soothingStrategies: ["Take time to process", "Seek support", "Professional help if needed"]
          },
          {
            name: "Stunned",
            definition: "So surprised that normal thinking is disrupted",
            triggers: ["Extreme unexpected events", "Shocking revelations", "Overwhelming experiences"],
            physicalSigns: ["Blank stare", "Inability to respond", "Physical stillness"],
            soothingStrategies: ["Allow processing time", "Ground yourself", "Seek understanding"]
          }
        ]
      }
    }
  }
};

// Helper functions for emotion wheel navigation
export const getAllEmotions = () => {
  const emotions = [];
  Object.values(EMOTION_WHEEL).forEach(category => {
    Object.values(category.subcategories).forEach(subcategory => {
      emotions.push(...subcategory.emotions.map(emotion => ({
        ...emotion,
        category: category.name,
        subcategory: subcategory.name,
        color: category.color,
        icon: category.icon
      })));
    });
  });
  return emotions;
};

export const getEmotionsByCategory = (categoryName) => {
  const category = EMOTION_WHEEL[categoryName.toLowerCase()];
  if (!category) return [];
  
  const emotions = [];
  Object.values(category.subcategories).forEach(subcategory => {
    emotions.push(...subcategory.emotions);
  });
  return emotions;
};

export const getEmotionByName = (name) => {
  const allEmotions = getAllEmotions();
  return allEmotions.find(emotion => emotion.name.toLowerCase() === name.toLowerCase());
};