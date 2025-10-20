import { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import {
  Paper,
  Typography,
  Box,
  MenuItem,
  Select,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { API_ENDPOINTS } from "../../config/api";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ProgressDonutChart = () => {
  const [progressData, setProgressData] = useState<any[]>([]);
  const [filter, setFilter] = useState("Weekly");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.PROGRESS, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProgressData(res.data);
      } catch (error) {
        console.error("Error fetching progress data", error);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e: SelectChangeEvent) => {
    setFilter(e.target.value);
  };

  // Filtered progress logic
  const now = new Date();
  let filtered = progressData;

  if (filter === "Weekly") {
    filtered = progressData.filter((p) => {
      const date = new Date(p.date);
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(now.getDate() - 7);
      return date >= oneWeekAgo;
    });
  } else if (filter === "Monthly") {
    filtered = progressData.filter((p) => {
      const date = new Date(p.date);
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(now.getMonth() - 1);
      return date >= oneMonthAgo;
    });
  }

  const latest = filtered.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];

  if (!latest)
    return (
      <Typography sx={{ mt: 4 }} align="center">
        Loading...
      </Typography>
    );

  const chartData = {
    labels: ["Body Fat %", "Waist", "Chest", "Biceps"],
    datasets: [
      {
        data: [
          latest.bodyFat || 0,
          latest.waist || 0,
          latest.chest || 0,
          latest.biceps || 0,
        ],
        backgroundColor: ["#f87171", "#60a5fa", "#facc15", "#34d399"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 12,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: "Body Progress",
        font: {
          size: 16,
        },
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
          <Typography variant="h6">Progress</Typography>
          <Select
            value={filter}
            onChange={handleFilterChange}
            size="small"
            sx={{ fontSize: 14 }}
          >
            <MenuItem value="Weekly">Weekly</MenuItem>
            <MenuItem value="Monthly">Monthly</MenuItem>
          </Select>
        </Box>

        <Box sx={{ height: 250, position: "relative" }}>
          <Doughnut data={chartData} options={chartOptions} />
        </Box>
      </Paper>
    </Box>
  );
};

export default ProgressDonutChart;
