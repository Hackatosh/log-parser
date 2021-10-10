import { DisplayAlertsWritable } from '../../streams/display-alerts-writable';
import { AlertFired, AlertMessage, AlertResolved } from '../../typings/alert-message';

import SpyInstance = jest.SpyInstance;

describe('Display Alert Messages', () => {
  let consoleLogMock: SpyInstance;
  let displayAlertsWritable: DisplayAlertsWritable;

  const callWrite = (alert: AlertMessage): Promise<void> =>
    new Promise((res, rej) => displayAlertsWritable._write(alert, undefined, (err) => (err ? rej(err) : res())));

  beforeEach(() => {
    consoleLogMock = jest.spyOn(console, 'log').mockImplementation();
    displayAlertsWritable = new DisplayAlertsWritable();
  });

  afterEach(() => {
    displayAlertsWritable = null;
    consoleLogMock.mockRestore();
  });

  test('Should correctly display a fired alert message', async () => {
    const alert = new AlertFired(4, 1549573860);
    const expectedMessage = 'High traffic generated an alert - hits = 4, triggered at time = 07-02-2019 22:11:00\n';

    await callWrite(alert);
    expect(consoleLogMock).toHaveBeenCalledTimes(1);
    expect(consoleLogMock).toBeCalledWith(expectedMessage);
  });

  test('Should correctly display a resolved alert message', async () => {
    const alert = new AlertResolved(1549573860);
    const expectedMessage = 'High traffic alert resolved - resolved at time = 07-02-2019 22:11:00\n';

    await callWrite(alert);
    expect(consoleLogMock).toHaveBeenCalledTimes(1);
    expect(consoleLogMock).toBeCalledWith(expectedMessage);
  });

  test('Should log an error for unknown alert message', async () => {
    const alert = { messageType: 'unknownAlertType' };
    const expectedMessage = 'Trying to display unknown alert message type : unknownAlertType\n';

    await callWrite(alert as AlertMessage);
    expect(consoleLogMock).toHaveBeenCalledTimes(1);
    expect(consoleLogMock).toBeCalledWith(expectedMessage);
  });
});
