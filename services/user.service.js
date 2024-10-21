import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  loginUserValidationSchema,
  registerUserValidationSchema,
} from "../config/user.validation.js";
import { User } from "../models/user.model.js";

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
