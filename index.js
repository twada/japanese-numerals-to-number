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

var EXPONENTS = {
  '十': 1,
  '百': 2,
  '千': 3
};

module.exports = function japaneseNumeralsToNumber (stringOfJapaneseNumerals) {
  var chars = stringOfJapaneseNumerals.split('');
  chars.reverse();
  return chars.reduce(function (prev, char) {
    if (EXPONENTS[char]) {
      return {value: prev.value, exp: EXPONENTS[char]};
    }
    var num = JAPANESE_NUMERAL_CHARS[char];
    var sum = prev.value + (num * Math.pow(10, prev.exp));
    return {value: sum, exp: prev.exp + 1};
  }, {value: 0, exp: 0}).value;
};
