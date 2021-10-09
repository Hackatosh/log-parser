import { Transform, TransformCallback } from 'stream';

import { ParsedLogLine } from '../typings/log-line';
import { AlertFired, AlertResolved } from '../typings/alert-message';
import { TimestampArray } from '../helpers/timestamp-array';

export class AlertsLogicTransform extends Transform {
  private readonly _timeIntervalStored;

  private readonly _totalRequestsThreshold;

  private _timestampArray: TimestampArray;

  private _isFiring: boolean;

  constructor(requestsPerSecondThreshold: number = 10) {
    // You read parsed log file line and push stats report
    super({ readableObjectMode: true, writableObjectMode: true });
    this._timeIntervalStored = 120; // 2 minutes
    this._totalRequestsThreshold = this._timeIntervalStored * requestsPerSecondThreshold;
    this._isFiring = false; // Initially not firing
    this._timestampArray = new TimestampArray();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _transform(parsedLogLine: ParsedLogLine, _: BufferEncoding, callback: TransformCallback): void {
    this._timestampArray.add(parsedLogLine.timestamp);
    // If need to keep only two minutes, or else we will count more requests than needed
    if (this._timestampArray.min + this._timeIntervalStored < parsedLogLine.timestamp) {
      this._timestampArray.removeBelow(parsedLogLine.timestamp - this._timeIntervalStored);
    }

    const totalRequestsForTimeInterval = this._timestampArray.length;
    if (!this._isFiring && totalRequestsForTimeInterval > this._totalRequestsThreshold) {
      this._isFiring = true;
      this.push(new AlertFired(totalRequestsForTimeInterval, this._timestampArray.min));
    } else if (this._isFiring && totalRequestsForTimeInterval < this._totalRequestsThreshold) {
      this._isFiring = false;
      this.push(new AlertResolved(this._timestampArray.min));
    }

    callback();
  }
}
