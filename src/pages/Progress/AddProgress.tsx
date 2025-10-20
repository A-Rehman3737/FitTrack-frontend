import React, { useState } from "react";
import axios from "axios";
import { Box, Card, CardContent, Typography, TextField,  Button,  Breadcrumbs } from "@mui/material";

import {
  FitnessCenter,
  Percent,
  Straighten,
  AccessibilityNew,
  Timer,
  Expand,

} from "@mui/icons-material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { InputAdornment } from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faLightbulb, faCheck } from "@fortawesome/free-solid-svg-icons";
import { usePreferences } from "../../context/preferenceContext";
import { API_ENDPOINTS } from "../../config/api";





//main function
const AddProgress = () => {
  const { preferences, currentTheme } = usePreferences();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    weight: "",
    bodyFat: "",
    waist: "",
    chest: "",
    biceps: "",
    runTime: "",
    liftWeight: "",
    notes: "",
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

  //handling changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //form submitting
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(API_ENDPOINTS.PROGRESS, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      alert("Progress added successfully!");
      setFormData({
        weight: "",
        bodyFat: "",
        waist: "",
        chest: "",
        biceps: "",
        runTime: "",
        liftWeight: "",
        notes: "",
      });
      navigate("/progress-list");
    } catch (error) {
      console.error("Error saving progress", error);
      alert("Failed to save progress.");
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
                color: "#000",
                fontWeight: 600,
              }}
            >
              Dashboard
            </Link>
            <Typography
              sx={{
                fontWeight: 600,
                color: "#329494",
              }}
            >
              Progress Form
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
    <Typography
      variant="h4"
      gutterBottom
      sx={{
        textAlign: "center",
        fontWeight: "bold",
        color: "#329494",
        mb: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          borderRadius: "8px",
          backgroundColor: "#329494",
        }}
      >
        <FontAwesomeIcon icon={faChartLine} style={{ color: "white", fontSize: "18px" }} />
      </Box>
      Track Your Progress
    </Typography>

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
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: 600, color: "white", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}
          >
            <FontAwesomeIcon icon={faLightbulb} style={{ fontSize: "20px" }} />
            Consistency is Key
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 1, color: "white", textAlign: "center" }}
          >
            Small progress each day adds up to big results. Stay focused and
            keep logging in!
          </Typography>
        </CardContent>
      </Card>
    </Box>

    {/* Form Box */}
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
  {/* Grid Inputs */}
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
      gap: 2,
    }}
  >
    <TextField
    size="small"
      label="Weight"
      type="number"
      name="weight"
      value={formData.weight}
      onChange={handleChange}
      required
      fullWidth
      sx={inputStyles}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FitnessCenter sx={{ color: "#329494" }} />
          </InputAdornment>
        ),
      }}
    />
    <TextField
    size="small"
      label="Body Fat (%)"
      type="number"
      name="bodyFat"
      value={formData.bodyFat}
      onChange={handleChange}
      required
      fullWidth
      sx={inputStyles}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Percent sx={{ color: "#329494" }} />
          </InputAdornment>
        ),
      }}
    />
    <TextField
    size="small"
      label="Waist (cm)"
      type="number"
      name="waist"
      value={formData.waist}
      onChange={handleChange}
      required
      fullWidth
      sx={inputStyles}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Straighten sx={{ color: "#329494" }} />
          </InputAdornment>
        ),
      }}
    />
    <TextField
    size="small"
      label="Chest (cm)"
      type="number"
      name="chest"
      value={formData.chest}
      onChange={handleChange}
      required
      fullWidth
      sx={inputStyles}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AccessibilityNew sx={{ color: "#329494" }} />
          </InputAdornment>
        ),
      }}
    />
    <TextField
    size="small"
      label="Biceps (cm)"
      type="number"
      name="biceps"
      value={formData.biceps}
      onChange={handleChange}
      required
      fullWidth
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
      label="Run Time (mins)"
      type="number"
      name="runTime"
      value={formData.runTime}
      onChange={handleChange}
      required
      fullWidth
      sx={inputStyles}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Timer sx={{ color: "#329494" }} />
          </InputAdornment>
        ),
      }}
    />

    {/* Lift Weight and Notes side by side */}
    <TextField
    size="small"
      label="Lift Weight (kg)"
      type="number"
      name="liftWeight"
      value={formData.liftWeight}
      onChange={handleChange}
      required
      fullWidth
      sx={inputStyles}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Expand sx={{ color: "#329494" }} />
          </InputAdornment>
        ),
      }}
    />
  
  </Box>

  {/* Small Submit Button under notes */}
  <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
    <Button
      type="submit"
      variant="contained"
      sx={{
        backgroundColor: "#329494",
        px: 3,
        py: 1,
        fontWeight: "bold",
        fontSize: "0.9rem",
        borderRadius: 2,
        minWidth: "150px",
      }}
    >
      <FontAwesomeIcon icon={faCheck} style={{ marginRight: "8px" }} />
      Save Progress
    </Button>
  </Box>
</Box>


  </Box>
  </Box>
);

};

export default AddProgress;
