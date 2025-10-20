import React, { useEffect, useState } from "react";
import { getForumPost } from "../services/forumService";
import ReplyForm from "./ReplyForm";
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  Paper,
  Button,
} from "@mui/material";

interface Reply {
  _id: string;
  content: string;
  user: { name: string };
  repliedTo?: { name: string };
  parentId?: string;
}

interface Forum {
  _id: string;
  title: string;
  content: string;
  user: { name: string };
  replies: Reply[];
}

interface Props {
  forumId: string;
}

const ForumDetail: React.FC<Props> = ({ forumId }) => {
  const [forum, setForum] = useState<Forum | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyToName, setReplyToName] = useState<string | null>(null);
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});

  const fetchForum = async () => {
    try {
      setLoading(true);
      const data = await getForumPost(forumId);
      setForum(data);
    } catch (err) {
      console.error("Failed to fetch forum post:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForum();
  }, [forumId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!forum) {
    return (
      <Typography variant="h6" color="error" align="center" mt={4}>
        Forum post not found.
      </Typography>
    );
  }

  const parentReplies = forum.replies.filter((r) => !r.parentId);
  const childReplies = forum.replies.filter((r) => r.parentId);

  const getChildReplies = (parentId: string) =>
    childReplies.filter((r) => r.parentId === parentId);

  return (
<Box
  sx={{
    px: 3,
    py: 0,
    maxWidth: 600,
    mx: "auto",
  }}
>

  <Typography
    variant="h4"
    fontWeight="bold"
    
    color="#329494"
    sx={{ textAlign: "center" }}
  >
    {forum.title}
  </Typography>
 
   <Typography variant="body1" sx={{ mb: 2, color: "#333", fontSize:18, textAlign:"center" }}>
    {forum.content}
  </Typography>
    <Typography
    variant="subtitle2"
    color="#329494"
  
    sx={{ mb: 1, fontSize:18, paddingLeft: "10px", textAlign:"center" }}
  >
    Posted by: {forum.user?.name}
  </Typography>

  

 

 

  <Typography
    variant="h6"
    fontWeight="medium"
    gutterBottom
    color="#329494"
  >
    Replies
  </Typography>

  {parentReplies.length > 0 ? (
    parentReplies.map((reply) => (
      <Paper
        key={reply._id}
        elevation={1}
        sx={{
          p: 2,
          mb: 2,
          backgroundColor: "#f1fdfb",
          borderLeft: "4px solid #00bfa5",
          borderRadius: 2,
        }}
      >
        <Typography variant="body2" sx={{ color: "#329494" }}>
          {reply.content}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          — {reply.user?.name}
        </Typography>

        <Box mt={1} display="flex" gap={1}>
          <Button
            size="small"
            variant="text"
            sx={{ color: "#329494", fontWeight: 500 }}
            onClick={() => {
              setActiveReplyId(reply._id);
              setReplyToName(reply.user.name);
            }}
          >
            Reply
          </Button>

          {getChildReplies(reply._id).length > 0 && (
            <Button
              size="small"
              variant="text"
              sx={{ color: "#329494", fontWeight: 500 }}
              onClick={() =>
                setShowReplies((prev) => ({
                  ...prev,
                  [reply._id]: !prev[reply._id],
                }))
              }
            >
              {showReplies[reply._id] ? "Hide Replies" : "View Replies"}
            </Button>
          )}
        </Box>

        {activeReplyId === reply._id && (
          <ReplyForm
            forumId={forumId}
            parentId={reply._id}
            replyingTo={replyToName ?? ""}
            onReplyAdded={() => {
              fetchForum();
              setActiveReplyId(null);
              setReplyToName(null);
            }}
            onCancel={() => {
              setActiveReplyId(null);
              setReplyToName(null);
            }}
          />
        )}

        {showReplies[reply._id] &&
          getChildReplies(reply._id).map((child) => (
            <Paper
              key={child._id}
              elevation={0}
              sx={{
                p: 1.5,
                ml: 3,
                mt: 1,
                borderRadius: 2,
                backgroundColor: "#e0f2f1",
              }}
            >
              <Typography variant="body2">{child.content}</Typography>
              <Typography variant="caption" color="text.secondary">
                — {child.user.name}
                {child.repliedTo &&
                  ` (replied to ${child.repliedTo.name})`}
              </Typography>
            </Paper>
          ))}
      </Paper>
    ))
  ) : (
    <Typography variant="body2" color="text.secondary">
      No replies yet.
    </Typography>
  )}

  <Divider sx={{ my: 3 }} />

  {!activeReplyId && (
    <ReplyForm
      forumId={forumId}
      onReplyAdded={() => fetchForum()}
    />
  )}
</Box>

);

};

export default ForumDetail;
