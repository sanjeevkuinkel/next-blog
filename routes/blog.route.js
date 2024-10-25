import express from "express";
import { isAuthor } from "../middleware/auth.middleware.js";
import {
  createBlog,
  deleteBlog,
  getBlogs,
  getSingleBlog,
  updateBlog,
} from "../services/blog.service.js";
const router = express.Router();
router.post("/blog/create", isAuthor, createBlog);
router.get("/blog/details/:id", getSingleBlog);
router.get("/blogs", isAuthor, getBlogs);
router.put("/blog/update/:id", isAuthor, updateBlog);
router.delete("/blog/delete/:id", isAuthor, deleteBlog);
export { router };
