import { DEFAULT_FILE_PATH, parseArgs } from '../../helpers/parse-args';

describe('Parse args', () => {
  test('Should correctly parse minimist args', () => {
    expect(parseArgs({ _: [] })).toEqual({ logFilePath: DEFAULT_FILE_PATH });
    expect(parseArgs({ _: [], logFilePath: 'test.csv' })).toEqual({ logFilePath: 'test.csv' });
  });
});
