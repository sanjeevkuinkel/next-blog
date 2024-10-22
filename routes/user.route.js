import express from "express";
import { isAuthor } from "../middleware/auth.middleware.js";
import {
  deleteUserAndData,
  getAllUser,
  getSingleUser,
  loginUser,
  registerUser,
} from "../services/user.service.js";

const router = express.Router();
router.post("/user/register", registerUser);
router.get("/user/login", loginUser);
router.get("/user/details/:id", getSingleUser);
router.get("/users", getAllUser);
router.delete("/user/delete/:id", isAuthor, deleteUserAndData);
export { router };
