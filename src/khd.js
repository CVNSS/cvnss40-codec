'use strict';

const MARKERS = Object.freeze({
  b: { marker: 'b', group: 'circumflex', diacritic: 'hat', tone: 'sac', label: 'sắc + nón' },
  d: { marker: 'd', group: 'circumflex', diacritic: 'hat', tone: 'huyen', label: 'huyền + nón' },
  q: { marker: 'q', group: 'circumflex', diacritic: 'hat', tone: 'hoi', label: 'hỏi + nón' },
  g: { marker: 'g', group: 'circumflex', diacritic: 'hat', tone: 'nga', label: 'ngã + nón' },
  f: { marker: 'f', group: 'circumflex', diacritic: 'hat', tone: 'nang', label: 'nặng + nón' },

  x: { marker: 'x', group: 'breve_or_horn', diacritic: 'breve_or_horn', tone: 'sac', label: 'sắc + trăng/móc' },
  k: { marker: 'k', group: 'breve_or_horn', diacritic: 'breve_or_horn', tone: 'huyen', label: 'huyền + trăng/móc' },
  v: { marker: 'v', group: 'breve_or_horn', diacritic: 'breve_or_horn', tone: 'hoi', label: 'hỏi + trăng/móc' },
  w: { marker: 'w', group: 'breve_or_horn', diacritic: 'breve_or_horn', tone: 'nga', label: 'ngã + trăng/móc' },
  h: { marker: 'h', group: 'breve_or_horn', diacritic: 'breve_or_horn', tone: 'nang', label: 'nặng + trăng/móc' },

  j: { marker: 'j', group: 'plain_vowel', diacritic: 'none', tone: 'sac', label: 'sắc' },
  l: { marker: 'l', group: 'plain_vowel', diacritic: 'none', tone: 'huyen', label: 'huyền' },
  z: { marker: 'z', group: 'plain_vowel', diacritic: 'none', tone: 'hoi', label: 'hỏi' },
  s: { marker: 's', group: 'plain_vowel', diacritic: 'none', tone: 'nga', label: 'ngã' },
  r: { marker: 'r', group: 'plain_vowel', diacritic: 'none', tone: 'nang', label: 'nặng' },

  y: { marker: 'y', group: 'level', diacritic: 'hat', tone: 'ngang', label: 'ngang + nón' },
  o: { marker: 'o', group: 'level', diacritic: 'breve_or_horn', tone: 'ngang', label: 'ngang + trăng/móc' },
  p: { marker: 'p', group: 'level_guard', diacritic: 'none', tone: 'ngang', label: 'chống nhập nhằng' }
});

function analyzeKhd(cvssToken) {
  const token = String(cvssToken ?? '');
  if (!token) {
    return { stem: '', marker: null, group: null, tone: null, diacritic: null, hasMarker: false };
  }
  const last = token[token.length - 1].toLowerCase();
  const info = MARKERS[last];
  if (!info) {
    return { stem: token, marker: null, group: null, tone: 'ngang_or_unknown', diacritic: 'unknown', hasMarker: false };
  }
  return {
    stem: token.slice(0, -1),
    marker: token[token.length - 1],
    group: info.group,
    tone: info.tone,
    diacritic: info.diacritic,
    label: info.label,
    hasMarker: true
  };
}

function khdTable() {
  return { ...MARKERS };
}

module.exports = { MARKERS, analyzeKhd, khdTable };
