import { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Delete, CheckCircle, NavigateNext as NavigateNextIcon } from "@mui/icons-material";

import {
  Box,
  Typography,
  TextField,
  Stack,
  Button,
  Chip,
  IconButton,

  Breadcrumbs,
} from "@mui/material";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faCheckCircle,
  faHourglassHalf,
} from "@fortawesome/free-solid-svg-icons";
import { API_ENDPOINTS } from "../../config/api";

export default function GoalList() {
  const [goals, setGoals] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "fitness",
    target: "",
  
    unit: "workouts",
    deadline: "",
  });

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_ENDPOINTS.GOALS.BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(res.data);
    } catch (err: any) {
      console.error("Error fetching goals:", err.response?.data || err.message);
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(API_ENDPOINTS.GOALS.BY_ID(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGoals();
    } catch (err: any) {
      console.error("Error deleting goal:", err.response?.data || err.message);
    }
  };

  const markGoalAchieved = async (id: string, goalTitle: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(API_ENDPOINTS.GOALS.ACHIEVE(id), {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const key = `notificationMessages_${user._id}`;
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      existing.push(`Goal "${goalTitle}" achieved!`);
      localStorage.setItem(key, JSON.stringify(existing));
      fetchGoals();
    } catch (err: any) {
      console.error("Error marking goal achieved:", err.response?.data || err.message);
    }
  };

  const handleEditClick = (goal: any) => {
    setEditingId(goal._id);
    setEditForm({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      target: goal.target.toString(),
   
      unit: goal.unit,
      deadline: goal.deadline?.slice(0, 10) || "",
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
        target: Number(editForm.target),

      };
      await axios.put(API_ENDPOINTS.GOALS.BY_ID(editingId), payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingId(null);
      fetchGoals();
    } catch (err: any) {
      console.error("Error updating goal:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

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
              color: "#000", // Inactive breadcrumb in black
              fontWeight: 600,
            }}
          >
            Dashboard
          </Link>
          <Typography
            sx={{
              fontWeight: 600,
              color: "#329494", // Active breadcrumb in green
            }}
          >
            Goal List
          </Typography>
        </Breadcrumbs>
      </Box>
       <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mb: 3 }}>
         <Box sx={{
           width: 48, height: 48, borderRadius: "12px",
           backgroundColor: "#329494", display: "flex",
           alignItems: "center", justifyContent: "center",
           boxShadow: "0 4px 12px rgba(50, 148, 148, 0.25)"
         }}>
           <FontAwesomeIcon icon={faBullseye} style={{ color: "#ffffff", fontSize: "20px" }} />
         </Box>
         <Typography variant="h4" sx={{ color: "#1a1a1a", fontWeight: 700 }}>
           Your Fitness Goals
         </Typography>
       </Box>
      
      <Typography
        variant="subtitle1"
        sx={{
          textAlign: "center",
          color: "text.secondary",
          mb: 3,
        }}
      >
       Track your progress below and update your goals as you go.
Stay consistent and celebrate every milestone, no matter how small.
Review your progress regularly to stay focused and motivated.
As you evolve, your goals might change—don’t hesitate to adjust them.
Let this tracker be your partner in building a healthier, stronger you!
Push your limits, but also listen to your body and rest when needed.
Every step you take brings you closer to your ultimate transformation.
      </Typography>

      {goals.length === 0 ? (
        <Box textAlign="center" mt={5}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="No data"
            style={{ width: 100, opacity: 0.4 }}
          />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            No goals found.
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
              <tr style={{ textAlign: "center", color: "white", fontSize: 18 }}>
                <th style={{ padding: "12px" }}>Title</th>
               <th style={{ minWidth: "250px" }}>Description</th>

                <th>Category</th>
                <th>Target</th>
                
                <th>Unit</th>
                <th>Deadline</th>
                <th>Status</th>
               <th style={{ textAlign: "left", paddingLeft: "55px" }}>Actions</th>

              </tr>
            </thead>
            <tbody>
              {goals.map((goal) =>
                editingId === goal._id ? (
                  <tr key={goal._id} style={{ textAlign: "center" }}>
                    {Object.keys(editForm).map((field) => (
                      <td key={field}>
                        <TextField
                          size="small"
                          type={field === "deadline" ? "date" : "text"}
                          name={field}
                          value={(editForm as any)[field]}
                          onChange={handleEditChange}
                          inputProps={{ style: { textAlign: "center" } }}
                        />
                      </td>
                    ))}
                    <td colSpan={2}>
                      <Stack direction="row" spacing={1} justifyContent="center">
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
                    key={goal._id}
                    style={{
                      textAlign: "center",
                      transition: "background 0.2s",
                      cursor: "pointer",
                      height: "60px",
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
                      {goal.title}
                    </td>
                   <td style={{ padding: "12px 8px", minWidth: "250px", whiteSpace: "normal", wordBreak: "break-word" }}>
  {goal.description}
</td>

                    <td style={{ padding: "12px 8px" }}>
                      <Chip
                        label={goal.category}
                        sx={{
                          backgroundColor: "#329494",
                          color: "#fff",
                          fontSize: 17,
                        }}
                        size="small"
                      />
                    </td>
                    <td style={{ padding: "12px 8px" }}>{goal.target}</td>
                    
                    <td style={{ padding: "12px 8px" }}>{goal.unit}</td>
                    <td style={{ padding: "12px 8px" }}>
                      {goal.deadline?.slice(0, 10) || "N/A"}
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      {goal.achieved ? (
                        <Chip
                          icon={<FontAwesomeIcon icon={faCheckCircle} style={{ color: "white", fontSize: "14px" }} />}
                          label="Achieved"
                          color="success"
                          size="small"
                        />
                      ) : (
                        <Chip
                          icon={<FontAwesomeIcon icon={faHourglassHalf} style={{ color: "#fff", fontSize: "14px" }} />}
                          label="In Progress"
                          color="warning"
                          size="small"
                        />
                      )}
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton onClick={() => handleEditClick(goal)}>
                          <Edit fontSize="small" color="primary" />
                        </IconButton>
                        <IconButton onClick={() => deleteGoal(goal._id)}>
                          <Delete fontSize="small" color="error" />
                        </IconButton>
                        {!goal.achieved && (
                          <Button
                            onClick={() => markGoalAchieved(goal._id, goal.title)}
                            size="small"
                            variant="outlined"
                            color="secondary"
                            startIcon={<CheckCircle />}
                            sx={{
                              borderRadius: "20px",
                              fontWeight: 500,
                              textTransform: "none",
                              px: 2,
                            }}
                          >
                            Goal Pending
                          </Button>
                        )}
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
