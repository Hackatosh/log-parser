import { Writable } from 'stream';
import { stat } from 'fs';

import { StatsReport, StatsReportForDisplay } from '../typings/stats-report';
import { formatTimestamp } from '../helpers/format-timestamp';

export class DisplayStatsWritable extends Writable {
  constructor() {
    super({ objectMode: true });
  }

  private static _convertStatsReportForDisplay(statsReport: StatsReport): StatsReportForDisplay {
    const statusesStats = Object.entries(statsReport.statusesStats)
      .map(([status, hits]) => ({ status: Number(status), hits }))
      .sort((a, b) => (a.hits > b.hits ? -1 : 1));
    const requestsStats = Object.entries(statsReport.requestsStats)
      .map(([request, hits]) => ({ request, hits }))
      .sort((a, b) => (a.hits > b.hits ? -1 : 1));
    const { totalHits, endTimestamp, startTimestamp } = statsReport;
    return { statusesStats, requestsStats, totalHits, endTimestamp, startTimestamp };
  }

  private static _displayStatsReport(statsReport: StatsReportForDisplay): void {
    const welcomeString = `# Request statistics from ${formatTimestamp(statsReport.startTimestamp)} to ${formatTimestamp(statsReport.endTimestamp)}`;

    const statusesHelpString = '# Show number of hits for each HTTP Status (desc)';
    const statusesStatsString = statsReport.statusesStats
      .map(({ status, hits }) => `Status ${status} - ${hits} requests`)
      .join('\n');

    const requestsHelpString = '# Show number of hits for each request (desc)';
    const requestsStatsString = statsReport.requestsStats
      .map(({ request, hits }) => `Request "${request}" - ${hits} requests`)
      .join('\n');

    const totalHitsHelpString = '# Show total number of hits';
    const totalHitsString = `Total ${statsReport.totalHits}`;

    const stringToDisplay = [
      welcomeString,
      statusesHelpString,
      statusesStatsString,
      requestsHelpString,
      requestsStatsString,
      totalHitsHelpString,
      totalHitsString
    ]
      .join('\n');
    // eslint-disable-next-line no-console
    console.log(stringToDisplay);
  }

  _write(statsReport: StatsReport, encoding: BufferEncoding, callback: (error?: (Error | null)) => void): void {
    const convertedStatsReport = DisplayStatsWritable._convertStatsReportForDisplay(statsReport);
    DisplayStatsWritable._displayStatsReport(convertedStatsReport);
    callback();
  }
}
