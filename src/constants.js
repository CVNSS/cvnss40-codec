'use strict';

const VERSION = '0.1.0';
const SPEC_VERSION = 'CVNSS4.0-IR-DRAFT-0.1';

const PROFILES = Object.freeze({
  USER: 'user',
  CANONICAL: 'canonical',
  NLP: 'nlp',
  ID: 'id',
  SECURE: 'secure',
  COMPACT: 'compact',
  VERBOSE: 'verbose'
});

const RAW_TYPES = Object.freeze({
  URL: 'url',
  EMAIL: 'email',
  NUMBER: 'number',
  CODE: 'code',
  SYMBOL: 'symbol',
  WHITESPACE: 'whitespace',
  PUNCTUATION: 'punctuation',
  WORD: 'word',
  UNKNOWN: 'unknown'
});

module.exports = { VERSION, SPEC_VERSION, PROFILES, RAW_TYPES };
