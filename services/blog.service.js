import { blogPostValidationSchema } from "../config/blog.validation.js";
import {Blog} from "../models/blog.model.js";

export const createBlog = async (req, res) => {
    const newBlog = req.body;
    try {
        await blogPostValidationSchema.validateAsync(newBlog);
    } catch (error) {
        console.error("Validation Error:", error.details); 
        return res.status(400).send({ message: "Blog Validation Failed.", details: error.details });
    }
    const authorId = req.userInfo?._id; 
    if (!authorId) {
        return res.status(401).send({ message: "Unauthorized: User not authenticated." });
    }
    try {
        const blogPost = await Blog.create({
            title: newBlog.title,
            content: newBlog.content,
            author: authorId,
            tags: newBlog.tags || [],
            categories: newBlog.categories || [],
        });

        return res.status(201).send({ message: "New Blog Added Successfully", blog: blogPost });
    } catch (error) {
        console.error("Database Error:", error.message);
        return res.status(400).send({ message: "Bad Request", details: error.message });
    }
};
