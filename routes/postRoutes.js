import express from "express";
import { upload } from "../middleware/upload.js";
import {
  fetchPosts,
  fetchPost,
  addPost,
  editPost,
  removePost,
  fetchPostsPaginated,
  fetchUserPosts, // ✅ new controller
  fetchOtherPosts,
} from "../controllers/postController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/other-posts", verifyToken, fetchOtherPosts);
router.get("/", fetchPosts);
router.get("/paginated", fetchPostsPaginated);
router.get("/my-posts", verifyToken, fetchUserPosts); // ✅ only user’s posts
router.get("/:id", fetchPost);
router.post("/", verifyToken, upload.single("image"), addPost);
router.put("/:id", verifyToken, upload.single("image"), editPost);
router.delete("/:id", verifyToken, removePost);

export default router;
