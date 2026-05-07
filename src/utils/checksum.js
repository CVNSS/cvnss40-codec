'use strict';

const crypto = require('crypto');

function sha256Hex(input) {
  return crypto.createHash('sha256').update(String(input), 'utf8').digest('hex');
}

function hmacSha256Hex(input, secret) {
  return crypto.createHmac('sha256', String(secret)).update(String(input), 'utf8').digest('hex');
}

function crc8(input) {
  const bytes = Buffer.from(String(input), 'utf8');
  let crc = 0x00;
  for (const byte of bytes) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) {
      crc = (crc & 0x80) ? ((crc << 1) ^ 0x07) & 0xff : (crc << 1) & 0xff;
    }
  }
  return crc.toString(16).padStart(2, '0').toUpperCase();
}

function base36FromHex(hex, length = 12) {
  const clean = String(hex).replace(/[^a-f0-9]/gi, '').slice(0, 30) || '0';
  const value = BigInt(`0x${clean}`);
  return value.toString(36).toUpperCase().padStart(length, '0').slice(0, length);
}

module.exports = { sha256Hex, hmacSha256Hex, crc8, base36FromHex };
