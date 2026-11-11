'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'addon-pack_standalone.user.js'), 'utf8');
const match = source.match(/window\.V39_NOTIF = window\.V39_NOTIF \|\| \{[\s\S]*?\n    \};/);
assert.ok(match);

test('routine startup notices coalesce while warnings and errors remain visible', () => {
    const rendered = [];
    const timers = [];
    const container = {appendChild: node => rendered.push(node)};
    const document = {createElement: () => ({style: {}, remove() {}})};
    const window = {};
    const context = {window, document, setTimeout: fn => timers.push(fn)};
    vm.runInNewContext(match[0], context);
    window.V39_NOTIF._ensureContainer = () => container;
    window.V39_NOTIF.success('GeoFS-V3.9_Core-Library Loaded.');
    window.V39_NOTIF.success('GeoFS-V3.9_Design-System V2.0.1 Loaded.');
    window.V39_NOTIF.warn('Low fuel');
    window.V39_NOTIF.critical('Engine failure');
    assert.deepEqual(rendered.map(node => node.textContent), ['Low fuel', 'Engine failure']);
    timers.shift()();
    assert.deepEqual(rendered.map(node => node.textContent), ['Low fuel', 'Engine failure', 'GeoFS-V3.9 ready']);
    window.V39_NOTIF.success('GeoFS-V3.9_Fuel-Simulator Loaded.');
    assert.equal(rendered.length, 3);
});
