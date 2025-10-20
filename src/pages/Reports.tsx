import { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Paper,
  Stack,
  Button,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Chip,
  useTheme,
  Breadcrumbs,

} from "@mui/material";
import {
  PictureAsPdf as PdfIcon,
  InsertDriveFile as CsvIcon,
  FitnessCenter as WorkoutIcon,
  Restaurant as NutritionIcon,
  CalendarToday as DateIcon,
  TrendingUp as ProgressIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { API_ENDPOINTS } from "../config/api";

const Reports = () => {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [nutritions, setNutritions] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not logged in or token missing.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.REPORTS.BASE, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWorkouts(res.data.workouts || []);
        setNutritions(res.data.nutritions || []);
      } catch (error) {
        console.error("Error fetching report data:", error);
        setError("Failed to fetch report data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const downloadPdf = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Authentication required. Please login again.");
    try {
      const res = await axios.get(API_ENDPOINTS.REPORTS.PDF, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `fitness-report-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      link.click();
    } catch (err) {
      console.error("Error downloading PDF:", err);
      alert("Failed to generate PDF report. Please try again.");
    }
  };

  const downloadCsv = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Authentication required. Please login again.");
    try {
      const res = await axios.get(API_ENDPOINTS.REPORTS.CSV, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `fitness-data-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      link.click();
    } catch (err) {
      console.error("Error downloading CSV:", err);
      alert("Failed to generate CSV export. Please try again.");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ px: { }, py: 3, maxWidth: 1200, margin: "0 auto" }}>

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
              Reports
            </Typography>
          </Breadcrumbs>
        </Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, justifyContent: "center" }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: "12px",
            backgroundColor: "#329494", display: "flex",
            alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(50, 148, 148, 0.25)"
          }}>
            <FontAwesomeIcon icon={faChartLine} style={{ color: "#ffffff", fontSize: "20px" }} />
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#329494",
            }}
          >
            Fitness Analytics Reports
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<PdfIcon />}
            onClick={downloadPdf}
            sx={{
              px: 3,
              backgroundColor: "#329494",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#287f7f", // darker shade for hover effect
                boxShadow: 4,
              },
            }}
          >
            Export PDF
          </Button>

          <Button
            variant="outlined"
            startIcon={<CsvIcon />}
            onClick={downloadCsv}
            sx={{
              px: 3,
              borderColor: "#329494",
              color: "#329494",
              "&:hover": {
                backgroundColor: "#f0fdfa", // optional subtle hover
                borderColor: "#287f7f",
                color: "#287f7f",
              },
            }}
          >
            Export CSV
          </Button>
        </Stack>
      </Stack>

      {error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : (
        <>
          <Typography variant="subtitle1" color="text.secondary" mb={4}>
            Get a comprehensive overview of your fitness journey. Track
            workouts, monitor your progress, and stay motivated with clear
            insights that help you train smarter, push harder, and reach your
            full potential.
          </Typography>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            sx={{ flexWrap: "wrap" }}
          >
            {/* Workout Section */}
            <Box flex={1}>
              <Paper
                elevation={1}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  borderLeft: `4px solid ${theme.palette.secondary.main}`,
                  height: "100%",
                }}
              >
                <Stack
  direction="row"
  alignItems="center"
  spacing={4}

  sx={{
    backgroundColor: "#e0f7f7",
    px: 2,
    py: 1,
    borderRadius: 1,
  }}
>
  <WorkoutIcon sx={{ color: "#329494" }} fontSize="large" />
  <Typography variant="h5" fontWeight="500" color="#329494">
    Workout Performance
  </Typography>
  <Chip
    label={`${workouts.length} sessions`}
    size="small"
    sx={{
      ml: "auto",
      backgroundColor: "white",
      color: "#329494",
      fontWeight: "500",
    }}
  />
</Stack>

                <Divider sx={{ mb: 3 }} />

                {workouts.length > 0 ? (
                  <List dense sx={{ maxHeight: 400, overflow: "auto" }}>                    {workouts.map((w, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          py: 1.5,
                          "&:not(:last-child)": {
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <ProgressIcon color="action" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                         <Stack direction="row" alignItems="center" spacing={10}>
  <Typography variant="body1" fontWeight="500">
    {w.exercise}
  </Typography>
  <Chip
    label={w.category}
    size="small"
    sx={{
      backgroundColor: "#329494",
      color: "white",
      fontWeight: "500",
    }}
  />
</Stack>
                          }
                          secondary={
                            <Stack direction="row" spacing={2} mt={0.5}>
                              <Chip
                                label={`${w.sets} sets`}
                                size="small"
                                variant="outlined"
                              />
                              <Chip
                                label={`${w.reps} reps`}
                                size="small"
                                variant="outlined"
                              />
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                              >
                                <DateIcon fontSize="small" color="action" />
                                <Typography variant="caption">
                                  {new Date(w.date).toLocaleDateString()}
                                </Typography>
                              </Stack>
                            </Stack>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box textAlign="center" py={4}>
                    <Typography color="text.secondary" fontStyle="italic">
                      No workout records found. Start tracking your exercises!
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>

            {/* Nutrition Section */}
            <Box flex={1}>
              <Paper
                elevation={1}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  borderLeft: `4px solid ${theme.palette.success.main}`,
                  height: "100%",
                }}
              >
                <Stack
  direction="row"
  alignItems="center"
  spacing={4}
 
  sx={{
    backgroundColor: "#e0f7f7", // Light teal shade
    borderRadius: 2,
    px: 2,
    py: 1,
  }}
>
  <NutritionIcon sx={{ color: "#329494" }} fontSize="large" />
  <Typography
    variant="h5"
    fontWeight="500"
    sx={{ color: "#329494" }}
  >
    Nutrition Log
  </Typography>
  <Chip
    label={`${nutritions.length} entries`}
    size="small"
    sx={{
      ml: "auto",
      backgroundColor: "white",
      color: "#329494",
      fontWeight: "500",
    }}
  />
</Stack>


                <Divider sx={{ mb: 3 }} />

                {nutritions.length > 0 ? (
                  <List dense sx={{ maxHeight: 400, overflow: "auto" }}>
                    {nutritions.map((n, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          py: 1.5,
                          "&:not(:last-child)": {
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <NutritionIcon color="action" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Stack direction="row" alignItems="center" spacing={10}>
  <Typography variant="body1" fontWeight="500">
    {n.foodName}
  </Typography>
  <Chip
    label={n.mealType}
    size="small"
    sx={{
      backgroundColor: "#329494",
      color: "white",
      fontWeight: "500",
    }}
  />
</Stack>

                          }
                          secondary={
                            <Stack direction="row" spacing={2} mt={0.5}>
                              <Chip
                                label={`${n.calories} kcal`}
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                              >
                                <DateIcon fontSize="small" color="action" />
                                <Typography variant="caption">
                                  {new Date(n.date).toLocaleDateString()}
                                </Typography>
                              </Stack>
                            </Stack>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box textAlign="center" py={4}>
                    <Typography color="text.secondary" fontStyle="italic">
                      No nutrition records found. Log your meals to get
                      insights!
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          </Stack>

          <Box mt={4} textAlign="center">
            <Typography variant="caption" color="text.secondary">
              Last updated: {new Date().toLocaleString()}
            </Typography>
          </Box>
        </>
      )}
    </Box>
   
  );
};

export default Reports;
