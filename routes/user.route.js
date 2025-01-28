import express from "express";
import {
  registerUser,
  loginUser,
  getSingleUser,
  getUser,
  deleteUserAndData,
  editUserDetails,
} from "../services/user.service.js";
import { isAuthenticated, isAuthor } from "../middleware/auth.middleware.js";
import { refreshAccessToken } from "../utility/refreshToken.js";
const router = express.Router();
router.post("/user/register", registerUser);
router.get("/user/login", loginUser);
router.get("/user/:id", getSingleUser);
router.get("/users", getUser);
router.delete("/delete/:id", isAuthor, deleteUserAndData);
router.put("/user/edit", isAuthenticated, editUserDetails);
// router.delete("/delete", deleteAllUser);
router.post("/refreshToken", refreshAccessToken);

export { router };
