"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { LogOut, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const { user, logOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-semibold">🏋️‍♂️ AI Fitness Coach</h1>

        {/* Desktop actions */}
        {user && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center gap-4"
          >
            <div className="flex items-center gap-2">
              <User size={18} />
              <span className="text-sm">{user.email}</span>
            </div>
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
            >
              <LogOut size={16} />
              Logout
            </motion.button>
          </motion.div>
        )}

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center">
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((s) => !s)}
            className="p-2 rounded-md bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {user && open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden mt-3 px-4 pb-4"
        >
          <div className="flex flex-col gap-3 bg-white/5 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <User size={18} />
              <span className="text-sm">{user.email}</span>
            </div>

            {/* Theme toggle inside mobile menu */}
            <div className="flex items-center justify-between px-1">
              <div className="text-sm text-gray-100">Theme</div>
              <ThemeToggle inline />
            </div>

            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 bg-white/10 hover:bg-white/20 rounded-md flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
}
