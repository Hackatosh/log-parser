// This structure is used for alerting
// You use this structure to store the timestamps of requests made to a certain route

import { locationOf } from './binary-search';

export class TimestampArray {
  _array: Array<number>;

  constructor() {
    this._array = [];
  }

  public add(element: number): void {
    this._array.splice(locationOf(element, this._array) + 1, 0, element);
  }

  public removeBelow(minValue: number): void {
    this._array.splice(0, locationOf(minValue, this._array));
  }

  get length(): number {
    return this._array.length;
  }

  get min(): number {
    return this._array.length > 0 ? this._array[0] : null;
  }

  get max(): number {
    return this._array.length > 0 ? this._array[0] : null;
  }
}
