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
   *
   * @param {string} a - 1 строка
   * @param {string} b - 2 строка
   */
  static async compare(a: string, b: string): Promise<boolean> {
    return await bcrypt.compare(a, b);
  }
}
