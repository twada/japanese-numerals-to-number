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
  describe('positional notation', function () {
    testConv({ input: '三〇', expected: 30 });
    testConv({ input: '六八', expected: 68 });
    testConv({ input: '一六〇〇', expected: 1600 });
    testConv({ input: '二〇一七', expected: 2017 });
  });
  describe('numerals for places: 十,百,千', function () {
    testConv({ input: '二十', expected: 20 });
    testConv({ input: '五十九', expected: 59 });
    testConv({ input: '三百二', expected: 302 });
    testConv({ input: '四千五百', expected: 4500 });
  });
  describe('if starts with 十,百,千, treat them as 一十,一百,一千', function () {
    testConv({ input: '十', expected: 10 });
    testConv({ input: '十五', expected: 15 });
    testConv({ input: '百', expected: 100 });
    testConv({ input: '百十', expected: 110 });
    testConv({ input: '百八', expected: 108 });
    testConv({ input: '千六', expected: 1006 });
    testConv({ input: '千十', expected: 1010 });
    testConv({ input: '千百十', expected: 1110 });
  });
  describe('numerals for the name of powers of myriad: 万,億,兆', function () {
    testConv({ input: '百万', expected: 1000000 });
    testConv({ input: '一万五千八百', expected: 15800 });
    testConv({ input: '二億五千万', expected: 250000000 });
    testConv({ input: '十兆百億七百万', expected: 10010007000000 });
    testConv({ input: '百兆三', expected: 100000000000003 });
    testConv({ input: '二千万', expected: 20000000 });
    testConv({ input: '一千万', expected: 10000000 });
    testConv({ input: '千万', expected: 10000000 });
  });
  describe('formal numerals called daiji: 壱,弐,参,拾', function () {
    testConv({ input: '参弐壱', expected: 321 });
    testConv({ input: '弐拾参', expected: 23 });
    testConv({ input: '拾弐万参千弐百拾壱', expected: 123211 });
  });
  describe('Number.MAX_SAFE_INTEGER => 9007199254740991', function () {
    testConv({ input: '九千七兆千九百九十二億五千四百七十四万九百九十一', expected: Number.MAX_SAFE_INTEGER });
    testConv({ input: '九〇〇七兆一九九二億五四七四万九九一', expected: Number.MAX_SAFE_INTEGER });
  });
  describe('exceptional cases', function () {
    it('throws TypeError when input is not a string', function () {
      assert.throws(function () {
        japaneseNumeralsToNumber(null);
      }, TypeError);
    });
    it('throws Error when input contains unsupported characters', function () {
      assert.throws(function () {
        japaneseNumeralsToNumber('第百十六回');
      }, Error);
    });
    it('throws Error when input string is empty', function () {
      assert.throws(function () {
        japaneseNumeralsToNumber('');
      }, Error);
    });
    describe('throws Error when input string is wrong sequence of numerals', function () {
      function wrongSequence (input) {
        it(input, function () {
          assert.throws(function () {
            japaneseNumeralsToNumber(input);
          }, /Wrong sequence of numerals/);
        });
      }
      wrongSequence('十十');
      wrongSequence('二十五十');
      wrongSequence('十百千');
      wrongSequence('三十七百九千');
      wrongSequence('四万三億二兆');
    });
    describe('万,億,兆 cannot be adjacent to each other or be the first character of the sequence', function () {
      function wrongMyriads (input) {
        it(input, function () {
          assert.throws(function () {
            japaneseNumeralsToNumber(input);
          }, /万,億,兆 cannot be adjacent to each other or be the first character of the sequence/);
        });
      }
      wrongMyriads('億千万');
      wrongMyriads('億千万億千万');
    });
  });
});
