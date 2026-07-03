import express from "express";
import expressProxy from "express-http-proxy";
import cors from "cors";
import http from "http";
import { initializeSocket } from "./socket.js";

const app = express();
const server = http.createServer(app);

app.use(cors());

app.use("/users", expressProxy("http://localhost:8005"));
app.use("/captains", expressProxy("http://localhost:8008"));
app.use("/rides", expressProxy("http://localhost:8022"));
app.use("/maps", expressProxy("http://localhost:8022"));

initializeSocket(server);
server.listen(8000, () => {
  console.log("Gateway server listening on port 8000");
});
