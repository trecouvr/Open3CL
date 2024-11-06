import { PRECISION, PRECISION_PERCENT } from './constant.js';
import { expect } from '@jest/globals';

export function buildExpectedObject_closeTo(expectedObject, attrs, precision = PRECISION) {
  const expected = {};
  for (const attr of attrs) {
    expected[attr] = expect.closeTo(expectedObject[attr], precision ?? PRECISION);
  }
  return expected;
}

export function buildExpectedObject_closeToPercent(
  expectedObject,
  attrs,
  precision = PRECISION_PERCENT
) {
  const expected = {};
  for (const attr of attrs) {
    let expectedValue = expectedObject[attr];
    expected[attr] = expect.closeTo(
      expectedValue,
      Math.abs(expectedValue) <= 0.001 ? -5 : -Math.log10(expectedValue * precision * 2)
    );
    expected[attr] = expect.closeToPercent(expectedValue, precision);
    // expected[attr] = expect.closeTo(
    //   expectedValue,
    //   (Math.abs(expectedValue) <= 0.001) ? -5 : -Math.log10(expectedValue * precision * 2),
    // );
  }
  return expected;
}

export function buildExpectedObject_closeToPercentFactor1000(
  expectedObject,
  calculatedObject,
  attrs,
  precision = PRECISION_PERCENT
) {
  const expected = {};
  for (const attr of attrs) {
    let expectedValue = expectedObject[attr];
    const calculatedValue = calculatedObject[attr];
    // Values should sometimes be in different unit
    if (Math.round(Math.log10(expectedValue / calculatedValue)) >= 3) {
      expectedValue /= 1000.0;
    } else if (Math.round(Math.log10(calculatedValue / expectedValue)) >= 3) {
      expectedValue *= 1000.0;
    }
    expected[attr] = expect.closeTo(
      expectedValue,
      -Math.round(Math.log10((expectedValue * precision) / 10))
    );
  }
  return expected;
}

expect.extend({
  closeToPercent(actual, expected, precision = PRECISION_PERCENT) {
    if (typeof actual !== 'number') {
      throw new Error('Actual value must be a number');
    }

    let pass = '';
    if (Math.abs(expected) <= 0.000001) {
      pass = Math.abs(actual) <= 0.000001;
    } else {
      const diff = Math.abs(actual - expected) / expected;
      pass = diff <= precision;
    }
    const message = pass
      ? () => `NumberCloseTo ${expected} (${precision * 100}%)`
      : () => `not NumberCloseTo ${expected} (${precision * 100}%)`;
    return { message, pass };
  }
});
