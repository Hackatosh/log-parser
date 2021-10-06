/* istanbul ignore file */
import { createReadStream } from 'fs';

import { CsvParserTransform } from './streams/csv-parser-transform';
import { AlertsLogicTransform } from './streams/alerts-logic-transform';
import { StatsLogicTransform } from './streams/stats-logic-transform';
import { DisplayStatsWritable } from './streams/display-stats-writable';
import { DisplayAlertsWritable } from './streams/display-alerts-writable';

const path = '/test';

const readStream = createReadStream(path);
const csvParserTransform = new CsvParserTransform();
const alertsLogicTransform = new AlertsLogicTransform();
const statsLogicTransform = new StatsLogicTransform();
const displayStatsWritable = new DisplayStatsWritable();
const displayAlertsWritable = new DisplayAlertsWritable();

readStream.pipe(csvParserTransform);
csvParserTransform.pipe(alertsLogicTransform);
csvParserTransform.pipe(statsLogicTransform);
alertsLogicTransform.pipe(displayAlertsWritable);
statsLogicTransform.pipe(displayStatsWritable);
