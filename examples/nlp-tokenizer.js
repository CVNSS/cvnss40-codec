'use strict';

const cvnss = require('../src');

const text = 'Bến Tre ứng dụng GIS, RFID và AI biên.';
const tokens = cvnss.tokenizeForNLP(text);
console.table(tokens.map(t => ({
  i: t.index,
  type: t.type,
  cqn: t.cqn,
  cvss: t.cvss,
  stem: t.stem,
  marker: t.marker,
  tone: t.tone,
  diacritic: t.diacritic
})));
