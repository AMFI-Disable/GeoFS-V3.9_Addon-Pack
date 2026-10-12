# Changelog

All notable changes, addon updates, and version releases for the GeoFS-V3.9 Addon Pack are documented in this file.

---

## [1.0.0] - Foundation Reset & Official Ecosystem Master Bundle

> **Architecture Reset**: Complete reimagining and reboot of the Addon Pack from the ground up, resetting from legacy V3 monolithic community scripts to a clean, standardized V1.0.0 foundation composed exclusively of the official GeoFS-V3.9 ecosystem modules.

### Added
- **Official Ecosystem Integration**: Bundled all 13 official GeoFS-V3.9 standalone modules into a unified master userscript:
  - `GeoFS-V3.9_Core-Library`
  - `GeoFS-V3.9_Design-System`
  - `GeoFS-V3.9_Autothrottle`
  - `GeoFS-V3.9_Checklist-System`
  - `GeoFS-V3.9_Failure-Simulator`
  - `GeoFS-V3.9_Flight-Path-Vector`
  - `GeoFS-V3.9_Fuel-Simulator`
  - `GeoFS-V3.9_Information-Display`
  - `GeoFS-V3.9_JetBridge-System`
  - `GeoFS-V3.9_Landing-Statistics`
  - `GeoFS-V3.9_Overpowered-Engines`
  - `GeoFS-V3.9_Realism-Pack`
  - `GeoFS-V3.9_Satellite-Imagery`
- **Encapsulated Scope Architecture**: Wrapped each subsystem in dedicated IIFE scopes to prevent variable collision and ensure crash isolation.
- **Zero-Latency Technical Kernel**: Native integration with `SafeInit`, persistent `localStorage` draggable coordinates, and the glassmorphic design token system.

### Removed
- **Legacy Monolithic Bloat**: Purged unmaintained third-party community scripts (legacy utilities, older third-party realism versions, slew, twlights, skydolly, etc.) in favor of the modernized, high-performance modular ecosystem.

---

## [3.0.1] - Modularity And Architecture Optimization (Legacy)

### Added
- **Failure Simulator Modularization**: Transitioned internal failure mechanics to the standalone `GeoFS-V3.9_Failure-Simulator` module for improved maintainability.
- **Draggable UI Engine**: Draggable buttons and HUD windows with position persistence across browser sessions.
- **Precision Gear Indexing**: Intelligent keyword detection and landing gear index mapping for multi-bogie airframes (A380, B747).

### Fixed
- **Simulation Safety Locks**: Probability sliders locked during active failure simulations to avoid flight phase state resets.
- **Null Safety Safeguards**: Added validation guards for aircraft suspensions and non-standard aircraft parameters.
- **Code Optimization**: Cleaned up legacy monolithic logic and implemented dynamic CDN asset resolution.

---

## [3.0.0] - Modern Ecosystem Overhaul (Legacy)

### Added
- **Design System Integration**: Unified dark-grey and amber/orange glassmorphic design system matching real-world avionics.
- **27+ Bundled Addons**: Unified package bundling flight HUDs, physics enhancements, realistic sound packs, and navigational tools.
- **Draggable Multi-Window Overlay**: Multi-window interface allowing customized instrument arrangements on desktop screens.

---

## [2.1.0] - Avionics And Telemetry Expansion (Legacy)

### Added
- **Flight Path Vector (FPV)**: True velocity vector projection HUD based on Earth-Centered, Earth-Fixed (ECEF) calculations.
- **Autothrottle Integration**: Closed-loop PID speed controller with auto-retard logic.
- **Telemetry HUD Display**: High-precision glassmorphic instruments displaying airspeed, altitude, vertical speed, and Mach number.

---

## [2.0.0] - Flight Physics And Audio Overhaul (Legacy)

### Added
- **Realism Audio & G-Force Effects**: Dynamic atmospheric audio, structural camera shaking, and blackout/redout visual effects.
- **Interactive Fuel System**: Real-time fuel burn simulation, center-of-gravity shifts, and fuel dump mechanics.

---
