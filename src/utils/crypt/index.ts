// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

export class Crypt {
  /**
   * Хэширование строки
   *
   * @param {string} string - строка
   * @param {number} level - уровень
   */
  static async hash(string: string, level: number | undefined = 10): Promise<string> {
    return await bcrypt.hash(string, level);
  }

  /**
   * Сравнение двух строк
   */
  static async compare(plaintText: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plaintText, hash);
  }
}
