import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";


import connecttoDb from "./config/db.config.js";

import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

const Port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
connecttoDb();
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api", userRoutes);


app.get("/", (req, res) => {
  res.send("Hello World");
}) 

app.listen(Port, () => {
  console.log("Server Running on Port 5000");
});
