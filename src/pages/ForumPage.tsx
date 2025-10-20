import { useState } from "react";
import ForumForm from "../components/ForumForm";
import ForumList from "../components/ForumList";
import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

const ForumPage = () => {
  const [, setSelectedForumId] = useState<string | null>(null);

  return (
    <div className="container mt-4">
      {/* Header with Breadcrumb on Right */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3
      }}>
        {/* Page Heading */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: "12px",
            backgroundColor: "#329494", display: "flex",
            alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(50, 148, 148, 0.25)"
          }}>
            <FontAwesomeIcon icon={faComments} style={{ color: "#ffffff", fontSize: "20px" }} />
          </Box>
          <h2 className="fw-bold" style={{ color: "#329494" }}>
            Community Forum
          </h2>
        </Box>

        {/* Breadcrumb Navigation - Moved to Right */}
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ 
            '& .MuiBreadcrumbs-separator': {
              color: '#329494'
            }
          }}
        >
          <Link 
            underline="hover" 
            color="black" 
            href="/dashboard"
            sx={{ 
              fontWeight:"bold",
              fontSize: '1rem',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Dashboard
          </Link>
          <Typography color="#329494" fontWeight="bold" fontSize="1rem" text-center>
            Community Forum
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Description */}
      <div className="text-center mb-4">
        <p style={{ color: "#666", margin: "auto", fontSize: "17px" }}>
          Ask questions, share insights, and connect with other fitness enthusiasts.  
          Our community is here to support your journey — one post at a time.  
          Learn from experienced members and inspire others with your progress.  
          Stay consistent, stay accountable — we grow stronger together.  
          No matter your level, your voice matters in our fitness family.  
          Let's push limits, crush goals, and celebrate every win!
        </p>
      </div>

      {/* Original Layout */}
      <div className="row">
        {/* Left Column - Forum Form */}
        <div className="col-md-6 mb-4">
          <ForumForm onPostCreated={setSelectedForumId} />
        </div>

        {/* Right Column - Forum Detail */}
        <div className="col-md-6 mt-1 pt-1">
          <ForumList onPostSelect={setSelectedForumId} />
        </div>
      </div>
    </div>
  );
};

export default ForumPage;