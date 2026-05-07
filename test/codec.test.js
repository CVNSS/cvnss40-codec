'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const cvnss = require('../src');

const vectors = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'test-vectors.json'), 'utf8'));

test('encodes CQN to expected CVNSS4.0 vectors', () => {
  for (const vector of vectors) {
    const result = cvnss.encode(vector.input_cqn, { profile: vector.profile });
    assert.equal(result.output, vector.expected_cvss, vector.id);
  }
});

test('decodes known CVNSS4.0 sentence back to CQN', () => {
  const cvss = 'Qa fal wizy woj logd gal\nTrahj qetr thugj ger wujk ta dugx gand';
  const result = cvnss.decode(cvss);
  assert.equal(result.output, 'Qua phà nghiêng ngó lồng gà\nTránh quẹt thúng ghẹ người ta đứng gần');
});

test('creates NLP tokens with stem and KHD fields', () => {
  const tokens = cvnss.tokenizeForNLP('mẹ má lồng');
  const words = tokens.filter(t => t.type === 'word');
  assert.equal(words.length, 3);
  assert.ok(words.every(t => Object.prototype.hasOwnProperty.call(t, 'stem')));
});

test('creates deterministic ID and audit hash', () => {
  const id1 = cvnss.makeId('Xoài tứ quý Thạnh Hải', { idPrefix: 'BT' }).output;
  const id2 = cvnss.makeId('Xoài tứ quý Thạnh Hải', { idPrefix: 'BT' }).output;
  assert.equal(id1, id2);
  assert.match(id1, /^BT-/);
  const audit = cvnss.auditRecord('Bến Tre ứng dụng GIS');
  assert.equal(audit.type, 'cvnss40.audit.v1');
  assert.equal(audit.integrity.sha256.length, 64);
});
