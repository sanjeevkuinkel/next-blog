import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import { RefreshToken } from "../models/refresh.token.model.js";

export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;
  console.log(refreshToken);
  if (!refreshToken) {
    return res.status(403).send("Refresh Token is required");
  }

  // Check if refresh token is valid and exists in DB
  const tokenInDb = await RefreshToken.findOne({ token: refreshToken });
  if (!tokenInDb) {
    return res.status(403).send("Invalid or expired refresh token");
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY
    );

    // Generate a new access token
    const newAccessToken = generateAccessToken({
      id: decoded.id,
      email: decoded.email,
    });

    // Optionally, refresh the refresh token (token rotation)
    const newRefreshToken = generateRefreshToken({
      id: decoded.id,
      email: decoded.email,
    });
    tokenInDb.token = newRefreshToken; // Update the DB with the new refresh token
    await tokenInDb.save();

    return res
      .status(200)
      .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    return res.status(403).send("Invalid refresh token");
  }
};
