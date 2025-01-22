import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  loginUserValidationSchema,
  registerUserValidationSchema,
} from "../config/user.validation.js";
import { User } from "../models/user.model.js";

import { checkMongoIdValidation } from "../config/mongoIdValidator.js";
import { Blog } from "../models/blog.model.js";

export const registerUser = async (req, res) => {
  const newUser = req.body;

  //validate new user with joi
  try {
    await registerUserValidationSchema.validateAsync(newUser);
  } catch (error) {
    //if not valid throws error
    return res.status(400).send({ message: error.message });
  }
  const findUser = await User.findOne({
    $or: [{ username: newUser.username }, { email: newUser.email }],
  });
  if (findUser) {
    res.status(409).send({ message: "User Already Exists." });
  } else {
    try {
      const hashedPassword = await bcrypt.hash(newUser.password, 10);
      newUser.password = hashedPassword;
      const createdUser = await User.create({
        username: newUser.username,
        email: newUser.email,
        password: hashedPassword,
        profilePicture: newUser.profilePicture,
        bio: newUser.bio,
        role: newUser.role,
      });
      res
        .status(201)
        .send({ message: "New User Created Successfully", user: createdUser });
    } catch (error) {
      console.log(error.message);
      res.status(400).send({ message: "Bad Request" });
    }
  }
};
export const loginUser = async (req, res) => {
  const loginCredentials = req.body;

  try {
    await loginUserValidationSchema.validateAsync(loginCredentials);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
  const user = await User.findOne({ email: loginCredentials.email });
  if (!user) {
    return res.status(404).send({ message: "Invalid Credentials" });
  }
  const passwordMatch = await bcrypt.compare(
    loginCredentials.password,
    user.password
  );
  if (!passwordMatch) {
    return res.status(404).send({ message: "Invalid Credentials" });
  }
  const token = jwt.sign(
    { email: user.email },
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY_TIME,
    }
  );
  user.password = undefined;
  return res.status(200).send({ user, token });
};
export const getSingleUser = async (req, res) => {
  const userId = req.params.id;

  //validate mongodb id
  const isValidMongoId = checkMongoIdValidation(userId);
  if (!isValidMongoId) {
    res.status(400).send({ message: "Invalid Mongodb Id." });
  }
  try {
    // const user = await User.find({ _id: userId });
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User Does not Exist." });
    }

    res.status(200).send({ user });
  } catch (error) {
    console.error("Failed to fetch data:", error.message);
  }
};
export const getUser = async (req, res) => {
  try {
    const user = await User.find();
    if (!user) {
      return res.status(404).send({ message: "User Does not exist." });
    }
    res.status(200).send({ user });
  } catch (error) {
    console.error("Failed to fetch data:", error.message);
  }
};
export const deleteUserAndData = async (req, res) => {
  const userId = req.params.id;
  const isValidMongoId = checkMongoIdValidation(userId);
  if (!isValidMongoId) {
    res.status(400).send({ message: "Invalid Mongodb Id." });
  }
  // await Blog.find({_id:userId})
  try {
    if(req.userInfo._id===req.params.id){
      const user = await User.findById(userId);
      if (!user) {
     return res.status(404).send({ message: "User Does not exist." });
    } else {
      // if(req.userInfo._id==userId)
      const blog=await Blog.find({author:userId}).deleteMany();
      if(!blog){
       return res.status(404).send({message:"Blog does not exist "})
      }
      await Blog.deleteMany({ author: userId });
  
      await User.deleteOne({ _id: userId });
       return res.status(200).send({ message: "User Deleted Successfully." });
    }
  }else
  {
    return res.status(401).send({message:"You are not the author of the blogs.Unauthorized"})
  }
  } catch (error) {
    console.error("Failed to fetch data:", error.message);
  
  }
 
};
