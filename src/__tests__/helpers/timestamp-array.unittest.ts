import { TimestampArray } from '../../helpers/timestamp-array';

describe('Timestamp array', () => {
  describe('Add method', () => {
    let timestampArray: TimestampArray;

    beforeEach(() => {
      timestampArray = new TimestampArray();
    });

    test('Array should be empty at initialization', () => {
      expect(timestampArray.array).toEqual([]);
    });

    test('Should be able to add 1 element', () => {
      timestampArray.add(3);
      expect(timestampArray.array).toEqual([3]);
    });

    test('Should be able to add 2 element (1st added > 2nd added)', () => {
      timestampArray.add(2);
      timestampArray.add(1);
      expect(timestampArray.array).toEqual([1, 2]);
    });

    test('Should be able to add 2 element (1st added < 2nd added)', () => {
      timestampArray.add(1);
      timestampArray.add(2);
      expect(timestampArray.array).toEqual([1, 2]);
    });

    test('Should be able to add 3 element (3rd < first two)', () => {
      timestampArray.add(3);
      timestampArray.add(2);
      timestampArray.add(1);
      expect(timestampArray.array).toEqual([1, 2, 3]);
    });

    test('Should be able to add 3 element (3rd > first two)', () => {
      timestampArray.add(1);
      timestampArray.add(2);
      timestampArray.add(3);
      expect(timestampArray.array).toEqual([1, 2, 3]);
    });

    test('Should be able to add 3 element (3rd middle of first two)', () => {
      timestampArray.add(1);
      timestampArray.add(3);
      timestampArray.add(2);
      expect(timestampArray.array).toEqual([1, 2, 3]);
    });
  });

  describe('Remove below', () => {
    let timestampArray: TimestampArray;

    const addOneTwoFour = (): void => {
      timestampArray.add(1);
      timestampArray.add(2);
      timestampArray.add(4);
    };

    const addOneTwoTwoFour = (): void => {
      timestampArray.add(1);
      timestampArray.add(2);
      timestampArray.add(2);
      timestampArray.add(4);
    };

    beforeEach(() => {
      timestampArray = new TimestampArray();
    });

    test('Should correctly remove element below (element < whole array)', () => {
      addOneTwoFour();
      timestampArray.removeBelow(0);
      expect(timestampArray.array).toEqual([1, 2, 4]);
    });

    test('Should correctly remove element below (element > whole array)', () => {
      addOneTwoFour();
      timestampArray.removeBelow(5);
      expect(timestampArray.array).toEqual([]);
    });

    test('Should correctly remove element below (element middle of whole array)', () => {
      addOneTwoFour();
      timestampArray.removeBelow(3);
      expect(timestampArray.array).toEqual([4]);
    });

    test('Should correctly remove element below (element middle of whole array, equal to element)', () => {
      addOneTwoFour();
      timestampArray.removeBelow(2);
      expect(timestampArray.array).toEqual([2, 4]);
    });

    test('Should correctly remove element below (equal to first element)', () => {
      addOneTwoFour();
      timestampArray.removeBelow(1);
      expect(timestampArray.array).toEqual([1, 2, 4]);
    });

    test('Should correctly remove element below (equal to last element)', () => {
      addOneTwoFour();
      timestampArray.removeBelow(4);
      expect(timestampArray.array).toEqual([4]);
    });

    test('Handle duplicate (equality)', () => {
      addOneTwoTwoFour();
      timestampArray.removeBelow(2);
      expect(timestampArray.array).toEqual([2, 2, 4]);
    });

    test('Handle duplicate (not equality)', () => {
      addOneTwoTwoFour();
      timestampArray.removeBelow(3);
      expect(timestampArray.array).toEqual([4]);
    });

    test('Handle duplicate (not equality)', () => {
      addOneTwoTwoFour();
      timestampArray.removeBelow(4);
      expect(timestampArray.array).toEqual([4]);
    });
  });

  describe('Getters', () => {
    let timestampArray: TimestampArray;

    beforeEach(() => {
      timestampArray = new TimestampArray();
    });

    test('Should correctly be able to get min/max/length', () => {
      timestampArray.add(1);
      timestampArray.add(3);
      timestampArray.add(2);
      expect(timestampArray.min).toEqual(1);
      expect(timestampArray.max).toEqual(3);
      expect(timestampArray.length).toEqual(3);
    });

    test('Should correctly be able to get min/max/length (empty array)', () => {
      expect(timestampArray.min).toBeNull();
      expect(timestampArray.max).toBeNull();
      expect(timestampArray.length).toEqual(0);
    });
  });
});
