'use strict';

delete require.cache[require.resolve('..')];
var japaneseNumeralsToNumber = require('..');
var assert = require('assert');

function testConv (spec) {
  var input = spec.input;
  var expected = spec.expected;
  it('input: ' + input + ', expected: ' + expected, function () {
    assert(japaneseNumeralsToNumber(input) === expected);
  });
}

describe('japanese-numerals-to-number', function () {
  describe('one digit', function () {
    testConv({ input: '一', expected: 1 });
    testConv({ input: '二', expected: 2 });
  });
  describe('two digits', function () {
    testConv({ input: '三〇', expected: 30 });
    testConv({ input: '六八', expected: 68 });
  });
});
