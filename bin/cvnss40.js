#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const cvnss = require('../src');

function help() {
  console.log(`CVNSS4.0 Codec/IR CLI

Usage:
  cvnss40 encode "Tiếng Việt" [--profile canonical|user|nlp|id|secure|compact|verbose] [--json]
  cvnss40 decode "Cvnss text" [--json]
  cvnss40 ir "Tiếng Việt" [--json]
  cvnss40 id "Tên sản phẩm / địa danh" [--prefix BT]
  cvnss40 audit "Nội dung log" [--source sensor-01]
  cvnss40 encode --file input.txt --out output.txt

Examples:
  cvnss40 encode "Qua phà nghiêng ngó lồng gà"
  cvnss40 decode "Qa fal wizy woj logd gal"
  cvnss40 ir "Bến Tre ứng dụng GIS và RFID" --json
`);
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const args = { command, textParts: [] };
  for (let i = 0; i < rest.length; i += 1) {
    const item = rest[i];
    if (item.startsWith('--')) {
      const key = item.slice(2);
      if (['json'].includes(key)) args[key] = true;
      else args[key] = rest[++i];
    } else {
      args.textParts.push(item);
    }
  }
  return args;
}

function readInput(args) {
  if (args.file) return fs.readFileSync(path.resolve(args.file), 'utf8');
  return args.textParts.join(' ');
}

function writeOutput(args, value) {
  if (args.out) fs.writeFileSync(path.resolve(args.out), value, 'utf8');
  else console.log(value);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.command || args.command === 'help' || args.command === '--help') return help();
  const input = readInput(args);
  let result;

  switch (args.command) {
    case 'encode':
      result = cvnss.encode(input, { profile: args.profile || 'canonical', includeTokens: !!args.json });
      writeOutput(args, args.json ? JSON.stringify(result, null, 2) : result.output);
      break;
    case 'decode':
      result = cvnss.decode(input, { profile: args.profile || 'canonical', includeTokens: !!args.json });
      writeOutput(args, args.json ? JSON.stringify(result, null, 2) : result.output);
      break;
    case 'ir':
      result = cvnss.toIR(input, { profile: args.profile || 'nlp' });
      writeOutput(args, JSON.stringify(result, null, 2));
      break;
    case 'id':
      result = cvnss.makeId(input, { idPrefix: args.prefix || 'CV40' });
      writeOutput(args, args.json ? JSON.stringify(result, null, 2) : result.output);
      break;
    case 'audit':
      result = cvnss.auditRecord(input, { sourceId: args.source || 'cli' });
      writeOutput(args, JSON.stringify(result, null, 2));
      break;
    default:
      console.error(`Unknown command: ${args.command}`);
      process.exitCode = 1;
      help();
  }
}

main();
