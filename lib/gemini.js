import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generatePlanWithGemini(userData) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = buildPrompt(userData);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return parsePlanResponse(text);
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(`Failed to generate plan: ${error.message}`);
  }
}

function buildPrompt(userData) {
  return `You are an expert fitness coach and nutritionist. Generate a comprehensive, personalized fitness and diet plan for the following user:

User Details:
- Name: ${userData.name}
- Age: ${userData.age}
- Gender: ${userData.gender}
- Height: ${userData.height} cm
- Weight: ${userData.weight} kg
- Fitness Goal: ${userData.goal}
- Fitness Level: ${userData.fitnessLevel || "Beginner"}
- Workout Location: ${userData.location || "Home"}
- Dietary Preferences: ${userData.dietary || "Balanced"}
${userData.medicalHistory ? `- Medical History: ${userData.medicalHistory}` : ""}
${userData.stressLevel ? `- Stress Level: ${userData.stressLevel}` : ""}

IMPORTANT: Generate the plan in valid JSON format ONLY with the following exact structure (no markdown, no code blocks, just pure JSON):

{
  "workout": {
    "dailyRoutines": [
      {
        "day": "Monday",
        "exercises": [
          {
            "name": "Exercise Name",
            "sets": 3,
            "reps": "10-12",
            "rest": "60 seconds",
            "description": "Detailed instructions on how to perform this exercise safely and effectively"
          }
        ]
      },
      {
        "day": "Tuesday",
        "exercises": [
          {
            "name": "Exercise Name",
            "sets": 3,
            "reps": "10-12",
            "rest": "60 seconds",
            "description": "Detailed instructions"
          }
        ]
      },
      {
        "day": "Wednesday",
        "exercises": [
          {
            "name": "Exercise Name",
            "sets": 3,
            "reps": "10-12",
            "rest": "60 seconds",
            "description": "Detailed instructions"
          }
        ]
      },
      {
        "day": "Thursday",
        "exercises": [
          {
            "name": "Exercise Name",
            "sets": 3,
            "reps": "10-12",
            "rest": "60 seconds",
            "description": "Detailed instructions"
          }
        ]
      },
      {
        "day": "Friday",
        "exercises": [
          {
            "name": "Exercise Name",
            "sets": 3,
            "reps": "10-12",
            "rest": "60 seconds",
            "description": "Detailed instructions"
          }
        ]
      },
      {
        "day": "Saturday",
        "exercises": [
          {
            "name": "Exercise Name",
            "sets": 3,
            "reps": "10-12",
            "rest": "60 seconds",
            "description": "Detailed instructions"
          }
        ]
      },
      {
        "day": "Sunday",
        "exercises": [
          {
            "name": "Rest or Light Activity",
            "sets": 0,
            "reps": "N/A",
            "rest": "Full day",
            "description": "Rest day or active recovery"
          }
        ]
      }
    ]
  },
  "diet": {
    "meals": [
      {
        "meal": "Breakfast",
        "foods": [
          {
            "name": "Food Name",
            "portion": "200g",
            "calories": 300,
            "description": "Nutritional benefits and preparation tips"
          }
        ]
      },
      {
        "meal": "Lunch",
        "foods": [
          {
            "name": "Food Name",
            "portion": "250g",
            "calories": 450,
            "description": "Nutritional benefits and preparation tips"
          }
        ]
      },
      {
        "meal": "Dinner",
        "foods": [
          {
            "name": "Food Name",
            "portion": "200g",
            "calories": 400,
            "description": "Nutritional benefits and preparation tips"
          }
        ]
      },
      {
        "meal": "Snacks",
        "foods": [
          {
            "name": "Food Name",
            "portion": "100g",
            "calories": 150,
            "description": "Healthy snack options"
          }
        ]
      }
    ]
  },
  "tips": [
    "Practical lifestyle tip relevant to the user",
    "Posture or form tip for exercises",
    "Nutrition or meal timing tip",
    "Recovery or sleep tip"
  ],
  "motivation": "Personalized motivational message encouraging the user to stay consistent with their fitness journey"
}

Be specific, realistic, and highly personalized. Ensure:
- Exercises match the user's fitness level, goal, and location constraints
- Diet matches dietary preferences and supports the fitness goal
- All exercises are safe for the user's age and medical considerations
- Provide at least 3-4 exercises per workout day
- Provide varied and nutritious meals for all meal types

Return ONLY the JSON object, no other text.`;
}

function parsePlanResponse(text) {
  try {
    // Remove markdown code blocks if present
    let jsonText = text.trim();
    jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    // Try to extract JSON object if there's extra text
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }
    
    const parsed = JSON.parse(jsonText);
    
    // Validate structure
    if (!parsed.workout || !parsed.diet) {
      throw new Error("Invalid plan structure");
    }
    
    return parsed;
  } catch (error) {
    console.error("Failed to parse plan response:", error);
    console.error("Response text:", text);
    
    // Return a fallback structure
    return {
      workout: {
        dailyRoutines: [
          {
            day: "Monday",
            exercises: [
              {
                name: "Push-ups",
                sets: 3,
                reps: "10-15",
                rest: "60 seconds",
                description: "Start in plank position, lower body until chest nearly touches floor, push back up"
              }
            ]
          }
        ]
      },
      diet: {
        meals: [
          {
            meal: "Breakfast",
            foods: [
              {
                name: "Oatmeal with fruits",
                portion: "200g",
                calories: 300,
                description: "High fiber, provides sustained energy"
              }
            ]
          }
        ]
      },
      tips: [
        "Stay hydrated throughout the day",
        "Get 7-9 hours of sleep for recovery",
        "Warm up before workouts"
      ],
      motivation: "You've got this! Stay consistent and you'll see amazing results. Every small step counts!"
    };
  }
}
