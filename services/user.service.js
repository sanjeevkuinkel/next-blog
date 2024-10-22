import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {
  loginUserValidationSchema,
  registerUserValidationSchema,
} from "../config/user.validation.js";
import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
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
        profilepicture: newUser.profilepicture,
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
const loginUser = async (req, res) => {
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
const getSingleUser = async (req, res) => {
  const userId = req.params.id;

  const isValidMongoId = mongoose.Types.ObjectId.isValid(userId);
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongo id." });
  }

  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res.status(404).send({ message: "User does not exist." });
  }
  return res.status(200).send(user);
};
const getAllUser = async (req, res) => {
  const user = await User.find();
  if (!user) {
    return res.status(404).send({ message: "User Database is Empty" });
  }
  return res.status(200).send(user);
};
const deleteUserAndData = async (req, res) => {
  const userId = req.params.id;
  const isValidMongoId = mongoose.Types.ObjectId.isValid(userId);
  if (!isValidMongoId) {
    return res.status(400).send({ message: "Invalid mongo id." });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).send({ message: "User does not exist." });
  }

  try {
    await Blog.deleteMany({ author: userId }); // Deleting blogs associated with the user

    await User.deleteOne({ _id: userId });
    return res
      .status(200)
      .send({ message: "User and associated data deleted successfully." });
  } catch (error) {
    return res.status(500).send({
      message: "An error occurred while deleting the user.",
      error: error.message,
    });
  }
};
export {
  deleteUserAndData,
  getAllUser,
  getSingleUser,
  loginUser,
  registerUser,
};
