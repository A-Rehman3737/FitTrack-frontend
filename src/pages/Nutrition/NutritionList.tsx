// IMPORTS
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  IconButton,
  Stack,
  TextField,
  Button,
  MenuItem,
  Divider,
  Breadcrumbs,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faChartLine,
  faBowlFood,
  faFire,
  faBreadSlice,
  faDrumstickBite,
  faCheese,
  faClock,
  faBrain,
  faAppleAlt,
  faWalking,
  faMoon,
  faLeaf,
  faSeedling,
  faGlassWater,
  faBan,
  faCamera,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { API_ENDPOINTS } from "../../config/api";

// CONSTANTS
const mealTypes = ["all", "Breakfast", "Lunch", "Dinner", "Snacks"];

export default function NutritionList() {
  const [nutritions, setNutritions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMealType, setFilterMealType] = useState("all");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    foodName: "",
    quantity: "",
    calories: "",
    carbs: "",
    protein: "",
    fat: "",
    mealType: "",
    image: "",
  });

  const fetchNutritions = async () => {
    try {
      const token = localStorage.getItem("token");
      const params: any = {};
      if (searchTerm.trim()) params.search = searchTerm;
      if (filterMealType !== "all") params.mealType = filterMealType;

      const res = await axios.get(API_ENDPOINTS.NUTRITION.BASE, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setNutritions(res.data);
    } catch (err: any) {
      console.error(
        "Error fetching nutritions:",
        err.response?.data || err.message
      );
    }
  };

  const deleteNutrition = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(API_ENDPOINTS.NUTRITION.BY_ID(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNutritions();
    } catch (err: any) {
      console.error(
        "Error deleting nutrition:",
        err.response?.data || err.message
      );
    }
  };

  const handleEditClick = (nutrition: any) => {
    setEditingId(nutrition._id);
    setEditForm({
      foodName: nutrition.foodName,
      quantity: nutrition.quantity.toString(),
      calories: nutrition.calories.toString(),
      carbs: nutrition.carbs.toString(),
      protein: nutrition.protein.toString(),
      fat: nutrition.fat.toString(),
      mealType: nutrition.mealType || "Breakfast",
      image: nutrition.image || "",
    });
  };

  const handleEditChange = (e: any) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditForm({ ...editForm, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const submitEdit = async () => {
    if (!editingId) return;
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...editForm,
        quantity: Number(editForm.quantity),
        calories: Number(editForm.calories),
        carbs: Number(editForm.carbs),
        protein: Number(editForm.protein),
        fat: Number(editForm.fat),
      };
      await axios.put(
        API_ENDPOINTS.NUTRITION.BY_ID(editingId),
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditingId(null);
      fetchNutritions();
    } catch (err: any) {
      console.error(
        "Error updating nutrition:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    fetchNutritions();
  }, [searchTerm, filterMealType]);

  return (
    <Box sx={{ px: 2 }}>
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
                    color: "#000", // Inactive breadcrumb in black
                    fontWeight: 600,
                  }}
                >
                  Dashboard
                </Link>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: "#329494", // Active breadcrumb in green
                  }}
                >
                  Nutrition List
                </Typography>
              </Breadcrumbs>
            </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mb: 3 }}>
        <Box sx={{
          width: 48, height: 48, borderRadius: "12px",
          backgroundColor: "#329494", display: "flex",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(50, 148, 148, 0.25)"
        }}>
          <FontAwesomeIcon icon={faUtensils} style={{ color: "#ffffff", fontSize: "20px" }} />
        </Box>
        <Typography variant="h4" sx={{ color: "#1a1a1a", fontWeight: 700 }}>
          Your Meal Intakes
        </Typography>
      </Box>
      {/* Search & Filter */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 0,
        }}
      >
        {/* Left Side: Nutrition Analytics Button */}
        <NavLink
          to="/nutrition-analytics"
          style={() => ({
            padding: "7px 18px",
            borderRadius: "30px",
            backgroundColor: "#329494",
            color: "white",
            textDecoration: "none",
            transition: "0.3s",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          })}
        >
          <FontAwesomeIcon icon={faChartLine} />
          Nutrition Analytics
        </NavLink>

        {/* Right Side: All Filters */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          {/* Search Input */}
          <TextField
            label="Search"
            placeholder="e.g. Apple"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              minWidth: 210,
              backgroundColor: "#fff",
              borderRadius: "30px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
              },
            }}
          />

          {/* Meal Type Dropdown */}
          <TextField
            label="Meal Type"
            select
            value={filterMealType}
            onChange={(e) => setFilterMealType(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              minWidth: 160,
              backgroundColor: "#fff",
              borderRadius: "30px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
              },
            }}
          >
            {mealTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          {/* Clear Button */}
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => {
              setSearchTerm("");
              setFilterMealType("all");
            }}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: "30px",
              px: 3,
              py: 1,
              backgroundColor: "#329494",
              "&:hover": {
                backgroundColor: "#329494",
              },
            }}
          >
            Clear
          </Button>
        </Box>
      </Box>
      <Typography variant="caption" sx={{ color: "black", fontSize: 13, display: "flex", alignItems: "center", gap: 0.5 }}>
        Track your Nutritions visually <FontAwesomeIcon icon={faChartLine} style={{ color: "#329494", marginLeft: "6px" }} />
      </Typography>

      <br />
      <br />

      {/* Layout */}
      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {/* Left - Cards */}
        <Box sx={{ flex: 1 }}>
          {nutritions.length === 0 ? (
            <Typography variant="h6" color="text.secondary" sx={{ mt: 4 }}>
              No nutrition entries found.
            </Typography>
          ) : (
            nutritions.map((nutrition) => (
              <Card
                key={nutrition._id}
                elevation={3}
                sx={{
                  display: "flex",
                  mb: 3,
                  borderRadius: 3,
                  overflow: "hidden",
                  minHeight: 180,
                }}
              >
                {/* Image */}
                {nutrition.image && (
                  <Box
                    sx={{
                      width: 190,
                      height: 180,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "12px",
                      overflow: "hidden",
                      mt: 2,
                      mb: 2,
                      mx: "auto",
                      p: 1, // 👈 padding added
                      boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <img
                      src={nutrition.image}
                      alt="Food"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px", // 👈 slightly smaller than outer box
                        display: "block",
                      }}
                    />
                  </Box>
                )}

                {/* Content */}

                <Box sx={{ flex: 1, p: 2, position: "relative" }}>
                  <br />
                  <Box
                    sx={{ position: "absolute", top: 12, left: 12, zIndex: 1 }}
                  >
                    <Typography
                      sx={{
                        fontSize: 16,
                        mt: 2,
                        px: 1.5,
                        py: 0.5,
                        color: "white",
                        borderRadius: "16px",
                        backgroundColor: "#329494",
                        fontWeight: 600,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                        textTransform: "capitalize",
                        minWidth: "80px",
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <FontAwesomeIcon icon={faBowlFood} /> {nutrition.mealType}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 5, pr: 2 }}>
                    {/* Food Name - Make it attractive */}
                    <Typography
                      fontWeight={800}
                      fontSize={20}
                      sx={{
                        mb: 1,
                        color: "#222",
                        letterSpacing: 0.5,
                        lineHeight: 1.3,
                        fontFamily: "'Segoe UI', sans-serif",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <FontAwesomeIcon icon={faBowlFood} style={{ color: "#329494" }} /> {nutrition.foodName}
                    </Typography>

                    {/* Line-by-line details */}
                    <Typography fontSize={14} sx={{ color: "#555", mb: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                      <FontAwesomeIcon icon={faUtensils} style={{ color: "#329494" }} />
                      You had this in the quantity of{" "}
                      <strong>{nutrition.quantity}</strong>.
                    </Typography>
                    <Typography fontSize={14} sx={{ color: "#555", mb: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                      <FontAwesomeIcon icon={faFire} style={{ color: "#329494" }} />
                      It provided you around{" "}
                      <strong>{nutrition.calories} calories</strong>.
                    </Typography>
                  </Box>

                  {/* Right side - Macros */}
                  <Stack
                    direction="column"
                    spacing={2.5}
                    sx={{
                      position: "absolute",
                      right: 16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      textAlign: "right",
                      backgroundColor: "#f5f5f5",
                      padding: "12px",
                      borderRadius: "8px",
                      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                      minWidth: "150px",
                      minHeight: "160px",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      fontSize={17}
                      sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <FontAwesomeIcon icon={faBreadSlice} style={{ color: "#329494" }} /> Carbs:
                      </span> <strong>{nutrition.carbs}g</strong>
                    </Typography>
                    <Typography
                      fontSize={17}
                      sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <FontAwesomeIcon icon={faDrumstickBite} style={{ color: "#329494" }} /> Protein:
                      </span>{" "}
                      <strong>{nutrition.protein}g</strong>
                    </Typography>
                    <Typography
                      fontSize={17}
                      sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <FontAwesomeIcon icon={faCheese} style={{ color: "#329494" }} /> Fat:
                      </span> <strong>{nutrition.fat}g</strong>
                    </Typography>
                  </Stack>

                  {/* Bottom Right - Buttons */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 10,
                      left: "40%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    <IconButton
                      onClick={() => handleEditClick(nutrition)}
                      color="primary"
                      size="small"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => deleteNutrition(nutrition._id)}
                      color="error"
                      size="small"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            ))
          )}
        </Box>

        {/* Right Info Box */}
        <Box
          sx={{
            minWidth: 300,
            maxWidth: 400,
            backgroundColor: "#529e9eff",
            p: 3,
            mt: 5,
            color: "white",
            borderRadius: 3,
            boxShadow: 2,
            height: "fit-content",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: "8px",
              backgroundColor: "#ffffff20", display: "flex",
              alignItems: "center", justifyContent: "center"
            }}>
              <FontAwesomeIcon icon={faUtensils} style={{ color: "#ffffff", fontSize: "16px" }} />
            </Box>
            <Typography variant="h6" fontWeight={600}>
              Nutrition Info
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography fontSize={14} gutterBottom sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <FontAwesomeIcon icon={faUtensils} style={{ marginTop: "3px", flexShrink: 0 }} />
            A balanced diet fuels your body and mind. Eat colorful veggies,
            whole grains, and healthy proteins.
          </Typography>

          <Typography fontSize={14} gutterBottom sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <FontAwesomeIcon icon={faGlassWater} style={{ marginTop: "3px", flexShrink: 0 }} />
            Stay hydrated and avoid processed sugar. Small steps lead to
            long-term results.
          </Typography>

          <Typography fontSize={14} gutterBottom sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <FontAwesomeIcon icon={faClock} style={{ marginTop: "3px", flexShrink: 0 }} />
            Eating on time helps regulate your metabolism and energy levels.
          </Typography>

          <Typography fontSize={14} gutterBottom sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <FontAwesomeIcon icon={faBrain} style={{ marginTop: "3px", flexShrink: 0 }} />
            Omega-3 rich foods like fish and walnuts support brain health.
          </Typography>

          <Typography fontSize={14} gutterBottom sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <FontAwesomeIcon icon={faAppleAlt} style={{ marginTop: "3px", flexShrink: 0 }} />
            Fresh fruits are packed with essential vitamins — aim for at
            least 2 servings daily.
          </Typography>

          <Typography fontSize={14} gutterBottom sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <FontAwesomeIcon icon={faWalking} style={{ marginTop: "3px", flexShrink: 0 }} />
            Combine good nutrition with regular exercise for best results.
          </Typography>

          <Typography fontSize={14} gutterBottom sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <FontAwesomeIcon icon={faMoon} style={{ marginTop: "3px", flexShrink: 0 }} />
            Don't forget rest — quality sleep improves digestion and overall
            wellness.
          </Typography>

          <Typography fontSize={14} gutterBottom sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <FontAwesomeIcon icon={faLeaf} style={{ marginTop: "3px", flexShrink: 0 }} />
            Green leafy vegetables are rich in fiber and iron — include them
            in at least one meal a day.
          </Typography>

          <Typography fontSize={14} gutterBottom sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <FontAwesomeIcon icon={faSeedling} style={{ marginTop: "3px", flexShrink: 0 }} />
            Choose complex carbs like sweet potatoes and oats for
            longer-lasting energy.
          </Typography>

          <Typography fontSize={14} gutterBottom sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <FontAwesomeIcon icon={faGlassWater} style={{ marginTop: "3px", flexShrink: 0 }} />
            Calcium-rich foods like yogurt and almonds support strong bones
            and teeth.
          </Typography>

          <Typography fontSize={14} gutterBottom sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <FontAwesomeIcon icon={faBan} style={{ marginTop: "3px", flexShrink: 0 }} />
            Skip late-night snacking — it can disrupt sleep and digestion.
          </Typography>
        </Box>
      </Box>

      {/* Edit Section (Preserved) */}
      <Dialog
        open={Boolean(editingId)}
        onClose={() => setEditingId(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 2,
            maxHeight: "90vh", // prevent full screen overflow
            overflowY: "auto", // allow scrolling *only if needed*
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: 20,
            color: "#329494",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <FontAwesomeIcon icon={faPencil} /> Edit Nutrition Entry
        </DialogTitle>

        <DialogContent sx={{overflow: "visible",}}>
          <form className="p-4">
            <div className="row g-3">
              {/* Input Fields */}
              {[
                "foodName",
                "quantity",
                "calories",
                "carbs",
                "protein",
                "fat",
              ].map((field) => (
                <div className="col-md-6" key={field}>
                  <label className="form-label text-muted">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-4 shadow-sm px-3 py-2"
                    name={field}
                    value={(editForm as any)[field]}
                    onChange={handleEditChange}
                  />
                </div>
              ))}

              {/* Meal Type Dropdown */}
              <div className="col-md-6">
                <label className="form-label text-muted">Meal Type</label>
                <select
                  className="form-select rounded-4 shadow-sm px-3 py-2"
                  name="mealType"
                  value={(editForm as any).mealType}
                  onChange={handleEditChange}
                >
                  {mealTypes
                    .filter((m) => m !== "all")
                    .map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                </select>
              </div>

              {/* Upload Image Button */}
              <div className="col-md-6 d-flex align-items-end">
                <label
                  className="btn w-100 fw-bold rounded-4 px-3 py-2 border"
                  style={{
                    borderColor: "#329494",
                    color: "#329494",
                    backgroundColor: "#f2fdfd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <FontAwesomeIcon icon={faCamera} />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {/* Preview Image */}
              {editForm.image && (
                <div className="col-12 d-flex justify-content-center">
                  <img
                    src={editForm.image}
                    alt="Preview"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      border: "3px solid #329494",
                      boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                      marginTop: "10px",
                    }}
                  />
                </div>
              )}

              {/* Buttons */}
            </div>
          </form>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 3,mt :-6}}>
          <Button
            onClick={() => setEditingId(null)}
            variant="outlined"
            sx={{
              borderRadius: "30px",
              px: 4,
              fontWeight: "bold",
              borderColor: "#aaa",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={submitEdit}
            variant="contained"
            sx={{
              backgroundColor: "#329494",
              borderRadius: "30px",
              px: 4,
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#287e7e",
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
