import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  Breadcrumbs,
} from "@mui/material";
import axios from "axios";

import EmailIcon from "@mui/icons-material/Email";
import SubjectIcon from "@mui/icons-material/Subject";
import MessageIcon from "@mui/icons-material/Message";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faCircleQuestion, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { usePreferences } from "../../context/preferenceContext";
import { API_ENDPOINTS } from "../../config/api";

interface FormData {
  email: string;
  type: string;
  subject: string;
  message: string;
}

const initialState: FormData = {
  email: "",
  type: "",
  subject: "",
  message: "",
};

const SupportForm: React.FC = () => {
  const { preferences, currentTheme } = usePreferences();
  const [form, setForm] = useState<FormData>(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Dark mode compatible input styles
  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: preferences.theme === "dark" ? "rgba(255,255,255,0.05)" : "#fafafa",
      "&:hover": {
        backgroundColor: preferences.theme === "dark" ? "rgba(255,255,255,0.08)" : "#f5f5f5",
      },
      "&.Mui-focused": {
        backgroundColor: preferences.theme === "dark" ? "rgba(255,255,255,0.1)" : "#ffffff",
      },
    },
    "& .MuiInputLabel-root": {
      color: currentTheme.textSecondary,
    },
    "& .MuiOutlinedInput-input": {
      color: currentTheme.text,
    },
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await axios.post(
        API_ENDPOINTS.SUPPORT,
        form
      );
      setMessage(response.data.message);
      setForm(initialState);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
     <Box sx={{ width: '100%' }}>
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
              Contact Form
            </Typography>
          </Breadcrumbs>
        </Box>
    <Box
      sx={{
        minHeight: "80vh",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1, justifyContent: "center" }}>
        <Box sx={{
          width: 48, height: 48, borderRadius: "12px",
          backgroundColor: "#329494", display: "flex",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(50, 148, 148, 0.25)"
        }}>
          <FontAwesomeIcon icon={faEnvelope} style={{ color: "#ffffff", fontSize: "20px" }} />
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#329494",
          }}
        >
          Contact & Support
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1, justifyContent: "center" }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: "10px",
          backgroundColor: "#329494", display: "flex",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(50, 148, 148, 0.25)"
        }}>
          <FontAwesomeIcon icon={faCircleQuestion} style={{ color: "#ffffff", fontSize: "18px" }} />
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#329494",
          }}
        >
          We're Here For You
        </Typography>
      </Box>
      <Typography
        variant="body1"
        sx={{  textAlign: "center", fontSize:"18px"}}
      >
        Questions? Feedback? Bugs? Don’t worry—we’ve got your back. Drop your
        message and we’ll reach out quickly!
      </Typography>

      <br />

      {/* Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 900,
          backgroundColor: currentTheme.cardBg,
          p: 4,
          borderRadius: 3,
          boxShadow: 3,
          border: `1px solid ${currentTheme.border}`,
        }}
      >
        {/* Fields */}
        <TextField
        size="small"
          label="Email"
          name="email"
          type="email"
          fullWidth
          value={form.email}
          onChange={handleChange}
          required
          margin="normal"
          sx={inputStyles}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ color: "#329494" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
        size="small"
          select
          label="Type"
          name="type"
          fullWidth
          value={form.type}
          onChange={handleChange}
          required
          margin="normal"
          sx={inputStyles}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <HelpOutlineIcon sx={{ color: "#329494" }} />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="Help">Help</MenuItem>
          <MenuItem value="Feedback">Feedback</MenuItem>
          <MenuItem value="Bug">Bug</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>

        <TextField
        size="small"
          label="Subject"
          name="subject"
          fullWidth
          value={form.subject}
          onChange={handleChange}
          required
          margin="normal"
          sx={inputStyles}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SubjectIcon sx={{ color: "#329494" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
        size="small"
          label="Message"
          name="message"
          multiline
          rows={5}
          fullWidth
          value={form.message}
          onChange={handleChange}
          required
          margin="normal"
          sx={inputStyles}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MessageIcon
                  sx={{ color: "#329494", alignSelf: "flex-start", mt: 1 }}
                />
              </InputAdornment>
            ),
          }}
        />

        {/* Submit Button */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#329494",
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              borderRadius: 2,
              minWidth: "200px",
              "&:hover": {
                backgroundColor: "#287a7a",
              },
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <>
                <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: "8px" }} />
                Send Message
              </>
            )}
          </Button>
        </Box>

        {/* Response Alerts */}
        {message && (
          <Alert severity="success" sx={{ mt: 2, textAlign: "center" }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2, textAlign: "center" }}>
            {error}
          </Alert>
        )}
      </Box>
    </Box>
    </Box>
  );
};

export default SupportForm;
