import { DisplayStatsWritable } from '../../streams/display-stats-writable';
import { StatsReport } from '../../typings/stats-report';

import SpyInstance = jest.SpyInstance;

describe('Display Stats Messages', () => {
  let consoleLogMock: SpyInstance;
  let displayStatsWritable: DisplayStatsWritable;

  const callWrite = (statsReport: StatsReport): Promise<void> =>
    new Promise((res, rej) => displayStatsWritable._write(statsReport, undefined, (err) => (err ? rej(err) : res(null))));

  beforeEach(() => {
    consoleLogMock = jest.spyOn(console, 'log').mockImplementation();
    displayStatsWritable = new DisplayStatsWritable();
  });

  afterEach(() => {
    displayStatsWritable = null;
    consoleLogMock.mockRestore();
  });
  test('Should correctly display a stats message', async () => {
    // You have 11 requests
    // 6 on GET /api/users with 4 status 200 and 2 status 404
    // 4 on POST /api/dogs with 3 status 200 and 1 400
    // 1 on GET /api/out-of-luck with 1 status 500
    const statsReport: StatsReport = {
      startTimestamp: 1549573860,
      endTimestamp: 1549573870,
      totalHits: 11,
      requestsStats: {
        'GET /api/users': 6,
        'GET /api/out-of-luck': 1,
        'POST /api/dogs': 4,
      },
      statusesStats: {
        500: 1,
        404: 2,
        200: 7,
        400: 1,
      }
    };

    const expectedMessage = '# Request statistics from 07-02-2019 22:11:00 to 07-02-2019 22:11:10\n' +
    '# Show number of hits for each HTTP Status (desc)\n' +
    'Status 200 - 7 requests\n' +
    'Status 404 - 2 requests\n' +
    'Status 400 - 1 requests\n' +
    'Status 500 - 1 requests\n' +
    '# Show number of hits for each request (desc)\n' +
    'Request "GET /api/users" - 6 requests\n' +
    'Request "POST /api/dogs" - 4 requests\n' +
    'Request "GET /api/out-of-luck" - 1 requests\n' +
    '# Show total number of hits\n' +
    'Total - 11 requests\n';

    await callWrite(statsReport);
    expect(consoleLogMock).toHaveBeenCalledTimes(1);
    expect(consoleLogMock).toBeCalledWith(expectedMessage);
  });
});
