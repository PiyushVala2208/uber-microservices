import express from "express";
import expressProxy from "express-http-proxy";

const app = express();

app.use("/users", expressProxy("http://localhost:8005"));
app.use("/captains", expressProxy("http://localhost:8008"));
// app.use("/rides", expressProxy("http://localhost:8022"));

app.listen(8000, () => {
  console.log("Gateway server listening on port 8000");
});
