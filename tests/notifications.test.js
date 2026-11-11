'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'addon-pack_standalone.user.js'), 'utf8');
const start = source.indexOf('    /** Startup status and independent');
const end = source.indexOf('    /**\n     * Module Guard', start);
assert.ok(start >= 0 && end > start);
function makeElement() {
    return {style: {}, children: [], isConnected: true,
        setAttribute() {}, appendChild(child) { child.parent = this; this.children.push(child); },
        append(...children) { children.forEach(child => this.appendChild(child)); },
        addEventListener(name, fn) { this[name] = fn; },
        remove() { this.isConnected = false; if (this.parent) this.parent.children = this.parent.children.filter(x => x !== this); }};
}
function setup() {
    const body = makeElement(), timers = [], intervals = [];
    const document = {body, createElement: makeElement, getElementById: () => null};
    const window = {V39_NOTIF: {legacy: true}, SafeInit() {}};
    const context = {window, document, setTimeout: (fn, ms) => { const t = {fn, ms}; timers.push(t); return t; },
        clearTimeout: t => { if (t) t.cleared = true; }, setInterval: fn => (intervals.push(fn), 1), clearInterval() {}};
    vm.runInNewContext(source.slice(start, end), context);
    return {window, body, timers, intervals};
}
test('missing scripts remain visible, and runtime messages get separate banners', () => {
    const {window, body, timers, intervals} = setup(); const panel = body.children[0];
    assert.equal(panel.children[0].children[0].textContent, 'GeoFS-V3.9_Ecosystem');
    timers.find(t => t.ms === 18000).fn();
    assert.match(panel.children[1].textContent, /Not detected/);
    assert.equal(panel.isConnected, true);
    window.V39_NOTIF.success('Thrust Active: 2x Multiplier');
    window.V39_NOTIF.success('Thrust Active: 3x Multiplier');
    const banners = body.children[1];
    assert.equal(banners.children.length, 2);
    assert.match(banners.children[0].textContent, /2x/);
    assert.match(banners.children[1].textContent, /3x/);
    timers.filter(t => t.ms === 4000)[0].fn();
    assert.equal(banners.children.length, 1);
    assert.equal(panel.isConnected, true);
    panel.children[0].children[1].click();
    assert.equal(panel.isConnected, false);
});
test('late arrivals complete startup and dismiss the panel', () => {
    const {window, body, timers} = setup(); const panel = body.children[0];
    timers.find(t => t.ms === 18000).fn();
    for (const name of ['Core-Library', 'Design-System', 'Information-Display', 'Checklist-System', 'Fuel-Simulator', 'Failure-Simulator', 'Realism-Pack', 'Landing-Statistics', 'Flight-Path-Vector', 'Autothrottle', 'Overpowered-Engines', 'Satellite-Imagery']) window.V39_NOTIF.status('GeoFS-V3.9_' + name, 'ready');
    assert.doesNotMatch(panel.children[1].textContent, /Not detected/);
    timers.find(t => t.ms === 2000 && !t.cleared).fn();
    assert.equal(panel.isConnected, false);
});
test('failure keeps the startup panel open', () => {
    const {window, body, timers} = setup(); const panel = body.children[0];
    window.V39_NOTIF.critical('GeoFS-V3.9_Fuel-Simulator Boot Failure.');
    timers.find(t => t.ms === 18000).fn();
    assert.match(panel.children[1].textContent, /Failed to start: Fuel-Simulator/);
    assert.equal(panel.isConnected, true);
});
