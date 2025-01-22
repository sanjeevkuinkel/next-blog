import express from "express";
import {
  registerUser,
  loginUser,
  getSingleUser,
  getUser,
  deleteUserAndData,
} from "../services/user.service.js";
import { isAuthor } from "../middleware/auth.middleware.js";
const router = express.Router();
router.post("/user/register", registerUser);
router.get("/user/login", loginUser);
router.get("/user/:id", getSingleUser);
router.get("/users", getUser);
router.delete("/delete/:id",isAuthor, deleteUserAndData);
// router.delete("/delete", deleteAllUser);
// router.post("/refreshToken",getRefreshToken)

export { router };
