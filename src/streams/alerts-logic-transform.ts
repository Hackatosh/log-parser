import { Transform, TransformCallback } from 'stream';

import { ParsedLogLine } from '../typings/log-line';
import { AlertFired, AlertResolved } from '../typings/alert-message';
import { TimestampArray } from '../helpers/timestamp-array';

export class AlertsLogicTransform extends Transform {
  private readonly _timeIntervalStored;

  private readonly _totalRequestsThreshold;

  private _timestampArray: TimestampArray;

  private _isFiring: boolean;

  constructor(alertRpsThreshold: number = 10) {
    // You read parsed log file line and push stats report
    super({ readableObjectMode: true, writableObjectMode: true });
    this._timeIntervalStored = 120; // 2 minutes
    this._totalRequestsThreshold = this._timeIntervalStored * alertRpsThreshold;
    this._isFiring = false; // Initially not firing
    this._timestampArray = new TimestampArray();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _transform(parsedLogLine: ParsedLogLine, _: BufferEncoding, callback: TransformCallback): void {
    try {
      // Here, we have made the choice to discard the log line if it is earlier that the time interval we are storing
      if (this._timestampArray.max && parsedLogLine.timestamp < this._timestampArray.max - this._timeIntervalStored) {
        callback();
        return;
      }

      // If need to keep only two minutes, or else we will count more requests than needed
      if (this._timestampArray.min + this._timeIntervalStored < parsedLogLine.timestamp) {
        this._timestampArray.removeBelow(parsedLogLine.timestamp - this._timeIntervalStored);
      }

      this._timestampArray.add(parsedLogLine.timestamp);

      const totalRequestsForTimeInterval = this._timestampArray.length;
      if (!this._isFiring && totalRequestsForTimeInterval >= this._totalRequestsThreshold) {
        this._isFiring = true;
        this.push(new AlertFired(totalRequestsForTimeInterval, this._timestampArray.max));
      } else if (this._isFiring && totalRequestsForTimeInterval < this._totalRequestsThreshold) {
        this._isFiring = false;
        this.push(new AlertResolved(this._timestampArray.max));
      }

      callback();
    } catch (err) /* istanbul ignore next */ {
      callback(err);
    }
  }
}
