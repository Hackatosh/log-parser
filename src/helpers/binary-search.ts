// eslint-disable-next-line @typescript-eslint/naming-convention
const _locationOf = (element: number, array: Array<number>, start: number, end: number): number => {
  const pivot = Math.floor(start + ((end - start) / 2));
  if (array[pivot] === element) return pivot;
  if (end - start <= 1) return array[pivot] > element ? pivot - 1 : pivot;
  if (array[pivot] < element) {
    return _locationOf(element, array, pivot, end);
  }
  return _locationOf(element, array, start, pivot);
};

export const locationOf = (element: number, array: Array<number>): number => _locationOf(element, array, 0, array.length);
