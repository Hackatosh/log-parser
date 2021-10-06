import { Writable } from 'stream';

import { Alert } from '../typing';

export class DisplayAlertsWritable extends Writable {
  constructor() {
    super({ objectMode: true });
  }

  private _displayAlert(alert: Alert): void {
    console.log(alert);
  }

  _write(chunk: Alert, encoding: BufferEncoding, callback: (error?: (Error | null)) => void): void {
    this._displayAlert(chunk);
    callback();
  }
}
