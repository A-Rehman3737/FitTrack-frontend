import { useEffect, useState } from "react";
import axios from "axios";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Box, Paper, Typography, Select, MenuItem } from "@mui/material";
import { API_ENDPOINTS } from "../../config/api";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Workout {
    _id: string;
    date?: string;
    exercise: string;
    sets: number;
    reps: number;
    weight: number;
    category: string;
}

const WorkoutProgressChart = () => {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [filter, setFilter] = useState("Weekly");

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(API_ENDPOINTS.WORKOUTS.BASE, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setWorkouts(res.data);
            } catch (err) {
                console.error("Error fetching workout data:", err);
            }
        };

        fetchWorkouts();
    }, []);

    // Count by category
    const strengthCount = workouts.filter(w => w.category === "strength").length;
    const cardioCount = workouts.filter(w => w.category === "cardio").length;
    const otherCount = workouts.filter(w => w.category === "other").length;

    const chartData = {
        labels: ["Strength", "Cardio", "Other"],
        datasets: [
            {
                label: "Workout Sessions",
                data: [strengthCount, cardioCount, otherCount],
                backgroundColor: ["#f39c12", "#2ecc71", "#3498db"],
                borderWidth: 0,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        cutout: "70%",
        plugins: {
            legend: {
                display: true,
                position: "bottom" as const,
            },
        },
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 5 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    borderRadius: 4,
                    backgroundColor: "#fff",
                    textAlign: "center",
                }}
            >
                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="h6">Workout Category Breakdown</Typography>
                    <Select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        size="small"
                        sx={{ fontSize: 14 }}
                    >
                        <MenuItem value="Weekly">Weekly</MenuItem>
                        <MenuItem value="Monthly">Monthly</MenuItem>
                    </Select>
                </Box>

                <Box position="relative" display="inline-block">
                    <Doughnut data={chartData} options={chartOptions} />
                    <Box
                        position="absolute"
                        top="50%"
                        left="50%"
                        sx={{
                            transform: "translate(-50%, -50%)",
                            textAlign: "center",
                        }}
                    >
                        <Typography variant="body2" sx={{ color: "#888" }}>
                            Total
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {strengthCount + cardioCount + otherCount}
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default WorkoutProgressChart;
