/* istanbul ignore file */
import { Writable } from 'stream';

export class TestWritable extends Writable {
  constructor() {
    super({ objectMode: true });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _write(alertMessage: never, _: BufferEncoding, callback: (error?: (Error | null)) => void): void {
    // eslint-disable-next-line no-console
    console.log(alertMessage);
    callback();
  }
}
