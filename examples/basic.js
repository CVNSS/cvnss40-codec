'use strict';

const cvnss = require('../src');

const text = 'Qua phà nghiêng ngó lồng gà\nTránh quẹt thúng ghẹ người ta đứng gần';

const encoded = cvnss.encode(text, { profile: 'canonical', includeTokens: true });
console.log('CQN:', text);
console.log('CVNSS:', encoded.output);
console.log('Stats:', encoded.stats);

const decoded = cvnss.decode(encoded.output, { profile: 'canonical' });
console.log('Decoded:', decoded.output);
