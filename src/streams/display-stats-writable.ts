import { Writable } from 'stream';

import { StatsReport } from '../typings/stats-report';

export class DisplayStatsWritable extends Writable {
  constructor() {
    super({ objectMode: true });
  }

  private _displayStatsReport(statsReport: StatsReport): void {
    console.log(statsReport);
  }

  _write(chunk: StatsReport, encoding: BufferEncoding, callback: (error?: (Error | null)) => void): void {
    this._displayStatsReport(chunk);
    callback();
  }
}
