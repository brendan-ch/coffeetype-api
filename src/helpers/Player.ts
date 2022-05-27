import Logger from "./Logger";
import Room from "./Room";

const FILE_PATH = 'helpers/Player.ts';

/**
 * Keep track of a player inside a room.
 */
class Player {
  /**
   * List of all players.
   */
  private static _instances: Player[] = [];

  /**
   * ID of the player.
   */
  public readonly id: string;
  
  /**
   * Nickname of the player.
   */
  private _name: string;

  /**
   * Reference to the room the player is currently in.
   */
  private _room: Room;

  /**
   * What the player has typed.
   * Used to calculate WPM and accuracy.
   */
  private _typed: string;

  constructor(name: string, room: Room) {
    Logger.print('Creating a new Player object in room ' + room.roomKey, FILE_PATH);

    // Generate a random numeric ID
    this.id = Player.generateId();
    this._name = name;
    this._room = room;

    this._typed = '';
    
    Player.addPlayer(this);
    room.addPlayer(this);
  }

  /**
   * The nickname of the player.
   */
  public get name() {
    return this._name;
  }
  public get room() {
    return this._room;
  }

  /**
   * Calculate the current WPM of the player.
   */
  public get wpm() {
    let numWordsTypedCorrectly = 0;

    // Time elapsed, in minutes
    const timeElapsed = this.room.timeElapsed ? this.room.timeElapsed / 1000 / 60 : undefined;
    if (!timeElapsed || timeElapsed === 0) return 0;

    let actualWord = '';
    let typedWord = '';

    // Loop through all typed characters
    for (let i = 0; i < this._typed.length; i += 1) {
      const character = this._typed.substring(i, i + 1);

      if (character === " ") {
        // Bump number of words typed correctly
        if (actualWord === typedWord) {
          numWordsTypedCorrectly += 1;
        }

        // Clear the typed words
        actualWord = "";
        typedWord = "";
      } else {
        actualWord += this.room.chars.substring(i, i + 1);
        typedWord += character;
      }
    }

    return (numWordsTypedCorrectly / timeElapsed);
  }

  public get acc() {
    // Count number of characters typed correctly
    let numCharsTypedCorrectly = 0;

    for (let i = 0; i < this._typed.length; i += 1) {
      if (this.room.chars.substring(i, i + 1) === this._typed.substring(i, i + 1)) {
        numCharsTypedCorrectly++;
      }
    }

    return (numCharsTypedCorrectly / this._typed.length) * 100;
  }

  public static generateId(): string {
    Logger.print('Generating a player ID', FILE_PATH);
    let key: string = '';

    while (key.length < 6) {
      const int = Math.ceil(Math.random() * 10);
      key += int;
    }

    if (Player._instances.find((value) => value.id === key)) {
      return Player.generateId();
    }

    return key;
  }

  public static addPlayer(player: Player) {
    Logger.print('Adding a player to static array', FILE_PATH);
    if (Player._instances.find((value) => value.id === player.id)) {
      return;
    }

    this._instances.push(player);
  }

  /**
   * Remove all references to a player object .
   * @param playerId
   */
  public static deletePlayer(playerId: string) {
    Logger.print(`Deleting player ${playerId} from static array`, FILE_PATH);
    const i = Player._instances.findIndex((value) => value.id === playerId);
    if (i < 0) return;

    Player._instances[i].room.deletePlayer(playerId);
    Player._instances.splice(i, 1);
  }

  /**
   * Return a player object based on their ID.
   * @param id
   */
  public static findPlayer(id: string) {
    return Player._instances.find((value) => value.id === id);
  }

  /**
   * Update the characters typed for the player.
   */
  public setTyped(typed: string) {
    this._typed = typed;
  }

  /**
   * Remove all references to the player.
   */
  public selfDestruct() {
    Logger.print(`Player ${this.id} self destructing`, FILE_PATH);
    Player.deletePlayer(this.id);
  }
}

export default Player;