'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'addon-pack_standalone.user.js'), 'utf8');

test('bundle contains the 12 supported modules in order', () => {
    const names = [...source.matchAll(/^\/\/ MODULE (\d+): GeoFS-V3\.9_(.+)$/gm)];
    assert.deepEqual(names.map(m => Number(m[1])), Array.from({length: 12}, (_, i) => i + 1));
    assert.equal(new Set(names.map(m => m[2])).size, 12);
    assert.ok(!names.some(m => m[2] === 'JetBridge-System'));
});

test('version guard permits 3.9 and blocks 4.0 and newer', () => {
    const guard = source.match(/function isUnsupportedGeoFS\(\) \{[\s\S]*?\n    \}/);
    assert.ok(guard, 'bundle guard exists');
    for (const [version, expected] of [[3.9, false], ['v3.9', false], [4, true], ['v4.0', true], ['5.1', true]]) {
        assert.equal(vm.runInNewContext(`(${guard[0]})()`, {window: {geofs: {version}}}), expected);
    }
});

test('bundle stops before initializing modules on GeoFS 4', () => {
    const warnings = [];
    const window = {geofs: {version: '4.0'}};
    vm.runInNewContext(source, {window, console: {warn: message => warnings.push(message)}});
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /Inactive/);
    assert.equal(window.SafeInit, undefined);
});
