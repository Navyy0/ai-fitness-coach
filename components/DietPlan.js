"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlanCard from "./PlanCard";
import ImageModal from "./ImageModal";

export default function DietPlan({ plan }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(null);
  const [activeMeal, setActiveMeal] = useState(0);

  const handleFoodClick = async (foodName) => {
    setLoadingImage(foodName);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: foodName, type: "food" }),
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setSelectedImage({ url: data.image, name: foodName });
      } else {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `Failed to generate image (${res.status})`);
      }
    } catch (error) {
      console.error("Error generating image:", error);
      const errorMsg = error.message || "Failed to generate image. Please try again.";
      
      // Log helpful messages
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

  if (!plan || !plan.meals || plan.meals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PlanCard title="🥗 Diet Plan">
          <div className="flex flex-col items-center justify-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mb-4 text-4xl flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700"
            >
              🍽️
            </motion.div>
            <p className="text-gray-500 dark:text-gray-400 text-center">
              No diet plan available yet.<br/>
              Fill out your details to get started!
            </p>
          </div>
        </PlanCard>
      </motion.div>
    );
  }

  return (
    <>
      <PlanCard title="🥗 Diet Plan">
        {/* Meal selector tabs */}
        <div className="mb-6 overflow-x-auto">
          <motion.div 
            className="flex space-x-2 min-w-max"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {plan.meals.map((meal, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeMeal === idx
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setActiveMeal(idx)}
              >
                {meal.type || meal.meal}
              </motion.button>
            ))}
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeMeal}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg mb-6">
                <h3 className="text-xl font-bold text-primary mb-2">
                  {plan.meals[activeMeal].type || plan.meals[activeMeal].meal}
                </h3>
                {plan.meals[activeMeal].timing && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    🕒 Recommended time: {plan.meals[activeMeal].timing}
                  </p>
                )}
              
              </div>

              <div className="space-y-4">
                {plan.meals[activeMeal].foods?.map((food, idx) => (
                  <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02, backgroundColor: "var(--hover-bg)" }}
                      className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                      onClick={() => handleFoodClick(food.name)}
                    >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <motion.h4 
                          className="font-bold text-lg sm:text-xl text-gray-800 dark:text-white mb-3 flex items-center gap-2"
                          layout
                        >
                          {food.name}
                          {loadingImage === food.name && (
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
                          className="grid grid-cols-2 gap-2 sm:gap-4 text-sm mb-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {food.portion && (
                            <div className="bg-gray-50 dark:bg-gray-700 p-2 sm:p-3 rounded-lg text-center">
                              <div className="text-primary font-bold text-lg">{food.portion}</div>
                              <div className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">Portion</div>
                            </div>
                          )}
                          {food.calories && (
                            <div className="bg-gray-50 dark:bg-gray-700 p-2 sm:p-3 rounded-lg text-center">
                              <div className="text-primary font-bold text-lg">{food.calories}</div>
                              <div className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">Calories</div>
                            </div>
                          )}
                        </motion.div>

                        {food.description && (
                          <motion.p 
                            className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            {food.description}
                          </motion.p>
                        )}
                      </div>
                    </div>
                    
                    <motion.div
                      className="mt-4 flex items-center gap-2 text-primary text-sm font-medium"
                      whileHover={{ x: 5 }}
                    >
                      <span>View food image</span>
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
                {(!plan.meals[activeMeal].foods || plan.meals[activeMeal].foods.length === 0) && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-gray-500 dark:text-gray-400 italic py-8"
                  >
                    No foods listed for this meal
                  </motion.p>
                )}
              </div>
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

