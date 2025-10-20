import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faDumbbell,
  faChartLine,
  faChevronDown,
  faTimes,
  faBars,
  faAppleAlt,
  faBullseye,
  faComments,
  faEnvelope,
  faFileAlt,
  faUserShield,
  faPlus,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { usePreferences } from "../context/preferenceContext";
import logo from "../images/logo.png";

type DropdownKey = "workout" | "nutrition" | "progress" | "goals";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdowns, setDropdowns] = useState({
    workout: false,
    nutrition: false,
    progress: false,
    goals: false,
  });

  const { currentTheme, themeColors } = usePreferences();

  const toggleDropdown = (key: DropdownKey) => {
    setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!sidebarOpen) {
    return (
      <div
        onClick={() => setSidebarOpen(true)}
        style={{
          position: "fixed",
          top: "1rem",
          left: "1rem",
          background: themeColors.primary,
          color: "#fff",
          padding: "0.5rem",
          borderRadius: "6px",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        <FontAwesomeIcon icon={faBars} />
      </div>
    );
  }

  return (
    <div
      style={{
        width: "250px",
        background: currentTheme.sidebarBg,
        color: currentTheme.text,
        padding: "2rem 1rem",
        boxShadow: currentTheme.shadow,
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        zIndex: 999,
        animationName: sidebarOpen ? "fadeInLeft" : "fadeOutLeft",
        animationDuration: "0.8s",
        animationFillMode: "forwards",
        overflowY: "auto",
      }}
    >
      <img
        src={logo}
        alt="FitTrack Logo"
        style={{
          height: "90px",
          width: "90px",
          objectFit: "contain",
          display: "block",
          margin: "0 auto",
          marginBottom: "16px",
        }}
      />
      <FontAwesomeIcon
        icon={faTimes}
        onClick={() => setSidebarOpen(false)}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          cursor: "pointer",
          color: currentTheme.textSecondary,
          fontSize: "18px",
        }}
      />

      <ul style={{ listStyle: "none", padding: 0 }}>
        {/* Dashboard */}
        <li>
          <NavLink
            to="/dashboard"
            style={({ isActive }) => getLinkStyle(isActive, currentTheme, themeColors)}
          >
            <FontAwesomeIcon icon={faHome} />
            <span style={{ marginLeft: "10px", fontSize: 18 }}>Dashboard</span>
          </NavLink>
        </li>

        {/* Workouts Dropdown */}
        <li
          style={getSidebarItemStyle(currentTheme)}
          onClick={() => toggleDropdown("workout")}
        >
          <FontAwesomeIcon icon={faDumbbell} />
          <span style={{ marginLeft: "10px", fontSize: 18 }}>Workouts</span>
          <FontAwesomeIcon
            icon={faChevronDown}
            style={chevronStyle(dropdowns.workout)}
          />
        </li>
        {dropdowns.workout && (
          <ul
            style={{
              listStyle: "none",
              paddingLeft: "1.5rem",
              marginTop: "0.5rem",
            }}
          >
            <li style={{ marginBottom: "0.4rem" }}>
              <NavLink
                to="/workout-form"
                style={({ isActive }) => getSubLinkStyle(isActive, currentTheme, themeColors)}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Workout Form
              </NavLink>
            </li>
            <li style={{ marginBottom: "0.4rem" }}>
              <NavLink
                to="/workout-list"
                style={({ isActive }) => getSubLinkStyle(isActive, currentTheme, themeColors)}
              >
                <FontAwesomeIcon icon={faList} className="me-2" />
                Workout List
              </NavLink>
            </li>
          </ul>
        )}

        {/* Nutrition Dropdown */}
        <li
          style={getSidebarItemStyle(currentTheme)}
          onClick={() => toggleDropdown("nutrition")}
        >
          <FontAwesomeIcon icon={faAppleAlt} />
          <span style={{ marginLeft: "10px", fontSize: 18 }}>Nutrition</span>
          <FontAwesomeIcon
            icon={faChevronDown}
            style={chevronStyle(dropdowns.nutrition)}
          />
        </li>
        {dropdowns.nutrition && (
          <ul
            style={{
              listStyle: "none",
              paddingLeft: "1.5rem",
              marginTop: "0.5rem",
            }}
          >
            <li style={{ marginBottom: "0.4rem" }}>
              <NavLink
                to="/nutrition-form"
                style={({ isActive }) => getSubLinkStyle(isActive, currentTheme, themeColors)}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Nutrition Form
              </NavLink>
            </li>
            <li style={{ marginBottom: "0.4rem" }}>
              <NavLink
                to="/nutrition-list"
                style={({ isActive }) => getSubLinkStyle(isActive, currentTheme, themeColors)}
              >
                <FontAwesomeIcon icon={faList} className="me-2" />
                Nutrition List
              </NavLink>
            </li>
          </ul>
        )}

        {/* Progress Dropdown */}
        <li
          style={getSidebarItemStyle(currentTheme)}
          onClick={() => toggleDropdown("progress")}
        >
          <FontAwesomeIcon icon={faChartLine} />
          <span style={{ marginLeft: "10px", fontSize: 18 }}>Progress</span>
          <FontAwesomeIcon
            icon={faChevronDown}
            style={chevronStyle(dropdowns.progress)}
          />
        </li>
        {dropdowns.progress && (
          <ul
            style={{
              listStyle: "none",
              paddingLeft: "1.5rem",
              marginTop: "0.5rem",
            }}
          >
            <li style={{ marginBottom: "0.4rem" }}>
              <NavLink
                to="/add-progress"
                style={({ isActive }) => getSubLinkStyle(isActive, currentTheme, themeColors)}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Progress
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/progress-list"
                style={({ isActive }) => getSubLinkStyle(isActive, currentTheme, themeColors)}
              >
                <FontAwesomeIcon icon={faChartLine} className="me-2" />
                View Progress
              </NavLink>
            </li>
          </ul>
        )}

        {/* Goals Dropdown */}
        <li
          style={getSidebarItemStyle(currentTheme)}
          onClick={() => toggleDropdown("goals")}
        >
          <FontAwesomeIcon icon={faBullseye} />
          <span style={{ marginLeft: "10px", fontSize: 18 }}>Goals</span>
          <FontAwesomeIcon
            icon={faChevronDown}
            style={chevronStyle(dropdowns.goals)}
          />
        </li>
        {dropdowns.goals && (
          <ul
            style={{
              listStyle: "none",
              paddingLeft: "1.5rem",
              marginTop: "0.5rem",
            }}
          >
            <li style={{ marginBottom: "0.4rem" }}>
              <NavLink
                to="/add-goals"
                style={({ isActive }) => getSubLinkStyle(isActive, currentTheme, themeColors)}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Goals
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/goal-list"
                style={({ isActive }) => getSubLinkStyle(isActive, currentTheme, themeColors)}
              >
                <FontAwesomeIcon icon={faList} className="me-2" />
                Goal List
              </NavLink>
            </li>
          </ul>
        )}

        {/* Forum */}
        <li>
          <NavLink
            to="/forum"
            style={({ isActive }) => getLinkStyle(isActive, currentTheme, themeColors)}
          >
            <FontAwesomeIcon icon={faComments} />
            <span style={{ marginLeft: "10px", fontSize: 18 }}>Forum</span>
          </NavLink>
        </li>

        {/* Contact */}
        <li>
          <NavLink
            to="/contact"
            style={({ isActive }) => getLinkStyle(isActive, currentTheme, themeColors)}
          >
            <FontAwesomeIcon icon={faEnvelope} />
            <span style={{ marginLeft: "10px", fontSize: 18 }}>Contact</span>
          </NavLink>
        </li>

        {/* Reports */}
        <li>
          <NavLink
            to="/reports"
            style={({ isActive }) => getLinkStyle(isActive, currentTheme, themeColors)}
          >
            <FontAwesomeIcon icon={faFileAlt} />
            <span style={{ marginLeft: "10px", fontSize: 18 }}>Reports</span>
          </NavLink>
        </li>

        {/* Privacy Policy */}
        <li>
          <NavLink
            to="/privacy"
            style={({ isActive }) => getLinkStyle(isActive, currentTheme, themeColors)}
          >
            <FontAwesomeIcon icon={faUserShield} />
            <span style={{ marginLeft: "10px", fontSize: 18 }}>
              Privacy Policy
            </span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

// Helper style functions
const getSidebarItemStyle = (theme: any): React.CSSProperties => ({
  padding: "0.75rem 1rem",
  marginBottom: "0.5rem",
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  transition: "0.3s",
  cursor: "pointer",
  color: theme.text,
});

const getLinkStyle = (
  isActive: boolean,
  theme: any,
  colors: any
): React.CSSProperties => ({
  padding: "0.75rem 1rem",
  marginBottom: "0.5rem",
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  transition: "0.3s",
  cursor: "pointer",
  background: isActive ? colors.primary : "transparent",
  color: isActive ? "#fff" : theme.text,
});

const getSubLinkStyle = (
  isActive: boolean,
  theme: any,
  colors: any
): React.CSSProperties => ({
  display: "block",
  padding: "0.5rem 0.75rem",
  borderRadius: "5px",
  background: isActive ? colors.primary : "transparent",
  color: isActive ? "#fff" : theme.text,
  textDecoration: "none",
  transition: "0.3s",
});

const chevronStyle = (open: boolean) => ({
  marginLeft: "auto",
  transition: "0.3s",
  transform: open ? "rotate(180deg)" : "rotate(0deg)",
} as const);

export default Sidebar;
