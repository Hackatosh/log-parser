import { Transform, TransformCallback } from 'stream';

import { ParsedLogLine } from '../typings/log-line';
import { AlertMessage } from '../typings/alert-message';

export class AlertsLogicTransform extends Transform {
  constructor() {
    // You read parsed log file line and push stats report
    super({ readableObjectMode: true, writableObjectMode: true });
  }

  private _ingestParsedLogFileLine(parsedLogLine: ParsedLogLine): boolean {
    // TODO
    return false;
  }

  private _generateAlerts(): Array<AlertMessage> {
    // TODO
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _transform(chunk: ParsedLogLine, encoding: BufferEncoding, callback: TransformCallback): void {
    try {
      this._ingestParsedLogFileLine(chunk);
      for (const alert of this._generateAlerts()) {
        this.push(alert);
      }
      callback();
    } catch (e) {
      callback(e);
    }
  }
}
