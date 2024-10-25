import jwt from "jsonwebtoken";
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY_TIME,
  });
};
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY_TIME,
  });
};
export { generateAccessToken, generateRefreshToken };
