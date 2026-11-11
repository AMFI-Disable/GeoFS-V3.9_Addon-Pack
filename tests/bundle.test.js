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

test('every userscript waits for a known version and blocks unsupported versions before side effects', () => {
    const paths = fs.readdirSync(path.join(__dirname, '..', '..', 'GeoFS-V3.9_Standalones')).flatMap(dir => {
        const folder = path.join(__dirname, '..', '..', 'GeoFS-V3.9_Standalones', dir);
        return fs.statSync(folder).isDirectory() ? fs.readdirSync(folder).filter(name => name.endsWith('_standalone.user.js')).map(name => path.join(folder, name)) : [];
    });
    paths.push(path.join(__dirname, '..', 'addon-pack_standalone.user.js'));
    for (const file of paths) {
        const code = fs.readFileSync(file, 'utf8');
        for (const version of [3.8, 4, '3.10', 'unknown']) {
            const window = {geofs: {version}};
            vm.runInNewContext(code, {window, console: {warn() {}}, setTimeout() { throw Error('unexpected timer'); }});
            assert.deepEqual(Object.keys(window), ['geofs'], `${file}: ${version}`);
        }
        let retry;
        const window = {};
        vm.runInNewContext(code, {window, console: {warn() {}}, setTimeout(fn) { retry = fn; }});
        assert.equal(typeof retry, 'function', file);
        assert.deepEqual(Object.keys(window), [], file);
        window.geofs = {version: 4};
        retry();
        assert.deepEqual(Object.keys(window), ['geofs'], file);
    }
});

test('userscripts share metadata and match only the main GeoFS host', () => {
    const standalones = path.join(__dirname, '..', '..', 'GeoFS-V3.9_Standalones');
    const files = fs.readdirSync(standalones).flatMap(name => {
        const dir = path.join(standalones, name);
        return fs.statSync(dir).isDirectory() ? fs.readdirSync(dir).filter(f => f.endsWith('_standalone.user.js')).map(f => path.join(dir, f)) : [];
    });
    files.push(path.join(__dirname, '..', 'addon-pack_standalone.user.js'));
    let common;
    for (const file of files) {
        const header = fs.readFileSync(file, 'utf8').split('// ==/UserScript==')[0];
        const fields = header.split('\n').filter(line => /^\/\/ @/.test(line) && !/^\/\/ @(?:name|description)(?::\S+)?\s/.test(line) && !/^\/\/ @require\s/.test(line));
        assert.deepEqual(fields.filter(line => /^\/\/ @match\s/.test(line)), ['// @match               https://www.geo-fs.com/geofs.php*']);
        assert.ok(fields.includes('// @version             3.9.0'));
        if (common) assert.deepEqual(fields, common, file); else common = fields;
        const dependencies = header.split('\n').filter(line => /^\/\/ @require\s/.test(line));
        const selfContained = /(?:Core-Library|Design-System|Addon-Pack)/.test(file);
        assert.equal(dependencies.length, selfContained ? 0 : 2, file);
    }
});
