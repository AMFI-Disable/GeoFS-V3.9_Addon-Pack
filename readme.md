# GeoFS-V3.9_Addon-Pack

![Version](https://img.shields.io/badge/Version-v3.9.0-3b82f6?style=flat-square)

A bundled userscript for the GeoFS-V3.9 ecosystem, combining the shared libraries and standalone add-ons into one package.

## Included components

- **Core Library and Design System:** Shared initialization, GeoFS-style controls, the HUD, and notifications.
- **Autothrottle:** Speed control and an optional landing mode that retards thrust at touchdown.
- **Checklist System, Fuel Simulator, Information Display, and Realism Pack:** Shared HUD tabs, ordered INFO → FUEL → CHECKS → REALISM when available.
- **Failure Simulator:** Configurable system failures and repairs.
- **Flight Path Vector:** A toggleable marker showing the aircraft's projected movement.
- **Landing Statistics:** Touchdown measurements and a landing report.
- **Overpowered Engines:** Thrust, altitude ceiling, and stability controls.
- **Satellite Imagery:** Esri World Imagery and terrain settings. Tile availability depends on the shared Esri key and its usage allowance.

The **GeoFS-V3.9_Ecosystem** startup panel closes after all components are detected. It stays open and identifies components that are not detected or failed; dismiss it with ×. Runtime messages appear as separate temporary banners.

## Installation

1. Install a userscript manager such as [Tampermonkey](https://www.tampermonkey.net/).
2. Install the bundle from this repository, or install individual scripts from the [Greasy Fork collection](https://greasyfork.org/en/scripts?set=594718).
3. Open or reload GeoFS V3.9. Avoid enabling both the bundle and the same standalone scripts together.

The bundle activates only when GeoFS reports version V3.9 (including V3.9 patch releases). It waits for the version to become available and remains inactive on other versions.

## Development and validation

Run `python3 scripts/assemble.py` to rebuild the bundle from the sibling standalone scripts, or `python3 scripts/assemble.py --check` to check for drift. Run `node --check addon-pack_standalone.user.js` and `node --test tests/*.test.js` for syntax and bundle checks. These checks do not replace a flight test in GeoFS.

## License

[MIT](license) · © 2026 AMFI-Disable · [GeoFS-V3.9 Ecosystem](https://sites.google.com/view/geofs-v39-ecosystem/home)
