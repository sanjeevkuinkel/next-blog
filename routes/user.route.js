import express from "express";
import { registerUser, loginUser } from "../services/user.service.js";
const router = express.Router();
router.post("/user/register", registerUser);
router.get("/user/login", loginUser);
export { router };
