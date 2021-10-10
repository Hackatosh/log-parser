import { ParsedArgs } from 'minimist';

import { LogParserArgs } from '../typings/log-parser-args';

export const DEFAULT_FILE_PATH = `${process.cwd()}/resources/sample_csv.txt`;
export const DEFAULT_ALERT_RPS_THRESHOLD = 10;

export const parseArgs = (args: ParsedArgs): LogParserArgs => {
  let logFilePath: string;
  if (args.logFilePath === undefined) {
    logFilePath = DEFAULT_FILE_PATH;
    console.log(`logFilePath not provided. Using default logFilePath : ${logFilePath}\n`);
  } else {
    logFilePath = args.logFilePath.toString();
    console.log(`Using provided logFilePath : ${logFilePath}\n`);
  }

  let alertRpsThreshold: number;
  if (args.alertRpsThreshold === undefined) {
    alertRpsThreshold = DEFAULT_ALERT_RPS_THRESHOLD;
    console.log(`alertRpsThreshold. Using default alertRpsThreshold : ${alertRpsThreshold}\n`);
  } else {
    alertRpsThreshold = parseInt(args.alertRpsThreshold, 10);
    if (Number.isNaN(alertRpsThreshold)) {
      throw new Error(`Provided alertRpsThreshold "${args.alertRpsThreshold}" is not a number`);
    }
    if (alertRpsThreshold <= 0) {
      throw new Error(`Provided alertRpsThreshold "${alertRpsThreshold}" is inferior or equal to 0, it must be positive`);
    }
    console.log(`Using provided alertRpsThreshold : ${alertRpsThreshold}\n`);
  }

  return { logFilePath, alertRpsThreshold };
};
