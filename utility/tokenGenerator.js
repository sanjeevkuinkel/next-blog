import jwt from "jsonwebtoken";
const generateToken = (user) => {
  const accessToken = jwt.sign(
    { userId: user.userId, email: user.email },
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY_TIME,
    }
  );

  const refreshToken = jwt.sign(
    { userId: user.userId, email: user.email },
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY_TIME,
    }
  );
  return { accessToken, refreshToken };
};

export { generateToken };
