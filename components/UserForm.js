"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function UserForm({ onSubmit, savedData }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal: "",
    fitnessLevel: "",
    location: "",
    dietary: "",
    medicalHistory: "",
    stressLevel: "",
  });

  const [currentSection, setCurrentSection] = useState(0);
  const [formProgress, setFormProgress] = useState(0);
  const [hasShownCompleteAlert, setHasShownCompleteAlert] = useState(false);

  const formFields = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "age", label: "Age", type: "number", required: true },
    { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"], required: true },
    { name: "height", label: "Height (cm)", type: "number", required: true },
    { name: "weight", label: "Weight (kg)", type: "number", required: true },
    { name: "goal", label: "Fitness Goal", type: "select", 
      options: ["Weight Loss", "Muscle Gain", "General Fitness", "Endurance", "Strength"], required: true },
    { name: "fitnessLevel", label: "Fitness Level", type: "select", 
      options: ["Beginner", "Intermediate", "Advanced"], required: false },
    { name: "location", label: "Workout Location", type: "select", 
      options: ["Home", "Gym", "Outdoor", "Mix"], required: false },
    { name: "dietary", label: "Dietary Preferences", type: "select",
      options: ["Vegetarian", "Non-Vegetarian", "Vegan", "Keto", "Balanced", "Mediterranean"], required: false },
    { name: "stressLevel", label: "Stress Level", type: "select", 
      options: ["Low", "Moderate", "High"], required: false },
    { name: "medicalHistory", label: "Medical History", type: "textarea", required: false }
  ];

  useEffect(() => {
    if (savedData?.userData) {
      setFormData(savedData.userData);
      // Calculate progress based on filled fields
      const filledFields = Object.values(savedData.userData).filter(Boolean).length;
      setFormProgress((filledFields / formFields.length) * 100);
    }
  }, [savedData]);

  // When the user fills all required fields, show a single alert (only once)
  useEffect(() => {
    if (hasShownCompleteAlert) return;
    const required = formFields.filter((f) => f.required).map((f) => f.name);
    const allFilled = required.every((name) => Boolean(formData[name]));
    if (allFilled) {
      // Show one alert to inform the user that the form is complete
      window.alert("All required fields are complete. Click 'Generate Plan' to create your personalized plan.");
      setHasShownCompleteAlert(true);
    }
  }, [formData, formFields, hasShownCompleteAlert]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      const filledFields = Object.values(newData).filter(Boolean).length;
      setFormProgress((filledFields / formFields.length) * 100);
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = formFields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formData[field.name]);
    
    // Only allow submission on the last page (medical history)
    if (currentSection !== Math.ceil(formFields.length / 2) - 1) {
      return;
    }
    
    if (missingFields.length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-2xl mx-auto bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl rounded-2xl p-8 relative overflow-hidden"
    >
      {/* Background Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full -mr-32 -mt-32 pointer-events-none"
      />
      
      {/* Title Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
          🏋️ AI Fitness Coach
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Let's create your personalized fitness journey
        </p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${formProgress}%` }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Show fields based on current section */}
            {(currentSection === Math.ceil(formFields.length / 2) - 1 
              ? formFields.slice(-1)
              : formFields.slice(
                  currentSection * 2,
                  (currentSection + 1) * 2
                )).map((field) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={field.type === "textarea" ? "col-span-2" : ""}
              >
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  {field.label} {field.required && <span className="text-primary">*</span>}
                </label>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    rows="3"
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <motion.button
            type="button"
            onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
            disabled={currentSection === 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Previous
          </motion.button>

          {/* Show Generate Plan button only on medical history page */}
          {currentSection === Math.ceil(formFields.length / 2) - 1 && formData.medicalHistory ? (
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Generate Plan 🚀
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={() => setCurrentSection(prev => Math.min(Math.ceil(formFields.length / 2) - 1, prev + 1))}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              {currentSection === Math.ceil(formFields.length / 2) - 1 ? 'Complete Medical History' : 'Next'}
            </motion.button>
          )}
        </div>
      </form>
    </motion.div>
  );
}
