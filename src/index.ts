/* istanbul ignore file */
import { createReadStream, read } from 'fs';
import { Writable } from 'stream';

import moment from 'moment';
import minimist from 'minimist';

import { CsvParserTransform } from './streams/csv-parser-transform';
import { AlertsLogicTransform } from './streams/alerts-logic-transform';
import { StatsLogicTransform } from './streams/stats-logic-transform';
import { DisplayStatsWritable } from './streams/display-stats-writable';
import { DisplayAlertsWritable } from './streams/display-alerts-writable';
import { AlertFired, AlertMessage, AlertMessageType, AlertResolved } from './typings/alert-message';
import { TestWritable } from './streams/test-writable-stream';

import ReadableStream = NodeJS.ReadableStream;

const DEFAULT_FILE_PATH = `${__dirname}/../resources/sample_csv.txt`;

const createFileStream = (providedFilePath?: string): ReadableStream => {
  let filePath;
  if (!filePath) {
    // eslint-disable-next-line no-console
    console.log(`Filepath not provided. Using default filepath : ${DEFAULT_FILE_PATH}`);
    filePath = DEFAULT_FILE_PATH;
  } else {
    filePath = providedFilePath.toString();
  }
  try {
    return createReadStream(filePath);
  } catch (err) {
    throw new Error(`Error while opening file at filepath : ${filePath}. File probably does not exist.`);
  }
};

const readStream = createFileStream(minimist(process.argv.slice(2)).filePath);
const csv = new CsvParserTransform();
readStream.pipe(csv).pipe(new TestWritable());
