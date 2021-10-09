import { ParsedArgs } from 'minimist';

import { LogParserArgs } from '../typings/log-parser-args';

const DEFAULT_FILE_PATH = `${process.cwd()}/resources/sample_csv.txt`;

export const parseArgs = (args: ParsedArgs): LogParserArgs => {
  let logFilePath: string;
  if (!args.logFilePath) {
    logFilePath = DEFAULT_FILE_PATH;
    console.log(`logFilePath not provided. Using default logFilePath : ${logFilePath}`);
  } else {
    logFilePath = args.logFilePath.toString();
    console.log(`Using provided logFilePath : ${logFilePath}`);
  }
  return { logFilePath };
};
