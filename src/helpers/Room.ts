import Logger from "./Logger";
import Player from "./Player";
import { RoomEvent } from "../types";
import WordsLoader from "./WordsLoader";

const FILE_PATH = 'helpers/Room.ts';

type Listener = (event: RoomEvent) => any;

/**
 * Keep track of a single multiplayer room.
 * Handling of endpoints take place outside of the class.
 */
class Room {
  /**
   * Timer default, in milliseconds.
   */
  public static readonly TIMER_DEFAULT = 30000;

  /**
   * List of taken keys.
   */
  private static _instances: Room[] = [];

  /**
   * Key of the room, can only be set once.
   */
  public readonly roomKey: string;
  
  /**
   * List of players in the associated room.
   * Order of players determines player number.
   */
  private _players: Player[];

  /**
   * Current host of the room.
   */
  private _host?: Player;

  /**
   * Time when the last test was started.
   * Undefined if no test running.
   */
  private _lastTestStarted?: Date;

  /**
   * Generated characters to display and compare typed results against.
   */
  private characters: string;

  private listeners: Listener[];

  constructor() {
    Logger.print('Generating a new Room object', FILE_PATH);

    // Generate a random numeric room key, not in the keys array
    this.roomKey = Room.generateKey();
    this._players = [];
    this.listeners = [];

    this.characters = WordsLoader.getWords(200);

    // Add itself to the _instances array
    Room.addRoom(this);
  }

  /**
   * Return all active rooms.
   */
  public static get instances() {
    return Room._instances;
  }

  public get players() {
    return this._players;
  }

  public get chars() {
    return this.characters;
  }

  public get host() {
    return this._host;
  }

  /**
   * Amount of time since last test was started.
   */
  public get timeElapsed() {
    if (!this._lastTestStarted) {
      return undefined;
    }

    return Date.now() - this._lastTestStarted.getTime();
  }

  /**
   * Generate a room key.
   */
  public static generateKey(): string {
    Logger.print('Generating a room key', FILE_PATH);
    let key: string = '';

    while (key.length < 6) {
      const int = Math.ceil(Math.random() * 10);
      key += int;
    }

    if (Room._instances.find((value) => value.roomKey === key)) {
      return Room.generateKey();
    }

    return key;
  }

  /**
   * Add a room to the _instances array.
   * @param room
   * @returns
   */
  public static addRoom(room: Room) {
    Logger.print(`Adding room ${room.roomKey} to static array`, FILE_PATH);
    // Check for duplicate keys
    if (Room.findRoom(room.roomKey)) {
      return;
    }
    Room._instances.push(room);
  }

  /**
   * Return the room corresponding to the room key.
   * @param roomKey
   */
  public static findRoom(roomKey: string) {
    return Room._instances.find((value) => value.roomKey === roomKey);
  }
  
  /**
   * Remove all references to a room, if it exists.
   * @param key
   */
  public static deleteRoom(key: string) {
    Logger.print(`Deleting room ${key} from static array`, FILE_PATH);
    const i = Room._instances.findIndex((value) => value.roomKey === key);
    if (i < 0) return;
    Room._instances.splice(i, 1);
  }

  /**
   * Link a player to the room.
   * @param player 
   */
  public addPlayer(player: Player) {
    Logger.print(`Linking player ${player.id} to room`, FILE_PATH);
    if (this._players.find((value) => value.id === player.id)) {
      return;
    }

    // Add the player
    this._players.push(player);

    // By default, the first player who enters becomes the host
    if (this._players.length === 1) {
      Logger.print(`Making player ${player.id} host of room ${this.roomKey}`, FILE_PATH);
      this._host = player;
    }

    this.fireEventListeners(RoomEvent.PLAYERS_UPDATE);
  }

  /**
   * Unlink a player to the room.
   * @param playerId
   * @todo remove this method or Player.deletePlayer depending on which one gets called
   */
  public deletePlayer(playerId: string) {
    Logger.print(`Unlinking player ${playerId} from room`, FILE_PATH); 

    const i = this._players.findIndex((value) => value.id === playerId);
    if (i < 0) {
      Logger.print('Player not linked to room', FILE_PATH, true);
      return;
    };
    
    this._players.splice(i, 1);
    // Check if host
    if (this._host?.id === playerId && this._players.length > 0) {
      this._host = this._players[Math.floor(Math.random() * this._players.length)];

      Logger.print('Passing host to player ' + this._host.id, FILE_PATH);
    } else if (this._host?.id === playerId) {
      Logger.print(`Removing host from room ${this.roomKey}`, FILE_PATH);
      this._host = undefined;
    }

    this.fireEventListeners(RoomEvent.PLAYERS_UPDATE);
  }

  /**
   * Remove itself from the _instances array.
   */
  public selfDestruct() {
    Room.deleteRoom(this.roomKey);
  }

  /**
   * Add a new event listener.
   * @param listener
   */
  public addEventListener(listener: Listener) {
    Logger.print('Adding listener', FILE_PATH);
    this.listeners.push(listener);

    return listener;
  }

  /**
   * Remove an event listener from the array.
   * @param listener
   */
  public removeEventListener(listener: Listener) {
    Logger.print('Removing listener', FILE_PATH);

    // Check for reference equality
    const i = this.listeners.findIndex((value) => value == listener);
    if (i < 0) {
      Logger.print('Listener not found', FILE_PATH, true);
    };
    this.listeners.splice(i, 1);
  }

  /**
   * Set lastTestStarted to current time, and set a timeout to end the test
   * depending on TIMER_DEFAULT
   */
  public startTest() {
    Logger.print(`Starting test in room ${this.roomKey}`, FILE_PATH);
    this._lastTestStarted = new Date();

    setTimeout(() => {
      Logger.print(`Ending test in room ${this.roomKey}`, FILE_PATH);

      // End the test
      this._lastTestStarted = undefined;

      // Fire event
      this.fireEventListeners(RoomEvent.TEST_END);
    }, Room.TIMER_DEFAULT);

    this.fireEventListeners(RoomEvent.TEST_START);
  }
  
  /**
   * Fire all event listeners.
   * @param event
   */
  private fireEventListeners(event: RoomEvent) {
    Logger.print(`Firing event listener ${event}`, FILE_PATH);
    this.listeners.forEach((listener) => listener(event));
  }
}

export default Room;