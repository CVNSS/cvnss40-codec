'use strict';

const cvnss = require('../src');

const message = 'Cảm biến RFID-24 ghi nhận độ mặn 3,5‰ tại Bến Tre.';
const audit = cvnss.auditRecord(message, { sourceId: 'edge-node-BT-001' });
console.log(JSON.stringify(audit, null, 2));
