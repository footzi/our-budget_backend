const dayjs = require('dayjs');

const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);

export class Date {
  static toFormat(date: string): any {
    return dayjs.utc(date).format();
  }
}
