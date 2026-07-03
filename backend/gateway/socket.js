import { Server } from "socket.io";
import rabbitMq from "./services/rabbit.service.js";

let io;
const userSocketMap = new Map();

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join", (data) => {
      const { userId, userType } = data;
      if (userId) {
        userSocketMap.set(userId.toString(), socket.id);
      }

      if (userType === "user") {
        rabbitMq.publishToQueue(
          "update-user-socket",
          JSON.stringify({ userId, socketId: socket.id }),
        );
      } else if (userType === "captain") {
        rabbitMq.publishToQueue(
          "update-captain-socket",
          JSON.stringify({ userId, socketId: socket.id }),
        );
      }
    });

    socket.on("update-location-captain", (data) => {
      const { userId, location } = data;

      if (!location || !location.ltd || !location.lng) {
        return socket.emit("error", { message: "Invalid location data" });
      }

      rabbitMq.publishToQueue(
        "update-captain-location",
        JSON.stringify({ userId, location }),
      );
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          break;
        }
      }
    });
  });

  // Subscribe to outbound messages from other microservices
  rabbitMq.subscribeToQueue("send-socket-message", (msg) => {
    const data = JSON.parse(msg);
    console.log(`[Gateway] Received send-socket-message for event: ${data.event}`);
    if (io) {
      if (data.socketId) {
        console.log(`[Gateway] Routing to socketId: ${data.socketId}`);
        io.to(data.socketId).emit(data.event, data.message);
      } else if (data.userId) {
        const socketId = userSocketMap.get(data.userId.toString());
        console.log(`[Gateway] Routing to userId: ${data.userId} -> socketId: ${socketId}`);
        if (socketId) {
          io.to(socketId).emit(data.event, data.message);
        } else {
          console.log(`[Gateway] Warning: No socket found for userId ${data.userId}`);
        }
      }
    }
  });
};
