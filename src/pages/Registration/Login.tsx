import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faSignInAlt, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { usePreferences } from "../../context/preferenceContext";
import { API_ENDPOINTS } from "../../config/api";
import "./Register.css";

// Define LoginFormData type locally since global.d.ts is not a module
type LoginFormData = {
  email: string;
  password: string;
};

//main function
const Login = () => {
  const [form, setForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { currentTheme, themeColors } = usePreferences();

  //changes handling
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //submitting form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        API_ENDPOINTS.USERS.LOGIN,
        form
      );
      alert(res.data.message);

      // Save token and user data to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="register-container">
      <div
        className="register-card shadow-lg"
        style={{
          height: "70vh",
          backgroundColor: currentTheme.cardBg,
          color: currentTheme.text,
        }}
      >
        <h1
          className="text-center mb-4 fw-bold"
          style={{ color: themeColors.primary }}
        >
          <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
          Welcome Back To FitTrack
        </h1>

        <form onSubmit={handleSubmit}>
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
              <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
              Login
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => navigate("/")}
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
              <FontAwesomeIcon icon={faUserPlus} className="me-2" />
              Create a new account? Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
