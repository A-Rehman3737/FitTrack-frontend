import React, { useState, useEffect } from "react";
import { addReply } from "../services/forumService";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  forumId: string;
  parentId?: string;
  replyingTo?: string;
  onReplyAdded: () => void;
  onCancel?: () => void;
}

const ReplyForm: React.FC<Props> = ({
  forumId,
  replyingTo,
  onReplyAdded,
  onCancel,
}) => {
  const [reply, setReply] = useState("");

  useEffect(() => {
    if (replyingTo) {
      setReply(`@${replyingTo} `); // auto-mention
    }
  }, [replyingTo]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    await addReply(forumId, reply);
    setReply("");
    onReplyAdded();
    onCancel?.();
  };

  return (
    <Paper
      elevation={2}
      sx={{
       
        p: 3,
        borderRadius: 3,
        backgroundColor: "#f9fefc",
        border: "1px solid #e0f2f1",
      }}
    >
      {replyingTo && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            px: 1,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ color: "#329494", fontWeight: 500 }}
          >
            Replying to <span style={{ fontWeight: 600 }}>@{replyingTo}</span>
          </Typography>
          <IconButton
            onClick={onCancel}
            size="small"
            sx={{
              color: "#329494",
              "&:hover": { backgroundColor: "#b2dfdb" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <Box component="form" onSubmit={handleReply}>
        <TextField
          fullWidth
          multiline
          minRows={2}
          variant="outlined"
          placeholder="Write your reply..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          sx={{
            mb: 2,
            backgroundColor: "#fff",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#329494",
            textTransform: "none",
            fontWeight: "bold",
            px: 3,
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "#009e88",
            },
          }}
        >
          Reply
        </Button>
      </Box>
    </Paper>
  );
};

export default ReplyForm;
