import { useState } from "react";
import axios from "axios";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faUserPlus,
  faSignInAlt,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { usePreferences } from "../../context/preferenceContext";
import { API_ENDPOINTS } from "../../config/api";
import "./Register.css";

// Type for registration form data
type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  image: string;
};

//main function
const Register = () => {
  const [form, setForm] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    image: "",
  });

  const { currentTheme, themeColors } = usePreferences();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        API_ENDPOINTS.USERS.REGISTER,
        form
      );
      alert(res.data.message);
      navigate("/login");
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  const HandleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="register-container">
      <div
        className="register-card shadow-lg"
        style={{
          backgroundColor: currentTheme.cardBg,
          color: currentTheme.text,
        }}
      >
        <h1
          className="text-center mb-4 fw-bold"
          style={{ color: themeColors.primary }}
        >
          <FontAwesomeIcon icon={faUserPlus} className="me-2" />
          Join FitTrack
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 input-group">
            <span
              className="input-group-text"
              style={{
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.border,
                color: themeColors.primary,
              }}
            >
              <FontAwesomeIcon icon={faUser} />
            </span>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
              className="form-control"
              style={{
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.border,
                color: currentTheme.text,
              }}
            />
          </div>

          <br />
          <div className="mb-3 input-group">
            <span
              className="input-group-text"
              style={{
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.border,
                color: themeColors.primary,
              }}
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
              className="form-control border-start-0"
              style={{
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.border,
                color: currentTheme.text,
              }}
            />
          </div>

          <br />

          <div className="mb-3 input-group">
            <span
              className="input-group-text"
              style={{
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.border,
                color: themeColors.primary,
              }}
            >
              <FontAwesomeIcon icon={faLock} />
            </span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="form-control border-start-0"
              style={{
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.border,
                color: currentTheme.text,
              }}
            />
          </div>

          <br />

          <div className="mb-3 d-flex align-items-center justify-content-between">
            <div className="w-75">
              <Typography
                variant="subtitle1"
                gutterBottom
                style={{
                  color: currentTheme.textSecondary,
                  fontWeight: 600,
                }}
              >
                <FontAwesomeIcon icon={faImage} className="me-2" />
                Upload Profile Image
              </Typography>
              <input
                accept="image/*"
                type="file"
                onChange={HandleImageChange}
                className="form-control"
                style={{
                  backgroundColor: currentTheme.surface,
                  borderColor: currentTheme.border,
                  color: currentTheme.text,
                }}
              />
            </div>

            {form.image && (
              <div className="ms-3">
                <img
                  src={form.image}
                  alt="Uploaded"
                  className="rounded-circle"
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    border: `3px solid ${themeColors.primary}`,
                  }}
                />
              </div>
            )}
          </div>

          <br />
          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: themeColors.primary,
                color: "#fff",
                border: "none",
                padding: "12px",
                fontSize: "16px",
                fontWeight: "600",
                borderRadius: "8px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#00b4b4";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = themeColors.primary;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <FontAwesomeIcon icon={faUserPlus} className="me-2" />
              Register
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => navigate("/login")}
              style={{
                backgroundColor: currentTheme.surface,
                color: currentTheme.text,
                border: `1px solid ${currentTheme.border}`,
                padding: "12px",
                fontSize: "16px",
                fontWeight: "600",
                borderRadius: "8px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.surfaceAlt;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.surface;
              }}
            >
              <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
              Already have an account? Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
