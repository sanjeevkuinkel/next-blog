import express from "express";
import "dotenv/config";
import { dbConnect } from "./config/database.js";
import { router as userRoutes } from "./routes/user.route.js";
import { router as blogRoutes } from "./routes/blog.route.js";
const app = express();
dbConnect();
app.use(express.json());
app.use(userRoutes);
app.use(blogRoutes);
const port = process.env.PORT;
app.get("/", (req, res) => {
  res.send("express app Created");
});
app.listen(port, () => {
  console.log(`App is listening on port http://localhost:${port}`);
});
