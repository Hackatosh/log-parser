/* istanbul ignore file */
import { createReadStream } from 'fs';
import { Stream } from 'stream';

import minimist from 'minimist';

import { CsvParserTransform } from './streams/csv-parser-transform';
import { AlertsLogicTransform } from './streams/alerts-logic-transform';
import { StatsLogicTransform } from './streams/stats-logic-transform';
import { DisplayStatsWritable } from './streams/display-stats-writable';
import { DisplayAlertsWritable } from './streams/display-alerts-writable';
import { LogParserArgs } from './typings/log-parser-args';
import { parseArgs } from './helpers/parse-args';

const main = (logParserArgs: LogParserArgs): void => {
  const fileReadStream = createReadStream(logParserArgs.logFilePath);
  fileReadStream.on('error', (err) => {
    console.log(`Error while reading file, process will exit. Error : ${err}`);
    process.exit(1);
  });

  const csvParserTransform = new CsvParserTransform();
  const alertsLogicTransform = new AlertsLogicTransform();
  const statsLogicTransform = new StatsLogicTransform();
  const displayStatsWritable = new DisplayStatsWritable();
  const displayAlertsWritable = new DisplayAlertsWritable();

  const attachErrorHandler = (stream: Stream): Stream => stream.on('error', (err) => {
    console.log(`Unexpected error, process will exit. Error : ${err}`);
    process.exit(1);
  });
  [csvParserTransform, alertsLogicTransform, statsLogicTransform, displayStatsWritable, displayAlertsWritable].forEach(attachErrorHandler);

  fileReadStream.pipe(csvParserTransform);
  csvParserTransform.pipe(alertsLogicTransform);
  csvParserTransform.pipe(statsLogicTransform);
  alertsLogicTransform.pipe(displayAlertsWritable);
  statsLogicTransform.pipe(displayStatsWritable);
};

main(parseArgs(minimist(process.argv.slice(2))));
