import React, { createContext, useContext, useEffect, useState } from "react";
import { getThemeColors, themeColors } from "../theme/themeConfig";

// Define the shape of preferences
export interface Preferences {
  theme: "light" | "dark";
  unit: "kg" | "lbs";
  notifications: boolean;
}

// Default preferences
const defaultPreferences: Preferences = {
  theme: "light",
  unit: "kg",
  notifications: true,
};

interface PreferenceContextType {
  preferences: Preferences;
  updatePreferences: (prefs: Partial<Preferences>) => void;
  setPreferences: (prefs: Preferences) => void;
  currentTheme: ReturnType<typeof getThemeColors>;
  themeColors: typeof themeColors;
  toggleTheme: () => void;
}

const PreferenceContext = createContext<PreferenceContextType>({
  preferences: defaultPreferences,
  updatePreferences: () => {},
  setPreferences: () => {},
  currentTheme: getThemeColors("light"),
  themeColors: themeColors,
  toggleTheme: () => {},
});

export const PreferenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [userId, setUserId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Get current theme colors
  const currentTheme = getThemeColors(preferences.theme);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = preferences.theme === "light" ? "dark" : "light";
    updatePreferences({ theme: newTheme });
  };

  // 🔁 This effect watches for user changes
  useEffect(() => {
    const checkUser = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        if (user._id !== userId) {
          setUserId(user._id);
          const savedPrefs = localStorage.getItem(`userPreferences_${user._id}`);
          setPreferences(savedPrefs ? JSON.parse(savedPrefs) : defaultPreferences);
        }
      } else {
        setUserId(null);
        setPreferences(defaultPreferences); // Reset on logout
      }
    };

    checkUser(); // Call immediately on mount
    setIsReady(true); // Mark as ready after first check

    // ✅ Listen to storage change events across tabs/windows
    window.addEventListener("storage", checkUser);

    return () => {
      window.removeEventListener("storage", checkUser);
    };
  }, [userId]);

  // ✅ Save preferences whenever they change
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`userPreferences_${userId}`, JSON.stringify(preferences));
    }
  }, [preferences, userId]);

  // Apply theme to document body
  useEffect(() => {
    document.body.style.backgroundColor = currentTheme.background;
    document.body.style.color = currentTheme.text;
    document.body.style.transition = "background-color 0.3s ease, color 0.3s ease";
  }, [currentTheme]);

  const updatePreferences = (newPrefs: Partial<Preferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPrefs }));
  };

  // Show loading state until ready
  if (!isReady) {
    return null;
  }

  return (
    <PreferenceContext.Provider
      value={{
        preferences,
        updatePreferences,
        setPreferences,
        currentTheme,
        themeColors,
        toggleTheme,
      }}
    >
      {children}
    </PreferenceContext.Provider>
  );
};

export const usePreferences = () => useContext(PreferenceContext);
