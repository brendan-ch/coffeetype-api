import { Request, Response } from "express";
import Logger from "../../helpers/Logger";
import Player from "../../helpers/Player";
import Room from "../../helpers/Room";

// POST to this endpoint to add a new player to an existing room
// Create new Player instance and send the ID back to the player
const FILE_PATH = 'api/post/join.ts';

async function join(req: Request, res: Response) {
  Logger.print('Endpoint called', FILE_PATH);
  
  const roomId = req.body.roomKey;
  const playerName = req.body.playerName;
  if (typeof roomId !== 'string' || typeof playerName !== 'string') {
    Logger.print('Invalid parameters provided', FILE_PATH, true);
    
    return res.status(400).json({
      success: false,
      error: 'Invalid parameters provided.',
    });
  }

  // Find the room
  const room = Room.findRoom(roomId);
  if (!room) {
    Logger.print('Room not found', FILE_PATH, true);
    
    return res.status(404).json({
      success: false,
      error: 'Room not found.',
    });
  }

  // Create a new player
  const newPlayer = new Player(playerName, room);

  return res.status(200).json({
    success: true,
    playerId: newPlayer.id,
    roomKey: room.roomKey,
  });
}

export default join;
