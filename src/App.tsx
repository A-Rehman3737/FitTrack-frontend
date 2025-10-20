import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { PreferenceProvider, usePreferences } from "./context/preferenceContext";

// Layout and pages

import Login from "./pages/Registration/Login";
import Register from "./pages/Registration/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import EditProfile from "./pages/Profile/EditProfile";
import WorkoutForm from "./pages/Workout/WorkoutForm";
import WorkoutList from "./pages/Workout/WorkoutList";
import WorkoutAnalyticsGraph from "./pages/Workout/WorkoutAnalyticsGraph";
import NutritionForm from "./pages/Nutrition/NutritionForm";
import NutritionList from "./pages/Nutrition/NutritionList";
import NutritionGraph from "./pages/Nutrition/NutritionAnalyticsGraph";
import AddProgress from "./pages/Progress/AddProgress";
import ProgressList from "./pages/Progress/ProgressList";
import ProgressGraph from "./pages/Progress/ProgressGraph";
import GoalForm from "./pages/Goals/GoalForm";
import GoalList from "./pages/Goals/GoalList";
import ForumPage from "./pages/ForumPage";
import Reports from "./pages/Reports";
import SupportForm from "./pages/Contact/SupportForm";
import Layout from "./components/Layout";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const ThemedApp = () => {
  const { preferences } = usePreferences();

  const theme = createTheme({
    palette: {
      mode: preferences.theme,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
     <Routes>
  {/* Public routes */}
  <Route path="/" element={<Register />} />
  <Route path="/login" element={<Login />} />

  {/* Protected routes inside Layout */}
  <Route element={<Layout  />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/edit-profile" element={<EditProfile />} />
    <Route path="/workout-form" element={<WorkoutForm />} />
    <Route path="/workout-list" element={<WorkoutList />} />
    <Route path="/workout-analytics" element={<WorkoutAnalyticsGraph />} />
    <Route path="/nutrition-form" element={<NutritionForm />} />
    <Route path="/nutrition-list" element={<NutritionList />} />
    <Route path="/nutrition-analytics" element={<NutritionGraph />} />
    <Route path="/add-progress" element={<AddProgress />} />
    <Route path="/progress-list" element={<ProgressList />} />
    <Route path="/progress-graph" element={<ProgressGraph />} />
    <Route path="/add-goals" element={<GoalForm />} />
    <Route path="/goal-list" element={<GoalList />} />
    <Route path="/forum" element={<ForumPage />} />
    <Route path="/reports" element={<Reports />} />
    <Route path="/contact" element={<SupportForm />} />
    <Route path="/privacy" element={<PrivacyPolicy />} />
  </Route>
</Routes>

    </ThemeProvider>
  );
};

const App = () => {
  return (
    <PreferenceProvider>
      <ThemedApp />
    </PreferenceProvider>
  );
};

export default App;
