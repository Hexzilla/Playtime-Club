import { sign } from 'tweetnacl';
import { uuid } from 'uuidv4';
import { Player } from "./types";
import * as roomService from "./room";

const clients: Player[] = [];
const clientLookup = {};
const sockets = {};

const server = (socket: any) => {
  /// Print a log in node.js command prompt
  console.log("A user ready for connection!");

  /// To store current client connection
  const player: Player = {} as Player;

  socket.on("PING", function () {
    console.log(`Ping Message from user #${socket.id}`);

    /// Emit back to NetworkManager in Unity by client.js script
    socket.emit("PONG", socket.id);
  });

  socket.on("LOGIN", function (msg) {
    console.log("[INFO] LOGIN received !!! ", msg);

    const data = JSON.parse(msg);

    /// Fills out with the information emitted by the player in the unity
    player.id = socket.id;
    player.name = data.name;
    player.avatar = data.avatar;
    player.position = data.position;
    player.rotation = "0";
    player.socketId = socket.id;
    player.animation = "";
    player.health = 100;
    player.maxHealth = 100;
    player.kills = 0;
    player.timeOut = 0;
    player.isDead = false;
    player.isMute = false;

    console.log("[INFO] player " + player.name + ": logged!");
    console.log("[INFO] currentUser.position " + player.position);

    /// add currentUser in clients list
    clients.push(player);

    /// add client in search engine
    clientLookup[player.id] = player;

    sockets[player.socketId] = socket; /// add curent user socket

    console.log("[INFO] Total players: " + clients.length);

    /*********************************************************************************************/

    /// Send to the client.js script
    socket.emit(
      "LOGIN_SUCCESS",
      player.id,
      player.name,
      player.avatar,
      player.position
    );

    /// Spawn all connected clients for currentUser client
    clients.forEach(function (i) {
      if (i.id !== player.id) {
        /// send to the client.js script
        socket.emit("SPAWN_PLAYER", i.id, i.name, i.avatar, i.position);
      }
    });

    /// Spawn currentUser client on clients in broadcast
    socket.broadcast.emit(
      "SPAWN_PLAYER",
      player.id,
      player.name,
      player.avatar,
      player.position
    );
  });

  socket.on("JOIN", function (msg) {
    console.log("[INFO] JOIN received !!! ", msg);

    const player = {
      id: uuid(),
      address: msg.address,
      socketId: socket.id,
    } as Player;

    const room = roomService.createRoom();
    room.players.push(player);

    socket.emit(
      "JOIN_SUCCESS",
      player.id,
    );
  });

  socket.on("RESPAWN", function (msg) {
    var info = JSON.parse(msg);

    if (player) {
      player.isDead = false;

      player.health = player.maxHealth;

      socket.emit(
        "RESPAWN_PLAYER",
        player.id,
        player.name,
        player.avatar,
        player.position
      );

      socket.broadcast.emit(
        "SPAWN_PLAYER",
        player.id,
        player.name,
        player.avatar,
        player.position
      );

      console.log("[INFO] User " + player.name + " respawned!");
    }
  });

  /// EmitMoveAndRotate
  socket.on("MOVE_AND_ROTATE", function (msg) {
    const data = JSON.parse(msg);

    if (player) {
      player.position = data.position;
      player.rotation = data.rotation;

      /// Send current user position and  rotation in broadcast to all clients in game
      socket.broadcast.emit(
        "UPDATE_MOVE_AND_ROTATE",
        player.id,
        player.position,
        player.rotation
      );
    }
  });

  /// EmitAnimation
  socket.on("ANIMATION", function (msg) {
    const data = JSON.parse(msg);

    if (player) {
      player.timeOut = 0;

      /// send to the client.js script
      /// updates the animation of the player for the other game clients
      socket.broadcast.emit(
        "UPDATE_PLAYER_ANIMATOR",
        player.id,
        data.animation
      );
    }
  });

  /// EmitAnimation()
  socket.on("ATTACK", function () {
    if (player) {
      socket.broadcast.emit("UPDATE_ATTACK", player.id);
    }
  });

  /// EmitPhisicstDamage
  socket.on("PHISICS_DAMAGE", function (msg) {
    const data = JSON.parse(msg);

    if (player) {
      const target = clientLookup[data.targetId];
      const damage = 1;

      /// If health target is not empty
      if (target.health - damage > 0) {
        /// Decrease target health
        target.health -= damage;
      } else {
        if (!target.isDead) {
          target.isDead = true; /// target is dead
          target.kills = 0;

          player.kills += 1;

          const jo_pack = {
            targetId: data.targetId,
          };

          /// Emit only for the currentUser
          socket.emit("DEATH", jo_pack.targetId);

          /// Emit to all connected clients in broadcast
          socket.broadcast.emit("DEATH", jo_pack.targetId);
        }
      }

      const damage_pack = {
        targetId: data.targetId,
        targetHealth: target.health,
      };
      socket.emit(
        "UPDATE_PHISICS_DAMAGE",
        damage_pack.targetId,
        damage_pack.targetHealth
      );
      socket.broadcast.emit(
        "UPDATE_PHISICS_DAMAGE",
        damage_pack.targetId,
        damage_pack.targetHealth
      );
    }
  });

  socket.on("VOICE", function (data) {
    if (player) {
      let newData = data.split(";");
      newData[0] = "data:audio/ogg;";
      newData = newData[0] + newData[1];

      clients.forEach(function (u) {
        if (sockets[u.id] && u.id != player.id && !u.isMute) {
          sockets[u.id].emit("UPDATE_VOICE", newData);
        }
      });
    }
  });

  socket.on("AUDIO_MUTE", function (data) {
    if (player) {
      player.isMute = !player.isMute;
    }
  });

  /// Called when the user desconnect
  socket.on("disconnect", function () {
    console.log("disconnect");
    if (player) {
      player.isDead = true;

      /// Send to the client.js script
      /// Updates the currentUser disconnection for all players in game
      socket.broadcast.emit("USER_DISCONNECTED", player.id);

      for (var i = 0; i < clients.length; i++) {
        if (clients[i].name == player.name && clients[i].id == player.id) {
          console.log(`User ${clients[i].name} has disconnected`);
          clients.splice(i, 1);
        }
      }
    }
  });
};

export default server;
