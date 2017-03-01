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
  describe('万,億,兆', function () {
    testConv({ input: '百万', expected: 1000000 });
    testConv({ input: '一万五千八百', expected: 15800 });
    testConv({ input: '二億五千万', expected: 250000000 });
    testConv({ input: '十兆百億七百万', expected: 10010007000000 });
    testConv({ input: '百兆三', expected: 100000000000003 });
  });
  describe('Number.MAX_SAFE_INTEGER => 9007199254740991', function () {
    testConv({ input: '九千七兆千九百九十二億五千四百七十四万九百九十一', expected: Number.MAX_SAFE_INTEGER });
    testConv({ input: '九〇〇七兆一九九二億五四七四万九九一', expected: Number.MAX_SAFE_INTEGER });
  });
});
