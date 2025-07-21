import express from "express";
import connectDB from "./utils/connectDB.js";
import dotenv from "dotenv";
import cors from "cors";
import postRouter from "./router/post/postRouter.js";

dotenv.config();

const app = express();

//* Connect to the DB
connectDB();

//* Middlewares
//* CORS
const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};

//* PORT
const PORT = process.env.PORT || 5000;

//* CORS
app.use(cors(corsOptions));

//* Middlewares
app.use(express.json());

//* Route Handlers
app.use("/api/v1", postRouter);

//* Not Found Route
app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

//* Error Handling Middleware
app.use((err, req, res, next) => {
  const message = err.message || "Internal Server Error";
  const status = err.status || 500;
  const stack = err.stack || "";
  res.status(status).json({
    status: "error",
    message: message,
    stack,
  });
});

//* Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
