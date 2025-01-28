import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
export const isUser = async (req, res, next) => {
  try {
    //?phase1
    //extract token from headers
    const authorization = req?.headers?.authorization;
    const splittedArray = authorization?.split(" ");
    const token = splittedArray?.length === 2 && splittedArray[1];
    //if not token,terminate
    if (!token) {
      return res.status(401).send({ message: error.message });
    }
    //decrpyt token using jwt.verify
    const userData = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET_KEY);

    //find user from email decrypted from token
    const user = await User.findOne({ email: userData.email });
    //if not user terminate
    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    //if user role is not user ,terminate
    if (user.role !== "user") {
      return res.status(401).send({ message: "Unauthorized" });
    }
    //?phase2
    req.userInfo = user;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized." });
  }
};
export const isAuthor = async (req, res, next) => {
  try {
    //?phase1
    //extract token from header
    const authorization = req?.headers?.authorization;
    const splittedArray = authorization?.split(" ");
    const token = splittedArray?.length === 2 && splittedArray[1];
    //if not token,terminate
    if (!token) {
      return res.status(401).send({ message: error.message });
    }
    //decrpyt token using jwt.verify
    const userData = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET_KEY);

    //find user from email decrypted from token
    const user = await User.findOne({ email: userData.email });
    //if not user terminate
    if (!user) {
      return res.status(401).send({ message: "User Does not Exist." });
    }

    //if user role is not user ,terminate
    if (user.role !== "author") {
      return res.status(401).send({ message: "Unauthorized" });
    }
    //?phase2
    req.userInfo = user;
    // console.log(user);
    next();
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized." });
  }
};
export const isAuthenticated = async (req, res, next) => {
  try {
    const authorization = req?.headers?.authorization;
    const splittedArray = authorization?.split(" ");
    const token = splittedArray?.length === 2 && splittedArray[1];
    if (!token) {
      return res
        .status(401)
        .send({ message: "Unauthorized: No token provided." });
    }
    const userData = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET_KEY);
    const user = await User.findOne({ email: userData.email });
    if (!user) {
      return res
        .status(401)
        .send({ message: "Unauthorized: User does not exist." });
    }
    req.userInfo = user;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized: Invalid token." });
  }
};
