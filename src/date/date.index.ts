// eslint-disable-next-line @typescript-eslint/no-var-requires
const dayjs = require('dayjs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);

export class Date {
  static toFormat(date: string): any {
    return dayjs.utc(date).format();
  }
}
