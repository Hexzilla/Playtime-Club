export interface Player {
  address: string;
  name: string;
  avatar: string;
  position: string;
  rotation: string;
  id: string;
  socketId: string;
  animation: string;
  health: number;
  maxHealth: number;
  kills: number;
  timeOut: number;
  isDead: boolean;
  isMute: boolean;
};
