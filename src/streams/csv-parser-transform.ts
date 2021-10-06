import { Transform, TransformCallback } from 'stream';

import { ParsedLogLine } from '../typing';

export class CsvParserTransform extends Transform {
  constructor() {
    // You read csv line and push parsed log file line
    super({ readableObjectMode: false, writableObjectMode: true });
  }

  public static parseCSV(csvLine: string): ParsedLogLine {
    // TODO
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _transform(chunk: string, encoding: BufferEncoding, callback: TransformCallback): void {
    try {
      const parsedLogFileLine = CsvParserTransform.parseCSV(chunk);
      this.push(parsedLogFileLine);
      callback();
    } catch (e) {
      callback(e);
    }
  }
}
