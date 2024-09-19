import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth-routes.js";
import userRoutes from "./routes/user-routes.js";
import postRoutes from "./routes/post-routes.js";
import notificationRoutes from "./routes/notification-routes.js";
import connectionRoutes from "./routes/connection-routes.js";
import { connectDB } from "./database/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}

app.use(express.json({ limit: "5mb" }));

app.use(cookieParser());

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/connections", connectionRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
