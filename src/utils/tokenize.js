'use strict';

const { RAW_TYPES } = require('../constants');

const URL_RE = /^(https?:\/\/|www\.)\S+$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const NUMBER_RE = /^[+-]?(?:\d+[.,]?)+%?$/;
const TECH_CODE_RE = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9._:/#-]+$/;
const WORD_RE = /^[A-Za-zÀ-ỹĐđ]+$/u;
const WHITESPACE_RE = /^\s+$/;
const PUNCT_RE = /^[.,;:!?()\[\]{}"'“”‘’…\-–—/\\|@#$%^&*+=<>~`]+$/u;

function classifyToken(token) {
  if (WHITESPACE_RE.test(token)) return RAW_TYPES.WHITESPACE;
  if (URL_RE.test(token)) return RAW_TYPES.URL;
  if (EMAIL_RE.test(token)) return RAW_TYPES.EMAIL;
  if (NUMBER_RE.test(token)) return RAW_TYPES.NUMBER;
  if (TECH_CODE_RE.test(token)) return RAW_TYPES.CODE;
  if (WORD_RE.test(token)) return RAW_TYPES.WORD;
  if (PUNCT_RE.test(token)) return RAW_TYPES.PUNCTUATION;
  return RAW_TYPES.UNKNOWN;
}

function tokenize(text) {
  const source = String(text ?? '');
  const pattern = /(https?:\/\/\S+|www\.\S+|[^\s@]+@[^\s@]+\.[^\s@]+|[A-Za-zÀ-ỹĐđ]+|[0-9]+(?:[.,][0-9]+)*%?|[A-Za-z0-9]+(?:[-_:/.#][A-Za-z0-9]+)+|\s+|.)/gu;
  const tokens = [];
  let match;
  let index = 0;
  while ((match = pattern.exec(source)) !== null) {
    const value = match[0];
    tokens.push({
      index,
      start: match.index,
      end: match.index + value.length,
      value,
      type: classifyToken(value)
    });
    index += 1;
  }
  return tokens;
}

function isRawType(type) {
  return type !== RAW_TYPES.WORD;
}

module.exports = {
  tokenize,
  classifyToken,
  isRawType,
  URL_RE,
  EMAIL_RE,
  NUMBER_RE,
  TECH_CODE_RE,
  WORD_RE,
  WHITESPACE_RE,
  PUNCT_RE
};
