import { Transform, TransformCallback } from 'stream';

import { ParsedLogLine } from '../typings/log-line';

export class CsvParserTransform extends Transform {
  constructor() {
    // You read csv line and push parsed log file line
    super({ readableObjectMode: true, writableObjectMode: false });
  }

  private static _parseCSV(rawCsvLine: string): ParsedLogLine {
    // eslint-disable-next-line max-len
    const regexPattern = /"(?<remoteHost>.*)","(?<rfc931>.*)","(?<authUser>.*)",(?<timestamp>[0-9]+),"(?<requestMethod>.*) (?<requestRoute>.*) (?<requestProtocol>.*)",(?<status>[0-9]+),(?<bytes>[0-9]+)/;
    const parsed = new RegExp(regexPattern).exec(rawCsvLine);
    if (!parsed) {
      // We do not throw because emitting an error from the stream would kill the whole pipeline
      // As the error is recoverable, we just print a warning
      console.log(`Incorrect CSV line : ${rawCsvLine}\n`);
      return null;
    }
    const {
      remoteHost,
      rfc931,
      authUser,
      timestamp,
      requestMethod,
      requestRoute,
      requestProtocol,
      status,
      bytes
    } = parsed.groups;
    return {
      remoteHost,
      rfc931,
      authUser,
      timestamp: Number(timestamp),
      requestMethod,
      requestRoute,
      requestProtocol,
      status: Number(status),
      bytes: Number(bytes),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _transform(csvLine: string, _: BufferEncoding, callback: TransformCallback): void {
    try {
      const parsedLogFileLine = CsvParserTransform._parseCSV(csvLine.toString());
      if (parsedLogFileLine) {
        this.push(parsedLogFileLine);
      }
      callback();
    } catch (err) /* istanbul ignore next */ {
      callback(err);
    }
  }
}
