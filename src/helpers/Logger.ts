/**
 * Contains static methods for printing shit to the console
 */
class Logger {
  public static readonly ANSI_CYAN = '\u001B[36m';
  public static readonly ANSI_RED = '\u001B[31m';
  public static readonly ANSI_RESET = '\u001B[0m';

  /**
   * Print a message to the console.
   * @param message The message to print.
   * @param file Indicates where the message came from.
   * @param error Whether or not the message is an error.
   */
  public static print(message: string, file: string, error?: boolean) {
    console.log(`${Logger.ANSI_CYAN}[${file}]${Logger.ANSI_RESET} ${error ? Logger.ANSI_RED : ''}${message}${error ? Logger.ANSI_RESET : ''}`);
  }
}

export default Logger;