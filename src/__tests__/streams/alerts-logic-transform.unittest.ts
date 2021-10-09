import { ParsedLogLine } from '../../typings/log-line';
import { AlertsLogicTransform } from '../../streams/alerts-logic-transform';
import { AlertFired, AlertResolved } from '../../typings/alert-message';

import SpyInstance = jest.SpyInstance;

describe('Alerts Logic', () => {
  let alertsLogicTransform: AlertsLogicTransform;
  let pushMock: SpyInstance;

  const baseTimestamp = 1549573860;

  const generateLogLine = (addToBaseTimestamp: number): ParsedLogLine => ({
    remoteHost: '10.0.0.5',
    rfc931: '-',
    authUser: 'apache',
    timestamp: baseTimestamp + addToBaseTimestamp,
    requestMethod: 'GET',
    requestRoute: '/api/users',
    requestProtocol: 'HTTP/1.0',
    status: 200,
    bytes: 1234,
  });

  const callTransform = (parsedLogLine: ParsedLogLine): Promise<void> =>
    new Promise((res, rej) => alertsLogicTransform._transform(parsedLogLine, undefined, (err) => (err ? rej(err) : res())));

  const sendRequestsAtTime = async (numberOfRequests: number, addToBaseTimestamp: number): Promise<void> => {
    for (let i = 0; i < numberOfRequests; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await callTransform(generateLogLine(addToBaseTimestamp));
    }
  };

  beforeEach(() => {
    alertsLogicTransform = new AlertsLogicTransform();
    pushMock = jest.spyOn(alertsLogicTransform, 'push').mockImplementation();
  });

  afterEach(() => {
    pushMock.mockRestore();
    alertsLogicTransform = null;
  });

  test('Spike below threshold should not generate an alert', async () => {
    await sendRequestsAtTime(1199, 1);

    expect(pushMock).toHaveBeenCalledTimes(0);
  });

  test('Spike equal to threshold should generate an alert', async () => {
    await sendRequestsAtTime(1200, 1);

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith(new AlertFired(1200, baseTimestamp + 1));
  });

  test('Consecutive requests after fire should not trigger another alert', async () => {
    await sendRequestsAtTime(1200, 1);

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith(new AlertFired(1200, baseTimestamp + 1));

    await sendRequestsAtTime(1200, 10);

    expect(pushMock).toHaveBeenCalledTimes(1);
  });

  test('Should recover after an alert', async () => {
    await sendRequestsAtTime(1200, 1);

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith(new AlertFired(1200, baseTimestamp + 1));

    await sendRequestsAtTime(1, 122);

    expect(pushMock).toHaveBeenCalledTimes(2);
    expect(pushMock).toHaveBeenNthCalledWith(2, new AlertResolved(baseTimestamp + 122));
  });

  test('Should recover after an alert and trigger another one if needed', async () => {
    await sendRequestsAtTime(1200, 1);

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith(new AlertFired(1200, baseTimestamp + 1));

    await sendRequestsAtTime(1, 122);

    expect(pushMock).toHaveBeenCalledTimes(2);
    expect(pushMock).toHaveBeenNthCalledWith(2, new AlertResolved(baseTimestamp + 122));

    await sendRequestsAtTime(1199, 122);

    expect(pushMock).toHaveBeenCalledTimes(3);
    expect(pushMock).toHaveBeenNthCalledWith(3, new AlertFired(1200, baseTimestamp + 122));
  });

  test('Should discard request that are earlier than the time interval stored', async () => {
    await sendRequestsAtTime(1, 122);
    await sendRequestsAtTime(1200, 1);

    expect(pushMock).toHaveBeenCalledTimes(0);
  });
});
