'use strict';

const cvnss = require('../src');

const objectName = 'Xoài tứ quý Thạnh Hải - lô 2026-A01';
const id = cvnss.makeId(objectName, { idPrefix: 'BT', slugLength: 36 });
console.log(JSON.stringify({ objectName, cvnssId: id.output, stats: id.stats }, null, 2));
