"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Trash2, Eye, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function SavedPlans({ onLoadPlan }) {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchPlans();
    }
  }, [user]);

  const fetchPlans = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/user-plans?userId=${user.uid}`);
      if (res.ok) {
        const data = await res.json();
        setPlans(data.plans || []);
      } else {
        console.error("Failed to fetch plans");
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (planId, e) => {
    e.stopPropagation();

    // First click arms the delete confirmation for this plan.
    if (confirmDeleteId !== planId) {
      setConfirmDeleteId(planId);
      // Auto-clear the confirmation after 5 seconds
      setTimeout(() => {
        if (confirmDeleteId === planId) setConfirmDeleteId(null);
      }, 5000);
      return;
    }

    // Second click confirms and proceeds with deletion
    setDeletingId(planId);
    setConfirmDeleteId(null);
    try {
      const res = await fetch("/api/delete-plan", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          firebaseUserId: user.uid,
        }),
      });

      if (res.ok) {
        setPlans(plans.filter((p) => p.id !== planId));
      } else {
        const error = await res.json();
        // Show a non-blocking console message; avoid window alerts
        console.error(error.error || "Failed to delete plan");
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleLoadPlan = (plan) => {
    if (onLoadPlan) {
      // Log the raw plan data to verify structure
      console.log('Raw saved plan:', plan);

      // Structure the plan data correctly for the components
      const planData = plan.plan_data || {};
      
      // Ensure we extract all possible locations of diet and tips data
      const extractDietPlan = () => {
        return (
          planData.diet || // New format
          planData.dietPlan || // Legacy format
          (planData.workout && planData.workout.dietPlan) || // Very old format
          null
        );
      };
      
      const extractTips = () => {
        return (
          planData.tips || // New format
          planData.aiTips || // Legacy format v1
          (planData.workout && planData.workout.tips) || // Very old format
          null
        );
      };

      const structuredPlan = {
        workout: planData.workout || planData,
        diet: extractDietPlan(),
        tips: extractTips()
      };
      
      // Log the structured plan to verify transformation
      console.log('Structured plan:', structuredPlan);
      
      onLoadPlan({
        plan: structuredPlan,
        userData: plan.user_form_data,
      });
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </motion.div>
    );
  }

  if (plans.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          📋 My Saved Plans
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          No saved plans yet. Generate a plan to see it here!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          📋 My Saved Plans
        </h2>
        <button
          onClick={fetchPlans}
          className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleLoadPlan(plan)}
              className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg cursor-pointer border-2 border-transparent hover:border-primary transition-all shadow-md"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-primary" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {plan.user_form_data?.name || "Plan"}
                  </span>
                </div>
                <button
                  onClick={(e) => handleDelete(plan.id, e)}
                  disabled={deletingId === plan.id}
                  className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition disabled:opacity-50"
                  title="Delete plan"
                >
                  {deletingId === plan.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : confirmDeleteId === plan.id ? (
                    <span className="text-sm font-semibold text-red-600">Confirm</span>
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  <p className="font-medium">
                    Goal: {plan.user_form_data?.goal || "N/A"}
                  </p>
                  <p>
                    Created: {format(new Date(plan.created_at), "MMM dd, yyyy")}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 mt-3">
                  <Eye size={14} className="text-primary" />
                  <span className="text-xs text-primary font-medium">
                    Click to load
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

