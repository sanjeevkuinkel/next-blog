
import { blogPostValidationSchema, updateBlogValidationSchema } from "../config/blog.validation.js";
import { checkMongoIdValidation } from "../config/mongoIdValidator.js";
import { paginationDetailsValidationSchema } from "../config/paginationDetails.validation.js";
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
    const paginationDetails=req.body;
    try {
        await paginationDetailsValidationSchema.validateAsync(paginationDetails)
    } catch (error) {
        //if not valid terminate
        return res.status(400).send({message:error.message})
    }
    ///calculate skip
    const skip=(paginationDetails.page-1)*paginationDetails.limit;
    try {
   const blogs= await Blog.aggregate([
        {$match:{}},
        { $skip:skip},
        { $limit:paginationDetails.limit},
        {$project:{
            title:1,
            content:1,
        }}
    ])
    if(!blogs)return res.status(404).send({message:"Blog Does not Exist."})
        return res.status(200).send({blogs})
   } catch (error) {
    console.error("Error fetching blogs:", error.message);
    return res.status(500).send({ message: "Internal server error."})
   }
};
export const getAuthorBlogs=async(req,res)=>{
    const authorId=req.userInfo._id;
    const paginationDetails=req.body
    try {
        await paginationDetailsValidationSchema.validateAsync(paginationDetails)
    } catch (error) {
        //if not valid terminate
        return res.status(400).send({message:error.message})
    }
    const skip=(paginationDetails.page)*paginationDetails.limit;//this if page start with0
    const authorBlogs=await Blog.aggregate([
        {$match:{author :authorId}},
        {$skip:skip},
        {$limit:paginationDetails.limit}
    ])
    if(!authorBlogs){
        return res.status(404).send({message:"Blog Does not Exist."});

    }
    return res.status(200).send({authorBlogs})

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


