import mongoose from "mongoose";
import { blogPostValidationSchema } from "../config/blog.validation.js";
import { Blog } from "../models/blog.model.js";

const createBlog = async (req, res) => {
  const newBlog = req.body;
  try {
    await blogPostValidationSchema.validateAsync(newBlog);
  } catch (error) {
    //if not valid throws error
    return res.status(400).send({ message: "Blog Validation Failed" });
  }
  const authorId = req.userInfo._id;
  //let blog add blog
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
};

const getSingleBlog = async (req, res) => {
  const blogId = req.params.id;

  const isValidMongoId = mongoose.Types.ObjectId.isValid(blogId);
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongo id." });
  }

  const blog = await Blog.findOne({ _id: blogId });
  if (!blog) {
    return res.status(404).send({ message: "Blog does not exist." });
  }
  return res.status(200).send(blog);
};
const getBlogs = async (req, res) => {
  const blog = await Blog.find();
  if (!blog) {
    return res.status(404).send({ message: "Blog database is Empty" });
  }
  return res.status(200).send(blog);
};
const updateBlog = async (req, res) => {
  const blogId = req.params.id;
  const updatedBlog = req.body;
  const isValidMongoId = mongoose.Types.ObjectId.isValid(blogId);
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongo id." });
  }
  try {
    await blogPostValidationSchema.validateAsync(updatedBlog);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
  const blog = await Blog.findOne({ _id: blogId });
  if (!blog) {
    return res.status(404).send({ message: "Blog does not exist." });
  }

  console.log(blog.author);
  console.log(req.userInfo._id);
  // check if logged in user is owner of product
  const isAuthorOfBlog = blog.author.equals(req.userInfo._id);
  if (!isAuthorOfBlog) {
    return res
      .status(403)
      .send({ message: "You are not author of this Blog." });
  }
  await Blog.updateOne({ _id: blogId }, updatedBlog);

  return res.status(200).send({ message: "Blog updated successfully." });
};

export { createBlog, getSingleBlog, getBlogs, updateBlog };
