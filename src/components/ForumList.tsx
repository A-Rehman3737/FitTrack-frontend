import React, { useEffect, useState } from "react";
import { getAllPosts } from "../services/forumService";
import {
  List,
  ListItem,
  Typography,
  Paper,

  Avatar,
  Box,

} from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";


interface Props {
  onPostSelect: (id: string) => void;
}

const ForumList: React.FC<Props> = () => {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getAllPosts();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        maxWidth: 800,
        margin: "auto",
        borderRadius: 3,
        backgroundColor: "#fefefe",
        border: "1px solid #e0e0e0",
      }}
    >
      {/* Breadcrumb Navigation */}
 

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: "10px",
          backgroundColor: "#329494", display: "flex",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(50, 148, 148, 0.25)"
        }}>
          <FontAwesomeIcon icon={faClipboardList} style={{ color: "#ffffff", fontSize: "18px" }} />
        </Box>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: "#329494" }}
        >
          All Forum Posts
        </Typography>
      </Box>

      {posts.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No posts yet.
        </Typography>
      ) : (
        <Box
          sx={{
            maxHeight: 360,
            overflowY: "auto",
            pr: 1,
          }}
        >
          <List disablePadding>
            {posts.map((post) => (
              <ListItem
                key={post._id}
                disableGutters
                sx={{
                  px: 2,
                  py: 1.5,
                  borderRadius: '12px',
                  transition: "all 0.2s ease-in-out",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  "&:hover": {
                    backgroundColor: "#f0fdfa",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                    transform: "translateY(-1px)",
                    borderColor: '#329494',
                  },
                  mb: 1.5,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    backgroundColor: 'transparent',
                    transition: 'background-color 0.2s ease'
                  },
                  '&:hover::before': {
                    backgroundColor: '#329494'
                  }
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#e0f7f7",
                    color: "#329494",
                    width: 36,
                    height: 36,
                    mr: 2,
                    fontSize: "1rem",
                    fontWeight: 600,
                    border: '2px solid #e0f7f7',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  {post.user?.name?.charAt(0)?.toUpperCase() || <ForumIcon fontSize="small" />}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      color: "#9ca3af",
                      fontSize: "0.7rem",
                      fontWeight: 500
                    }}
                  >
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Typography>
                  
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ 
                      color: "#111827", 
                      fontSize: "1rem",
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: 1.3,
                      pr: 4
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <Typography
                      variant="caption"
                      sx={{ 
                        color: "#6b7280", 
                        fontSize: "0.8rem",
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Box component="span" sx={{ fontWeight: 500, color: '#329494', mr: 0.5 }}>
                        {post.user?.name || "Unknown"}
                      </Box>
                    </Typography>
                  </Box>
                </Box>

                {post.replies?.length > 0 && (
                  <Box sx={{ 
                    ml: 2,
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#e0f7f7',
                    borderRadius: '12px',
                    px: 1.5,
                    py: 0.5
                  }}>
                    <Typography variant="caption" sx={{ 
                      color: '#329494',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}>
                      {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
                    </Typography>
                  </Box>
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Paper>
  );
};

export default ForumList;