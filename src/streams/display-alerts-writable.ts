import { Writable } from 'stream';

import { AlertFired, AlertMessage, AlertMessageType, AlertResolved } from '../typings/alert-message';
import { formatTimestamp } from '../helpers/format-timestamp';

export class DisplayAlertsWritable extends Writable {
  constructor() {
    super({ objectMode: true });
  }

  private _displayAlert(alertMessage: AlertMessage): void {
    switch (alertMessage.messageType) {
      case AlertMessageType.FIRED: {
        const { hits, timestamp } = alertMessage as AlertFired;
        console.log(`High traffic generated an alert - hits = ${hits}, triggered at time = ${formatTimestamp(timestamp)}`);
        break;
      }
      case AlertMessageType.RESOLVED: {
        const { timestamp } = alertMessage as AlertResolved;
        console.log(`High traffic alert resolved - resolved at time = ${formatTimestamp(timestamp)}`);
        break;
      }
      default:
        console.log(`Trying to display unknown alert message type : ${alertMessage.messageType}`);
    }
  }

  _write(alertMessage: AlertMessage, _: BufferEncoding, callback: (error?: (Error | null)) => void): void {
    try {
      this._displayAlert(alertMessage);
      callback();
    } catch (err) /* istanbul ignore next */ {
      callback(err);
    }
  }
}
