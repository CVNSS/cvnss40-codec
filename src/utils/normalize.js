'use strict';

function normalizeCqn(input, options = {}) {
  const {
    unicode = 'NFC',
    normalizeLineEndings = true,
    trim = false,
    collapseSpaces = false,
    removeZeroWidth = true
  } = options;

  let text = String(input ?? '');
  if (normalizeLineEndings) text = text.replace(/\r\n?/g, '\n');
  if (removeZeroWidth) text = text.replace(/[\u200B-\u200D\uFEFF]/g, '');
  text = text.normalize(unicode);
  if (collapseSpaces) text = text.replace(/[ \t]+/g, ' ');
  if (trim) text = text.trim();
  return text;
}

function normalizeCvss(input, options = {}) {
  return normalizeCqn(input, options);
}

module.exports = { normalizeCqn, normalizeCvss };
