import { Writable } from 'stream';

import moment from 'moment';

import { AlertFired, AlertMessage, AlertMessageType, AlertResolved } from '../typings/alert-message';

export class DisplayAlertsWritable extends Writable {
  constructor() {
    super({ objectMode: true });
  }

  private _displayAlert(alertMessage: AlertMessage): void {
    const formatTimestamp = (timestamp: number): string => moment(timestamp * 1000).format('DD-MM-YYYY HH:mm:ss');
    switch (alertMessage.messageType) {
      case AlertMessageType.FIRED: {
        const { request, hits, timestamp } = alertMessage as AlertFired;
        console.log(`High traffic generated an alert - request="${request}", hits = ${hits}, triggered at time = ${formatTimestamp(timestamp)}`);
        break;
      }
      case AlertMessageType.RESOLVED: {
        const { request, timestamp } = alertMessage as AlertResolved;
        console.log(`High traffic alert resolved - request="${request}", resolved at time = ${formatTimestamp(timestamp)}`);
        break;
      }
      default:
        console.log(`Trying to display unknown alert message type : ${alertMessage.messageType}`);
    }
  }

  _write(alertMessage: AlertMessage, _: BufferEncoding, callback: (error?: (Error | null)) => void): void {
    this._displayAlert(alertMessage);
    callback();
  }
}
