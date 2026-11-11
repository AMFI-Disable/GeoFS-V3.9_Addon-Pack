'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'addon-pack_standalone.user.js'), 'utf8');
const setter = source.match(/geofs\.autopilot\.setArm = \(a\) => \{[\s\S]*?\n        \};/);
const ticker = source.match(/tickWrapper: \(a\) => \{[\s\S]*?\n            \},/);
assert.ok(setter && ticker);

function scenario({armed, ground}) {
    const buttons = {};
    const events = [];
    const document = {};
    const controls = {throttle: 0.7};
    const geofs = {autopilot: {}, aircraft: {instance: {groundContact: ground}}, utils: {now: () => 1000}, autothrottle: {on: true, tick: () => events.push('tick'), handleError: error => {throw error;}}};
    const $ = key => key === document ? {trigger: name => events.push(name)} : (buttons[key] ||= {classes: {}, attrs: {}, toggleClass(name, value) {this.classes[name] = value; return this;}, attr(name, value) {this.attrs[name] = value; return this;}});
    const context = {geofs, window: {}, document, controls, $};
    vm.runInNewContext(setter[0], context);
    geofs.autopilot.setArm(JSON.stringify(armed));
    const tick = vm.runInNewContext('({' + ticker[0] + '}).tickWrapper', context);
    tick(1100);
    return {buttons, controls, events, geofs};
}

test('armed landing mode commands idle and disengages on touchdown', () => {
    const s = scenario({armed: true, ground: true});
    assert.equal(s.controls.throttle, 0);
    assert.deepEqual(s.events, ['autothrottleOff']);
    assert.equal(s.buttons['#armOn'].attrs['aria-pressed'], 'true');
    assert.equal(s.buttons['#armOff'].attrs['aria-pressed'], 'false');
});

test('off or airborne landing mode continues normal speed control', () => {
    for (const options of [{armed: false, ground: true}, {armed: true, ground: false}]) {
        const s = scenario(options);
        assert.equal(s.controls.throttle, 0.7);
        assert.deepEqual(s.events, ['tick']);
        assert.equal(s.buttons['#armOn'].attrs['aria-pressed'], String(options.armed));
    }
});
