import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend,
} from "chart.js"; 
import { Paper, Typography, Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { API_ENDPOINTS } from "../../config/api";

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

//main function
const ProgressGraph = () => {
  const [progressData, setProgressData] = useState<any[]>([]);

  //fetching graph data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.PROGRESS, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setProgressData(res.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  //graph content
  const labels = progressData.map((p) =>
    new Date(p.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Weight (kg)",
        data: progressData.map((p) => p.weight),
        borderColor: "#1976d2",
        backgroundColor: "rgba(25, 118, 210, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Lifting Weight (kg)",
        data: progressData.map((p) => p.liftWeight),
        borderColor: "#2e7d32",
        backgroundColor: "rgba(46, 125, 50, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Run Time (min)",
        data: progressData.map((p) => p.runTime),
        borderColor: "#d32f2f",
        backgroundColor: "rgba(211, 47, 47, 0.2)",
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Your Fitness Progress",
        font: {
          size: 18
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5
        }
      }
    }
  };

  //html frontend
  return (
    <Box sx={{ maxWidth: "900px", mx: "auto", mt: 5 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" align="center" gutterBottom color="primary" sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
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
          Fitness Progress Graph
        </Typography>
        <Box>
          <Line data={chartData} options={chartOptions} />
        </Box>
      </Paper>
    </Box>
  );
};

export default ProgressGraph;
