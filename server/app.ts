import express, { Express } from "express";
import { Server } from "socket.io";
import cors from './cors';
import socketServer from "./server";

const port = process.env.PORT || 3000;

const server: Express = express();

server.use(cors);

/// import socketio communication module
const http = require("http").Server(server);
const io = new Server(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

/// Open a connection with the specific client
io.on("connection", socketServer);

http.listen(port, () => {
  console.log('Server is running on ', port)
});
