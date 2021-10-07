import { DisplayAlertsWritable } from '../streams/display-alerts-writable';
import { AlertFired, AlertMessage, AlertResolved } from '../typings/alert-message';

import SpyInstance = jest.SpyInstance;

describe('Display Alert Messages', () => {
  let consoleLogMock: SpyInstance;
  let displayAlertsWritable: DisplayAlertsWritable;

  beforeEach(() => {
    consoleLogMock = jest.spyOn(console, 'log').mockImplementation();
    displayAlertsWritable = new DisplayAlertsWritable();
  });

  afterEach(() => {
    displayAlertsWritable = null;
    consoleLogMock.mockRestore();
  });

  test('Should correctly display a fired alert message', async () => {
    const alert = new AlertFired('GET /api/users', 4, 1549573860);
    const expectedMessage = 'High traffic generated an alert - request="GET /api/users", hits = 4, triggered at time = 07-02-2019 22:11:00';
    await new Promise((res, rej) => displayAlertsWritable._write(alert, undefined, (err) => (err ? rej(err) : res(null))));
    expect(consoleLogMock).toHaveBeenCalledTimes(1);
    expect(consoleLogMock).toBeCalledWith(expectedMessage);
  });

  test('Should correctly display a resolved alert message', async () => {
    const alert = new AlertResolved('GET /api/users', 1549573860);
    const expectedMessage = 'High traffic alert resolved - request="GET /api/users", resolved at time = 07-02-2019 22:11:00';
    await new Promise((res, rej) => displayAlertsWritable._write(alert, undefined, (err) => (err ? rej(err) : res(null))));
    expect(consoleLogMock).toHaveBeenCalledTimes(1);
    expect(consoleLogMock).toBeCalledWith(expectedMessage);
  });

  test('Should throw for unknown alert message', async () => {
    const alert = { messageType: 'unknownAlertType' };
    const expectedMessage = 'Trying to display unknown alert message type : unknownAlertType';
    await new Promise((res, rej) => displayAlertsWritable._write(alert as AlertMessage, undefined, (err) => (err ? rej(err) : res(null))));
    expect(consoleLogMock).toHaveBeenCalledTimes(1);
    expect(consoleLogMock).toBeCalledWith(expectedMessage);
  });
});
