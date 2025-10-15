import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsPaginated,
  getUserPosts,
  getOtherUserPosts,
} from "../models/postModel.js";

// Fetch all posts (no pagination)
export const fetchPosts = async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.json(posts);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching posts", error: err.message });
  }
};

// Fetch posts with pagination (6 posts per page)
export const fetchPostsPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;

    const result = await getPostsPaginated(page, limit);
    res.json(result);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching paginated posts", error: err.message });
  }
};

// ✅ Fetch posts created by the logged-in user
export const fetchUserPosts = async (req, res) => {
  try {
    const user_id = req.user.id; // extracted from token
    const { page = 1, limit = 6 } = req.query;

    const result = await getUserPosts(user_id, page, limit);
    console.log(result);
    res.json(result);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user posts", error: err.message });
  }
};

// Fetch a single post by ID
export const fetchPost = async (req, res) => {
  try {
    const post = await getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching post", error: err.message });
  }
};

// Create a new post
export const addPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const user_id = req.user.id; // from token
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    console.log(image);
    const newPost = await createPost(user_id, title, content, image);
    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating post", error: err.message });
  }
};

// Update an existing post
export const editPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    console.log(req.body.image);
    const image = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.image !== undefined
      ? req.body.image
      : null;

    const post = await updatePost(req.params.id, title, content, image);

    res.json({ message: "Post updated successfully", post });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating post", error: err.message });
  }
};

// Delete a post
export const removePost = async (req, res) => {
  try {
    await deletePost(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting post", error: err.message });
  }
};

// ✅ Fetch posts created by other users
export const fetchOtherPosts = async (req, res) => {
  try {
    const user_id = req.user.id; // logged-in user
    const page = parseInt(req.query.page) || 1;
    const limit = 6;

    const result = await getOtherUserPosts(user_id, page, limit);

    res.json(result);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error fetching other users' posts",
        error: err.message,
      });
  }
};
