"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// Components
import UserForm from "@/components/UserForm";
import WorkoutPlan from "@/components/WorkoutPlan";
import DietPlan from "@/components/DietPlan";
import AITips from "@/components/AITips";
import ThemeToggle from "@/components/ThemeToggle";
import PDFExportButton from "@/components/PDFExportButton";
import AudioPlayer from "@/components/AudioPlayer";
import DailyMotivation from "@/components/DailyMotivation";
import SavedPlans from "@/components/SavedPlans";

export default function Home() {
  // Auth related hooks
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // State management
  const [formData, setFormData] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [savedPlan, setSavedPlan] = useLocalStorage("fitnessPlan", null);
  const [triggerGeneration, setTriggerGeneration] = useState(null);
  const [showSavedPlans, setShowSavedPlans] = useState(false);
  
  // Query hooks
  const queryClient = useQueryClient();
  const { 
    data: generatedPlan, 
    isLoading: isGenerating, 
    error: generationError, 
    refetch: regeneratePlan 
  } = useQuery({
    queryKey: ["fitness-plan", triggerGeneration],
    queryFn: async () => {
      if (!triggerGeneration) return null;

      // If we already have the plan cached (for example when loading a saved plan),
      // return it immediately to avoid re-generating and re-saving which causes duplicates.
      try {
        const cached = queryClient.getQueryData(["fitness-plan", triggerGeneration]);
        if (cached) {
          return cached;
        }
      } catch (e) {
        // ignore cache lookup errors and continue to generate
      }

      const cleanData = { ...triggerGeneration };
      delete cleanData._regenerate;

      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate plan");
      }

      const data = await res.json();
      // Cache generated plan locally. Do NOT auto-save to the database here.
      // Saving to Supabase should only happen when the user explicitly
      // clicks the "Save Plan" button in the UI (handled in WorkoutPlan).
      setSavedPlan({ plan: data, userData: cleanData });

      return data;
    },
    enabled: !!triggerGeneration,
  });

  // Effects
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // If the dashboard saved a trigger (dashboard -> home flow), pick it up once and start generation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('dashboardTrigger');
      if (raw) {
        const data = JSON.parse(raw);
        setFormData(data);
        setTriggerGeneration(data);
        localStorage.removeItem('dashboardTrigger');
      }
    } catch (e) {
      console.error('Error reading dashboard trigger:', e);
    }
  }, []);

  useEffect(() => {
    if (triggerGeneration) {
      regeneratePlan();
    }
  }, [triggerGeneration, regeneratePlan]);

  // Event handlers
  const handleFormSubmit = (data) => {
    setFormData(data);
    setSelectedSection("confirm"); // Set intermediate confirmation step
  };

  const handleConfirm = () => {
    setTriggerGeneration(formData); // Trigger plan generation only after confirmation
    setSelectedSection(null); // Reset intermediate step
  };

  const handleRegenerate = () => {
    if (formData) {
      setTriggerGeneration({ ...formData, _regenerate: Date.now() });
    }
  };

  const handleNewPlan = () => {
    setFormData(null);
    setSelectedSection(null);
    setTriggerGeneration(null);
  };

  const handleLoadSavedPlan = ({ plan: savedPlanData, userData: savedUserData }) => {
    // Helper functions to extract data from various possible locations
    const extractWorkoutPlan = (data) => {
      return data.workout || 
        ((!data.workout && !data.diet && !data.tips) ? data : null);
    };

    const extractDietPlan = (data) => {
      return data.diet ||                     // New format
        data.dietPlan ||                      // Legacy format v1
        (data.workout && data.workout.diet) || // Legacy nested format
        (data.workout && data.workout.dietPlan); // Very old format
    };

    const extractTips = (data) => {
      return data.tips ||                     // New format
        data.aiTips ||                        // Legacy format v1
        (data.workout && data.workout.tips) || // Legacy nested format
        (data.workout && data.workout.aiTips); // Very old format
    };

    // Ensure savedPlanData has the expected structure with all sections
    const structuredPlan = {
      workout: extractWorkoutPlan(savedPlanData),
      diet: extractDietPlan(savedPlanData),
      tips: extractTips(savedPlanData)
    };

    // Log the plan structure to verify content
    console.log('Loading saved plan:', structuredPlan);

    setFormData(savedUserData);
    queryClient.setQueryData(["fitness-plan", savedUserData], structuredPlan);
    setSavedPlan({ plan: structuredPlan, userData: savedUserData });
    setTriggerGeneration(savedUserData);
    queryClient.invalidateQueries({ queryKey: ["fitness-plan", savedUserData] });
    // close the saved plans panel after loading
    setShowSavedPlans(false);
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-semibold">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Auth guard
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8">
        <ThemeToggle />

        {!formData && !generatedPlan && <DailyMotivation />}

        {/* Saved Plans toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowSavedPlans((s) => !s)}
            className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {showSavedPlans ? 'Close Saved Plans' : 'Saved Plans'}
          </button>
        </div>

        {/* Render saved plans only when toggled open */}
        {showSavedPlans && user && (
          <div className="mb-8">
            <SavedPlans onLoadPlan={(p) => { handleLoadSavedPlan(p); setShowSavedPlans(false); }} />
          </div>
        )}

        {/* Confirmation step */}
        {selectedSection === "confirm" && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">Confirm Your Details</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Please confirm your fitness preferences before generating the plan.</p>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Confirm and Generate Plan
            </button>
            <button
              onClick={() => setSelectedSection(null)}
              className="ml-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Go Back
            </button>
          </div>
        )}

        {!generatedPlan && !isGenerating && selectedSection !== "confirm" && (
          <UserForm onSubmit={handleFormSubmit} savedData={savedPlan} />
        )}

        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="text-center py-16"
          >
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p className="text-xl text-gray-600 dark:text-gray-300 font-semibold">
              {generatedPlan ? "Regenerating your personalized plan..." : "AI is generating your personalized plan..."}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              This may take a few moments
            </p>
          </motion.div>
        )}

        {generationError && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto p-6 bg-red-100 dark:bg-red-900 rounded-lg mb-6"
          >
            <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
              Error: {generationError.message}
            </p>
            <button
              onClick={handleRegenerate}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {generatedPlan && !isGenerating && (
          <div className="space-y-8">
            {formData && (
              <div className="flex justify-end gap-4 mb-8">
                <button
                  onClick={handleNewPlan}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Create New Plan
                </button>
                <button
                  onClick={() => {
                    // go back to dashboard
                    router.push('/dashboard');
                  }}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={handleRegenerate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Regenerate Plan
                </button>
                <PDFExportButton plan={generatedPlan} userData={formData} />
              </div>
            )}

            <AudioPlayer plan={generatedPlan} selectedSection={selectedSection} onSectionChange={setSelectedSection} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <WorkoutPlan plan={generatedPlan.workout} userFormData={formData} />
              <div className="space-y-8">
                <DietPlan plan={generatedPlan.diet} />
                <AITips tips={generatedPlan.tips} />
              </div>
            </div>

            
          </div>
        )}
      </div>
    </div>
  );
}