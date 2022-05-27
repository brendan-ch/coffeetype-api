import fs from "fs";
import Logger from "./Logger";

/**
 * Utility class to load some words.
 */
class WordsLoader {
  public static readonly WORDS_FILE: string = './src/assets/words.txt';
  public static readonly words: string[] = WordsLoader.generateWords();

  /**
   * Load words from a text file.
   */
  public static generateWords() {
    Logger.print('Generating initial words', 'helpers/WordsLoader.ts');

    const string = fs.readFileSync(WordsLoader.WORDS_FILE, 'utf8');
    return string.split('\n');
  }

  /**
   * Get some random words from the words array.
   * @param num
   */
  public static getWords(num: number) {
    Logger.print('Getting some random words', 'helpers/WordsLoader.ts');
    const len = WordsLoader.words.length;

    let chars = '';
    let count = 0;
    while (count < num) {
      chars += WordsLoader.words[Math.floor(Math.random() * len)] + ' ';

      count += 1;
    }

    return chars;
  }
}

export default WordsLoader;
