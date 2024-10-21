import express from "express";
import { isAuthor } from "../middleware/auth.middleware.js";
import { blogPostValidationSchema } from "../config/blog.validation.js";
import { Blog } from "../models/blog.model.js";
const router = express.Router();
router.post("/blog/create", isAuthor, async (req, res) => {
  const newBlog = req.body;
  try {
    await blogPostValidationSchema.validateAsync(newBlog);
  } catch (error) {
    //if not valid throws error
    return res.status(400).send({ message: "Blog Validation Failed" });
  }
  console.log(req);
  const authorId = req.userInfo._id;
  //let user add blog
  try {
    const blogPost = await Blog.create({
      title: newBlog.title,
      content: newBlog.content,
      author: authorId,
      tags: newBlog.tags || [],
      categories: newBlog.categories || [],
    });
    res
      .status(201)
      .send({ message: "New Blog Added Successfully", blog: blogPost });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ message: "Bad Request" });
  }
});
router.post("/post/details", (req, res) => {});
router.post("/posts", (req, res) => {});
router.post("/post/update/:id", (req, res) => {});
router.post("/post/delete/:id", (req, res) => {});
export { router };
