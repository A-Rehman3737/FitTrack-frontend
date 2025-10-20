// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  BASE: API_BASE_URL,

  // User Routes
  USERS: {
    LOGIN: `${API_BASE_URL}/api/users/login`,
    REGISTER: `${API_BASE_URL}/api/users/register`,
    PROFILE: `${API_BASE_URL}/api/users/profile`,
    UPDATE: (userId: string) => `${API_BASE_URL}/api/users/update/${userId}`,
    NOTIFICATIONS: `${API_BASE_URL}/api/users/notifications`,
    PEOPLE: `${API_BASE_URL}/api/users/people`,
    FOLLOW: (id: string) => `${API_BASE_URL}/api/users/follow/${id}`,
    FOLLOW_STATUS: (id: string) => `${API_BASE_URL}/api/users/follow-status/${id}`,
  },

  // Workout Routes
  WORKOUTS: {
    BASE: `${API_BASE_URL}/api/workouts`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/workouts/${id}`,
    COMPLETE: (id: string) => `${API_BASE_URL}/api/workouts/complete/${id}`,
  },

  // Progress Routes
  PROGRESS: `${API_BASE_URL}/api/progress`,

  // Nutrition Routes
  NUTRITION: {
    BASE: `${API_BASE_URL}/api/nutritions`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/nutritions/${id}`,
  },

  // Goals Routes
  GOALS: {
    BASE: `${API_BASE_URL}/api/goals`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/goals/${id}`,
    ACHIEVE: (id: string) => `${API_BASE_URL}/api/goals/achieve/${id}`,
  },

  // Forum Routes
  FORUM: `${API_BASE_URL}/api/forum`,

  // Preferences Routes
  PREFERENCES: `${API_BASE_URL}/api/preferences`,

  // Reports Routes
  REPORTS: {
    BASE: `${API_BASE_URL}/api/reports`,
    PDF: `${API_BASE_URL}/api/reports/pdf`,
    CSV: `${API_BASE_URL}/api/reports/csv`,
  },

  // Support Routes
  SUPPORT: `${API_BASE_URL}/api/support`,

  // Chat Routes
  CHAT: `${API_BASE_URL}/api/chat`,
};

export default API_ENDPOINTS;
