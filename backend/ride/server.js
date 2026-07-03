import http from "http";
import app from "./app.js";

const server = http.createServer(app);

server.listen(8022, () => {
  console.log("🚕 Ride service is running on port 8022");
});
