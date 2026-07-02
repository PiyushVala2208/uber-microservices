import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


import userRoutes from "./routes/user.route.js";
import { connectToDB } from "./db/db.js";


connectToDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", userRoutes);


export default app;
