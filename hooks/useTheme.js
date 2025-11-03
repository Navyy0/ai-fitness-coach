import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

// Persist theme in Supabase per-user. Falls back to system preference when no stored theme.
export function useTheme() {
  const { user } = useAuth();
  const [theme, setTheme] = useState("light");

  // Apply theme to document
  const applyTheme = (t) => {
    document.documentElement.classList.toggle("dark", t === "dark");
  };

  useEffect(() => {
    const init = async () => {
      // If user is available, try to load their saved preference from Supabase via API
      if (user) {
        try {
          const res = await fetch(`/api/user-preferences?userId=${user.uid}`);
          if (res.ok) {
            const json = await res.json();
            const savedTheme = json?.preferences?.theme;
            if (savedTheme) {
              setTheme(savedTheme);
              applyTheme(savedTheme);
              return;
            }
          }
        } catch (e) {
          console.error('Failed to load user theme preference:', e);
        }
      }

      // Fallback: system preference
      const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      applyTheme(initialTheme);
    };

    init();
    // only run when user changes
  }, [user]);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    applyTheme(newTheme);

    // Persist preference if user is available
    if (user) {
      try {
        await fetch('/api/user-preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firebaseUserId: user.uid, preferences: { theme: newTheme } }),
        });
      } catch (e) {
        console.error('Failed to save theme preference:', e);
      }
    }
  };

  return { theme, toggleTheme };
}

