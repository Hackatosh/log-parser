import { DEFAULT_ALERT_RPS_THRESHOLD, DEFAULT_FILE_PATH, parseArgs } from '../../helpers/parse-args';

describe('Parse args', () => {
  test('Should correctly parse minimist args', () => {
    expect(parseArgs({ _: [] })).toEqual({ logFilePath: DEFAULT_FILE_PATH, alertRpsThreshold: DEFAULT_ALERT_RPS_THRESHOLD });
    expect(parseArgs({ _: [], logFilePath: 'test.csv' })).toEqual({ logFilePath: 'test.csv', alertRpsThreshold: DEFAULT_ALERT_RPS_THRESHOLD });
    expect(parseArgs({ _: [], alertRpsThreshold: 3 })).toEqual({ logFilePath: DEFAULT_FILE_PATH, alertRpsThreshold: 3 });
    expect(() => parseArgs({ _: [], alertRpsThreshold: 'unexpected-string' }))
      .toThrow(new Error('Provided alertRpsThreshold "unexpected-string" is not a number'));
    expect(parseArgs({ _: [], logFilePath: 'test.csv', alertRpsThreshold: 3 })).toEqual({ logFilePath: 'test.csv', alertRpsThreshold: 3 });
  });
});
