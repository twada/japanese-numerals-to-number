'use strict';

var JAPANESE_NUMERAL_CHARS = {
  '〇': 0,
  '一': 1,
  '二': 2,
  '三': 3,
  '四': 4,
  '五': 5,
  '六': 6,
  '七': 7,
  '八': 8,
  '九': 9
};

module.exports = function japaneseNumeralsToNumber (stringOfJapaneseNumerals) {
  var chars = stringOfJapaneseNumerals.split('');
  var nums = chars.map(function (c) {
    return JAPANESE_NUMERAL_CHARS[c];
  });
  nums.reverse();
  return nums.reduce(function (prev, next, idx) {
    return prev + (next * Math.pow(10, idx));
  }, 0);
};
