import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { usePreferences } from "../context/preferenceContext";
import { Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faBell,
  faExclamationTriangle,
  faUserCircle,
  faEdit,
  faSignOutAlt,
  faSearch,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { API_ENDPOINTS } from "../config/api";

interface User {
  name: string;
  email: string;
  image: string;
}

interface Notification {
  _id: string;
  message: string;
}

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [prefOpen, setPrefOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [alignRight, setAlignRight] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [cardioAlert, setCardioAlert] = useState(false);
  const [strengthAlert, setStrengthAlert] = useState(false);
  const [nutritionAlert, setNutritionAlert] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);

  const popRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const prefRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);

  const { preferences, updatePreferences, currentTheme, themeColors, toggleTheme } = usePreferences();

  useEffect(() => {
    const loadUser = () => {
      const userData = localStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : null);
    };
    loadUser();
    window.addEventListener("userUpdated", loadUser);
    return () => window.removeEventListener("userUpdated", loadUser);
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", (e) => {
      if (
        !popRef.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node) &&
        !prefRef.current?.contains(e.target as Node) &&
        !notifRef.current?.contains(e.target as Node) &&
        !alertRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
        setPrefOpen(false);
        setNotifOpen(false);
        setAlertOpen(false);
      }
    });
    return () => document.removeEventListener("mousedown", () => {});
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      if (!token || !userData) return;

      const parsedUser = JSON.parse(userData);
      try {
        const [notifRes, workoutRes, nutritionRes] = await Promise.all([
          axios.get(API_ENDPOINTS.USERS.NOTIFICATIONS, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(API_ENDPOINTS.WORKOUTS.BASE, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(API_ENDPOINTS.NUTRITION.BASE, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setNotifications(notifRes.data);

        const userW = workoutRes.data.filter(
          (w: any) => w.userId === parsedUser._id
        );
        const hasStrength = userW.some((w: any) => w.category === "strength");
        const hasCardio = userW.some((w: any) => w.category === "cardio");
        setCardioAlert(hasStrength && !hasCardio);
        setStrengthAlert(hasCardio && !hasStrength);

        const meals = nutritionRes.data.filter(
          (n: any) => n.userId === parsedUser._id
        );
        const types = meals.map((n: any) => n.mealType?.toLowerCase());
        if (types.length === 0) {
          setNutritionAlert(
            "No meals logged today. Please ensure a balanced diet."
          );
        } else if (types.includes("breakfast") && !types.includes("lunch")) {
          setNutritionAlert("Breakfast logged. Kindly log lunch.");
        } else if (
          types.includes("breakfast") &&
          types.includes("lunch") &&
          !types.includes("dinner")
        ) {
          setNutritionAlert(
            "Dinner not logged. Please complete your intake."
          );
        } else {
          setNutritionAlert(null);
        }
      } catch (err) {
        console.error("Error fetching alerts and notifications", err);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (open && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setAlignRight(!(rect.right > window.innerWidth));
    }
  }, [open]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem(`userPreferences_${user?.name}`);
    window.location.href = "/login";
  };

  const handlePreferenceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    const updated = type === "checkbox" ? checked : value;
    updatePreferences({ [name]: updated });
    if (user) {
      localStorage.setItem(
        `userPreferences_${user.name}`,
        JSON.stringify({ ...preferences, [name]: updated })
      );
    }
  };

//Close Notification
const handleCloseNotification = async (id: string) => {
  const isDeleted = await deleteNotification(id);

  if (isDeleted) {
    // Remove the deleted notification from the state
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  } else {
    alert("Failed to delete notification.");
  }
};

// ✅ Function to call the backend and delete the notification
const deleteNotification = async (id: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No token found in localStorage.");
      return false;
    }

    // ✅ Fixed URL here
    const res = await fetch(`/api/users/notifications/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let data = null;
    const contentType = res.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      data = await res.json();
    }

    if (!res.ok) {
      console.warn("Delete failed with status:", res.status, data?.message);
      throw new Error(data?.message || "Failed to delete notification.");
    }

    return true;
  } catch (error) {
    console.error("Delete error:", error);
    return false;
  }
};




  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 shadow-sm py-2 px-4 w-full border-bottom animate__animated animate__fadeInDown"
        style={{
          backgroundColor: currentTheme.navbarBg,
          borderBottomColor: currentTheme.border,
          animationDuration: "0.8s",
        }}
      >
        <nav className="navbar navbar-expand-lg w-100">
          <div className="container-fluid d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="fs-5 border-0 bg-transparent"
                style={{
                  color: themeColors.primary,
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                }}
                title={`Switch to ${preferences.theme === "light" ? "dark" : "light"} mode`}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <FontAwesomeIcon
                  icon={preferences.theme === "light" ? faMoon : faSun}
                />
              </button>

              {/* Preferences */}
              <div className="position-relative" ref={prefRef}>
                <button
                  onClick={() => setPrefOpen((p) => !p)}
                  className="fs-4 border-0 bg-transparent"
                  style={{ color: themeColors.primary }}
                >
                  <FontAwesomeIcon icon={faCog} />
                </button>
                {prefOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "0",
                      marginTop: "8px",
                      backgroundColor: currentTheme.cardBg,
                      border: `1px solid ${currentTheme.border}`,
                      borderRadius: 12,
                      boxShadow: currentTheme.shadow,
                      padding: 16,
                      minWidth: 260,
                      zIndex: 9999,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: themeColors.primary, mb: 2 }}
                    >
                      <FontAwesomeIcon icon={faCog} className="me-2" />
                      Preferences
                    </Typography>
                    <div
                      className="mb-3"
                      style={{ color: currentTheme.text }}
                    >
                      <label>
                        <input
                          type="checkbox"
                          name="notifications"
                          checked={preferences.notifications}
                          onChange={handlePreferenceChange}
                          className="me-2"
                        />
                        Enable Notifications
                      </label>
                    </div>
                    <div
                      className="mb-3"
                      style={{ color: currentTheme.text }}
                    >
                      <label>Theme:</label>
                      <select
                        name="theme"
                        value={preferences.theme}
                        onChange={handlePreferenceChange}
                        className="ms-2"
                        style={{
                          backgroundColor: currentTheme.surface,
                          color: currentTheme.text,
                          border: `1px solid ${currentTheme.border}`,
                          borderRadius: "4px",
                          padding: "4px 8px",
                        }}
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                    </div>
                    <div style={{ color: currentTheme.text }}>
                      <label>Units:</label>
                      <select
                        name="unit"
                        value={preferences.unit}
                        onChange={handlePreferenceChange}
                        className="ms-2"
                        style={{
                          backgroundColor: currentTheme.surface,
                          color: currentTheme.text,
                          border: `1px solid ${currentTheme.border}`,
                          borderRadius: "4px",
                          padding: "4px 8px",
                        }}
                      >
                        <option value="kg">Metric (kg)</option>
                        <option value="lbs">Imperial (lbs)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Bell Icon */}
              <div className="position-relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen((p) => !p)}
                  className="fs-4 border-0 bg-transparent position-relative"
                  style={{ color: themeColors.primary }}
                >
                  <FontAwesomeIcon icon={faBell} />
                  {notifications.length > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: 10 }}
                    >
                      {notifications.length}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      width: 300,
                      backgroundColor: currentTheme.cardBg,
                      border: `1px solid ${currentTheme.border}`,
                      borderRadius: 8,
                      boxShadow: currentTheme.shadow,
                      zIndex: 9999,
                      maxHeight: 400,
                      overflowY: "auto",
                    }}
                  >
                    <div style={{ padding: 10 }}>
                      <Typography
                        variant="h6"
                        sx={{ color: themeColors.primary, mb: 1 }}
                      >
                        <FontAwesomeIcon icon={faBell} className="me-2" />
                        Notifications
                      </Typography>
                      {notifications.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          No notifications.
                        </Typography>
                      ) : (
                        notifications.map((note) => (
                          <div
                            key={note._id}
                            style={{
                              padding: 10,
                              marginBottom: 8,
                              backgroundColor: "#f1f9ff",
                              borderRadius: 6,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: "#333", fontSize: 13 }}
                            >
                              {note.message}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleCloseNotification(note._id)}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Alerts Icon */}
              <div className="position-relative" ref={alertRef}>
                <button
                  onClick={() => setAlertOpen((p) => !p)}
                  className="fs-4 border-0 bg-transparent position-relative"
                  style={{
                    color: themeColors.primary,
                  }}
                >
                  <FontAwesomeIcon icon={faExclamationTriangle} />

                  {(cardioAlert || strengthAlert || nutritionAlert) && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: 10 }}
                    >
                      {[
                        cardioAlert ? 1 : 0,
                        strengthAlert ? 1 : 0,
                        nutritionAlert ? 1 : 0,
                      ].reduce((a, b) => a + b, 0)}
                    </span>
                  )}
                </button>

                {alertOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      marginTop: 8,
                      width: 300,
                      backgroundColor: currentTheme.cardBg,
                      border: `1px solid ${currentTheme.border}`,
                      borderRadius: 8,
                      boxShadow: currentTheme.shadow,
                      zIndex: 9999,
                      maxHeight: 400,
                      overflowY: "auto",
                    }}
                  >
                    <div style={{ padding: 10 }}>
                      <Typography
                        variant="h6"
                        sx={{ color: themeColors.warning, mb: 1 }}
                      >
                        <FontAwesomeIcon
                          icon={faExclamationTriangle}
                          className="me-2"
                        />
                        Alerts
                      </Typography>

                      {nutritionAlert && (
                        <div
                          style={{
                            background: "#fff3cd",
                            padding: 8,
                            borderRadius: 6,
                            marginBottom: 10,
                            fontSize: 13,
                            color: "#856404",
                          }}
                        >
                          {nutritionAlert}
                        </div>
                      )}
                      {cardioAlert && (
                        <div
                          style={{
                            background: "#e2f0d9",
                            padding: 8,
                            borderRadius: 6,
                            marginBottom: 10,
                            fontSize: 13,
                            color: "#155724",
                          }}
                        >
                          To balance workouts: cardio missing
                        </div>
                      )}
                      {strengthAlert && (
                        <div
                          style={{
                            background: "#f8d7da",
                            padding: 8,
                            borderRadius: 6,
                            marginBottom: 10,
                            fontSize: 13,
                            color: "#721c24",
                          }}
                        >
                          Cardio done but strength missing
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div
                ref={popRef}
                className="d-flex align-items-center gap-2 position-relative"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen((p) => !p);
                  }}
                  className="btn p-0 border-0 bg-transparent d-flex align-items-center"
                >
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt="profile"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: `2px solid ${themeColors.primary}`,
                      }}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      className="fs-4"
                      style={{ color: themeColors.primary }}
                    />
                  )}
                </button>
                <div
                  style={{
                    fontSize: 15,
                    color: themeColors.primary,
                    whiteSpace: "nowrap",
                  }}
                >
                  Your Profile
                </div>
                {open && (
                  <div
                    ref={dropdownRef}
                    style={{
                      position: "absolute",
                      top: "60px",
                      right: alignRight ? 0 : "auto",
                      left: alignRight ? "auto" : 0,
                      backgroundColor: currentTheme.cardBg,
                      border: `1px solid ${currentTheme.border}`,
                      borderRadius: 12,
                      boxShadow: currentTheme.shadow,
                      width: 240,
                      zIndex: 9999,
                      textAlign: "center",
                    }}
                  >
                    <div
                      className="px-3 py-3"
                      style={{
                        borderBottom: `1px solid ${currentTheme.border}`,
                      }}
                    >
                      <strong style={{ color: themeColors.primary }}>
                        {user?.name}
                      </strong>
                      <br />
                      <small
                        style={{
                          fontSize: "14px",
                          color: currentTheme.textSecondary,
                        }}
                      >
                        {user?.email}
                      </small>
                    </div>
                    <a
                      href="/edit-profile"
                      className="dropdown-item px-3 py-2 d-block text-decoration-none"
                      style={{
                        color: themeColors.primary,
                        fontWeight: 500,
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} className="me-2" />
                      Edit Profile
                    </a>
                    <button
                      className="dropdown-item px-3 py-2 border-0 bg-transparent"
                      onClick={logout}
                      style={{
                        color: themeColors.danger,
                        fontWeight: 500,
                      }}
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Search */}
            <form className="d-flex align-items-center" role="search">
              <input
                className="form-control me-2 rounded-pill px-3 shadow-sm"
                type="search"
                placeholder="Search workouts..."
                style={{
                  width: 350,
                  backgroundColor: currentTheme.surface,
                  border: `1px solid ${currentTheme.border}`,
                  color: currentTheme.text,
                }}
              />
              <button
                className="btn rounded-pill shadow-sm"
                type="submit"
                style={{
                  backgroundColor: themeColors.primary,
                  color: "#fff",
                  border: "none",
                }}
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </form>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
