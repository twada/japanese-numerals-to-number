/**
 * japanese-numerals-to-number - Converts Japanese Numerals into number.
 *
 * https://github.com/twada/japanese-numerals-to-number
 *
 * Copyright (c) 2017 Takuto Wada
 * Licensed under the MIT license.
 *   https://github.com/twada/japanese-numerals-to-number/blob/master/LICENSE
 */
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
  // formal numerals (daiji) used in legal documents
  '壱': 1,
  '弐': 2,
  '参': 3
};

var PLACES_IN_SUBSEQ = {
  '十': 1,
  '百': 2,
  '千': 3,
  // formal numerals (daiji) used in legal documents
  '拾': 1
};

var POWERS_OF_MYRIAD = {
  '万': 4,
  '億': 8,
  '兆': 12
};

function valuesOf (acc) {
  var exp = PLACES_IN_SUBSEQ[acc.place];
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
    throw new Error('Each place (' + Object.keys(PLACES_IN_SUBSEQ).join(',') + ') should not have more than one digit');
  }
  if (seqForPlace[0] === 0) {
    throw new Error('Each place (' + Object.keys(PLACES_IN_SUBSEQ).join(',') + ') should not start with zero');
  }
  return acc.values.concat(seqForPlace);
}

function subseqToNumbers (subseq) {
  return valuesOf(subseq.reduce(function (prev, char) {
    if (PLACES_IN_SUBSEQ[char]) {
      if (prev.places.indexOf(char) !== -1) {
        throw new Error(char + ' appears more than once in subsequence');
      }
      return {values: valuesOf(prev), seq: [], exp: PLACES_IN_SUBSEQ[char], place: char, places: prev.places.concat(char)};
    }
    // in some cases, the digit 1 is explicitly written like 壱百壱拾 for 110, as opposed to 百十 in common writing.
    if (char === '一' && (prev.place === '十' || prev.place === '百')) {
      throw new Error('"一百" and "一十" are invalid in common writing. 100 is just "百", and 10 is just "十"');
    }
    return {
      values: prev.values,
      seq: prev.seq.concat(JAPANESE_NUMERAL_CHARS[char] * Math.pow(10, prev.exp)),
      exp: prev.exp + 1,
      place: prev.place,
      places: prev.places
    };
  }, {values: [], seq: [], exp: 0, place: '一', places: ['一']}));
}

function carryUpAndConcatSubseq (acc) {
  if (acc.exp > 0) {
    if (acc.seq.length === 0) {
      throw new Error(Object.keys(POWERS_OF_MYRIAD).join(',') + ' cannot be adjacent to each other or be the first character of the sequence');
    }
    if (acc.seq.length === 1 && acc.seq[0] === '千') {
      throw new Error('if "千" directly precedes the name of powers of myriad, "一" is normally attached before "千"');
    }
  }
  var numseq = subseqToNumbers(acc.seq).map(function (n) { return n * Math.pow(10, acc.exp); });
  return acc.values.concat(numseq);
}

function charsToNumbers (chars) {
  return carryUpAndConcatSubseq(chars.reverse().reduce(function (prev, char) {
    if (POWERS_OF_MYRIAD[char]) {
      return {values: carryUpAndConcatSubseq(prev), exp: POWERS_OF_MYRIAD[char], seq: []};
    }
    return {values: prev.values, exp: prev.exp, seq: prev.seq.concat([char])};
  }, {values: [], exp: 0, seq: []}));
}

function charsToNumber (chars) {
  if (chars.length === 1 && JAPANESE_NUMERAL_CHARS[chars[0]] === 0) {
    // treat zero as special case
    return 0;
  }
  return charsToNumbers(chars).reduce(function (acc, n) {
    if (n === 0) {
      return acc;
    }
    if (acc.prev >= n) {
      throw new Error('Wrong sequence of numerals');
    }
    return { sum: acc.sum + n, prev: n };
  }, { sum: 0, prev: 0 }).sum;
}

function supportedCharacters () {
  return Object.keys(JAPANESE_NUMERAL_CHARS)
    .concat(Object.keys(PLACES_IN_SUBSEQ))
    .concat(Object.keys(POWERS_OF_MYRIAD));
}

/**
 * Converts Japanese Numerals into number.
 *
 * @param {string} japaneseNumerals string of Japanese Numerals
 * @returns {number} number represented by japaneseNumerals
 * @throws {TypeError} when `japaneseNumerals` is not a string
 * @throws {Error} when `japaneseNumerals` is invalid
 */
function japaneseNumeralsToNumber (japaneseNumerals) {
  if (typeof japaneseNumerals !== 'string') {
    throw new TypeError('japaneseNumerals argument must be a string');
  }
  if (japaneseNumerals.length > 32) {
    throw new Error('length of japaneseNumerals is too long');
  }
  var pattern = new RegExp('^[' + supportedCharacters().join('') + ']+$');
  if (!pattern.test(japaneseNumerals)) {
    throw new Error('japaneseNumerals argument does not match ' + pattern);
  }
  return charsToNumber(japaneseNumerals.split(''));
}

module.exports = japaneseNumeralsToNumber;
