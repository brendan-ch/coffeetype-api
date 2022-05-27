// POST to this endpoint to exit the room
// Player instance self-destructs
// Remove player reference from Player._instances, and all rooms

import { Request, Response } from "express";
import Logger from "../../helpers/Logger";
import Player from "../../helpers/Player";

const FILE_PATH = 'api/post/exit.ts';

async function exit(req: Request, res: Response) {
  Logger.print('Endpoint called', FILE_PATH);

  const playerId: string = req.body.playerId;
  if (typeof playerId !== 'string') {
    Logger.print('No player ID provided', FILE_PATH, true);
    return res.status(400).json({
      'success': false,
      'error': 'No player ID provided.',
    });
  }

  // Remove the player
  Player.deletePlayer(playerId);

  res.status(200).json({
    'success': true,
  });
}

export default exit;