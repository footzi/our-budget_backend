const randomstring = require('randomstring');

export class GenerateRandom {
  /**
   * Генерация случайной строки
   */
  static string(): string {
    return randomstring.generate();
  }
}
