import { ParsedLogLine } from '../../typings/log-line';
import { StatsLogicTransform } from '../../streams/stats-logic-transform';

import SpyInstance = jest.SpyInstance;

describe('Parse CSV Lines', () => {
  let statsLogicTransform: StatsLogicTransform;
  let pushMock: SpyInstance;

  const baseTimestamp = 1549573860;

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

  const callFlush = (): Promise<void> =>
    new Promise((res, rej) => statsLogicTransform._flush((err) => (err ? rej(err) : res())));

  beforeEach(() => {
    statsLogicTransform = new StatsLogicTransform();
    pushMock = jest.spyOn(statsLogicTransform, 'push').mockImplementation();
  });

  afterEach(() => {
    pushMock.mockRestore();
    statsLogicTransform = null;
  });

  test('Should not push if you have multiple request before threshold is reached', async () => {
    await callTransform(generateLogLine(baseTimestamp + 1, 'GET', '/api/users', 200));
    await callTransform(generateLogLine(baseTimestamp + 2, 'GET', '/api/users', 200));
    await callTransform(generateLogLine(baseTimestamp + 3, 'GET', '/api/users', 200));
    await callTransform(generateLogLine(baseTimestamp + 4, 'GET', '/api/users', 200));
    await callTransform(generateLogLine(baseTimestamp + 5, 'GET', '/api/users', 200));

    expect(pushMock).toHaveBeenCalledTimes(0);
  });

  test('Should push if threshold is reached', async () => {
    await callTransform(generateLogLine(baseTimestamp + 1, 'GET', '/api/users', 200));
    await callTransform(generateLogLine(baseTimestamp + 12, 'GET', '/api/users', 200));

    expect(pushMock).toHaveBeenCalledTimes(1);
  });

  test('Should push multiple reports if threshold is reached multiple time', async () => {
    await callTransform(generateLogLine(baseTimestamp + 1, 'GET', '/api/users', 200));
    await callTransform(generateLogLine(baseTimestamp + 12, 'GET', '/api/users', 200));
    await callTransform(generateLogLine(baseTimestamp + 23, 'GET', '/api/users', 200));

    expect(pushMock).toHaveBeenCalledTimes(2);
  });

  test('Should correctly push one stats report', async () => {
    const expectedStatsReport = {
      startTimestamp: 1549573861,
      endTimestamp: 1549573871,
      totalHits: 8,
      requestsStats: {
        'GET /api/users': 5,
        'POST /api/dogs': 3,
      },
      statusesStats: {
        200: 5,
        404: 2,
        500: 1,
      },
    };

    await callTransform(generateLogLine(baseTimestamp + 1, 'GET', '/api/users', 200));
    await callTransform(generateLogLine(baseTimestamp + 1, 'GET', '/api/users', 200));
    await callTransform(generateLogLine(baseTimestamp + 2, 'POST', '/api/dogs', 200));
    await callTransform(generateLogLine(baseTimestamp + 2, 'POST', '/api/dogs', 200));
    await callTransform(generateLogLine(baseTimestamp + 2, 'GET', '/api/users', 200));
    await callTransform(generateLogLine(baseTimestamp + 2, 'GET', '/api/users', 404));
    await callTransform(generateLogLine(baseTimestamp + 3, 'GET', '/api/users', 404));
    await callTransform(generateLogLine(baseTimestamp + 5, 'POST', '/api/dogs', 500));

    expect(pushMock).toHaveBeenCalledTimes(0);

    // Trigger flush
    await callTransform(generateLogLine(baseTimestamp + 15, 'POST', '/api/dogs', 500));

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith(expectedStatsReport);
  });

  test('Should not add request to report if it is too old', async () => {
    const expectedStatsReport = {
      startTimestamp: 1549573862,
      endTimestamp: 1549573872,
      requestsStats: {
        'GET /api/users': 1,
      },
      statusesStats: {
        200: 1,
      },
      totalHits: 1,
    };

    await callTransform(generateLogLine(baseTimestamp + 2, 'GET', '/api/users', 200));
    await callTransform(generateLogLine(baseTimestamp + 1, 'GET', '/api/users', 200));
    await callTransform(generateLogLine(baseTimestamp + 13, 'GET', '/api/users', 200));

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith(expectedStatsReport);
  });

  test('Should correctly push one report on flush', async () => {
    const expectedStatsReport = {
      startTimestamp: 1549573861,
      endTimestamp: 1549573871,
      totalHits: 8,
      requestsStats: {
        'GET /api/users': 5,
        'POST /api/dogs': 3,
      },
      statusesStats: {
        200: 5,
        404: 2,
        500: 1,
      },
    };

    await callTransform(generateLogLine(baseTimestamp + 1, 'GET', '/api/users', 200));
    await callTransform(generateLogLine(baseTimestamp + 1, 'GET', '/api/users', 200));
    await callTransform(generateLogLine(baseTimestamp + 2, 'POST', '/api/dogs', 200));
    await callTransform(generateLogLine(baseTimestamp + 2, 'POST', '/api/dogs', 200));
    await callTransform(generateLogLine(baseTimestamp + 2, 'GET', '/api/users', 200));
    await callTransform(generateLogLine(baseTimestamp + 2, 'GET', '/api/users', 404));
    await callTransform(generateLogLine(baseTimestamp + 3, 'GET', '/api/users', 404));
    await callTransform(generateLogLine(baseTimestamp + 5, 'POST', '/api/dogs', 500));

    expect(pushMock).toHaveBeenCalledTimes(0);

    await callFlush();

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith(expectedStatsReport);
  });

  test('Should correctly push two stats reports', async () => {
    const firstExpectedStatsReport = {
      startTimestamp: 1549573861,
      endTimestamp: 1549573871,
      totalHits: 8,
      requestsStats: {
        'GET /api/users': 5,
        'POST /api/dogs': 3,
      },
      statusesStats: {
        200: 5,
        404: 2,
        500: 1,
      },
    };

    const secondExpectedStatsReport = {
      startTimestamp: 1549573875,
      endTimestamp: 1549573885,
      totalHits: 9,
      requestsStats: {
        'GET /api/users': 4,
        'POST /api/dogs': 5,
      },
      statusesStats: {
        200: 6,
        400: 1,
        500: 2,
      },
    };

    await callTransform(generateLogLine(baseTimestamp + 1, 'GET', '/api/users', 200));
    await callTransform(generateLogLine(baseTimestamp + 1, 'GET', '/api/users', 200));
    await callTransform(generateLogLine(baseTimestamp + 2, 'POST', '/api/dogs', 200));
    await callTransform(generateLogLine(baseTimestamp + 2, 'POST', '/api/dogs', 200));
    await callTransform(generateLogLine(baseTimestamp + 2, 'GET', '/api/users', 200));
    await callTransform(generateLogLine(baseTimestamp + 2, 'GET', '/api/users', 404));
    await callTransform(generateLogLine(baseTimestamp + 3, 'GET', '/api/users', 404));
    await callTransform(generateLogLine(baseTimestamp + 5, 'POST', '/api/dogs', 500));

    expect(pushMock).toHaveBeenCalledTimes(0);

    // Building second report, this will trigger the push for the first one
    await callTransform(generateLogLine(baseTimestamp + 15, 'POST', '/api/dogs', 500));
    await callTransform(generateLogLine(baseTimestamp + 15, 'GET', '/api/users', 200));
    await callTransform(generateLogLine(baseTimestamp + 16, 'GET', '/api/users', 200));
    await callTransform(generateLogLine(baseTimestamp + 16, 'GET', '/api/users', 200));
    await callTransform(generateLogLine(baseTimestamp + 16, 'POST', '/api/dogs', 200));
    await callTransform(generateLogLine(baseTimestamp + 16, 'POST', '/api/dogs', 200));
    await callTransform(generateLogLine(baseTimestamp + 17, 'POST', '/api/dogs', 400));
    await callTransform(generateLogLine(baseTimestamp + 19, 'POST', '/api/dogs', 500));
    await callTransform(generateLogLine(baseTimestamp + 23, 'GET', '/api/users', 200));

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith(firstExpectedStatsReport);

    // Trigger flush of second report
    await callTransform(generateLogLine(baseTimestamp + 26, 'POST', '/api/dogs', 400));

    expect(pushMock).toHaveBeenCalledTimes(2);
    expect(pushMock).toHaveBeenNthCalledWith(2, secondExpectedStatsReport);
  });
});
