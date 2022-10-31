import { Player } from "./types";

const roomList: any[] = [];

let uniqueId = 1;

export const createRoom = () => {
  const room = {
    id: uniqueId++,
    players: new Array<Player>(),
    createdAt: new Date(),
  };
  roomList.push(room);
  return room;
}

export const closeRoom = (id) => {
  const index = roomList.findIndex(i => i.id === id);
  if (index >= 0) {
    roomList.splice(index, 1);
  }
}

export const findRoom = (id) => {
  return roomList.find(i => i.id === id);
}

export const joinRoom = (roomId, player) => {
  const room = findRoom(roomId);
  if (room) {
    room.players.push(player);
  }
}

export const exitRoom = (roomId, playerId) => {
  const room = findRoom(roomId);
  if (room) {
    const index = room.players.findIndex(i => i.id === playerId);
    if (index >= 0) {
      room.players.splice(index, 1)
    }
  }
}
