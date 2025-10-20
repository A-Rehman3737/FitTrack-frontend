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

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
);
import { API_ENDPOINTS } from "../../config/api";

//setting interface
interface Nutrition {
  _id: string;
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number; // ✅ fixed this key name
}

//main function
const NutritionAnalyticsGraph = () => {
  const [nutritionData, setNutritionData] = useState<Nutrition[]>([]);

  //fetching data
  useEffect(() => {
    const fetchNutrition = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(API_ENDPOINTS.NUTRITION.BASE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNutritionData(res.data);
      } catch (err) {
        console.error("❌ Error fetching nutrition data:", err);
      }
    };

    fetchNutrition();
  }, []);

  // 🧠 Grouping data by date
  const grouped: {
    [date: string]: { calories: number; protein: number; carbs: number; fat: number };
  } = {};

  nutritionData.forEach((n) => {
    const date = new Date(n.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });

    if (!grouped[date]) {
      grouped[date] = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }

    grouped[date].calories += n.calories;
    grouped[date].protein += n.protein;
    grouped[date].carbs += n.carbs;
    grouped[date].fat += n.fat;
  });

  //data
  const labels = Object.keys(grouped);
  const calories = labels.map((date) => grouped[date].calories);
  const proteins = labels.map((date) => grouped[date].protein);
  const carbs = labels.map((date) => grouped[date].carbs);
  const fats = labels.map((date) => grouped[date].fat);

  const chartData = {
    labels,
    datasets: [
      {
        label: "🔥 Calories",
        data: calories,
        borderColor: "#ffa726",
        backgroundColor: "rgba(255, 167, 38, 0.3)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "🍗 Protein",
        data: proteins,
        borderColor: "#66bb6a",
        backgroundColor: "rgba(102, 187, 106, 0.3)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "🍞 Carbs",
        data: carbs,
        borderColor: "#42a5f5",
        backgroundColor: "rgba(66, 165, 245, 0.3)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "🥑 Fats",
        data: fats,
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
        text: "🥗 Nutrition Analytics Overview",
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

  //html frontend
  return (
    <Box sx={{ maxWidth: "1000px", mx: "auto", mt: 4 }}>
      <Paper elevation={4} sx={{ p: 4, backgroundColor: "#fafafa" }}>
        <Typography variant="h5" align="center" gutterBottom>
          🍽️ Nutrition Analytics
        </Typography>
        <Line data={chartData} options={chartOptions} />
      </Paper>
    </Box>
  );
};

export default NutritionAnalyticsGraph;
