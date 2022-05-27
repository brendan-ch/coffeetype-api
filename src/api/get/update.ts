// Long polling endpoint
// Client provides room key and player ID as query params
// Returns events to the room

import { Request, Response } from "express";
import Logger from "../../helpers/Logger";
import Room from "../../helpers/Room";
import { RoomEvent } from "../../types";

const FILE_PATH = 'api/get/update.ts';

/**
 * Subscribe to updates from a room.
 * @param req
 * @param res
 */
async function update(req: Request, res: Response) {
  Logger.print('Endpoint called', FILE_PATH);

  const roomKey = req.query.roomKey;
  const playerId = req.query.playerId;
  if (typeof roomKey !== 'string' || typeof playerId !== 'string') {
    Logger.print('Invalid parameters provided', FILE_PATH, true);
    
    return res.status(400).json({
      success: false,
      error: 'Invalid parameters provided.',
    });
  }

  // Find the room
  const room = Room.findRoom(roomKey);
  if (!room) {
    Logger.print('Room not found', FILE_PATH, true);
    
    return res.status(404).json({
      success: false,
      error: 'Room not found.',
    });
  }

  // Start listening for events
  const listener = room.addEventListener((event) => {
    let data: any = {};

    // Add a switch statement here
    switch (event) {
      case RoomEvent.TEST_END:
        // In data, pass the end results for players
      case RoomEvent.PLAYERS_UPDATE:
        // In data, update the names and IDs of players
        data.players = room.players.map((value) => ({
          name: value.name,
          id: value.id,
          wpm: value.wpm,
          acc: value.acc,
        }));
        break;
      case RoomEvent.TEST_START:
        // Pass the starting set of words
      case RoomEvent.WORDS_UPDATE:
        // In data, pass new set of words to players
        data.chars = room.chars;
        break;

      default:
        break;
    }

    Logger.print(`Event ${event} fired!`, FILE_PATH);

    // Remove the event listener
    room.removeEventListener(listener);

    res.status(200).json({
      success: true,
      event,
      data,
    });
  });

  Logger.print('Waiting for event...', FILE_PATH);
}

export default update;