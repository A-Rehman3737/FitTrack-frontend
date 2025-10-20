import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Paper, Typography, Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { API_ENDPOINTS } from "../../config/api";

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend, Filler);

//interface 
interface Workout {
  _id: string;
  date?: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  category: string;
}

const WorkoutAnalyticsGraph = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  //fetching data
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

  // Group workouts by date
  const grouped: { [date: string]: { volume: number; strength: number; cardio: number } } = {};

  workouts.forEach((w) => {
    const date = new Date(w.date || "").toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });

    const volume = w.sets * w.reps * w.weight;
    if (!grouped[date]) {
      grouped[date] = { volume: 0, strength: 0, cardio: 0 };
    }

    grouped[date].volume += volume;
    if (w.category === "strength") grouped[date].strength += 1;
    else if (w.category === "cardio") grouped[date].cardio += 1;
  });

  const labels = Object.keys(grouped);
  const volumes = labels.map((date) => grouped[date].volume);
  const strengthCounts = labels.map((date) => grouped[date].strength);
  const cardioCounts = labels.map((date) => grouped[date].cardio);

  //chart data
  const chartData = {
    labels,
    datasets: [
      {
        label: "Volume Lifted",
        data: volumes,
        borderColor: "#42a5f5",
        backgroundColor: "rgba(66, 165, 245, 0.3)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Strength Sessions",
        data: strengthCounts,
        borderColor: "#66bb6a",
        backgroundColor: "rgba(102, 187, 106, 0.3)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Cardio Sessions",
        data: cardioCounts,
        borderColor: "#ef5350",
        backgroundColor: "rgba(239, 83, 80, 0.3)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Workout Analytics Overview",
        font: {
          size: 20,
        },
        color: "#1976d2",
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.formattedValue}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#555",
        },
        grid: {
          color: "#e0e0e0",
        },
      },
      x: {
        ticks: {
          color: "#555",
        },
        grid: {
          color: "#f5f5f5",
        },
      },
    },
  };

  return (
    <Box sx={{ maxWidth: "1000px", mx: "auto", mt: 4 }}>
      <Paper elevation={4} sx={{ p: 4, backgroundColor: "#fafafa" }}>
        <Typography variant="h5" align="center" gutterBottom sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: "8px",
              backgroundColor: "#1976d2",
            }}
          >
            <FontAwesomeIcon icon={faChartLine} style={{ color: "white", fontSize: "16px" }} />
          </Box>
          Workout Analytics
        </Typography>
        <Line data={chartData} options={chartOptions} />
      </Paper>
    </Box>
  );
};

export default WorkoutAnalyticsGraph;
