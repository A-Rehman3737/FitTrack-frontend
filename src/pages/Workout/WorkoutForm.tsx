import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  CardMedia,
  InputAdornment,
  Breadcrumbs,
} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RepeatIcon from "@mui/icons-material/Repeat";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import NotesIcon from "@mui/icons-material/Notes";
import CategoryIcon from "@mui/icons-material/Category";
import ScaleIcon from "@mui/icons-material/Scale";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDumbbell, faFire, faChartLine, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { usePreferences } from "../../context/preferenceContext";
import { API_ENDPOINTS } from "../../config/api";

//images
import pushupsImg from "../../images/pushups.jpg";
import jump from "../../images/jump.avif";
import squat from "../../images/squat.webp";
import plank from "../../images/plank.jpg";
import lunges from "../../images/lunges.webp";

const categories = ["strength", "cardio", "other"];

const popularWorkouts = [
  {
    title: "Push-Ups",
    image: pushupsImg,
    description: "Great for building upper body strength.",
  },
  {
    title: "Jump Rope",
    image: jump,
    description: "Excellent cardio and coordination.",
  },
  {
    title: "Squats",
    image: squat,
    description: "Strengthens legs and glutes.",
  },
  {
    title: "Planks",
    image: plank,
    description: "Core stabilizing and strength-building.",
  },
  {
    title: "Lunges",
    image: lunges,
    description: "Improves leg strength and balance.",
  },
];

export default function WorkoutForm() {
  const { preferences, currentTheme } = usePreferences();
  const unitLabel = preferences.unit;
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const [form, setForm] = useState({
    exercise: "",
    sets: "",
    reps: "",
    weight: "",
    notes: "",
    category: "strength",
  });

  // Dark mode compatible input styles
  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: preferences.theme === "dark" ? "rgba(255,255,255,0.05)" : "#fafafa",
      "&:hover": {
        backgroundColor: preferences.theme === "dark" ? "rgba(255,255,255,0.08)" : "#f5f5f5",
      },
      "&.Mui-focused": {
        backgroundColor: preferences.theme === "dark" ? "rgba(255,255,255,0.1)" : "#ffffff",
      },
    },
    "& .MuiInputLabel-root": {
      color: currentTheme.textSecondary,
    },
    "& .MuiOutlinedInput-input": {
      color: currentTheme.text,
    },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        sets: Number(form.sets),
        reps: Number(form.reps),
        weight: Number(form.weight),
        userId,
      };

      const token = localStorage.getItem("token");
      await axios.post(API_ENDPOINTS.WORKOUTS.BASE, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Workout added successfully!");


      setForm({
        exercise: "",
        sets: "",
        reps: "",
        weight: "",
        notes: "",
        category: "strength",
      });

      navigate("/workout-list");
    } catch (err: any) {
      console.error(
        "❌ Error during workout submission:",
        err.response?.data || err.message
      );
      alert("Workout not saved. Check console for details.");
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Breadcrumb Navigation */}
    <Box
  sx={{
    display: "flex",
    justifyContent: "flex-end",
    mb: 2,
    px: 3,
   
  }}
>
  <Breadcrumbs
    separator={<NavigateNextIcon fontSize="small" />}
    aria-label="breadcrumb"
    sx={{
      fontSize: "1rem",
      "& .MuiBreadcrumbs-separator": {
        color: "#000", // Separator also black
      },
    }}
  >
    <Link
      to="/dashboard"
      style={{
        textDecoration: "none",
        color: "#000", // ✅ Inactive breadcrumb in black
        fontWeight: 600,
      }}
    >
      Dashboard
    </Link>
    <Typography
      sx={{
        fontWeight: 600,
        color: "#329494", // ✅ Active breadcrumb in green
      }}
    >
      Workout Form
    </Typography>
  </Breadcrumbs>
</Box>


      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          px: 3,
        }}
      >
        {/* Form Section */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            flex: 3,
            bgcolor: currentTheme.cardBg,
            p: 4,
            borderRadius: 3,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            border: `1px solid ${currentTheme.border}`,
          }}
        >
          {/* Creative Header Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 4,
              pb: 3,
              borderBottom: `2px solid ${currentTheme.border}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "16px",
                  backgroundColor: "#329494",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(50, 148, 148, 0.25)",
                }}
              >
                <FontAwesomeIcon
                  icon={faDumbbell}
                  style={{ color: "#ffffff", fontSize: "24px" }}
                />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: currentTheme.text,
                    fontWeight: 700,
                    letterSpacing: "-0.5px",
                  }}
                >
                  Create Your Workout
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: currentTheme.textSecondary,
                    mt: 0.5,
                  }}
                >
                  Track your progress and reach your fitness goals
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                backgroundColor: preferences.theme === "dark" ? "rgba(50, 148, 148, 0.1)" : "#f0f9f9",
                px: 2,
                py: 1,
                borderRadius: "12px",
              }}
            >
              <FontAwesomeIcon
                icon={faChartLine}
                style={{ color: "#329494", fontSize: "16px" }}
              />
              <Typography
                variant="body2"
                sx={{ color: "#329494", fontWeight: 600 }}
              >
                Track Progress
              </Typography>
            </Box>
          </Box>

          {/* Form Fields in Grid Layout */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2.5,
              mb: 2.5,
            }}
          >
            <TextField
              fullWidth
              label="Exercise"
              name="exercise"
              value={form.exercise}
              onChange={handleChange}
              required
              sx={{
                gridColumn: { xs: "span 1", sm: "span 2" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: preferences.theme === "dark" ? "rgba(255,255,255,0.05)" : "#fafafa",
                  "&:hover": {
                    backgroundColor: preferences.theme === "dark" ? "rgba(255,255,255,0.08)" : "#f5f5f5",
                  },
                  "&.Mui-focused": {
                    backgroundColor: preferences.theme === "dark" ? "rgba(255,255,255,0.1)" : "#ffffff",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: currentTheme.textSecondary,
                },
                "& .MuiOutlinedInput-input": {
                  color: currentTheme.text,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FitnessCenterIcon sx={{ color: "#329494" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Sets"
              name="sets"
              type="number"
              value={form.sets}
              onChange={handleChange}
              sx={inputStyles}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FormatListNumberedIcon sx={{ color: "#329494" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Reps"
              name="reps"
              type="number"
              value={form.reps}
              onChange={handleChange}
              sx={inputStyles}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <RepeatIcon sx={{ color: "#329494" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label={`Weight (${unitLabel})`}
              name="weight"
              type="number"
              value={form.weight}
              onChange={handleChange}
              sx={inputStyles}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ScaleIcon sx={{ color: "#329494" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              fullWidth
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              sx={inputStyles}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CategoryIcon sx={{ color: "#329494" }} />
                  </InputAdornment>
                ),
              }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <TextField
            fullWidth
            label="Notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            multiline
            rows={3}
            sx={{
              ...inputStyles,
              mb: 3,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <NotesIcon sx={{ color: "#329494" }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: 1.5,
              fontWeight: 600,
              fontSize: "16px",
              bgcolor: "#329494",
              borderRadius: "12px",
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(50, 148, 148, 0.25)",
              "&:hover": {
                bgcolor: "#287d7d",
                boxShadow: "0 6px 16px rgba(50, 148, 148, 0.35)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            Save Workout
          </Button>
        </Box>

        {/* Right Section - Popular Workouts */}
        <Box
          sx={{
            flex: 2,
            maxWidth: 400,
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            backgroundColor: currentTheme.cardBg,
            borderRadius: 3,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            border: `1px solid ${currentTheme.border}`,
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              pb: 2,
              borderBottom: `2px solid ${currentTheme.border}`,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                backgroundColor: "#ff6b35",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(255, 107, 53, 0.25)",
              }}
            >
              <FontAwesomeIcon
                icon={faFire}
                style={{ color: "#ffffff", fontSize: "20px" }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  color: currentTheme.text,
                  fontWeight: 700,
                  letterSpacing: "-0.3px",
                }}
              >
                Popular Workouts
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: currentTheme.textSecondary,
                  fontSize: "0.85rem",
                }}
              >
                Trending exercises
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                backgroundColor: "#fff3f0",
                px: 1.5,
                py: 0.5,
                borderRadius: "8px",
              }}
            >
              <FontAwesomeIcon
                icon={faTrophy}
                style={{ color: "#ff6b35", fontSize: "14px" }}
              />
              <Typography
                variant="caption"
                sx={{ color: "#ff6b35", fontWeight: 600 }}
              >
                Top 5
              </Typography>
            </Box>
          </Box>

          {/* Workout Cards */}
          {popularWorkouts.map((workout, index) => (
            <Card
              key={index}
              sx={{
                display: "flex",
                height: 100,
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                overflow: "hidden",
                border: "1px solid #f0f0f0",
                transition: "all 0.2s ease-in-out",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateX(4px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  borderColor: "#329494",
                },
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  width: 100,
                  objectFit: "cover",
                  filter: "brightness(0.92)",
                }}
                image={workout.image}
                alt={workout.title}
              />
              <CardContent
                sx={{
                  flex: "1 0 auto",
                  py: 1.5,
                  px: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  backgroundColor: preferences.theme === "dark" ? "rgba(255,255,255,0.05)" : "#fafafa",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight="700"
                    sx={{ color: currentTheme.text, fontSize: "0.95rem" }}
                  >
                    {workout.title}
                  </Typography>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "6px",
                      backgroundColor: "#329494",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      color: "#ffffff",
                    }}
                  >
                    {index + 1}
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: currentTheme.textSecondary,
                    fontSize: "0.8rem",
                    lineHeight: 1.4,
                  }}
                >
                  {workout.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}