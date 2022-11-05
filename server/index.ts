import express, { Express, Request, Response } from "express";
import next from "next";
import { Server } from "socket.io";
import cors from './cors';
import socketServer from "./server";

const dev = process.env.APP_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server: Express = express();

  server.use(cors);

  server.get('*', (req: Request, res: Response) => {
    return handle(req, res);
  });

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
    console.log('Server is running...')
  });
});
