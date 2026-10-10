# Changelog

All notable changes, addon updates, and version releases for the GeoFS-V3.9 Addon Pack are documented in this file.

---

## [3.0.1] - Modularity And Architecture Optimization

### Added
- **Failure Simulator Modularization**: Transitioned internal failure mechanics to the standalone `GeoFS-V3.9_Failure-Simulator` module for improved maintainability.
- **Draggable UI Engine**: Draggable buttons and HUD windows with position persistence across browser sessions.
- **Precision Gear Indexing**: Intelligent keyword detection and landing gear index mapping for multi-bogie airframes (A380, B747).

### Fixed
- **Simulation Safety Locks**: Probability sliders locked during active failure simulations to avoid flight phase state resets.
- **Null Safety Safeguards**: Added validation guards for aircraft suspensions and non-standard aircraft parameters.
- **Code Optimization**: Cleaned up legacy monolithic logic and implemented dynamic CDN asset resolution.

---

## [3.0.0] - Modern Ecosystem Overhaul

### Added
- **Design System Integration**: Unified dark-grey and amber/orange glassmorphic design system matching real-world avionics.
- **27+ Bundled Addons**: Unified package bundling flight HUDs, physics enhancements, realistic sound packs, and navigational tools.
- **Draggable Multi-Window Overlay**: Multi-window interface allowing customized instrument arrangements on desktop screens.

---

## [2.1.0] - Avionics And Telemetry Expansion

### Added
- **Flight Path Vector (FPV)**: True velocity vector projection HUD based on Earth-Centered, Earth-Fixed (ECEF) calculations.
- **Autothrottle Integration**: Closed-loop PID speed controller with auto-retard logic.
- **Telemetry HUD Display**: High-precision glassmorphic instruments displaying airspeed, altitude, vertical speed, and Mach number.

---

## [2.0.0] - Flight Physics And Audio Overhaul

### Added
- **Realism Audio & G-Force Effects**: Dynamic atmospheric audio, structural camera shaking, and blackout/redout visual effects.
- **Interactive Fuel System**: Real-time fuel burn simulation, center-of-gravity shifts, and fuel dump mechanics.

---

## [1.0.0] - Initial Public Release

### Added
- **Core Addon Collection**: Initial release uniting foundational community addons under a shared userscript runner.
