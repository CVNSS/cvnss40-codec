'use strict';

const cvnss = require('../src');

const command = 'Bật bơm ao số 3 khi độ mặn vượt ngưỡng';
const compact = cvnss.encode(command, { profile: 'compact' });
const secure = cvnss.encode(command, { profile: 'secure' });

console.log(JSON.stringify({
  device: 'edge-ai-hub',
  original: command,
  compactPayload: compact.output,
  crc8: secure.integrity.crc8,
  sha256: secure.integrity.sha256
}, null, 2));
