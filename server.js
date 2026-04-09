import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import jsonServer from "json-server";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Cấu hình Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(cors());
app.use(express.json());

const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

app.use(middlewares);
app.use("/api", router);

io.on("connection", (socket) => {
  console.log(`Có người vừa kết nối: ${socket.id}`);

  socket.on("notify_change", (data) => {
    io.emit("employee_changed", data);
  });

  socket.on("disconnect", () => {
    console.log("Người dùng đã ngắt kết nối");
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`- Socket.io ready`);
});
