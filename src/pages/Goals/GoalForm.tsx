import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  InputAdornment,
  Breadcrumbs,
} from "@mui/material";

import AssignmentIcon from "@mui/icons-material/Assignment";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import NotesIcon from "@mui/icons-material/Notes";
import CategoryIcon from "@mui/icons-material/Category";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import StraightenIcon from "@mui/icons-material/Straighten";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faFire, faDumbbell } from "@fortawesome/free-solid-svg-icons";
import { usePreferences } from "../../context/preferenceContext";
import { API_ENDPOINTS } from "../../config/api";

const categories = ["fitness", "nutrition", "other"];
const units = ["workouts", "kg", "minutes", "steps"];

export default function GoalForm() {
  const { preferences, currentTheme } = usePreferences();
  const userId = localStorage.getItem("userId");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "fitness",
    target: "",
    unit: "workouts",
    deadline: "",
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

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...form,
        target: Number(form.target),
        userId,
      };

      await axios.post(API_ENDPOINTS.GOALS.BASE, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Goals added successfully!");


      setForm({
        title: "",
        description: "",
        category: "fitness",
        target: "",
        unit: "workouts",
        deadline: "",
      });

      navigate("/goal-list");
    } catch (err: any) {
      console.error("Error saving goal:", err.response?.data || err.message);
      alert("Goal not saved. Check console for more info.");
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
          Goal Form
        </Typography>
      </Breadcrumbs>
    </Box>
    <Box
      sx={{
        px: 2,

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: currentTheme.background,
      }}
    >
      {/* Heading */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, justifyContent: "center" }}>
        <Box sx={{
          width: 48, height: 48, borderRadius: "12px",
          backgroundColor: "#329494", display: "flex",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(50, 148, 148, 0.25)"
        }}>
          <FontAwesomeIcon icon={faBullseye} style={{ color: "#ffffff", fontSize: "20px" }} />
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#329494",
          }}
        >
          Set Your Fitness Goal
        </Typography>
      </Box>

      {/* Motivation Card */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Card
          sx={{
            width: "100%",
            maxWidth: 650,
            backgroundColor: "#329494",
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1, justifyContent: "center" }}>
              <Box sx={{
                width: 40, height: 40, borderRadius: "10px",
                backgroundColor: "#ffffff", display: "flex",
                alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
              }}>
                <FontAwesomeIcon icon={faFire} style={{ color: "#329494", fontSize: "18px" }} />
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "white" }}
              >
                Motivation Boost
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{ mb: 1, color: "white", textAlign: "center" }}
            >
              Your body can stand almost anything. It's your mind that you have
              to convince.
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
              <Typography
                variant="body2"
                sx={{ color: "white", textAlign: "center" }}
              >
                Set meaningful goals and track your progress daily. You've got this!
              </Typography>
              <Box sx={{
                width: 24, height: 24, borderRadius: "6px",
                backgroundColor: "#ffffff", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <FontAwesomeIcon icon={faDumbbell} style={{ color: "#329494", fontSize: "12px" }} />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Goal Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          backgroundColor: currentTheme.cardBg,
          p: 4,
          borderRadius: 3,
          boxShadow: 3,
          border: `1px solid ${currentTheme.border}`,
        }}
      >
        {/* Row 1: Goal Title + Description */}
        <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
          <TextField
          size="small"
            fullWidth
            label="Goal Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            margin="normal"
            required
            sx={inputStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AssignmentIcon sx={{ color: "#329494" }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
          size="small"
            fullWidth
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
            sx={inputStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <NotesIcon sx={{ color: "#329494" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Row 2: Category */}
        <TextField
        size="small"
          select
          fullWidth
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          margin="normal"
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
              {cat}
            </MenuItem>
          ))}
        </TextField>

        {/* Row 3: Target + Unit */}
        <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
          <TextField
          size="small"
            fullWidth
            label="Target"
            name="target"
            type="number"
            value={form.target}
            onChange={handleChange}
            margin="normal"
            required
            helperText="e.g., 10 workouts or 5 kg"
            sx={inputStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FitnessCenterIcon sx={{ color: "#329494" }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
          size="small"
            select
            fullWidth
            label="Unit"
            name="unit"
            value={form.unit}
            onChange={handleChange}
            margin="normal"
            sx={inputStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <StraightenIcon sx={{ color: "#329494" }} />
                </InputAdornment>
              ),
            }}
          >
            {units.map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Row 4: Deadline */}
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          {/* Deadline Field with fixed width */}
          <TextField
          size="small"
            label="Deadline"
            name="deadline"
            type="date"
            value={form.deadline}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            sx={{ ...inputStyles, width: "70%" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon sx={{ color: "#329494" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Gap */}
          <Box sx={{ width: "15%" /* 16px gap */ }} />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#329494",
              px: 3,
              py: 1,
              minWidth: "120px",
              height: "56px",
              mt: 2,
            }}
          >
            <FontAwesomeIcon icon={faBullseye} style={{ marginRight: "8px" }} />
            Save Goal
          </Button>
        </Box>
      </Box>
    </Box>
    </Box>
  );
}
