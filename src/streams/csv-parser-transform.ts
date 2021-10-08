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
      throw new Error(`Incorrect CSV line : ${rawCsvLine}`);
    }
    const { remoteHost, rfc931, authUser, timestamp, requestMethod, requestRoute, requestProtocol, status, bytes } = parsed.groups;
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
  _transform(rawCsvLine: Buffer, _: BufferEncoding, callback: TransformCallback): void {
    try {
      const parsedLogFileLine = CsvParserTransform._parseCSV(rawCsvLine.toString());
      this.push(parsedLogFileLine);
      callback();
    } catch (e) {
      callback(e);
    }
  }
}
