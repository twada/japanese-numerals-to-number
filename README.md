japanese-numerals-to-number
================================

Converts [japanese numerals](https://en.wikipedia.org/wiki/Japanese_numerals) into `number`.

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Code Style][style-image]][style-url]
[![License][license-image]][license-url]


USAGE
---------------------------------------

```js
var ja2num = require('japanese-numerals-to-number');
var assert = require('assert');
assert(ja2num('一億二千三百四十五万六千七百八十九') === 123456789);
assert(ja2num('二千十七') === 2017);
assert(ja2num('二〇一七') === 2017); // supports positional notation
```


API
---------------------------------------

### var convertedNum = ja2num(stringOfJapaneseNumerals);

- Accepts japanese numerals between `0` (that is `'〇'`) and `Number.MAX_SAFE_INTEGER` (`9007199254740991`, that is `'九千七兆千九百九十二億五千四百七十四万九百九十一'`). Any number bigger than `Number.MAX_SAFE_INTEGER` is not supported and is not accurate.
- Throws `TypeError` when argument is not a string.
- Throws `Error` when argument is an invalid japanese numerals.

### supported characters

#### numbers 0 to 9

 - `〇`, `一`, `二`, `三`, `四`, `五`, `六`, `七`, `八`, `九`

#### names of powers of 10

 - `十`, `百`, `千`, `万`, `億`, `兆`

#### formal numerals (daiji)

 - `壱`, `弐`, `参`, `拾`


INSTALL
---------------------------------------

```sh
$ npm install japanese-numerals-to-number
```


AUTHOR
---------------------------------------
* [Takuto Wada](https://github.com/twada)


LICENSE
---------------------------------------
Licensed under the [MIT](https://github.com/twada/japanese-numerals-to-number/blob/master/LICENSE) license.


[npm-url]: https://npmjs.org/package/japanese-numerals-to-number
[npm-image]: https://badge.fury.io/js/japanese-numerals-to-number.svg

[travis-url]: https://travis-ci.org/twada/japanese-numerals-to-number
[travis-image]: https://secure.travis-ci.org/twada/japanese-numerals-to-number.svg?branch=master

[style-url]: https://github.com/Flet/semistandard
[style-image]: https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg

[license-url]: https://github.com/twada/japanese-numerals-to-number/blob/master/LICENSE
[license-image]: https://img.shields.io/badge/license-MIT-brightgreen.svg
