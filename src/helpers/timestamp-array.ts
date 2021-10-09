// This structure is used for alerting
// You use this structure to store the timestamps of requests made to a certain route

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

  // Get a copy of the array, for testing purpose
  public get array(): Array<number> {
    return [...this._array];
  }

  private static _recursiveLocationOf(element: number, array: Array<number>, start: number, end: number): number {
    const pivot = Math.floor(start + ((end - start) / 2));
    if (array[pivot] === element) return pivot;
    if (end - start <= 1) return array[pivot] > element ? pivot - 1 : pivot;
    if (array[pivot] < element) {
      return TimestampArray._recursiveLocationOf(element, array, pivot, end);
    }
    return TimestampArray._recursiveLocationOf(element, array, start, pivot);
  }

  private static _locationOf(element: number, array: Array<number>): number {
    return TimestampArray._recursiveLocationOf(element, array, 0, array.length);
  }
}
