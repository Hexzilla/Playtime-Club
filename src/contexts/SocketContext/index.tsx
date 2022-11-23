import React, { createContext, useState, useCallback, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { BaseUrl } from "configs";

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
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
