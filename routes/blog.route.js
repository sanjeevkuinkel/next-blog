import express from "express";
import { isAuthor } from "../middleware/auth.middleware.js";
import { createBlog, getAuthorBlogs, getBlogs, getSingleBlog, updateBlog } from "../services/blog.service.js";
const router = express.Router();
router.post("/blog/create", isAuthor,createBlog);
router.get("/blog/:id",getSingleBlog);
router.get("/blogs", getBlogs);
router.post("/blogs/:id",isAuthor,getAuthorBlogs)
router.put("/blog/update/:id",updateBlog);
router.delete("/blog/delete/:id", (req, res) => {});
export { router };
