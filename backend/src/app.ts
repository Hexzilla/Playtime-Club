import express, { Express, Request, Response } from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";
import server from "./server";

dotenv.config();

/// create an object of the express module
const app: Express = express();

/// import socketio communication module
const http = require("http").Server(app);
const io = new Server(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(
  "/public/TemplateData",
  express.static(__dirname + "/public/TemplateData")
);
app.use("/public/Build", express.static(__dirname + "/public/Build"));
app.use(express.static(__dirname + "/public"));

/// Open a connection with the specific client
io.on("connection", server);

http.listen(process.env.PORT || 8000, function () {
  console.log("listening on *:8000");
});
