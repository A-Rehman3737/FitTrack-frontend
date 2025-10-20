import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllPosts } from "../../services/forumService";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDumbbell,
  faAppleAlt,
  faFire,
  faHeartbeat,
  faComments,
  faUsers,
  faPaperPlane,
  faRobot,
  faArrowRight,
  faTimes,
  faBolt,
  faChartLine,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";

import NutritionBarChart from "../Nutrition/NutritionBarChart";
import ProgressDonutChart from "../Progress/ProgressDonutChart";
import { Box, Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ForumDetail from "../../components/ForumDetails";
import { usePreferences } from "../../context/preferenceContext";
import { API_ENDPOINTS } from "../../config/api";

interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  following?: string[];
}

interface FollowStatus {
  youFollow: boolean;
  theyFollowBack: boolean;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentTheme, themeColors } = usePreferences();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [people, setPeople] = useState<User[]>([]);
  const [followedIds, setFollowedIds] = useState<string[]>([]);
  const [followStatusMap, setFollowStatusMap] = useState<{
    [key: string]: FollowStatus;
  }>({});
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedForumId, setSelectedForumId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatReply, setChatReply] = useState("");
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleOpenForumDetail = (id: string) => {
    setSelectedForumId(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedForumId(null);
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    setIsLoadingChat(true);
    try {
      const res = await axios.post(API_ENDPOINTS.CHAT, {
        message: chatInput,
      });

      const reply =
        res.data.reply ||
        res.data.response ||
        res.data.text ||
        "AI did not respond.";

      setChatReply(reply);
      setChatInput("");
    } catch (err) {
      console.error("Chat error:", err);
      setChatReply("Sorry, something went wrong.");
    } finally {
      setIsLoadingChat(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    const fetchPosts = async () => {
      const data = await getAllPosts();
      setPosts(data.slice(0, 5));
    };
    fetchPosts();

    if (!token || !userData) {
      navigate("/login");
    } else {
      const parsedUser: User = JSON.parse(userData);
      setCurrentUser(parsedUser);
      if (parsedUser.following) {
        setFollowedIds(parsedUser.following);
      }

      axios
        .get(API_ENDPOINTS.USERS.PEOPLE, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(async (res) => {
          const peopleList = res.data;
          setPeople(peopleList);

          const statusMap: { [key: string]: FollowStatus } = {};
          for (const person of peopleList) {
            try {
              const statusRes = await axios.get(
                API_ENDPOINTS.USERS.FOLLOW_STATUS(person._id),
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              statusMap[person._id] = statusRes.data;
            } catch (err) {
              console.error("Error fetching follow status:", err);
            }
          }
          setFollowStatusMap(statusMap);
        })
        .catch((err) => console.error("Error fetching people:", err));
    }
  }, [navigate]);

  const handleFollow = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        API_ENDPOINTS.USERS.FOLLOW(id),
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFollowedIds([...followedIds, id]);

      const res = await axios.get(
        API_ENDPOINTS.USERS.FOLLOW_STATUS(id),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFollowStatusMap((prev) => ({
        ...prev,
        [id]: res.data,
      }));
    } catch (err) {
      console.error("Error following user:", err);
    }
  };

  return (
    <div
      style={{
        backgroundColor: currentTheme.background,
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
        {/* Hero Section with User Greeting */}
        <div
          style={{
            backgroundColor: themeColors.primary,
            borderRadius: "20px",
            padding: "40px",
            marginBottom: "24px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-30px",
              left: "-30px",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h1
                  style={{
                    fontSize: "36px",
                    fontWeight: "700",
                    color: "white",
                    margin: "0 0 8px 0",
                  }}
                >
                  {currentUser ? `Hey ${currentUser.name}!` : "Welcome to FitTrack"}
                </h1>
                <p
                  style={{
                    fontSize: "16px",
                    color: "rgba(255,255,255,0.9)",
                    margin: 0,
                  }}
                >
                  Ready to crush your fitness goals today?
                </p>
              </div>
              <Link to="/workout-form" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    backgroundColor: "white",
                    color: themeColors.primary,
                    border: "none",
                    borderRadius: "12px",
                    padding: "14px 28px",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FontAwesomeIcon icon={faBolt} />
                  Start Workout
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "24px" }}>
          {/* Left Column - Stats Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* Workout Card */}
            <div
              style={{
                backgroundColor: currentTheme.cardBg,
                border: `1px solid ${currentTheme.border}`,
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: `${themeColors.primary}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesomeIcon icon={faDumbbell} style={{ color: themeColors.primary, fontSize: "20px" }} />
                </div>
                <div
                  style={{
                    backgroundColor: `${themeColors.primary}15`,
                    color: themeColors.primary,
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  75%
                </div>
              </div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: currentTheme.textSecondary, marginBottom: "8px" }}>
                WORKOUT TIME
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "12px" }}>
                <span style={{ fontSize: "32px", fontWeight: "700", color: currentTheme.text }}>45</span>
                <span style={{ fontSize: "16px", fontWeight: "500", color: currentTheme.textSecondary }}>minutes</span>
              </div>
              <div style={{ width: "100%", height: "4px", backgroundColor: currentTheme.border, borderRadius: "4px" }}>
                <div style={{ width: "75%", height: "100%", backgroundColor: themeColors.primary, borderRadius: "4px" }} />
              </div>
            </div>

            {/* Nutrition Card */}
            <div
              style={{
                backgroundColor: currentTheme.cardBg,
                border: `1px solid ${currentTheme.border}`,
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: `${themeColors.secondary}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesomeIcon icon={faAppleAlt} style={{ color: themeColors.secondary, fontSize: "20px" }} />
                </div>
                <div
                  style={{
                    backgroundColor: `${themeColors.secondary}15`,
                    color: themeColors.secondary,
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  Balanced
                </div>
              </div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: currentTheme.textSecondary, marginBottom: "8px" }}>
                NUTRITION
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "12px" }}>
                <span style={{ fontSize: "32px", fontWeight: "700", color: currentTheme.text }}>1800</span>
                <span style={{ fontSize: "16px", fontWeight: "500", color: currentTheme.textSecondary }}>kcal</span>
              </div>
              <div style={{ fontSize: "12px", color: currentTheme.textMuted }}>Daily intake target</div>
            </div>

            {/* Calories Card */}
            <div
              style={{
                backgroundColor: currentTheme.cardBg,
                border: `1px solid ${currentTheme.border}`,
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: `${themeColors.tertiary}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesomeIcon icon={faFire} style={{ color: themeColors.tertiary, fontSize: "20px" }} />
                </div>
                <FontAwesomeIcon icon={faChartLine} style={{ color: themeColors.tertiary, fontSize: "16px" }} />
              </div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: currentTheme.textSecondary, marginBottom: "8px" }}>
                CALORIES BURNED
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "12px" }}>
                <span style={{ fontSize: "32px", fontWeight: "700", color: currentTheme.text }}>2200</span>
                <span style={{ fontSize: "16px", fontWeight: "500", color: currentTheme.textSecondary }}>kcal</span>
              </div>
              <div style={{ fontSize: "12px", color: currentTheme.textMuted }}>Today's total burn</div>
            </div>

            {/* Heart Rate Card */}
            <div
              style={{
                backgroundColor: currentTheme.cardBg,
                border: `1px solid ${currentTheme.border}`,
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: `${themeColors.quaternary}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesomeIcon icon={faHeartbeat} style={{ color: themeColors.quaternary, fontSize: "20px" }} />
                </div>
                <div
                  style={{
                    backgroundColor: `${themeColors.quaternary}15`,
                    color: themeColors.quaternary,
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  Normal
                </div>
              </div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: currentTheme.textSecondary, marginBottom: "8px" }}>
                HEART RATE
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "12px" }}>
                <span style={{ fontSize: "32px", fontWeight: "700", color: currentTheme.text }}>110</span>
                <span style={{ fontSize: "16px", fontWeight: "500", color: currentTheme.textSecondary }}>bpm</span>
              </div>
              <div style={{ fontSize: "12px", color: currentTheme.textMuted }}>Average today</div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div
            style={{
              backgroundColor: currentTheme.cardBg,
              border: `1px solid ${currentTheme.border}`,
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <FontAwesomeIcon icon={faTrophy} style={{ color: themeColors.primary, fontSize: "18px" }} />
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: currentTheme.text }}>
                Today's Goals
              </h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div
                style={{
                  backgroundColor: currentTheme.surface,
                  padding: "16px",
                  borderRadius: "12px",
                  borderLeft: `4px solid ${themeColors.primary}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: currentTheme.text }}>Morning Workout</span>
                  <span style={{ fontSize: "12px", color: themeColors.primary, fontWeight: "600" }}>75%</span>
                </div>
                <div style={{ width: "100%", height: "6px", backgroundColor: currentTheme.border, borderRadius: "6px" }}>
                  <div style={{ width: "75%", height: "100%", backgroundColor: themeColors.primary, borderRadius: "6px" }} />
                </div>
              </div>

              <div
                style={{
                  backgroundColor: currentTheme.surface,
                  padding: "16px",
                  borderRadius: "12px",
                  borderLeft: `4px solid ${themeColors.secondary}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: currentTheme.text }}>Water Intake</span>
                  <span style={{ fontSize: "12px", color: themeColors.secondary, fontWeight: "600" }}>60%</span>
                </div>
                <div style={{ width: "100%", height: "6px", backgroundColor: currentTheme.border, borderRadius: "6px" }}>
                  <div style={{ width: "60%", height: "100%", backgroundColor: themeColors.secondary, borderRadius: "6px" }} />
                </div>
              </div>

              <div
                style={{
                  backgroundColor: currentTheme.surface,
                  padding: "16px",
                  borderRadius: "12px",
                  borderLeft: `4px solid ${themeColors.tertiary}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: currentTheme.text }}>Meal Plan</span>
                  <span style={{ fontSize: "12px", color: themeColors.tertiary, fontWeight: "600" }}>80%</span>
                </div>
                <div style={{ width: "100%", height: "6px", backgroundColor: currentTheme.border, borderRadius: "6px" }}>
                  <div style={{ width: "80%", height: "100%", backgroundColor: themeColors.tertiary, borderRadius: "6px" }} />
                </div>
              </div>

              <div
                style={{
                  backgroundColor: currentTheme.surface,
                  padding: "16px",
                  borderRadius: "12px",
                  borderLeft: `4px solid ${themeColors.quaternary}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: currentTheme.text }}>Steps Goal</span>
                  <span style={{ fontSize: "12px", color: themeColors.quaternary, fontWeight: "600" }}>45%</span>
                </div>
                <div style={{ width: "100%", height: "6px", backgroundColor: currentTheme.border, borderRadius: "6px" }}>
                  <div style={{ width: "45%", height: "100%", backgroundColor: themeColors.quaternary, borderRadius: "6px" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Social Section */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginBottom: "24px" }}>
          {/* Nutrition Chart */}
          <div
            style={{
              backgroundColor: currentTheme.cardBg,
              border: `1px solid ${currentTheme.border}`,
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <NutritionBarChart />
          </div>

          {/* Progress Chart */}
          <div
            style={{
              backgroundColor: currentTheme.cardBg,
              border: `1px solid ${currentTheme.border}`,
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <ProgressDonutChart />
          </div>

          {/* Recent Posts */}
          <div
            style={{
              backgroundColor: currentTheme.cardBg,
              border: `1px solid ${currentTheme.border}`,
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FontAwesomeIcon icon={faComments} style={{ color: themeColors.primary, fontSize: "16px" }} />
                <h6 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: currentTheme.text }}>Community</h6>
              </div>
              <button
                onClick={() => navigate("/forum")}
                style={{
                  backgroundColor: "transparent",
                  color: themeColors.primary,
                  border: "none",
                  fontSize: "12px",
                  fontWeight: "500",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                View All
                <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: "10px" }} />
              </button>
            </div>

            <div style={{ maxHeight: "340px", overflowY: "auto" }}>
              {posts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: currentTheme.textMuted, fontSize: "13px" }}>
                  No posts yet
                </div>
              ) : (
                posts.map((post) => (
                  <div
                    key={post._id}
                    onClick={() => handleOpenForumDetail(post._id)}
                    style={{
                      padding: "12px",
                      marginBottom: "8px",
                      backgroundColor: currentTheme.surface,
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: "500", fontSize: "13px", color: currentTheme.text, marginBottom: "4px" }}>
                      {post.title}
                    </div>
                    <div style={{ fontSize: "11px", color: currentTheme.textSecondary }}>
                      by {post.user?.name || "Unknown"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* People You May Know Section */}
        <div
          style={{
            backgroundColor: currentTheme.cardBg,
            border: `1px solid ${currentTheme.border}`,
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: `${themeColors.primary}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesomeIcon icon={faUsers} style={{ color: themeColors.primary, fontSize: "18px" }} />
              </div>
              <div>
                <h6 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: currentTheme.text }}>
                  Connect with Athletes
                </h6>
                <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: currentTheme.textMuted }}>
                  Grow your fitness community
                </p>
              </div>
            </div>
            <div
              style={{
                backgroundColor: `${themeColors.primary}15`,
                color: themeColors.primary,
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              {people.length} Athletes
            </div>
          </div>

          {people.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                backgroundColor: currentTheme.surface,
                borderRadius: "12px",
                color: currentTheme.textMuted,
                fontSize: "13px",
              }}
            >
              <FontAwesomeIcon icon={faUsers} style={{ fontSize: "40px", marginBottom: "12px", opacity: 0.3 }} />
              <div>No athletes to connect with yet</div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "16px",
              }}
            >
              {people.map((person) => {
                const status = followStatusMap[person._id];
                let buttonText = "Follow";
                let isDisabled = false;
                let buttonColor = themeColors.primary;

                if (status?.youFollow && status?.theyFollowBack) {
                  buttonText = "Friends";
                  isDisabled = true;
                  buttonColor = themeColors.secondary;
                } else if (status?.theyFollowBack && !status?.youFollow) {
                  buttonText = "Follow Back";
                  buttonColor = themeColors.tertiary;
                } else if (status?.youFollow && !status?.theyFollowBack) {
                  buttonText = "Following";
                  isDisabled = true;
                }

                return (
                  <div
                    key={person._id}
                    style={{
                      backgroundColor: currentTheme.surface,
                      padding: "20px",
                      borderRadius: "12px",
                      border: `1px solid ${currentTheme.border}`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        marginBottom: "16px",
                      }}
                    >
                      <img
                        src={person.image}
                        alt={person.name}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "50%",
                          border: `3px solid ${currentTheme.cardBg}`,
                        }}
                      />
                      {status?.youFollow && status?.theyFollowBack && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "0",
                            right: "0",
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            backgroundColor: themeColors.secondary,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: `2px solid ${currentTheme.surface}`,
                          }}
                        >
                          <FontAwesomeIcon icon={faUsers} style={{ color: "white", fontSize: "10px" }} />
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: "center", marginBottom: "16px", width: "100%" }}>
                      <div
                        style={{
                          fontWeight: "600",
                          fontSize: "14px",
                          color: currentTheme.text,
                          marginBottom: "4px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {person.name}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: currentTheme.textSecondary,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {person.email}
                      </div>
                    </div>

                    <button
                      disabled={isDisabled}
                      onClick={() => handleFollow(person._id)}
                      style={{
                        width: "100%",
                        backgroundColor: isDisabled ? currentTheme.border : buttonColor,
                        color: isDisabled ? currentTheme.textMuted : "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: isDisabled ? "default" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={status?.youFollow && status?.theyFollowBack ? faUsers : faUsers}
                        style={{ fontSize: "11px" }}
                      />
                      {buttonText}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating AI Chat Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: themeColors.primary,
          border: "none",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <FontAwesomeIcon icon={isChatOpen ? faTimes : faRobot} style={{ color: "white", fontSize: "24px" }} />
      </button>

      {/* AI Chat Window */}
      {isChatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "24px",
            width: "380px",
            maxHeight: "600px",
            backgroundColor: currentTheme.cardBg,
            border: `1px solid ${currentTheme.border}`,
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "20px",
              borderBottom: `1px solid ${currentTheme.border}`,
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: themeColors.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon icon={faRobot} style={{ color: "white", fontSize: "20px" }} />
            </div>
            <div style={{ flex: 1 }}>
              <h6 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: currentTheme.text }}>
                FitTrack AI Assistant
              </h6>
              <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: currentTheme.textMuted }}>
                Ask me anything!
              </p>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon icon={faTimes} style={{ color: currentTheme.textSecondary, fontSize: "16px" }} />
            </button>
          </div>

          <div style={{ flex: 1, padding: "20px", overflowY: "auto", maxHeight: "400px" }}>
            {chatReply ? (
              <div
                style={{
                  padding: "14px",
                  backgroundColor: currentTheme.surface,
                  borderRadius: "12px",
                  fontSize: "13px",
                  color: currentTheme.text,
                  lineHeight: "1.6",
                  borderLeft: `3px solid ${themeColors.primary}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "8px",
                    fontSize: "11px",
                    fontWeight: "600",
                    color: themeColors.primary,
                  }}
                >
                  <FontAwesomeIcon icon={faRobot} />
                  AI Response
                </div>
                {chatReply}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "60px 20px", color: currentTheme.textMuted, fontSize: "13px" }}>
                Hello! I'm here to help with your fitness journey. Ask me anything!
              </div>
            )}
          </div>

          <div style={{ padding: "20px", borderTop: `1px solid ${currentTheme.border}` }}>
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your message..."
              style={{
                width: "100%",
                backgroundColor: currentTheme.surface,
                border: `1px solid ${currentTheme.border}`,
                color: currentTheme.text,
                borderRadius: "10px",
                padding: "12px",
                fontSize: "13px",
                resize: "none",
                fontFamily: "inherit",
                lineHeight: "1.5",
                marginBottom: "12px",
              }}
              rows={3}
            />

            <button
              onClick={handleChatSubmit}
              disabled={isLoadingChat || !chatInput.trim()}
              style={{
                width: "100%",
                backgroundColor: themeColors.primary,
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "12px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: isLoadingChat || !chatInput.trim() ? "not-allowed" : "pointer",
                opacity: isLoadingChat || !chatInput.trim() ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {isLoadingChat ? (
                <>
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  Processing...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPaperPlane} />
                  Send Message
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              maxWidth: "500px",
              width: "100%",
              maxHeight: "700px",
            },
          },
        }}
      >
        <DialogContent sx={{ position: "relative", padding: 0 }}>
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              backgroundColor: currentTheme.surface,
              zIndex: 10,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ padding: 3 }}>
            {selectedForumId && <ForumDetail forumId={selectedForumId} />}
          </Box>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
