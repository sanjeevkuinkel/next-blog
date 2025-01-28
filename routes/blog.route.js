import express from "express";
import { isAuthor, isUser } from "../middleware/auth.middleware.js";
import {
  createBlog,
  deleteBlog,
  getAuthorBlogs,
  getBlogs,
  getSingleBlog,
  updateBlog,
} from "../services/blog.service.js";
const router = express.Router();
router.post("/blog/create", isAuthor, createBlog);
router.get("/blog/:id", getSingleBlog);
router.get("/blogs", isUser, getBlogs);
router.post("/blogs", isAuthor, getAuthorBlogs);
router.put("/blog/edit/:id", isAuthor, updateBlog);
router.delete("/blog/delete/:id", isAuthor, deleteBlog);
export { router };
