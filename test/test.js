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
  describe('two or more digits', function () {
    testConv({ input: '三〇', expected: 30 });
    testConv({ input: '六八', expected: 68 });
    testConv({ input: '一六〇〇', expected: 1600 });
    testConv({ input: '二〇一七', expected: 2017 });
  });
  describe('十,百,千', function () {
    testConv({ input: '二十', expected: 20 });
    testConv({ input: '五十九', expected: 59 });
    testConv({ input: '三百二', expected: 302 });
    testConv({ input: '四千五百', expected: 4500 });
  });
  describe('if numerals starts with 十,百,千, treat them as 一十,一百,一千', function () {
    testConv({ input: '十五', expected: 15 });
    testConv({ input: '百八', expected: 108 });
    testConv({ input: '千六', expected: 1006 });
    testConv({ input: '千十', expected: 1010 });
    testConv({ input: '千百十', expected: 1110 });
  });
});
