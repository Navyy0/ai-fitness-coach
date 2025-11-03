"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import UserForm from "@/components/UserForm";
import SavedPlans from "@/components/SavedPlans";
import ThemeToggle from "@/components/ThemeToggle";

export default function Dashboard() {
  const router = useRouter();
  const [formData, setFormData] = useState(null);

  const handleFormSubmit = (data) => {
    // Save form data to localStorage so the Home page can pick it up and start generation
    try {
      localStorage.setItem('dashboardTrigger', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save dashboard trigger:', e);
    }
    // Navigate to home (which will read the trigger and start generation)
    router.push('/');
  };

  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold"
        >
          Dashboard
        </motion.h1>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Create a new plan</h2>
            <UserForm onSubmit={(data) => { setFormData(data); handleFormSubmit(data); }} savedData={null} />
          </motion.div>
        </div>

        <div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Saved plans</h2>
            <SavedPlans onLoadPlan={(p) => {
              // When user picks a saved plan from the dashboard, navigate to home and load it
              try { localStorage.setItem('dashboardTrigger', JSON.stringify(p.userData)); } catch(e){ console.error(e); }
              router.push('/');
            }} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
