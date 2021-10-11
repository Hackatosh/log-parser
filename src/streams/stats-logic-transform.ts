import { Transform, TransformCallback } from 'stream';

import { ParsedLogLine } from '../typings/log-line';
import { StatsReport } from '../typings/stats-report';
import { getSectionFromRoute } from '../helpers/get-section-from-route';

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
      sectionStats: {},
      statusesStats: {},
      requestsStats: {},
      totalHits: 0,
      startTimestamp: null,
      endTimestamp: null,
    };
  }

  private _ingestParsedLogFileLine(parsedLogLine: ParsedLogLine): void {
    // Sanity check
    if (this._statsReport.startTimestamp && parsedLogLine.timestamp < this._statsReport.startTimestamp) {
      // The request is "too late" for the current report and should not be pushed in the reports
      return;
    }

    // In case we have just reset _statsReport
    if (!this._statsReport.startTimestamp) {
      this._statsReport.startTimestamp = parsedLogLine.timestamp;
      this._statsReport.endTimestamp = parsedLogLine.timestamp + this._timeBeforeFlushInSeconds;
    }

    this._statsReport.totalHits += 1;

    const section = getSectionFromRoute(parsedLogLine.requestRoute);
    if (!this._statsReport.sectionStats[section]) {
      this._statsReport.sectionStats[section] = 1;
    } else {
      this._statsReport.sectionStats[section] += 1;
    }

    const request = `${parsedLogLine.requestMethod} ${parsedLogLine.requestRoute}`;
    if (!this._statsReport.requestsStats[request]) {
      this._statsReport.requestsStats[request] = 1;
    } else {
      this._statsReport.requestsStats[request] += 1;
    }

    if (!this._statsReport.statusesStats[parsedLogLine.status]) {
      this._statsReport.statusesStats[parsedLogLine.status] = 1;
    } else {
      this._statsReport.statusesStats[parsedLogLine.status] += 1;
    }
  }

  private _shouldPushStatsReport(parsedLogLine: ParsedLogLine): boolean {
    return this._statsReport.startTimestamp &&
    parsedLogLine.timestamp - this._statsReport.startTimestamp > this._timeBeforeFlushInSeconds;
  }

  private _pushStatsReport(): void {
    // We "clone" the object to avoid any problem we could encounter by call this.push(this._statsReport)
    // and modifying this._statsReport
    // We don't need to "deep clone" the object because we call this._resetStatsReport immediately afterward
    this.push({ ...this._statsReport });
    this._resetStatsReport();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _transform(parsedLogLine: ParsedLogLine, _: BufferEncoding, callback: TransformCallback): void {
    try {
      if (this._shouldPushStatsReport(parsedLogLine)) {
        this._pushStatsReport();
      }
      this._ingestParsedLogFileLine(parsedLogLine);
      callback();
    } catch (err) /* istanbul ignore next */ {
      callback(err);
    }
  }

  _flush(callback: TransformCallback): void {
    try {
      this._pushStatsReport();
      callback();
    } catch (err) /* istanbul ignore next */ {
      callback(err);
    }
  }
}
