'use strict';

delete require.cache[require.resolve('..')];
var japaneseNumeralsToNumber = require('..');
var assert = require('assert');

describe('japanese-numerals-to-number', function () {
  it('one digit', function () {
    assert(japaneseNumeralsToNumber('一') === 1);
    assert(japaneseNumeralsToNumber('二') === 2);
  });
  it('two digits', function () {
    assert(japaneseNumeralsToNumber('三〇') === 30);
    assert(japaneseNumeralsToNumber('六八') === 68);
  });
});
