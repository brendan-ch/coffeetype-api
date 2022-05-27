// Update the words the player has typed

import { Request, Response } from "express";
import Logger from "../../helpers/Logger";
import Player from "../../helpers/Player";

const FILE_PATH = 'api/post/testData.ts';

/**
 * Save typing data for the user.
 * @param req
 * @param res 
 * @returns 
 */
async function testData(req: Request, res: Response) {
  Logger.print('Endpoint called', FILE_PATH);
  // Get player ID and room key
  const roomKey = req.body.roomKey;
  const playerId = req.body.playerId;
  const typed = req.body.typed;

  if (typeof roomKey !== 'string' || typeof playerId !== 'string' || typeof typed !== 'string') {
    Logger.print('Invalid parameters provided', FILE_PATH, true);

    return res.status(400).json({
      success: false,
      error: 'Invalid parameters provided.',
    });
  }

  // Update the player data
  const player = Player.findPlayer(playerId);
  if (!player) {
    Logger.print('Player not found', FILE_PATH, true);

    return res.status(404).json({
      success: false,
      error: 'Player not found.',
    });
  }

  if (!player.room.testRunning) {
    Logger.print('Test not running', FILE_PATH, true);

    return res.status(404).json({
      success: false,
      error: 'Test not running.',
    });
  }

  player.setTyped(typed);
  player.room.generateMoreWords();

  res.status(200).json({
    success: true,
  });
}

export default testData;