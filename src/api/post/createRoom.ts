import { Request, Response } from "express";
import Logger from "../../helpers/Logger";
import Player from "../../helpers/Player";
import Room from "../../helpers/Room";

// Create a new room
// Generate a random room ID, and send the room code back to the player
// Also create a new Player instance and send the ID back to the player

async function createRoom(req: Request, res: Response) {
  Logger.print('Endpoint called', 'api/post/createRoom.ts');
  
  const playerName: string = req.body.playerName;
  if (typeof playerName !== 'string') {
    Logger.print('No player name provided', 'api/post/createRoom.ts', true);
    return res.status(400).json({
      'success': false,
      'error': 'No player name provided.',
    });
  }
  
  // Create a new room
  const newRoom = new Room();
  // Create a new player instance
  const newPlayer = new Player(playerName, newRoom);

  res.status(200).json({
    'success': true,
    'roomKey': newRoom.roomKey,
    'playerId': newPlayer.id,
  });
}

export default createRoom;