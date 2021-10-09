import { ParsedLogLine } from '../typings/log-line';
import { StatsLogicTransform } from '../streams/stats-logic-transform';

import SpyInstance = jest.SpyInstance;

describe('Parse CSV Lines', () => {
  let statsLogicTransform: StatsLogicTransform;
  let pushMock: SpyInstance;

  const generateLogLine = (timestamp: number, requestMethod: string, requestRoute: string, status: number): ParsedLogLine => ({
    remoteHost: '10.0.0.5',
    rfc931: '-',
    authUser: 'apache',
    timestamp,
    requestMethod,
    requestRoute,
    requestProtocol: 'HTTP/1.0',
    status,
    bytes: 1234,
  });

  const callTransform = (parsedLogLine: ParsedLogLine): Promise<void> =>
    new Promise((res, rej) => statsLogicTransform._transform(parsedLogLine, undefined, (err) => (err ? rej(err) : res())));

  beforeEach(() => {
    statsLogicTransform = new StatsLogicTransform();
    pushMock = jest.spyOn(statsLogicTransform, 'push').mockImplementation();
  });

  afterEach(() => {
    pushMock.mockRestore();
    statsLogicTransform = null;
  });

  test('', async () => {
  });
});
