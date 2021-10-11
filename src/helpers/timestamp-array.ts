// This structure is used for alerting
// This structure stores the timestamps of the processed requests and keep them sorted

export class TimestampArray {
  private readonly _array: Array<number>;

  constructor() {
    this._array = [];
  }

  public add(element: number): void {
    this._array.splice(TimestampArray._locationOf(element, this._array) + 1, 0, element);
  }

  public removeBelow(minValue: number): void {
    this._array.splice(0, TimestampArray._locationOf(minValue, this._array) + 1);
  }

  public get length(): number {
    return this._array.length;
  }

  public get min(): number {
    return this._array.length > 0 ? this._array[0] : null;
  }

  public get max(): number {
    return this._array.length > 0 ? this._array[this._array.length - 1] : null;
  }

  // Get a copy of the array, for testing purpose
  public get array(): Array<number> {
    return [...this._array];
  }

  private static _locationOf(element: number, array: Array<number>): number {
    for (const [index, value] of array.entries()) {
      if (element <= value) {
        return index - 1;
      }
    }
    return array.length - 1;
  }
}
