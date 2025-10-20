import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,

  Stack,
  Breadcrumbs,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faChartBar } from "@fortawesome/free-solid-svg-icons";
import { API_ENDPOINTS } from "../../config/api";

const ProgressList = () => {
  const [progress, setProgress] = useState<any[]>([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.PROGRESS, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProgress(res.data);
      } catch (error) {
        console.error("Error fetching progress", error);
      }
    };
    fetchProgress();
  }, []);

  return (
    <Box sx={{ mt: 4, px: { xs: 2, md: 6 } }}>
       
            
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
                    color: "#000",
                    fontWeight: 600,
                  }}
                >
                  Dashboard
                </Link>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: "#329494",
                  }}
                >
                  Goal List
                </Typography>
              </Breadcrumbs>
            </Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" color="#329494" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: "8px",
                backgroundColor: "#329494",
              }}
            >
              <FontAwesomeIcon icon={faChartLine} style={{ color: "white", fontSize: "18px" }} />
            </Box>
            Your Progress History
          </Typography>
          <br />
          <Typography variant="body1" sx={{ color: "gray", mt: 1 }}>
            Track your fitness measurements regularly and visualize your
            journey. Update frequently to stay motivated and accountable. <br />
            Celebrate small wins to stay on track and build long-term habits.
            Your numbers tell a story — let them inspire consistency. <br />
            Progress may be slow, but dedication always pays off. Keep pushing —
            your best version is in the making!
          </Typography>
          <br />
        </Box>

        <Box textAlign="center" mt={7}>
          <Link
            to="/progress-graph"
            style={{
              textDecoration: "none",
            }}
          >
            <Box
              component="span"
              sx={{
                backgroundColor: "#329494",
                color: "white",
                px: 3,
                py: 1.5,
                borderRadius: "12px",
                fontWeight: "bold",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                "&:hover": {
                  backgroundColor: "#329496",
                },
              }}
            >
              <BarChartIcon />
              View Graph
            </Box>
          </Link>

          <Typography
            variant="caption"
            sx={{ mt: 1, display: "flex", alignItems: "center", gap: 0.5, justifyContent: "center", color: "black", fontSize: 13 }}
          >
            Track progress with visual insights
            <FontAwesomeIcon icon={faChartBar} style={{ fontSize: "13px" }} />
          </Typography>
        </Box>
      </Stack>

      {progress.length === 0 ? (
        <Box textAlign="center" mt={5}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/10437/10437919.png"
            alt="No progress"
            style={{ width: 100, opacity: 0.5 }}
          />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            No progress records yet.
          </Typography>
        </Box>
      ) : (
        <Paper elevation={3} sx={{ overflowX: "auto", borderRadius: 2 }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ backgroundColor: "#329494" }}>
              <TableRow>
                {[
                  "Date",
                  "Weight",
                  "Body Fat",
                  "Waist",
                  "Chest",
                  "Biceps",
                  "Run Time",
                  "Lift Weight",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: 18,
                      letterSpacing: 0.5,
                      py: 2,
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {progress.map((item: any, idx: number) => (
                <TableRow key={idx} hover>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 500, color: "#329494" }}
                  >
                    {new Date(item.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell align="center">{item.weight} kg</TableCell>
                  <TableCell align="center">{item.bodyFat}%</TableCell>
                  <TableCell align="center">{item.waist} cm</TableCell>
                  <TableCell align="center">{item.chest} cm</TableCell>
                  <TableCell align="center">{item.biceps} cm</TableCell>
                  <TableCell align="center">{item.runTime} min</TableCell>
                  <TableCell align="center">{item.liftWeight} kg</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default ProgressList;
