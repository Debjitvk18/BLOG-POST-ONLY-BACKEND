import pool from "../config/db.js";

// ✅ Create posts table (if it doesn't exist)
export const createTablePosts = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      image VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
};

// ✅ Fetch all posts (no pagination)
export const getAllPosts = async () => {
  const { rows } = await pool.query(
    `SELECT posts.*, users.username 
     FROM posts 
     JOIN users ON posts.user_id = users.id
     ORDER BY posts.created_at DESC`
  );
  return rows;
};

// ✅ Fetch a single post by ID
export const getPostById = async (id) => {
  const { rows } = await pool.query(
    `SELECT posts.*, users.username 
     FROM posts 
     JOIN users ON posts.user_id = users.id
     WHERE posts.id = $1`,
    [id]
  );
  return rows[0];
};

// ✅ Create a new post
export const createPost = async (user_id, title, content, image) => {
  const { rows } = await pool.query(
    `INSERT INTO posts (user_id, title, content, image)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [user_id, title, content, image]
  );
  
  return rows[0];
};

// ✅ Update an existing post
export const updatePost = async (id, title, content, image) => {
  const { rows } = await pool.query(
    `UPDATE posts
     SET title = $1, content = $2, image = $3
     WHERE id = $4
     RETURNING *`,
    [title, content, image, id]
  );
  return rows[0];
};

// ✅ Delete a post
export const deletePost = async (id) => {
  await pool.query(`DELETE FROM posts WHERE id = $1`, [id]);
  return true;
};

// ✅ Fetch posts with pagination (for global feed)
export const getPostsPaginated = async (page = 1, limit = 6) => {
  const offset = (page - 1) * limit;

  const { rows } = await pool.query(
    `SELECT posts.*, users.username
     FROM posts
     JOIN users ON posts.user_id = users.id
     ORDER BY posts.created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  const { rows: countRows } = await pool.query(`SELECT COUNT(*) FROM posts`);
  const total = parseInt(countRows[0].count, 10);

  return {
    posts: rows,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

// ✅ Fetch posts created by a specific user ("My Posts")
export const getUserPosts = async (user_id, page = 1, limit = 6) => {
  const offset = (page - 1) * limit;

  const postsQuery = `
    SELECT posts.*, users.username
    FROM posts
    JOIN users ON posts.user_id = users.id
    WHERE user_id = $1
    ORDER BY posts.created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const countQuery = `SELECT COUNT(*) FROM posts WHERE user_id = $1`;

  const [postsResult, countResult] = await Promise.all([
    pool.query(postsQuery, [user_id, limit, offset]),
    pool.query(countQuery, [user_id]),
  ]);

  const total = parseInt(countResult.rows[0].count, 10);

  return {
    posts: postsResult.rows,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

// ✅ Fetch posts created by other users (NOT the logged-in user)
export const getOtherUserPosts = async (exclude_user_id, page = 1, limit = 6) => {
  const offset = (page - 1) * limit;

  const postsQuery = `
    SELECT posts.*, users.username
    FROM posts
    JOIN users ON posts.user_id = users.id
    WHERE posts.user_id != $1
    ORDER BY posts.created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const countQuery = `SELECT COUNT(*) FROM posts WHERE user_id != $1`;
//  console.log(postsQuery)
  const [postsResult, countResult] = await Promise.all([
    pool.query(postsQuery, [exclude_user_id, limit, offset]),
    pool.query(countQuery, [exclude_user_id]),
  ]);

  const total = parseInt(countResult.rows[0].count, 10);

  return {
    posts: postsResult.rows,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};
