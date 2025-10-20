import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Paper, Typography, Box, MenuItem, Select } from "@mui/material";
import { API_ENDPOINTS } from "../../config/api";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

interface Nutrition {
  _id: string;
  date: string;
  calories: number;
}

const NutritionBarChart = () => {
  const [nutritionData, setNutritionData] = useState<Nutrition[]>([]);
  const [filter, setFilter] = useState("Weekly");

  useEffect(() => {
    const fetchNutrition = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(API_ENDPOINTS.NUTRITION.BASE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNutritionData(res.data);
      } catch (err) {
        console.error("Error fetching nutrition data:", err);
      }
    };

    fetchNutrition();
  }, []);

  const dayData = Array(7).fill(0);

  nutritionData.forEach((item) => {
    const dateObj = new Date(item.date);
    const dayIndex = dateObj.getDay();
    dayData[dayIndex] += item.calories;
  });

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const adjustedDayData = [
    dayData[1],
    dayData[2],
    dayData[3],
    dayData[4],
    dayData[5],
    dayData[6],
    dayData[0],
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Nutrition",
        data: adjustedDayData,
        backgroundColor: "#1ccfc9",
        borderRadius: 6,
        barThickness: 30,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "#000", font: { size: 14 } },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#000", font: { size: 14 } },
        grid: { color: "#eee" },
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
          <Typography variant="h6">Nutrition</Typography>
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

        <Box sx={{ height: 250, position: "relative" }}>
          <Bar data={chartData} options={chartOptions} />
        </Box>
      </Paper>
    </Box>
  );
};

export default NutritionBarChart;
