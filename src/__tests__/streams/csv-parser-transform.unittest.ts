import { CsvParserTransform } from '../../streams/csv-parser-transform';
import { ParsedLogLine } from '../../typings/log-line';

import SpyInstance = jest.SpyInstance;

describe('Parse CSV Lines', () => {
  let csvParserTransform: CsvParserTransform;
  let pushMock: SpyInstance;
  let consoleLogMock: SpyInstance;

  const callTransform = (csvLine: string): Promise<void> =>
    new Promise((res, rej) => csvParserTransform._transform(csvLine, undefined, (err) => (err ? rej(err) : res())));

  beforeEach(() => {
    csvParserTransform = new CsvParserTransform();
    pushMock = jest.spyOn(csvParserTransform, 'push').mockImplementation();
    consoleLogMock = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    pushMock.mockRestore();
    consoleLogMock.mockRestore();
    csvParserTransform = null;
  });

  test('Correctly parse a CSV line', async () => {
    const csvLine = '"10.0.0.2","-","apache",1549573860,"GET /api/user HTTP/1.0",200,1234';
    const expectedParsedLogLine: ParsedLogLine = {
      remoteHost: '10.0.0.2',
      rfc931: '-',
      authUser: 'apache',
      timestamp: 1549573860,
      requestMethod: 'GET',
      requestRoute: '/api/user',
      requestProtocol: 'HTTP/1.0',
      status: 200,
      bytes: 1234,
    };

    await callTransform(csvLine);
    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toBeCalledWith(expectedParsedLogLine);
  });

  test('Log error when csv line is incorrect (incorrect type)', async () => {
    const csvLine = '"10.0.0.2","-","apache",1549573860,"GET /api/user HTTP/1.0",twohundred,1234';

    await callTransform(csvLine);
    expect(consoleLogMock).toHaveBeenCalledTimes(1);
    expect(consoleLogMock).toHaveBeenCalledWith(`Incorrect CSV line : ${csvLine}\n`);
    expect(pushMock).toHaveBeenCalledTimes(0);
  });

  test('Log error when csv line is incorrect (missing field)', async () => {
    const csvLine = '"10.0.0.2","-","apache",1549573860,200,1234';

    await callTransform(csvLine);
    expect(consoleLogMock).toHaveBeenCalledTimes(1);
    expect(consoleLogMock).toHaveBeenCalledWith(`Incorrect CSV line : ${csvLine}\n`);
    expect(pushMock).toHaveBeenCalledTimes(0);
  });
});
