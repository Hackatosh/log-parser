import { Transform, TransformCallback } from 'stream';

import { ParsedLogLine } from '../typings/log-line';
import { StatsReport } from '../typings/stats-report';

export class StatsLogicTransform extends Transform {
  private readonly _timeBeforeFlushInSeconds: number;

  private _statsReport: StatsReport;

  constructor(timeBeforeFlushInSeconds: number = 10) {
    // You read parsed log file line and push stats report
    super({ readableObjectMode: true, writableObjectMode: true });
    this._timeBeforeFlushInSeconds = timeBeforeFlushInSeconds;
    this._resetStatsReport();
  }

  private _resetStatsReport(): void {
    this._statsReport = {
      statusesStats: {},
      requestsStats: {},
      totalHits: 0,
      startTimestamp: null,
      endTimestamp: null,
    };
  }

  private _ingestParsedLogFileLine(parsedLogLine: ParsedLogLine): void {
    this._statsReport.totalHits += 1;

    if (this._statsReport.startTimestamp) {
      this._statsReport.startTimestamp = parsedLogLine.timestamp;
      this._statsReport.endTimestamp = parsedLogLine.timestamp + this._timeBeforeFlushInSeconds;
    }

    const request = `${parsedLogLine.requestMethod} ${parsedLogLine.requestRoute}`;
    if (!this._statsReport.requestsStats[request]) {
      this._statsReport.requestsStats[request] = 1;
    } else {
      this._statsReport.requestsStats[request] += 1;
    }

    if (!this._statsReport.statusesStats[parsedLogLine.status]) {
      this._statsReport.requestsStats[parsedLogLine.status] = 1;
    } else {
      this._statsReport.requestsStats[parsedLogLine.status] += 1;
    }
  }

  private _shouldPushStatsReport(parsedLogLine: ParsedLogLine): boolean {
    return this._statsReport.startTimestamp &&
    parsedLogLine.timestamp - this._statsReport.startTimestamp > this._timeBeforeFlushInSeconds;
  }

  private _pushStatsReport(): void {
    this.push({ ...this._statsReport });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _transform(parsedLogLine: ParsedLogLine, _: BufferEncoding, callback: TransformCallback): void {
    if (this._shouldPushStatsReport(parsedLogLine)) {
      this._pushStatsReport();
      this._resetStatsReport();
    }
    this._ingestParsedLogFileLine(parsedLogLine);
    callback();
  }

  _flush(callback: TransformCallback): void {
    this._pushStatsReport();
    callback();
  }
}
