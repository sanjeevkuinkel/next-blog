import { RefreshToken } from "../models/refreshToken.model.js";
import jwt from "jsonwebtoken";

export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required" });
  }
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY
    );
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    const userData = {
      userId: decoded.userId,
      email: decoded.email,
    };
    // const accessToken = jwt.sign(
    //   { userId: decoded.userId, email: decoded.email },
    //   process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    //   { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY_TIME }
    // );
    const { accessToken } = generateToken(userData);

    return res.json({
      accessToken,
      message: "Access token refreshed successfully",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      await RefreshToken.findOneAndDelete({ token: refreshToken });
      return res.status(403).json({ message: "Refresh token has expired" });
    }
    return res
      .status(403)
      .json({ message: "Invalid refresh token", error: error.message });
  }
};
