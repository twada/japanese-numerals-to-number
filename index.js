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
  '九': 9,
  '壱': 1,
  '弐': 2,
  '参': 3
};

var EXPONENTS_IN_SUBSEQ = {
  '十': 1,
  '百': 2,
  '千': 3,
  '拾': 1
};

var POWERS_OF_MYRIAD = {
  '万': 4,
  '億': 8,
  '兆': 12
};

function valuesOf (acc) {
  var exp = EXPONENTS_IN_SUBSEQ[acc.place];
  if (!exp) {
    // positional notation or place of '一'
    if ((acc.seq.length > 0) && (acc.seq[acc.seq.length - 1] === 0)) {
      throw new Error('Positional notation or place of "一" should not start with zero');
    }
    return acc.values.concat(acc.seq);
  }
  // if seq starts with 十,百,千, treat them as 一十,一百,一千
  var seqForPlace = (acc.seq.length === 0) ? acc.seq.concat(1 * Math.pow(10, exp)) : acc.seq;
  if (seqForPlace.length !== 1) {
    throw new Error('Each place (' + Object.keys(EXPONENTS_IN_SUBSEQ).join(',') + ') should not have more than one digit');
  }
  if (seqForPlace[0] === 0) {
    throw new Error('Each place (' + Object.keys(EXPONENTS_IN_SUBSEQ).join(',') + ') should not start with zero');
  }
  return acc.values.concat(seqForPlace);
}

function subseqToNumbers (subseq) {
  return valuesOf(subseq.reverse().reduce(function (prev, char) {
    if (EXPONENTS_IN_SUBSEQ[char]) {
      return {values: valuesOf(prev), seq: [], exp: EXPONENTS_IN_SUBSEQ[char], place: char};
    }
    return {
      values: prev.values,
      seq: prev.seq.concat(JAPANESE_NUMERAL_CHARS[char] * Math.pow(10, prev.exp)),
      exp: prev.exp + 1,
      place: prev.place
    };
  }, {values: [], seq: [], exp: 0, place: '一'}));
}

function carryUpAndConcatSubseq (acc) {
  if (acc.values.length > 0 && acc.seq.length === 0) {
    throw new Error(Object.keys(POWERS_OF_MYRIAD).join(',') + ' cannot be adjacent to each other or be the first character of the sequence');
  }
  var numseq = subseqToNumbers(acc.seq).map(function (n) { return n * Math.pow(10, acc.exp); });
  return acc.values.concat(numseq);
}

function charsToNumbers (chars) {
  return carryUpAndConcatSubseq(chars.reverse().reduce(function (prev, char) {
    if (POWERS_OF_MYRIAD[char]) {
      return {values: carryUpAndConcatSubseq(prev), exp: POWERS_OF_MYRIAD[char], seq: []};
    }
    return {values: prev.values, exp: prev.exp, seq: [char].concat(prev.seq)};
  }, {values: [], exp: 0, seq: []}));
}

function supportedCharacters () {
  return Object.keys(JAPANESE_NUMERAL_CHARS)
    .concat(Object.keys(EXPONENTS_IN_SUBSEQ))
    .concat(Object.keys(POWERS_OF_MYRIAD));
}

module.exports = function japaneseNumeralsToNumber (japaneseNumerals) {
  if (typeof japaneseNumerals !== 'string') {
    throw new TypeError('japaneseNumerals argument must be a string');
  }
  var pattern = new RegExp('^[' + supportedCharacters().join('') + ']+$');
  if (!pattern.test(japaneseNumerals)) {
    throw new Error('japaneseNumerals argument does not match ' + pattern);
  }
  var numbers = charsToNumbers(japaneseNumerals.split(''));
  numbers.filter(function (n) { return n !== 0; }).reduce(function (p, n) {
    if (p >= n) {
      throw new Error('Wrong sequence of numerals');
    }
    return n;
  });
  return numbers.reduce(function (p, n) { return p + n; }, 0);
};
