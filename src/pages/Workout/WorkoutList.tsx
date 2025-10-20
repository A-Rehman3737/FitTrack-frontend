// WorkoutList.tsx
import { useEffect, useState } from "react";
import {
  Typography,
  IconButton,
  Chip,
  Stack,
  TextField,
  Button,
  MenuItem,
  Box,
  Breadcrumbs,
} from "@mui/material";
import { Delete, Edit, NavigateNext as NavigateNextIcon } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faSearch,
  faCheckCircle,
  faClock,
  faDumbbell,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { usePreferences } from "../../context/preferenceContext"; // ✅ import
import { Link, NavLink } from "react-router-dom";
import { API_ENDPOINTS } from "../../config/api";

const categories = ["all", "strength", "cardio", "other"];

export default function WorkoutList() {
  const { preferences } = usePreferences(); // ✅ get user preference
  const unitLabel = preferences.unit;

  const [workouts, setWorkouts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    exercise: "",
    sets: "",
    reps: "",
    weight: "",
    notes: "",
    category: "",
  });

  const fetchWorkouts = async () => {
    try {
      const token = localStorage.getItem("token");
      const params: any = {};
      if (searchTerm.trim()) params.search = searchTerm;
      if (filterCategory !== "all") params.category = filterCategory;

      const res = await axios.get(API_ENDPOINTS.WORKOUTS.BASE, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setWorkouts(res.data);
    } catch (err: any) {
      console.error(
        "Error fetching workouts:",
        err.response?.data || err.message
      );
    }
  };

  const deleteWorkout = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(API_ENDPOINTS.WORKOUTS.BY_ID(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWorkouts();
    } catch (err: any) {
      console.error(
        "Error deleting workout:",
        err.response?.data || err.message
      );
    }
  };

  const markWorkoutComplete = async (id: string, exerciseName: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        API_ENDPOINTS.WORKOUTS.COMPLETE(id),
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const key = `notificationMessages_${user._id}`;
      const existing = JSON.parse(localStorage.getItem(key) || "[]");

      existing.push(`${exerciseName} workout completed!`);
      localStorage.setItem(key, JSON.stringify(existing));

      fetchWorkouts();
    } catch (err: any) {
      console.error(
        "Error marking workout complete:",
        err.response?.data || err.message
      );
    }
  };

  const handleEditClick = (workout: any) => {
    setEditingId(workout._id);
    setEditForm({
      exercise: workout.exercise,
      sets: workout.sets.toString(),
      reps: workout.reps.toString(),
      weight: workout.weight.toString(),
      notes: workout.notes,
      category: workout.category,
    });
  };

  const handleEditChange = (e: any) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const submitEdit = async () => {
    if (!editingId) return;
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...editForm,
        sets: Number(editForm.sets),
        reps: Number(editForm.reps),
        weight: Number(editForm.weight),
      };
      await axios.put(
        API_ENDPOINTS.WORKOUTS.BY_ID(editingId),
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditingId(null);
      fetchWorkouts();
    } catch (err: any) {
      console.error(
        "Error updating workout:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [searchTerm, filterCategory]);

  return (
    <Box sx={{ mt: 1, px: { xs: 1, sm: 3, md: 6 } }}>

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
            Workout List
          </Typography>
        </Breadcrumbs>
      </Box>
      {/* Creative Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          mb: 3,
          pb: 3,
          borderBottom: "2px solid #f0f0f0",
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "12px",
            backgroundColor: "#329494",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(50, 148, 148, 0.25)",
          }}
        >
          <FontAwesomeIcon
            icon={faDumbbell}
            style={{ color: "#ffffff", fontSize: "20px" }}
          />
        </Box>
        <Typography
          variant="h4"
          sx={{
            color: "#1a1a1a",
            fontWeight: 700,
            letterSpacing: "-0.5px",
          }}
        >
          Your Workouts List
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
        }}
      >
        {/* Left Side: NavLink */}
        <Box>
          <NavLink
            to="/workout-analytics"
            style={() => ({
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "12px",
              background: "#329494",
              color: "white",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: 600,
              transition: "all 0.2s ease-in-out",
              boxShadow: "0 2px 8px rgba(50, 148, 148, 0.25)",
            })}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(50, 148, 148, 0.35)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(50, 148, 148, 0.25)";
            }}
          >
            <FontAwesomeIcon icon={faChartLine} />
            Workout Analytics
          </NavLink>
        </Box>

        {/* Filters Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "flex-start", md: "flex-end" },
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            mt: { xs: 2, md: 0 }, // 👈 spacing from top on small screens
          }}
        >
          {/* Search Input */}
          <TextField
            label="Search"
            placeholder="e.g. Pushups"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              minWidth: 240,
              backgroundColor: "#fff",
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
            InputProps={{
              startAdornment: (
                <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
                  <FontAwesomeIcon
                    icon={faSearch}
                    style={{ color: "#666", fontSize: "14px" }}
                  />
                </Box>
              ),
            }}
          />

          {/* Category Dropdown */}
          <TextField
            label="Category"
            select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              minWidth: 160,
              backgroundColor: "#fff",
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </MenuItem>
            ))}
          </TextField>

          {/* Clear Button */}
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              setSearchTerm("");
              setFilterCategory("all");
            }}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "12px",
              px: 3,
              py: 1,
              backgroundColor: "#ff6b6b",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 1,
              "&:hover": {
                backgroundColor: "#ee5a52",
              },
            }}
          >
            <FontAwesomeIcon icon={faXmark} style={{ fontSize: "14px" }} />
            Clear
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 3,
          pl: 1,
        }}
      >
        <FontAwesomeIcon
          icon={faChartLine}
          style={{ color: "#329494", fontSize: "14px" }}
        />
        <Typography variant="body2" sx={{ color: "#666", fontSize: 14 }}>
          Track your Workouts visually
        </Typography>
      </Box>

      {/* Table View */}
      {workouts.length === 0 ? (
        <Box textAlign="center" mt={5}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="No data"
            style={{ width: 100, opacity: 0.4 }}
          />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            No workouts found.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ overflowX: "auto", mt: 3 }}>
          <table
            style={{
              minWidth: "100%",
              borderRadius: "12px",
              overflow: "hidden",
              borderCollapse: "separate",
              borderSpacing: 0,
              backgroundColor: "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <thead style={{ backgroundColor: "#329494" }}>
              <tr style={{ textAlign: "center", color: "white", fontSize: 20 }}>
                <th style={{ padding: "12px" }}>Exercise</th>
                <th>Sets</th>
                <th>Reps</th>
                <th>Weight ({unitLabel})</th>
                <th style={{ padding: "12px", minWidth: "180px" }}>Notes</th>

                <th>Category</th>
                <th>Status</th>
                <th style={{ minWidth: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout) =>
                editingId === workout._id ? (
                  <tr key={workout._id} style={{ textAlign: "center" }}>
                    <td>
                      <TextField
                        size="small"
                        name="exercise"
                        value={editForm.exercise}
                        onChange={handleEditChange}
                        inputProps={{ style: { textAlign: "center" } }}
                      />
                    </td>
                    <td>
                      <TextField
                        size="small"
                        name="sets"
                        value={editForm.sets}
                        onChange={handleEditChange}
                        inputProps={{ style: { textAlign: "center" } }}
                      />
                    </td>
                    <td>
                      <TextField
                        size="small"
                        name="reps"
                        value={editForm.reps}
                        onChange={handleEditChange}
                        inputProps={{ style: { textAlign: "center" } }}
                      />
                    </td>
                    <td>
                      <TextField
                        size="small"
                        name="weight"
                        value={editForm.weight}
                        onChange={handleEditChange}
                        inputProps={{ style: { textAlign: "center" } }}
                      />
                    </td>
                    <td style={{ minWidth: "180px" }}>
                      <TextField
                        size="small"
                        name="notes"
                        value={editForm.notes}
                        onChange={handleEditChange}
                        fullWidth
                        multiline
                        maxRows={4}
                        inputProps={{ style: { textAlign: "center" } }}
                      />
                    </td>
                    <td>
                      <TextField
                        size="small"
                        name="category"
                        value={editForm.category}
                        onChange={handleEditChange}
                        inputProps={{ style: { textAlign: "center" } }}
                      />
                    </td>
                    <td colSpan={2}>
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={submitEdit}
                        >
                          Save
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </Stack>
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={workout._id}
                    style={{
                      textAlign: "center",
                      transition: "background 0.2s",
                      cursor: "pointer",
                      height: "60px", // ⬅️ row ki height
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#f7fdfd";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                    }}
                  >
                    <td
                      style={{
                        color: "#329494",
                        padding: "12px 8px",
                        fontSize: "18px",
                        fontWeight: "bold",
                      }}
                    >
                      {workout.exercise}
                    </td>
                    <td style={{ padding: "12px 8px" }}>{workout.sets}</td>
                    <td style={{ padding: "12px 8px" }}>{workout.reps}</td>
                    <td style={{ padding: "12px 8px" }}>{workout.weight}</td>
                    <td
                      style={{
                        padding: "12px 8px",
                        minWidth: "180px",
                        wordBreak: "break-word",
                      }}
                    >
                      {workout.notes}
                    </td>

                    <td style={{ padding: "12px 8px" }}>
                      <Chip
                        size="small"
                        label={workout.category}
                        sx={{
                          backgroundColor: "#329494",
                          color: "#fff",

                          fontSize: 16,
                        }}
                      />
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      {workout.completed ? (
                        <Chip
                          icon={
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              style={{ fontSize: "14px", color: "#fff" }}
                            />
                          }
                          label="Done"
                          sx={{
                            backgroundColor: "#4caf50",
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: "13px",
                          }}
                          size="small"
                        />
                      ) : (
                        <Chip
                          icon={
                            <FontAwesomeIcon
                              icon={faClock}
                              style={{ fontSize: "14px", color: "#fff" }}
                            />
                          }
                          label="Pending"
                          sx={{
                            backgroundColor: "#ff9800",
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: "13px",
                          }}
                          size="small"
                        />
                      )}
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <IconButton onClick={() => handleEditClick(workout)}>
                          <Edit fontSize="small" color="primary" />
                        </IconButton>
                        <IconButton onClick={() => deleteWorkout(workout._id)}>
                          <Delete fontSize="small" color="error" />
                        </IconButton>
                        <Button
                          onClick={() =>
                            markWorkoutComplete(workout._id, workout.exercise)
                          }
                          size="small"
                          color="success"
                          variant="contained"
                          disabled={workout.completed}
                          sx={{ borderRadius: "20px", fontWeight: "bold" }}
                        >
                          Mark
                        </Button>
                      </Stack>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </Box>
      )}
    </Box>
  );
}
