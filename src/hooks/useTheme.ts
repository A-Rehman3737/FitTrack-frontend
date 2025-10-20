// Safe theme hook with fallback
import { usePreferences } from "../context/preferenceContext";
import { getThemeColors, themeColors as colors } from "../theme/themeConfig";

export const useSafeTheme = () => {
  try {
    const { currentTheme, themeColors, preferences, toggleTheme } = usePreferences();
    return { currentTheme, themeColors, preferences, toggleTheme };
  } catch (error) {
    // Fallback if provider not available
    return {
      currentTheme: getThemeColors("light"),
      themeColors: colors,
      preferences: { theme: "light" as const, unit: "kg" as const, notifications: true },
      toggleTheme: () => {},
    };
  }
};
