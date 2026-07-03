import http from "http";
import app from "./app.js";

const server = http.createServer(app);

server.listen(8008, () => {
  console.log("👮 Captain service is running on port 8008");   
});
