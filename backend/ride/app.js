import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import rideRoutes from "./routes/ride.route.js";
import { connectToDB } from "./db/db.js";
import rabbitMq from "./services/rabbit.service.js";

connectToDB();

const app = express();

rabbitMq.connect();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", rideRoutes);

export default app;
