import { formatTimestamp } from '../helpers/format-timestamp';

describe('Format timestamp', () => {
  test('Should correctly format a timestamp', () => {
    expect(formatTimestamp(1549573860)).toEqual('07-02-2019 22:11:00');
  });
});
