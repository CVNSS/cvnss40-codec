#!/usr/bin/env node
'use strict';

const http = require('http');
const cvnss = require('../src');

const PORT = Number(process.env.PORT || 8787);

function send(res, status, body) {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type'
  });
  res.end(JSON.stringify(body, null, 2));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch (e) { reject(e); }
    });
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 200, { ok: true });
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (req.method === 'GET' && url.pathname === '/health') return send(res, 200, { ok: true, service: 'cvnss40-codec' });
    if (req.method !== 'POST') return send(res, 404, { error: 'not_found' });
    const body = await readBody(req);
    const text = body.text || '';
    const profile = body.profile || 'canonical';

    if (url.pathname === '/encode') return send(res, 200, cvnss.encode(text, { profile, includeTokens: !!body.includeTokens }));
    if (url.pathname === '/decode') return send(res, 200, cvnss.decode(text, { profile, includeTokens: !!body.includeTokens }));
    if (url.pathname === '/ir') return send(res, 200, cvnss.toIR(text, { profile: 'nlp' }));
    if (url.pathname === '/id') return send(res, 200, cvnss.makeId(text, { idPrefix: body.idPrefix || 'CV40' }));
    if (url.pathname === '/audit') return send(res, 200, cvnss.auditRecord(text, { sourceId: body.sourceId || 'api' }));
    return send(res, 404, { error: 'not_found' });
  } catch (error) {
    return send(res, 500, { error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`CVNSS4.0 codec server listening on http://127.0.0.1:${PORT}`);
});
