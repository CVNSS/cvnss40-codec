'use strict';

const { PROFILES } = require('./constants');

const profileDefinitions = Object.freeze({
  [PROFILES.USER]: {
    name: 'CVNSS-User',
    reversible: 'best-effort',
    description: 'Gõ nhanh, học tốc ký, cho phép dùng gợi ý từ điển và linh hoạt ở lớp nhập liệu.',
    rawPolicy: 'preserve',
    includeMetadata: false,
    compact: false,
    secure: false
  },
  [PROFILES.CANONICAL]: {
    name: 'CVNSS-Canonical',
    reversible: 'intended',
    description: 'Biểu diễn chuẩn, ổn định, dùng cho so sánh chuỗi, lưu trữ và kiểm thử.',
    rawPolicy: 'escape',
    includeMetadata: true,
    compact: false,
    secure: false
  },
  [PROFILES.NLP]: {
    name: 'CVNSS-NLP',
    reversible: 'with-context',
    description: 'Tách token thành stem + tone + diacritic marker + metadata cho AI/NLP.',
    rawPolicy: 'preserve',
    includeMetadata: true,
    compact: false,
    secure: false
  },
  [PROFILES.ID]: {
    name: 'CVNSS-ID',
    reversible: 'lookup-required',
    description: 'Sinh mã định danh ngắn cho QR/NFC/RFID/GIS/Digital Twin.',
    rawPolicy: 'slug',
    includeMetadata: true,
    compact: true,
    secure: false
  },
  [PROFILES.SECURE]: {
    name: 'CVNSS-Secure',
    reversible: 'canonical-with-hash',
    description: 'Biểu diễn canonical kèm SHA-256/CRC phục vụ log, audit và kiểm chứng dữ liệu.',
    rawPolicy: 'escape',
    includeMetadata: true,
    compact: false,
    secure: true
  },
  [PROFILES.COMPACT]: {
    name: 'CVNSS-Compact',
    reversible: 'best-effort',
    description: 'Chuỗi CVNSS ngắn nhất có thể cho payload nhỏ và thiết bị tài nguyên thấp.',
    rawPolicy: 'preserve',
    includeMetadata: false,
    compact: true,
    secure: false
  },
  [PROFILES.VERBOSE]: {
    name: 'CVNSS-Verbose',
    reversible: 'debug',
    description: 'Xuất đầy đủ metadata để debug, kiểm thử và xây dataset.',
    rawPolicy: 'escape',
    includeMetadata: true,
    compact: false,
    secure: true
  }
});

function normalizeProfile(profile) {
  const key = (profile || PROFILES.CANONICAL).toLowerCase();
  if (!profileDefinitions[key]) {
    throw new Error(`Unsupported CVNSS4.0 profile: ${profile}`);
  }
  return key;
}

function getProfile(profile) {
  return profileDefinitions[normalizeProfile(profile)];
}

module.exports = { profileDefinitions, normalizeProfile, getProfile };
