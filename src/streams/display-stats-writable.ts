import { Writable } from 'stream';

import { StatsReport, StatsReportForDisplay } from '../typings/stats-report';
import { formatTimestamp } from '../helpers/format-timestamp';

export class DisplayStatsWritable extends Writable {
  constructor() {
    super({ objectMode: true });
  }

  private static _convertStatsReportForDisplay(statsReport: StatsReport): StatsReportForDisplay {
    const sectionStats = Object.entries(statsReport.sectionStats)
      .map(([section, hits]) => ({ section, hits }))
      .sort((a, b) => (a.hits > b.hits ? -1 : 1));
    const requestsStats = Object.entries(statsReport.requestsStats)
      .map(([request, hits]) => ({ request, hits }))
      .sort((a, b) => (a.hits > b.hits ? -1 : 1));
    const statusesStats = Object.entries(statsReport.statusesStats)
      .map(([status, hits]) => ({ status: Number(status), hits }))
      .sort((a, b) => (a.hits > b.hits ? -1 : 1));
    const { totalHits, endTimestamp, startTimestamp } = statsReport;
    return { sectionStats, statusesStats, requestsStats, totalHits, endTimestamp, startTimestamp };
  }

  private static _displayStatsReport(statsReport: StatsReportForDisplay): void {
    const welcomeString = `# Request statistics from ${formatTimestamp(statsReport.startTimestamp)} to ${formatTimestamp(statsReport.endTimestamp)}`;

    const sectionHelpString = '# Show number of hits for each section (desc)';
    const sectionStatsString = statsReport.sectionStats
      .map(({ section, hits }) => `Section "${section}" - ${hits} requests`)
      .join('\n');

    const requestsHelpString = '# Show number of hits for each request (desc)';
    const requestsStatsString = statsReport.requestsStats
      .map(({ request, hits }) => `Request "${request}" - ${hits} requests`)
      .join('\n');

    const statusesHelpString = '# Show number of hits for each HTTP Status (desc)';
    const statusesStatsString = statsReport.statusesStats
      .map(({ status, hits }) => `Status ${status} - ${hits} requests`)
      .join('\n');

    const totalHitsHelpString = '# Show total number of hits';
    const totalHitsString = `Total - ${statsReport.totalHits} requests\n`; // It's prettier this way with the \n

    const stringToDisplay = [
      welcomeString,
      sectionHelpString,
      sectionStatsString,
      requestsHelpString,
      requestsStatsString,
      statusesHelpString,
      statusesStatsString,
      totalHitsHelpString,
      totalHitsString,
    ]
      .join('\n');
    console.log(stringToDisplay);
  }

  _write(statsReport: StatsReport, encoding: BufferEncoding, callback: (error?: (Error | null)) => void): void {
    try {
      const convertedStatsReport = DisplayStatsWritable._convertStatsReportForDisplay(statsReport);
      DisplayStatsWritable._displayStatsReport(convertedStatsReport);
      callback();
    } catch (err) /* istanbul ignore next */ {
      callback(err);
    }
  }
}
