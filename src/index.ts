/* istanbul ignore file */
import { createReadStream } from 'fs';
import { Stream } from 'stream';

import minimist from 'minimist';
import split2 from 'split2';

import { CsvParserTransform } from './streams/csv-parser-transform';
import { AlertsLogicTransform } from './streams/alerts-logic-transform';
import { StatsLogicTransform } from './streams/stats-logic-transform';
import { DisplayStatsWritable } from './streams/display-stats-writable';
import { DisplayAlertsWritable } from './streams/display-alerts-writable';
import { LogParserArgs } from './typings/log-parser-args';
import { parseArgs } from './helpers/parse-args';

const main = (logParserArgs: LogParserArgs): void => {
  // Creating all the streams
  const fileReadStream = createReadStream(logParserArgs.logFilePath);
  const splitByLineStream = split2();
  const csvParserTransform = new CsvParserTransform();
  const alertsLogicTransform = new AlertsLogicTransform(logParserArgs.alertRpsThreshold);
  const statsLogicTransform = new StatsLogicTransform();
  const displayStatsWritable = new DisplayStatsWritable();
  const displayAlertsWritable = new DisplayAlertsWritable();

  // Error handling
  fileReadStream.on('error', (err) => {
    console.log(`Error while reading file, process will exit. Error : ${err}`);
    process.exit(1);
  });
  const attachUnexpectedErrorHandler = (stream: Stream): Stream => stream.on('error', (err) => {
    console.log(`Unexpected error, process will exit. Error : ${err}`);
    process.exit(1);
  });
  [splitByLineStream, csvParserTransform, alertsLogicTransform, statsLogicTransform, displayStatsWritable, displayAlertsWritable]
    .forEach(attachUnexpectedErrorHandler);

  // Piping everything
  fileReadStream.pipe(splitByLineStream).pipe(csvParserTransform);
  csvParserTransform.pipe(alertsLogicTransform);
  csvParserTransform.pipe(statsLogicTransform);
  alertsLogicTransform.pipe(displayAlertsWritable);
  statsLogicTransform.pipe(displayStatsWritable);
};

try {
  main(parseArgs(minimist(process.argv.slice(2))));
} catch (err) {
  console.log(`Error happened, process will exit. ${err}`);
  process.exit(1);
}
