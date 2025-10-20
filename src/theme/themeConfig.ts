// Theme Configuration with FitTrack Color Palette
export const themeColors = {
  // Primary Colors from Dashboard
  primary: '#329494',      // Teal/Turquoise (Main brand color)
  secondary: '#ff7043',    // Orange (Nutrition)
  tertiary: '#42a5f5',     // Blue (Calories)
  quaternary: '#ec407a',   // Pink (Heart Rate)

  // Accent Colors
  success: '#4caf50',      // Green
  warning: '#ffc107',      // Yellow
  danger: '#f44336',       // Red
  info: '#2196f3',         // Light Blue

  // Light Mode
  light: {
    background: '#ffffff',
    surface: '#e0f7fa',
    surfaceAlt: '#e0f7f7',
    text: '#333333',
    textSecondary: '#666666',
    textMuted: '#999999',
    border: '#e0e0e0',
    shadow: 'rgba(0, 0, 0, 0.1)',
    cardBg: '#ffffff',
    sidebarBg: '#e0F7FA',
    navbarBg: '#E0F7FA',
  },

  // Dark Mode
  dark: {
    background: '#121212',
    surface: '#1e1e1e',
    surfaceAlt: '#252525',
    text: '#e0e0e0',
    textSecondary: '#b0b0b0',
    textMuted: '#808080',
    border: '#333333',
    shadow: 'rgba(0, 0, 0, 0.5)',
    cardBg: '#2a2a2a',
    sidebarBg: '#1a1a1a',
    navbarBg: '#1e1e1e',
  },
};

// Helper function to get theme colors
export const getThemeColors = (theme: 'light' | 'dark') => {
  return theme === 'light' ? themeColors.light : themeColors.dark;
};

// Card Color Palette (keeping original vibrant colors for both themes)
export const cardColors = {
  workout: '#329494',
  nutrition: '#ff7043',
  calories: '#42a5f5',
  heartRate: '#ec407a',
  progress: '#66bb6a',
  goals: '#ab47bc',
};
