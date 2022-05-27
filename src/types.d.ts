/**
 * Event sent to the client along with data.
 */
const enum RoomEvent {
  /**
   * Fires when the test is started.
   */
  TEST_START = 'TEST_START',
  /**
   * Fires when the test ends.
   */
  TEST_END = 'TEST_END',
  /**
   * Fires when more words are generated or words are regenerated.
   * Send regenerated words to client.
   */
  WORDS_UPDATE = 'WORDS_UPDATE',
  /**
   * Fires when the stats for each player needs to be updated.
   */
  // STATS_UPDATE = 'STATS_UPDATE',
  /**
   * Fired when there is an update to the player list.
   */
  PLAYERS_UPDATE = 'PLAYERS_UPDATE',
}

export { RoomEvent };