import { ParsedArgs } from 'minimist';

import { LogParserArgs } from '../typings/log-parser-args';

export const DEFAULT_FILE_PATH = `${process.cwd()}/resources/sample_csv.txt`;
export const DEFAULT_ALERT_RPS_THRESHOLD = 10;

export const parseArgs = (args: ParsedArgs): LogParserArgs => {
  let logFilePath: string;
  if (!args.logFilePath) {
    logFilePath = DEFAULT_FILE_PATH;
    console.log(`logFilePath not provided. Using default logFilePath : ${logFilePath}`);
  } else {
    logFilePath = args.logFilePath.toString();
    console.log(`Using provided logFilePath : ${logFilePath}`);
  }

  let alertRpsThreshold: number;
  if (!args.alertRpsThreshold) {
    alertRpsThreshold = DEFAULT_ALERT_RPS_THRESHOLD;
    console.log(`alertRpsThreshold. Using default alertRpsThreshold : ${alertRpsThreshold}`);
  } else {
    alertRpsThreshold = Number(args.alertRpsThreshold);
    if (Number.isNaN(alertRpsThreshold)) {
      throw new Error(`Provided alertRpsThreshold "${args.alertRpsThreshold}" is not a number`);
    }
    console.log(`Using provided alertRpsThreshold : ${alertRpsThreshold}`);
  }

  return { logFilePath, alertRpsThreshold };
};
