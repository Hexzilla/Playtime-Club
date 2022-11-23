import React, { createContext, ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";
import { io, Socket } from "socket.io-client";
import { BaseUrl } from "configs";
import { setConnected } from "slices/play";
import useInterval from 'hooks/useInterval';

export interface SocketContextApi {
  socket: Socket;
}

export const SocketContext = createContext<SocketContextApi>(
  {} as SocketContextApi
);

const socket = io(BaseUrl);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("connect", () => {
      dispatch(setConnected(true));
      socket.emit("GET_ROOM");
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
      dispatch(setConnected(false));
    });

    socket.on("PONG", () => {
      console.log("PONG");
    });

    socket.connect();

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("PONG");
    };
  }, [dispatch]);

  useInterval(() => {
    socket.emit('PING');
  }, 5000);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
