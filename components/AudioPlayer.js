"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2 } from "lucide-react";

export default function AudioPlayer({ plan, selectedSection, onSectionChange }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const speechSynthesisRef = useRef(null);
  const utteranceRef = useRef(null);

  const generateText = (section) => {
    let text = "";
    
    if (section === "workout" && plan.workout) {
      text = "Workout Plan. ";
      plan.workout.dailyRoutines?.forEach((routine) => {
        text += `${routine.day}. `;
        routine.exercises?.forEach((exercise) => {
          text += `${exercise.name}. Sets: ${exercise.sets}. Reps: ${exercise.reps}. ${exercise.description}. `;
        });
      });
    } else if (section === "diet" && plan.diet) {
      text = "Diet Plan. ";
      plan.diet.meals?.forEach((meal) => {
        text += `${meal.meal}. `;
        meal.foods?.forEach((food) => {
          text += `${food.name}. Portion: ${food.portion}. Calories: ${food.calories}. ${food.description}. `;
        });
      });
    }
    
    return text || "No content available.";
  };

  // Check if Web Speech API is available
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      speechSynthesisRef.current = window.speechSynthesis;
    } else {
      console.warn("Web Speech API is not supported in this browser");
    }

    // Cleanup on unmount
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  const handlePlay = async (section) => {
    if (!selectedSection || selectedSection !== section) {
      onSectionChange(section);
    }

    // Stop current speech if playing
    if (isPlaying && currentSection === section) {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
      setIsPlaying(false);
      setCurrentSection(null);
      return;
    }

    // Stop any other section if playing
    if (isPlaying) {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    }

    if (!speechSynthesisRef.current) {
      console.warn("Text-to-speech is not supported in your browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    setLoading(true);
    try {
      let text = generateText(section);
      
      // Web Speech API can handle long text, but let's truncate very long content
      const maxLength = 10000; // More lenient than ElevenLabs
      if (text.length > maxLength) {
        text = text.substring(0, maxLength) + "... [Content truncated for audio generation]";
      }
      
      // Cancel any ongoing speech
      speechSynthesisRef.current.cancel();
      
      // Create new speech utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice settings
      utterance.rate = 1.0; // Normal speed
      utterance.pitch = 1.0; // Normal pitch
      utterance.volume = 1.0; // Full volume
      
      // Try to use a more natural voice if available
      const voices = speechSynthesisRef.current.getVoices();
      const preferredVoice = voices.find(
        voice => voice.lang.includes("en") && (voice.name.includes("Google") || voice.name.includes("Samantha") || voice.name.includes("Karen"))
      ) || voices.find(voice => voice.lang.includes("en"));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      // Set up event handlers
      utterance.onstart = () => {
        setIsPlaying(true);
        setCurrentSection(section);
        setLoading(false);
      };
      
      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentSection(null);
      };
      
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsPlaying(false);
        setCurrentSection(null);
        setLoading(false);
      };
      
      utteranceRef.current = utterance;
      
      // Speak the text
      speechSynthesisRef.current.speak(utterance);
      
    } catch (error) {
      console.error("Error generating audio:", error);
      setLoading(false);
    }
  };

  // Load voices when component mounts
  useEffect(() => {
    if (speechSynthesisRef.current && speechSynthesisRef.current.getVoices().length === 0) {
      speechSynthesisRef.current.addEventListener("voiceschanged", () => {
        // Voices loaded
      });
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg shadow-lg mb-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Volume2 className="text-white" size={24} />
          <h3 className="text-white font-semibold text-lg">Listen to Your Plan</h3>
        </div>
        
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePlay("workout")}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition ${
              selectedSection === "workout" && isPlaying
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-white bg-opacity-20 hover:bg-opacity-30"
            }`}
          >
            {loading && selectedSection === "workout" ? (
              "Loading..."
            ) : currentSection === "workout" && isPlaying ? (
              <>
                <Pause size={18} className="inline mr-2" />
                Pause Workout
              </>
            ) : (
              <>
                <Play size={18} className="inline mr-2" />
                Workout Plan
              </>
            )}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePlay("diet")}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition ${
              selectedSection === "diet" && isPlaying
                ? "bg-green-600 hover:bg-green-700"
                : "bg-white bg-opacity-20 hover:bg-opacity-30"
            }`}
          >
            {loading && selectedSection === "diet" ? (
              "Loading..."
            ) : currentSection === "diet" && isPlaying ? (
              <>
                <Pause size={18} className="inline mr-2" />
                Pause Diet
              </>
            ) : (
              <>
                <Play size={18} className="inline mr-2" />
                Diet Plan
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

