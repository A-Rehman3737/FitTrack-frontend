import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { usePreferences } from "../context/preferenceContext";

const Layout = () => {
  const { preferences } = usePreferences();
  const isDark = preferences.theme === "dark";

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: isDark ? "#121212" : "#f2f2f2",
        color: isDark ? "#f2f2f2" : "#333",
        minHeight: "100vh", // full height of screen
      }}
    >
      {/* Sidebar stays fixed on the left */}
      <div style={{ width: "250px", position: "fixed", height: "100vh", zIndex: 1000 }}>
        <Sidebar />
      </div>

      {/* Main content area with left margin to avoid overlap with sidebar */}
      <div style={{ marginLeft: "250px", flex: 1 }}>
        {/* Navbar appears at the top of the content area */}
        <div style={{ position: "sticky", top: 0, zIndex: 999 }}>
          <Navbar />
        </div>

        {/* Page content rendered via Outlet */}
        <main
          style={{
            padding: "20px",
            backgroundColor: isDark ? "#1e1e1e" : "#f2f2f2",
            minHeight: "100vh",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
