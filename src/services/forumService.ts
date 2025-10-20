import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

const API_URL = API_ENDPOINTS.FORUM;

// ✅ Create new forum post (token se user milega)
export const createForumPost = async (title: string, content: string) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `${API_URL}/create`,
    { title, content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// ✅ Get single post with replies, and normalize response for frontend
export const getForumPost = async (forumId: string) => {
  const res = await axios.get(`${API_URL}/${forumId}`);
  const { post, responses } = res.data;
  return {
    ...post,
    replies: responses, // frontend can safely access forum.replies
  };
};

// ✅ Add reply to a forum post (user taken from token)
export const addReply = async (forumId: string, content: string) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `${API_URL}/${forumId}/response`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getAllPosts = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};
