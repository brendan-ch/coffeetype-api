// POST to this endpoint to start a test in a room
// Only the room host can do this

import { Request, Response } from "express";
import Logger from "../../helpers/Logger";
import Room from "../../helpers/Room";

const FILE_PATH = 'api/post/start.ts';

async function start(req: Request, res: Response) {
  Logger.print('Endpoint called', FILE_PATH);
  // Get player ID and room key
  const roomKey = req.body.roomKey;
  const playerId = req.body.playerId;

  if (typeof roomKey !== 'string' || typeof playerId !== 'string') {
    Logger.print('Invalid parameters provided', FILE_PATH, true);

    return res.status(400).json({
      success: false,
      error: 'Invalid parameters provided.',
    });
  }

  // Look up the room
  const room = Room.findRoom(roomKey);
  if (!room) {
    Logger.print('Room not found', FILE_PATH, true);

    return res.status(404).json({
      success: false,
      error: 'Room not found',
    });
  }

  // Check if host
  if (room.host?.id !== playerId) {
    Logger.print('Not the host!', FILE_PATH, true);

    return res.status(403).json({
      success: false,
      error: 'Not the host!',
    });
  }

  if (room.testRunning) {
    Logger.print('Test already running!', FILE_PATH, true);

    return res.status(403).json({
      success: false,
      error: 'Test already running!',
    });
  }

  // Start the test by setting lastTestStarted
  room.startTest();

  res.status(200).json({
    success: true,
  });

}

export default start;
