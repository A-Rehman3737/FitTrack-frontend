import React, { useState } from "react";
import { createForumPost } from "../services/forumService";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import DescriptionIcon from "@mui/icons-material/Description";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

interface ForumFormProps {
  onPostCreated: (id: string) => void;
}

const ForumForm: React.FC<ForumFormProps> = ({ onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const createdPost = await createForumPost(title, content);

    setTitle("");
    setContent("");

    if (createdPost && createdPost._id) {
      onPostCreated(createdPost._id);
    }

    alert("Post created!");
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        maxWidth: 600,
        margin: "auto",
        mt: 1,
        borderRadius: 3,
        backgroundColor: "#fefefe",
        border: "1px solid #e0e0e0",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: "10px",
          backgroundColor: "#329494", display: "flex",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(50, 148, 148, 0.25)"
        }}>
          <FontAwesomeIcon icon={faPencil} style={{ color: "#ffffff", fontSize: "18px" }} />
        </Box>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: "#329494" }}
        >
          Create a New Forum Post
        </Typography>
      </Box>
      <Typography
        variant="body2"
        sx={{ mb: 3, color: "#666" }}
      >
        Share your thoughts, ask a question, or start a conversation with the community.
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CreateIcon sx={{ color: "#329494" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Content"
          multiline
          rows={4}
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ alignSelf: "start", pt: 1 }}>
                <DescriptionIcon sx={{ color: "#329494" }} />
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 3,
            backgroundColor: "#329494",
            color: "white",
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "16px",
            borderRadius: "25px",
            "&:hover": {
              backgroundColor: "#287f7f",
            },
          }}
          fullWidth
        >
          <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: "8px" }} />
          Post to Forum
        </Button>
      </Box>
    </Paper>
  );
};

export default ForumForm;
