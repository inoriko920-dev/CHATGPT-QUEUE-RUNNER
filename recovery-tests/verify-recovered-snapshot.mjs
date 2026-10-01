#!/usr/bin/env node
/**
 * PROVENANCE: RECONSTRUCTED_FROM_DOCS
 * LEGACY_TEST: false
 * PURPOSE: Recovery R0 snapshot/static verifier only.
 *
 * This harness MUST NOT be interpreted as Chrome integration or ChatGPT live
 * behavior evidence. It validates the recovered 10-runner source layout,
 * expected rescue hashes, manifest structure/version, and JavaScript syntax.
 *
 * Intended source under test:
 *   recovery/chat1-source-r0
 *   commit 4719c0e17e83bf03afd141b96156614f83b9631a
 */

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

const sourceRoot = resolve(process.argv[2] || 'extensions');
const expectedSourceCommit = '4719c0e17e83bf03afd141b96156614f83b9631a';

const runnerIds = Array.from({ length: 10 }, (_, i) => String(i + 1).padStart(2, '0'));
const expectedFiles = [
  'README.md',
  'background.js',
  'content.js',
  'interruption-bypass.js',
  'manifest.json',
  'popup.css',
  'popup.html',
  'popup.js',
];

const sharedHashes = {
  'background.js': '364dc52071af76bf7415ac75d56aea7c90a223a0f866261a8c1bb1592b498404',
  'content.js': '617ae14755f95e7d71aa704ca88ecd9ccdd92b6f8cfbdeb750eac7ada1a79db0',
  'popup.css': 'a72dca032ab900c87cbf99c906233245b7b4969b1049ea02b3c91538d85e9106',
  'popup.html': 'e52a558348f475beb5b7046075c01d0e9c895be4a022c77242f613f0baeb50ac',
  'popup.js': '407b95e74db771a3c38c63d29c9701a095420d9565e25748d9727db57928bf57',
  'README.md': '5afd3061028a970452b8da215c35b54a62d9614af8bb4b323a73a90dbee499a7',
};

const interruptionHashes = {
  '01': 'b7c4d6f1257ccbeb4c8a24093bc9b11bc2604f188ab1024ff178cd88c12f8632',
  '02': '90843c3ae52a13498e3e8ab047114abf6d28f16a86dd76bfb09c55925ff57db3',
  '03': '125def3f9964e1c6a9de3c9a5a503110411fb4fc12a6dc0c839b7b0e06f38341',
  '04': '43197f4b62182dd6ef56b6d0f462830e75b51b9a8b074c1f30c4858d6a929f76',
  '05': '810f10f498ca19227aa095cafec7aeb85b0157815dd7e71b58eb82b67b67a984',
  '06': '693c5a5a21b1ec50360fa2a014fbcdca84484c93c7037f90db7630cd48c508ca',
  '07': '693c5a5a21b1ec50360fa2a014fbcdca84484c93c7037f90db7630cd48c508ca',
  '08': '693c5a5a21b1ec50360fa2a014fbcdca84484c93c7037f90db7630cd48c508ca',
  '09': '693c5a5a21b1ec50360fa2a014fbcdca84484c93c7037f90db7630cd48c508ca',
  '10': '693c5a5a21b1ec50360fa2a014fbcdca84484c93c7037f90db7630cd48c508ca',
};

const manifestHashes = {
  '01': 'fddb6623b6089b1ec64376ea3aee0c4f1725598c1dacbd5a5a47a02cee79db1d',
  '02': '16d1061992331bf00ab8dcbb60f0ee0a44e320f64a569bcd988b5d871d7e9835',
  '03': '5abcacd9d02df6705f1f90485ea8fab58d5e8a1f57dad5676cecca436f32cbf8',
  '04': '9b7f88cfddfb2b9fd7af492eed649a24abe93ac0fa995719e24848960d938219',
  '05': '79ae39f0b89dbe96de5ee115b9b6fa3822bd53764c8682a234998ce52ebeafb5',
  '06': '23867b50d73a524be85f4d624f4776ff017fe2475e6a473a7ffe627503b753f3',
  '07': 'f08013e8f2dbf14b6c65ca29b2368a49c9e99c16f1dd3816f769b3aac919d216',
  '08': 'df193392abaf70fb8843ce32fde1acd34d6584ab79d108561f20ee2bfd53c4ed',
  '09': 'dac2a04c1c722bc2f3bf5ff0c6272417a6e1d84375837113507e30df96ad8ddd',
  '10': 'a4c3a430087df646fed77f25e177636f55a7d451ac66cb3cc0569b5585e66128',
};

let failures = 0;
let checks = 0;
let jsChecked = 0;

function pass(message) {
  checks += 1;
  console.log(`PASS: ${message}`);
}

function fail(message) {
  checks += 1;
  failures += 1;
  console.error(`FAIL: ${message}`);
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function expect(condition, message) {
  condition ? pass(message) : fail(message);
}

console.log('CHATGPT-QUEUE-RUNNER Recovery R0 snapshot verifier');
console.log(`PROVENANCE=RECONSTRUCTED_FROM_DOCS`);
console.log(`LEGACY_TEST=false`);
console.log(`EXPECTED_SOURCE_COMMIT=${expectedSourceCommit}`);
console.log(`SOURCE_ROOT=${sourceRoot}`);
console.log(`NODE=${process.version}`);
console.log('NOTE: This is static/snapshot evidence only; not Chrome or ChatGPT live behavior.');

if (!existsSync(sourceRoot) || !statSync(sourceRoot).isDirectory()) {
  console.error(`FAIL: source root not found: ${sourceRoot}`);
  process.exit(2);
}

const actualRunnerDirs = readdirSync(sourceRoot)
  .filter((name) => {
    const p = join(sourceRoot, name);
    return statSync(p).isDirectory() && /^chat-queue-runner-\d{2}$/.test(name);
  })
  .sort();

const expectedRunnerDirs = runnerIds.map((id) => `chat-queue-runner-${id}`);
expect(JSON.stringify(actualRunnerDirs) === JSON.stringify(expectedRunnerDirs), 'runner directories are exactly 01 through 10');

for (const id of runnerIds) {
  const runnerDir = join(sourceRoot, `chat-queue-runner-${id}`);
  if (!existsSync(runnerDir)) {
    fail(`Runner ${id} directory exists`);
    continue;
  }

  const actualFiles = readdirSync(runnerDir).filter((name) => statSync(join(runnerDir, name)).isFile()).sort();
  expect(JSON.stringify(actualFiles) === JSON.stringify([...expectedFiles].sort()), `Runner ${id} contains exactly 8 expected files`);

  for (const [name, expectedHash] of Object.entries(sharedHashes)) {
    const path = join(runnerDir, name);
    if (!existsSync(path)) {
      fail(`Runner ${id} ${name} exists`);
      continue;
    }
    expect(sha256(path) === expectedHash, `Runner ${id} ${name} SHA-256 matches verified rescue`);
  }

  const interruptionPath = join(runnerDir, 'interruption-bypass.js');
  if (existsSync(interruptionPath)) {
    expect(sha256(interruptionPath) === interruptionHashes[id], `Runner ${id} interruption-bypass.js SHA-256 matches verified rescue`);
  }

  const manifestPath = join(runnerDir, 'manifest.json');
  if (existsSync(manifestPath)) {
    expect(sha256(manifestPath) === manifestHashes[id], `Runner ${id} manifest.json SHA-256 matches verified rescue`);
    try {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
      expect(manifest.manifest_version === 3, `Runner ${id} manifest_version is 3`);
      expect(manifest.version === '0.1.8', `Runner ${id} version is 0.1.8`);
      expect(manifest.background?.service_worker === 'background.js', `Runner ${id} background service worker is background.js`);
      expect(manifest.action?.default_popup === 'popup.html', `Runner ${id} popup is popup.html`);
      const scripts = manifest.content_scripts?.[0]?.js || [];
      expect(JSON.stringify(scripts) === JSON.stringify(['interruption-bypass.js', 'content.js']), `Runner ${id} content script order matches recovered manifest`);
    } catch (error) {
      fail(`Runner ${id} manifest parses: ${error.message}`);
    }
  }

  for (const jsName of ['background.js', 'content.js', 'interruption-bypass.js', 'popup.js']) {
    const path = join(runnerDir, jsName);
    if (!existsSync(path)) continue;
    const result = spawnSync(process.execPath, ['--check', path], { encoding: 'utf8' });
    jsChecked += 1;
    if (result.status === 0) {
      pass(`node --check ${relative(process.cwd(), path)}`);
    } else {
      fail(`node --check ${relative(process.cwd(), path)} :: ${(result.stderr || result.stdout || '').trim()}`);
    }
  }
}

expect(jsChecked === 40, `exactly 40 JavaScript files syntax-checked (actual ${jsChecked})`);

console.log(`SUMMARY: checks=${checks} failures=${failures} js_checked=${jsChecked}`);
if (failures > 0) {
  process.exit(1);
}
console.log('RESULT: PASS (snapshot/static only)');
