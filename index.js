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

var EXPONENTS_IN_SUBSEQ = {
  '十': 1,
  '百': 2,
  '千': 3
};

var MYRIADS = {
  '万': 4,
  '億': 8,
  '兆': 12
};

function subTotal (acc) {
  if (EXPONENTS_IN_SUBSEQ[acc.char]) {
    // if seq starts with 十,百,千, treat them as 一十,一百,一千
    return acc.value + (1 * Math.pow(10, EXPONENTS_IN_SUBSEQ[acc.char]));
  } else {
    return acc.value;
  }
}

function subseqToNumber (subseq) {
  return subTotal(subseq.reverse().reduce(function (prev, char) {
    if (EXPONENTS_IN_SUBSEQ[char]) {
      return {value: subTotal(prev), exp: EXPONENTS_IN_SUBSEQ[char], char: char};
    }
    return {
      value: prev.value + (JAPANESE_NUMERAL_CHARS[char] * Math.pow(10, prev.exp)),
      exp: prev.exp + 1,
      char: char
    };
  }, {value: 0, exp: 0, char: null}));
}

function sumUp (acc) {
  return acc.value + (subseqToNumber(acc.seq) * Math.pow(10, acc.exp));
}

function charsToNumber (chars) {
  return sumUp(chars.reverse().reduce(function (prev, char) {
    if (MYRIADS[char]) {
      return {value: sumUp(prev), exp: MYRIADS[char], seq: []};
    }
    return {value: prev.value, exp: prev.exp, seq: [char].concat(prev.seq)};
  }, {value: 0, exp: 0, seq: []}));
}

module.exports = function japaneseNumeralsToNumber (stringOfJapaneseNumerals) {
  return charsToNumber(stringOfJapaneseNumerals.split(''));
};
