import { Transform, TransformCallback } from 'stream';

import { ParsedLogLine } from '../typings/log-line';
import { StatsReport } from '../typings/stats-report';

export class StatsLogicTransform extends Transform {
  constructor() {
    // You read parsed log file line and push stats report
    super({ readableObjectMode: true, writableObjectMode: true });
  }

  private _ingestParsedLogFileLine(parsedLogLine: ParsedLogLine): boolean {
    // TODO
    return false;
  }

  private _shouldWriteStats(): boolean {
    // TODO
    return false;
  }

  private _generateStatsReport(): StatsReport {
    // TODO
    return null;
  }

  private _flushData(): StatsReport {
    // TODO
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _transform(chunk: ParsedLogLine, encoding: BufferEncoding, callback: TransformCallback): void {
    try {
      this._ingestParsedLogFileLine(chunk);
      if (this._shouldWriteStats()) {
        this.push(this._generateStatsReport());
        this._flushData();
      }
      callback();
    } catch (e) {
      callback(e);
    }
  }
}
