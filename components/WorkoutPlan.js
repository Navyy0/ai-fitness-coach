"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import PlanCard from "./PlanCard";
import ImageModal from "./ImageModal";
import { Loader2, Save } from "lucide-react";

export default function WorkoutPlan({ plan, userFormData }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(null);
  const [activeDay, setActiveDay] = useState(0);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  const handleSavePlan = async () => {
    if (!user) {
      alert('Please log in to save plans');
      return;
    }

    setSaving(true);
    try {
      // Get the complete plan from localStorage to save all sections
      const savedData = JSON.parse(localStorage.getItem('fitnessPlan')) || {};
      const savedPlan = savedData.plan || savedData;
      
      // Get current state of diet plan and tips
      const currentDietPlan = savedPlan.diet || savedPlan.dietPlan;
      const currentTips = savedPlan.tips || savedPlan.aiTips;
      
      // Ensure we have all sections of the plan
      const completeData = {
        workout: plan,              // Current workout plan
        diet: currentDietPlan,      // Current diet plan
        tips: currentTips          // Current tips
      };
      
      // Only include sections that have data
      const cleanedPlanData = Object.fromEntries(
        Object.entries(completeData).filter(([_, value]) => value != null)
      );
      
      const response = await fetch('/api/save-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseUserId: user.uid,
          planData: cleanedPlanData,
          userFormData: userFormData,
          userInfo: {
            email: user.email,
            displayName: user.displayName
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save plan');
      }

      alert('Plan saved successfully!');
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Failed to save plan: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleExerciseClick = async (exerciseName) => {
    setLoadingImage(exerciseName);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: exerciseName, type: "exercise" }),
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setSelectedImage({ url: data.image, name: exerciseName });
      } else {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `Failed to generate image (${res.status})`);
      }
    } catch (error) {
      console.error("Error generating image:", error);
      const errorMsg = error.message || "Failed to generate image. Please try again.";
      
      if (errorMsg.includes("rate limit")) {
        console.warn("⚠️ Rate limit exceeded. Please wait a moment and try again. Tip: Add HUGGINGFACE_API_KEY in .env.local for higher limits.");
      } else if (errorMsg.includes("loading")) {
        console.warn("⏳ The image model is loading. Please wait a moment and try again.");
      } else {
        console.error(`❌ ${errorMsg}`);
      }
    } finally {
      setLoadingImage(null);
    }
  };

  if (!plan || !plan.dailyRoutines || plan.dailyRoutines.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PlanCard title="🏋️ Workout Plan">
          <div className="flex flex-col items-center justify-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mb-4 text-4xl flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700"
            >
              🤔
            </motion.div>
            <p className="text-gray-500 dark:text-gray-400 text-center">
              No workout plan available yet.<br/>
              Fill out your details to get started!
            </p>
          </div>
        </PlanCard>
      </motion.div>
    );
  }

  return (
    <>
      <PlanCard title="🏋️ Workout Plan">
        {/* Save button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleSavePlan}
            disabled={saving || !user}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 
              ${saving 
                ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
                : user 
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
              }`}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Saving...' : 'Save Plan'}
          </button>
        </div>

        {/* Day selector tabs */}
        <div className="mb-6 overflow-x-auto">
          <motion.div 
            className="flex space-x-2 min-w-max"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {plan.dailyRoutines.map((routine, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeDay === idx
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setActiveDay(idx)}
              >
                {routine.day}
              </motion.button>
            ))}
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="border-l-4 border-primary pl-4 pb-4"
            >
              <h3 className="text-xl font-bold text-primary mb-4">
                {plan.dailyRoutines[activeDay].day}
              </h3>
              
              {plan.dailyRoutines[activeDay].exercises && 
               plan.dailyRoutines[activeDay].exercises.length > 0 && (
                <div className="space-y-4">
                  {plan.dailyRoutines[activeDay].exercises.map((exercise, exIdx) => (
                    <motion.div
                          key={exIdx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: exIdx * 0.1 }}
                          whileHover={{ scale: 1.02, backgroundColor: "var(--hover-bg)" }}
                          className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                          onClick={() => handleExerciseClick(exercise.name)}
                        >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <motion.h4 
                            className="font-bold text-lg sm:text-xl text-gray-800 dark:text-white mb-3 flex items-center gap-2"
                            layout
                          >
                            <span className="text-primary">#{exIdx + 1}</span>
                            {exercise.name}
                            {loadingImage === exercise.name && (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm text-primary animate-pulse"
                              >
                                Generating image...
                              </motion.span>
                            )}
                          </motion.h4>
                          
                          <motion.div 
                            className="grid grid-cols-3 gap-2 sm:gap-4 text-sm mb-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="bg-gray-50 dark:bg-gray-700 p-2 sm:p-3 rounded-lg text-center min-w-0">
                              <div className="text-primary font-bold text-base sm:text-lg break-words whitespace-normal">{exercise.sets}</div>
                              <div className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">Sets</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-2 sm:p-3 rounded-lg text-center min-w-0">
                              <div className="text-primary font-bold text-base sm:text-lg break-words whitespace-normal">{exercise.reps}</div>
                              <div className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">Reps</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-2 sm:p-3 rounded-lg text-center min-w-0">
                              <div className="text-primary font-bold text-base sm:text-lg break-words whitespace-normal">{exercise.rest}</div>
                              <div className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">Rest</div>
                            </div>
                          </motion.div>

                          {exercise.description && (
                            <motion.p 
                              className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              {exercise.description}
                            </motion.p>
                          )}
                        </div>
                      </div>
                      
                      <motion.div
                        className="mt-4 flex items-center gap-2 text-primary text-sm font-medium"
                        whileHover={{ x: 5 }}
                      >
                        <span>View exercise image</span>
                        <svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </PlanCard>
      
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage.url}
          title={selectedImage.name}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
}