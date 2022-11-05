import express, { Express, Request, Response } from "express";
import next from "next";
import { Server } from "socket.io";
import cors from './cors';
import socketServer from "./server";

const dev = process.env.APP_ENV !== 'production';
console.log('~~~~~~~~~~~~~~~~1')
const app = next({ dev });
console.log('~~~~~~~~~~~~~~~~2')
const handle = app.getRequestHandler();
console.log('~~~~~~~~~~~~~~~~3')
const port = process.env.PORT || 3000;
console.log('~~~~~~~~~~~~~~~~4', port)

app.prepare().then(() => {
  console.log('~~~~~~~~~~~~~~~~10')
  const server: Express = express();

  console.log('~~~~~~~~~~~~~~~~11')
  server.use(cors);

  console.log('~~~~~~~~~~~~~~~~12')
  server.get('*', (req: Request, res: Response) => {
    return handle(req, res);
  });

  console.log('~~~~~~~~~~~~~~~~13')
  /// import socketio communication module
  const http = require("http").Server(server);
  const io = new Server(http, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  console.log('~~~~~~~~~~~~~~~~14')
  /// Open a connection with the specific client
  io.on("connection", socketServer);

  console.log('~~~~~~~~~~~~~~~~15')
  http.listen(port, () => {
    console.log('Server is running...')
  });
});
