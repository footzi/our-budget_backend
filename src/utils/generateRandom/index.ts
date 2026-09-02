const randomstring = require('randomstring');

export class GenerateRandom {
  /**
   * Генерация случайной строки
   */
  static string(len?: number): string {
    return randomstring.generate(len);
  }
}
