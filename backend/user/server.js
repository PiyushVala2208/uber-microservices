import http from "http";
import app from "./app.js";

const server = http.createServer(app);

server.listen(8005, () => {
  console.log("👤 User service is running on port 8005");   
});
