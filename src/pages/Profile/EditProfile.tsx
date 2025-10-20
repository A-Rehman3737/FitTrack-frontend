import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../config/api";


const EditProfile = () => {
  const [form, setForm] = useState({ name: "", email: "", image: "" });
 
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setForm(storedUser);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userId = JSON.parse(localStorage.getItem("user") || "{}")._id;
      const res = await axios.put(
        API_ENDPOINTS.USERS.UPDATE(userId),
        form
      );
      alert(res.data.message);
      navigate("/dashboard");
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      

      {/* Main Content */}
      <div style={{ flex: 1, padding: "4rem", background: "#f7f9fa" }}>
        <div
          style={{
            maxWidth: "500px",
            margin: "2rem auto",
            padding: "2rem",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
          }}
        >
          <h2 style={{ color: "#329494", textAlign: "center", marginBottom: "1.5rem" }}>
            Edit Your Profile
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>
                Update Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ padding: "0.4rem" }}
              />
            </div>
            {form.image && (
              <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                <img
                  src={form.image}
                  alt="Profile Preview"
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #329494",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                />
              </div>
            )}
            <button type="submit" style={buttonStyle}>
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};



// Input styles
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  fontSize: "1rem",
  borderRadius: "5px",
  border: "1px solid #ccc",
  outline: "none",
};

// Button styles
const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  backgroundColor: "#329494",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "1rem",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

export default EditProfile;
