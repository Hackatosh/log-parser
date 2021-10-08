import { CsvParserTransform } from '../streams/csv-parser-transform';
import { ParsedLogLine } from '../typings/log-line';

import SpyInstance = jest.SpyInstance;

describe('Parse CSV Lines', () => {
  let csvParserTransform: CsvParserTransform;
  let pushMock: SpyInstance;

  beforeEach(() => {
    csvParserTransform = new CsvParserTransform();
    pushMock = jest.spyOn(csvParserTransform, 'push').mockImplementation();
  });

  afterEach(() => {
    pushMock.mockRestore();
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
    await new Promise((res, rej) => csvParserTransform._transform(Buffer.from(csvLine), undefined, (err) => (err ? rej(err) : res(null))));
    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toBeCalledWith(expectedParsedLogLine);
  });

  test('Throw error when csv line is incorrect (incorrect type)', async () => {
    const csvLine = '"10.0.0.2","-","apache",1549573860,"GET /api/user HTTP/1.0",twohundred,1234';
    const prom = new Promise((res, rej) => csvParserTransform._transform(Buffer.from(csvLine), undefined, (err) => (err ? rej(err) : res(null))));
    await expect(prom).rejects.toThrowError(new Error(`Incorrect CSV line : ${csvLine}`));
    expect(pushMock).toHaveBeenCalledTimes(0);
  });

  test('Throw error when csv line is incorrect (missing field)', async () => {
    const csvLine = '"10.0.0.2","-","apache",1549573860,200,1234';
    const prom = new Promise((res, rej) => csvParserTransform._transform(Buffer.from(csvLine), undefined, (err) => (err ? rej(err) : res(null))));
    await expect(prom).rejects.toThrowError(new Error(`Incorrect CSV line : ${csvLine}`));
    expect(pushMock).toHaveBeenCalledTimes(0);
  });
});
