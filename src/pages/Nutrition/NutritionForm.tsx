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
  CardMedia,
  InputAdornment,
  Breadcrumbs,
} from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

import FastfoodIcon from "@mui/icons-material/Fastfood";
import ScaleIcon from "@mui/icons-material/Scale";

import GrainIcon from "@mui/icons-material/Grain";
import EggIcon from "@mui/icons-material/Egg";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { usePreferences } from "../../context/preferenceContext";
import { API_ENDPOINTS } from "../../config/api";

// Images for popular meals
import breakfastImg from "../../images/break.jpg";
import lunchImg from "../../images/lunch.jpg";
import dinnerImg from "../../images/dinner.webp";
import snacksImg from "../../images/snacks.webp";
import dessertImg from "../../images/dessert.webp";

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snacks"];

const popularMeals = [
  {
    title: "Breakfast",
    image: breakfastImg,
    description: "Start your day with a healthy meal.",
  },
  {
    title: "Lunch",
    image: lunchImg,
    description: "Power up with a balanced lunch.",
  },
  {
    title: "Dinner",
    image: dinnerImg,
    description: "Refuel with a nutritious dinner.",
  },
  {
    title: "Snacks",
    image: snacksImg,
    description: "Smart snacking keeps energy up.",
  },
  {
    title: "Desserts",
    image: dessertImg,
    description: "Satisfy your cravings with nourishing desserts.",
  },
];

export default function NutritionForm() {
  const { preferences, currentTheme } = usePreferences();
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    foodName: "",
    quantity: "",
    calories: "",
    carbs: "",
    protein: "",
    fat: "",
    mealType: "Breakfast",
    image: "",
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
        quantity: Number(form.quantity),
        calories: Number(form.calories),
        carbs: Number(form.carbs),
        protein: Number(form.protein),
        fat: Number(form.fat),
        userId,
      };

      const token = localStorage.getItem("token");
      await axios.post(API_ENDPOINTS.NUTRITION.BASE, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Nutritions added successfully!");

      setForm({
        foodName: "",
        quantity: "",
        calories: "",
        carbs: "",
        protein: "",
        fat: "",
        mealType: "Breakfast",
        image: "",
      });

      navigate("/nutrition-list");
    } catch (err: any) {
      console.error("Error during nutrition submission:", err);
      alert("Nutrition not saved. Check console for details.");
    }
  };

  const HandleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
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
      Nutrition Form
    </Typography>
  </Breadcrumbs>
</Box>
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 4,
        mt: 2,
        px: 3,
      }}
    >
      {/* Left Form Section */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          flex: 3,
          bgcolor: currentTheme.cardBg,
          p: 4,
          borderRadius: 3,
          boxShadow: 4,
          border: `1px solid ${currentTheme.border}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, justifyContent: "center" }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: "12px",
            backgroundColor: "#329494", display: "flex",
            alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(50, 148, 148, 0.25)"
          }}>
            <FontAwesomeIcon icon={faUtensils} style={{ color: "#ffffff", fontSize: "20px" }} />
          </Box>
          <Typography
            variant="h4"
            sx={{
              color: currentTheme.text,
              fontWeight: "bold",
            }}
          >
            Add Your Nutrition
          </Typography>
        </Box>
        <TextField
          fullWidth
          size="small"
          label="Food Name"
          name="foodName"
          value={form.foodName}
          onChange={handleChange}
          margin="normal"
          required
          sx={inputStyles}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FastfoodIcon sx={{ color: "#329494" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          size="small"
          label="Quantity (g)"
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
          margin="normal"
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
          fullWidth
          size="small"
          label="Calories"
          name="calories"
          type="number"
          value={form.calories}
          onChange={handleChange}
          margin="normal"
          sx={inputStyles}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocalFireDepartmentIcon sx={{ color: "#329494" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          size="small"
          label="Carbs (g)"
          name="carbs"
          value={form.carbs}
          onChange={handleChange}
          margin="normal"
          sx={inputStyles}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <GrainIcon sx={{ color: "#329494" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          size="small"
          label="Protein (g)"
          name="protein"
          value={form.protein}
          onChange={handleChange}
          margin="normal"
          sx={inputStyles}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EggIcon sx={{ color: "#329494" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          size="small"
          label="Fat (g)"
          name="fat"
          value={form.fat}
          onChange={handleChange}
          margin="normal"
          sx={inputStyles}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmojiFoodBeverageIcon sx={{ color: "#329494" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          fullWidth
          size="small"
          label="Meal Type"
          name="mealType"
          value={form.mealType}
          onChange={handleChange}
          margin="normal"
          sx={inputStyles}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <RestaurantIcon sx={{ color: "#329494" }} />
              </InputAdornment>
            ),
          }}
        >
          {mealTypes.map((meal) => (
            <MenuItem key={meal} value={meal}>
              {meal}
            </MenuItem>
          ))}
        </TextField>

        <div className="mb-3 d-flex align-items-center justify-content-between">
          <div className="w-75">
            <Typography variant="subtitle1" gutterBottom>
              Upload Your Meal
            </Typography>
            <input
              accept="image/*"
              type="file"
              onChange={HandleImageChange}
              className="form-control"
            />
          </div>

          {form.image && (
            <div className="ms-3">
              <img
                src={form.image}
                alt="Uploaded"
                className="rounded-circle"
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  border: "2px solid #198754",
                }}
              />
            </div>
          )}
        </div>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            py: 1.2,
            fontWeight: "bold",
            bgcolor: "#329494",
            "&:hover": { bgcolor: "#287d7d" },
          }}
        >
          Save Meal
        </Button>
      </Box>

      {/* Right Section - Popular Meals */}
      <Box
        sx={{
          flex: 2,
          maxWidth: 400,
          p: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: currentTheme.cardBg,
          borderRadius: 3,
          boxShadow: 3,
          border: `1px solid ${currentTheme.border}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1, justifyContent: "center" }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: "10px",
            backgroundColor: "#329494", display: "flex",
            alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(50, 148, 148, 0.25)"
          }}>
            <FontAwesomeIcon icon={faUtensils} style={{ color: "#ffffff", fontSize: "18px" }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: currentTheme.text,
              fontWeight: "bold",
            }}
          >
            Popular Meals
          </Typography>
        </Box>

        {popularMeals.map((meal, index) => (
          <Card
            key={index}
            sx={{
              display: "flex",
              height: 110,
              borderRadius: 3,
              boxShadow: 2,
              overflow: "hidden",
              transition: "transform 0.2s, box-shadow 0.2s",
              border: `1px solid ${currentTheme.border}`,
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: 4,
              },
            }}
          >
            <CardMedia
              component="img"
              sx={{
                width: 100,
                objectFit: "cover",
                filter: "brightness(0.95)",
              }}
              image={meal.image}
              alt={meal.title}
            />
            <CardContent
              sx={{
                flex: "1 0 auto",
                py: 1.5,
                px: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                backgroundColor: preferences.theme === "dark" ? "rgba(255,255,255,0.05)" : "#ffffff",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="600"
                sx={{ color: currentTheme.text }}
              >
                {meal.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: currentTheme.textSecondary, fontSize: "0.85rem" }}
              >
                {meal.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
    </Box>
  );
}
