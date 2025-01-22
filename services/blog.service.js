
import { updateBlogValidationSchema } from "../config/blog.validation.js";
import { checkMongoIdValidation } from "../config/mongoIdValidator.js";
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
export const getSingleBlog=async (req, res) => {
    
      try {
        const blogId=req.params.id;
    const  isValidMongoId=checkMongoIdValidation(blogId);
    if (!isValidMongoId) {
        return res.status(400).send({ message: "Invalid Mongodb Id." });
      }
      const blog=await Blog.findById(blogId);
      if(!blog)
        return res.status(404).send({message:"Blog Does not Exist."})
      return res.status(200).send({blog})
      } catch (error) {
        console.log("Error occured",error.message)
      }
};
export const getBlogs=async(req,res)=>{
   try {
    const blogs=await Blog.find()
    if(!blogs)return res.status(404).send({message:"Blog Does not Exist."})
        return res.status(200).send({blogs})

   } catch (error) {
    console.error("Error fetching blogs:", error.message);
    return res.status(500).send({ message: "Internal server error."})
   }
};
export const getAuthorBlogs=async(req,res)=>{
    const authorId=req.params.id;
    console.log(authorId)
    const isValidMongoId=checkMongoIdValidation(authorId);
    if (!isValidMongoId) {
        return res.status(400).send({ message: "Invalid Mongodb Id." });
      }
    const blogs=await Blog.find({author:authorId})
    console.log(blogs)
    if(!blogs){
        return res.status(404).send({message:"Blog Does not Exist."});

    }
    return res.status(200).send({blogs})

}
export const updateBlog= async(req, res) => {
    const blogId=req.params.id;
    const isValidMongoId=checkMongoIdValidation(blogId);
    if(!isValidMongoId)
    {
        return res.status(400).send({ message: "Invalid Mongodb Id." });
    }
    const newUpdatedBlog=req.body;
    try {
        await updateBlogValidationSchema.validateAsync(newUpdatedBlog)
    } catch (error) {
        return res.status(400).send({message:error.message})
    }
    try {
        
        const blog=await Blog.findById(blogId)
       
        if(!blog){
            return res.status(404).send({message:"Blog does not exist."})
        }
        if(req.userInfo._id.equals(blog.author)){
        await Blog.updateOne({_id:blogId},{
            $set:{
                title:newUpdatedBlog.title,
                content:newUpdatedBlog.content,
                
            }
        })
        return res.status(200).send("Blog Updated Successfully.")
    }else{
        return res.status(401).send({message:"You are not the author of the blogs.Unauthorized"})
    }
        
     
    } catch (error) {
        return res.status(400).send({message:error.message})
    }
}
export const deleteBlog=async(req, res) => {
    const blogId=req.params.id;
    const isValidMongoId=checkMongoIdValidation(blogId);
    if(!isValidMongoId)
    {
        return res.status(400).send({ message: "Invalid Mongodb Id." });
    }
    try {
        const blog=await Blog.findById(blogId);
        if(!blog)
        {
            return res.status(404).send({message:"Blog does not exist."}) 
        }
        if(req.userInfo._id.equals(blog.author)){
        await Blog.deleteOne({_id:blogId})
        return res.status(200).send({message:"Blog deleted Successfully."})
        }
        else{
            return res.status(401).send({message:"You are not the author of the blogs.Unauthorized"})
        }
    } catch (error) {
        return res.status(400).send({message:error.message})
    }
}   


