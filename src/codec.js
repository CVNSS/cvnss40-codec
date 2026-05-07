'use strict';

const legacy = require('./legacy/cvnss4-converter');
const { VERSION, SPEC_VERSION, PROFILES, RAW_TYPES } = require('./constants');
const { normalizeCqn, normalizeCvss } = require('./utils/normalize');
const { tokenize, isRawType } = require('./utils/tokenize');
const { sha256Hex, hmacSha256Hex, crc8, base36FromHex } = require('./utils/checksum');
const { analyzeKhd } = require('./khd');
const { normalizeProfile, getProfile } = require('./profiles');

function escapeRaw(value) {
  const b64 = Buffer.from(String(value), 'utf8').toString('base64url');
  return `[RAW:${b64}]`;
}

function unescapeRaw(value) {
  const match = /^\[RAW:([A-Za-z0-9_-]+)\]$/.exec(String(value));
  if (!match) return value;
  return Buffer.from(match[1], 'base64url').toString('utf8');
}

function stripForId(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
    .toUpperCase();
}

function convertWordFromCqn(word) {
  const converted = legacy.convert(word, 'cqn');
  return {
    cqn: word,
    cvn: converted.cvn,
    cvss: converted.cvss
  };
}

function convertWordFromCvss(word) {
  const converted = legacy.convert(word, 'cvss');
  return {
    cqn: converted.cqn,
    cvn: converted.cvn,
    cvss: word
  };
}

function rawOutputForToken(token, profile) {
  const def = getProfile(profile);
  if (token.type === RAW_TYPES.WHITESPACE || token.type === RAW_TYPES.PUNCTUATION || token.type === RAW_TYPES.SYMBOL) {
    return token.value;
  }
  if (def.rawPolicy === 'escape' && token.type !== RAW_TYPES.NUMBER) return escapeRaw(token.value);
  if (def.rawPolicy === 'slug') return stripForId(token.value);
  return token.value;
}

function encodeToken(token, profile) {
  if (isRawType(token.type)) {
    return {
      ...token,
      normalized: token.value,
      cqn: token.value,
      cvn: token.value,
      cvss: rawOutputForToken(token, profile),
      output: rawOutputForToken(token, profile),
      raw: true,
      khd: null,
      warnings: token.type === RAW_TYPES.UNKNOWN ? ['UNKNOWN_RAW_TOKEN_PRESERVED'] : []
    };
  }

  const converted = convertWordFromCqn(token.value);
  const khd = analyzeKhd(converted.cvss);
  return {
    ...token,
    normalized: token.value,
    cqn: token.value,
    cvn: converted.cvn,
    cvss: converted.cvss,
    output: converted.cvss,
    raw: false,
    stem: khd.stem,
    khd,
    warnings: []
  };
}

function decodeToken(token) {
  if (isRawType(token.type)) {
    return {
      ...token,
      cqn: unescapeRaw(token.value),
      cvn: token.value,
      cvss: token.value,
      output: unescapeRaw(token.value),
      raw: true,
      warnings: []
    };
  }
  const converted = convertWordFromCvss(token.value);
  return {
    ...token,
    cqn: converted.cqn,
    cvn: converted.cvn,
    cvss: token.value,
    output: converted.cqn,
    raw: false,
    khd: analyzeKhd(token.value),
    warnings: []
  };
}

function statistics(input, output, tokens) {
  const inLen = [...String(input)].length;
  const outLen = [...String(output)].length;
  const wordTokens = tokens.filter(t => t.type === RAW_TYPES.WORD);
  return {
    inputChars: inLen,
    outputChars: outLen,
    deltaChars: outLen - inLen,
    compressionRatio: inLen ? Number((outLen / inLen).toFixed(4)) : 1,
    tokenCount: tokens.length,
    wordTokenCount: wordTokens.length,
    rawTokenCount: tokens.length - wordTokens.length
  };
}

function makeIntegrity(payload, options = {}) {
  const sha256 = sha256Hex(payload);
  const result = {
    crc8: crc8(payload),
    sha256,
    shortHash: base36FromHex(sha256, options.shortHashLength || 12)
  };
  if (options.secret) result.hmacSha256 = hmacSha256Hex(payload, options.secret);
  return result;
}

function encode(input, options = {}) {
  const profile = normalizeProfile(options.profile || PROFILES.CANONICAL);
  const normalized = normalizeCqn(input, options.normalize || {});
  const tokenList = tokenize(normalized).map(t => encodeToken(t, profile));
  let output = tokenList.map(t => t.output).join('');

  let id = null;
  if (profile === PROFILES.ID) {
    const canonical = tokenList.map(t => t.cvss || t.output).join('');
    const slug = stripForId(canonical).slice(0, options.slugLength || 48);
    const hash = makeIntegrity(canonical, options).shortHash;
    id = `${options.idPrefix || 'CV40'}-${slug || 'X'}-${hash}`;
    output = id;
  }

  const integrity = (profile === PROFILES.SECURE || profile === PROFILES.VERBOSE || options.integrity)
    ? makeIntegrity(output, options)
    : undefined;

  return {
    version: VERSION,
    specVersion: SPEC_VERSION,
    profile,
    profileName: getProfile(profile).name,
    input: String(input ?? ''),
    normalized,
    output,
    id,
    tokens: getProfile(profile).includeMetadata || options.includeTokens ? tokenList : undefined,
    stats: statistics(normalized, output, tokenList),
    integrity,
    warnings: tokenList.flatMap(t => t.warnings || [])
  };
}

function decode(input, options = {}) {
  const profile = normalizeProfile(options.profile || PROFILES.CANONICAL);
  const normalized = normalizeCvss(input, options.normalize || {});
  const tokenList = tokenize(normalized).map(decodeToken);
  const output = tokenList.map(t => t.output).join('');
  const integrity = options.integrity ? makeIntegrity(output, options) : undefined;
  return {
    version: VERSION,
    specVersion: SPEC_VERSION,
    profile,
    profileName: getProfile(profile).name,
    input: String(input ?? ''),
    normalized,
    output,
    tokens: getProfile(profile).includeMetadata || options.includeTokens ? tokenList : undefined,
    stats: statistics(normalized, output, tokenList),
    integrity,
    warnings: tokenList.flatMap(t => t.warnings || [])
  };
}

function toIR(input, options = {}) {
  return encode(input, { ...options, profile: options.profile || PROFILES.NLP, includeTokens: true });
}

function tokenizeForNLP(input, options = {}) {
  const ir = toIR(input, options);
  return (ir.tokens || []).map(t => ({
    index: t.index,
    type: t.type,
    cqn: t.cqn,
    cvn: t.cvn,
    cvss: t.cvss,
    stem: t.stem || (t.khd && t.khd.stem) || t.cvss,
    marker: t.khd ? t.khd.marker : null,
    tone: t.khd ? t.khd.tone : null,
    diacritic: t.khd ? t.khd.diacritic : null,
    raw: t.raw
  }));
}

function makeId(input, options = {}) {
  return encode(input, { ...options, profile: PROFILES.ID });
}

function auditRecord(input, options = {}) {
  const encoded = encode(input, { ...options, profile: PROFILES.SECURE, integrity: true });
  const now = options.timestamp || new Date().toISOString();
  const sourceId = options.sourceId || 'unknown-source';
  const recordPayload = JSON.stringify({
    specVersion: SPEC_VERSION,
    sourceId,
    timestamp: now,
    normalized: encoded.normalized,
    cvnss: encoded.output,
    sha256: encoded.integrity.sha256
  });
  return {
    type: 'cvnss40.audit.v1',
    timestamp: now,
    sourceId,
    cvnss: encoded.output,
    normalized: encoded.normalized,
    integrity: {
      ...encoded.integrity,
      recordHash: sha256Hex(recordPayload)
    },
    recordPayload
  };
}

module.exports = {
  encode,
  decode,
  toIR,
  tokenizeForNLP,
  makeId,
  auditRecord,
  escapeRaw,
  unescapeRaw,
  stripForId,
  convertWordFromCqn,
  convertWordFromCvss
};
