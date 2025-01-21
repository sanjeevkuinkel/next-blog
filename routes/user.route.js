import express from "express";
import {
  registerUser,
  loginUser,
  getSingleUser,
  getUser,
  deleteUserAndData,
} from "../services/user.service.js";
const router = express.Router();
router.post("/user/register", registerUser);
router.get("/user/login", loginUser);
router.get("/user/:id", getSingleUser);
router.get("/users", getUser);
router.delete("/delete/:id", deleteUserAndData);
// router.delete("/delete", deleteAllUser);
// router.post("/refreshToken",getRefeshToken)

export { router };
