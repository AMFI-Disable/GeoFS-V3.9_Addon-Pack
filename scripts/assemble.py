#!/usr/bin/env python3
"""Synchronize the bundle with sibling standalone checkouts; use --check in reviews."""
import argparse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STANDALONES = ROOT.parent / 'GeoFS-V3.9_Standalones'
BUNDLE = ROOT / 'addon-pack_standalone.user.js'
MODULES = [
    ('Core-Library', 'core-library'), ('Design-System', 'design-system'),
    ('Autothrottle', 'autothrottle'), ('Checklist-System', 'checklist-system'),
    ('Failure-Simulator', 'failure-simulator'), ('Flight-Path-Vector', 'flight-path-vector'),
    ('Fuel-Simulator', 'fuel-simulator'), ('Information-Display', 'information-display'),
    ('Landing-Statistics', 'landing-statistics'), ('Overpowered-Engines', 'overpowered-engines'),
    ('Realism-Pack', 'realism-pack'), ('Satellite-Imagery', 'satellite-imagery'),
]
MARKER = re.compile(r'// ={20,}\n// MODULE \d+: GeoFS-V3\.9_[^\n]+\n// ={20,}\n')
FOOTER = "    console.info('[GeoFS-V3.9_Addon-Pack] >> All ecosystem modules loaded and running.');"


def assemble(original):
    first = MARKER.search(original)
    end = original.rfind(FOOTER)
    if not first or end < first.end():
        raise ValueError('Bundle module boundaries not found')
    sections = []
    for number, (name, filename) in enumerate(MODULES, 1):
        path = STANDALONES / ('GeoFS-V3.9_' + name) / (filename + '_standalone.user.js')
        source = path.read_text(encoding='utf-8')
        header, separator, body = source.partition('// ==/UserScript==')
        if not separator or '// ==UserScript==' not in header:
            raise ValueError(f'Invalid userscript header: {path}')
        body = body.strip()
        sections.append(f'// ============================================================\n// MODULE {number}: GeoFS-V3.9_{name}\n// ============================================================\n{body}\n\n')
    return original[:first.start()] + ''.join(sections) + original[end:]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='report drift without writing')
    args = parser.parse_args()
    original = BUNDLE.read_text(encoding='utf-8')
    result = assemble(original)
    if args.check:
        if original != result:
            raise SystemExit('Bundle differs from standalone modules; run python3 scripts/assemble.py')
        print('Bundle matches all standalone modules.')
    else:
        BUNDLE.write_text(result, encoding='utf-8')
        print('Bundle synchronized from standalone modules.')


if __name__ == '__main__':
    main()
