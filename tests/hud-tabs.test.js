'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'addon-pack_standalone.user.js'), 'utf8');
const match = source.match(/window\.registerHUDTab = \(tabId, label, contentHTML, isGrid\) => \{[\s\S]*?\n    \};/);
assert.ok(match, 'HUD registration function exists');

function setup() {
    const nodes = new Map();
    const tabs = {children: [], style: {}, insertBefore(node, next) {
        const position = next ? this.children.indexOf(next) : this.children.length;
        this.children.splice(position, 0, node);
        nodes.set(node.id, node);
    }};
    const panel = {appendChild(node) { nodes.set(node.id, node); }};
    nodes.set('hud-unified-tabs', tabs);
    nodes.set('flightDataDisplay', panel);
    const document = {
        getElementById: id => nodes.get(id),
        createElement: () => ({}),
        querySelector: () => ({}),
    };
    const window = {ensureSharedHUD() {}, switchHUDProTab() {}};
    vm.runInNewContext(match[0], {window, document, console: {log() {}, error() {}}});
    return {tabs, register: id => window.registerHUDTab(id, id, '', false)};
}

function permutations(items) {
    if (items.length < 2) return [items];
    return items.flatMap((item, i) => permutations(items.filter((_, j) => i !== j)).map(rest => [item, ...rest]));
}

test('HUD tabs retain the requested order and fill the row for every subset and load order', () => {
    const expected = ['id', 'fuel', 'checks', 'realism'];
    for (let mask = 1; mask < 16; mask++) {
        const subset = expected.filter((_, i) => mask & (1 << i));
        for (const order of permutations(subset)) {
            const {tabs, register} = setup();
            order.forEach(register);
            register(order[0]); // Duplicate registration must not add a tab.
            assert.deepEqual(tabs.children.map(node => node.id), subset.map(id => `tab-btn-${id}`));
            assert.equal(tabs.style.gridTemplateColumns, `repeat(${subset.length}, minmax(0, 1fr))`);
        }
    }
});

test('additional tabs remain available after the four standard tabs', () => {
    const {tabs, register} = setup();
    ['custom', 'realism', 'id', 'checks', 'fuel'].forEach(register);
    assert.deepEqual(tabs.children.map(node => node.id), ['id', 'fuel', 'checks', 'realism', 'custom'].map(id => `tab-btn-${id}`));
});
