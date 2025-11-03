"use client";
import { useTheme } from "@/hooks/useTheme";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ inline = false }) {
  const { theme, toggleTheme } = useTheme();

  const baseClasses = inline
    ? "inline-flex items-center p-2 rounded-md hover:bg-white/10 transition text-sm"
    : "hidden md:inline-flex fixed top-4 right-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition border border-gray-200 dark:border-gray-700";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={baseClasses}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className={inline ? "text-gray-200" : "text-gray-800"} size={inline ? 18 : 20} />
      ) : (
        <Sun className={inline ? "text-yellow-300" : "text-yellow-500"} size={inline ? 18 : 20} />
      )}
    </motion.button>
  );
}

