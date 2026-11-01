# CREDITS.md — Acknowledgements & Licences 💜

This document records all software libraries, fonts, and open-source resources used in **"A Little Universe Called Subashree"**, as required by PRD §17.4 and verified against official licence registries.

---

## 1. Core Software Libraries

| Package | Version | Author / Maintainer | Source URL | Licence | Date Verified | Where Used |
|---|---|---|---|---|---|---|
| `react` & `react-dom` | `^19.0.0` | Meta Platforms, Inc. & React Community | https://react.dev | MIT (https://opensource.org/licenses/MIT) | 2026-11-01 | Entire application UI, component lifecycle & state management |
| `vite` | `^6.0.0` | Evan You & Vite Contributors | https://vite.dev | MIT (https://opensource.org/licenses/MIT) | 2026-11-01 | Build tooling, development server & static asset bundling |
| `typescript` | `^5.6.0` | Microsoft Corporation | https://www.typescriptlang.org | Apache-2.0 (https://www.apache.org/licenses/LICENSE-2.0) | 2026-11-01 | Type definitions and compile-time contract enforcement |
| `canvas-confetti` | `^1.9.4` | Kiril Vatev (@catdad) | https://github.com/catdad/canvas-confetti | ISC (https://opensource.org/licenses/ISC) | 2026-11-01 | Celebration moments (Entrance YES, Countdown burst, Cake wish reveal) |

---

## 2. Dev-Only Tools

| Package | Author / Maintainer | Source URL | Licence | Date Verified | Where Used |
|---|---|---|---|---|---|
| `sharp` | Lovell Fuller | https://sharp.pixelplumbing.com | Apache-2.0 | 2026-11-01 | Image scanning, EXIF stripping, and WebP generation pipeline |
| `music-metadata` | Borewit | https://github.com/Borewit/music-metadata | MIT | 2026-11-01 | Local audio tag parsing during asset inventory scan |

---

## 3. Typography (Self-Hosted via Fontsource)

All fonts are self-hosted within the bundle; **zero third-party requests or external Google Fonts CDN calls are made at runtime.**

| Typeface | Creator / Foundry | Package | Licence | Date Verified | Where Used |
|---|---|---|---|---|---|
| **Nunito** | Vernon Adams, Cyreal, Jacques Le Bailly | `@fontsource/nunito` | SIL Open Font License 1.1 (OFL-1.1) | 2026-11-01 | Primary sans-serif UI text, buttons, body copy, helper notes |
| **Caveat** | Pablo Impallari | `@fontsource/caveat` | SIL Open Font License 1.1 (OFL-1.1) | 2026-11-01 | Handwritten diary style: Oviya's letter, polaroid captions, quotes |
| **Noto Serif Tamil** | Google Fonts team | `@fontsource/noto-serif-tamil` | SIL Open Font License 1.1 (OFL-1.1) | 2026-11-01 | Tamil poetry verses (Kavithaigal) |
| **Noto Sans Tamil** | Google Fonts team | `@fontsource/noto-sans-tamil` | SIL Open Font License 1.1 (OFL-1.1) | 2026-11-01 | Tamil UI headings & subtitle elements |

---

## 4. Visual Art, Illustrations & Characters

| Asset | Creator | Source | Licence | Notes |
|---|---|---|---|---|
| Kawaii Cats & Penguins | Antigravity Agent | Bespoke inline SVG (`src/components/Character.tsx`) | Dedicated to Oviya & Subashree (Free / Unrestricted) | Original vectors designed with soft pastel palette, dot eyes, and blush cheeks. No trademarked characters (Sanrio, Disney, etc.) used. |
| 3-Tier Birthday Cake | Antigravity Agent | Bespoke inline SVG (`src/sections/Cake.tsx`) | Dedicated to Oviya & Subashree (Free / Unrestricted) | Illustrated purple-lavender cake with animated SVG flames, frosting drips, and sugar flowers. |
| Botanical Garden Flowers | Antigravity Agent | Bespoke inline SVG (`src/sections/Flowers.tsx`) | Dedicated to Oviya & Subashree (Free / Unrestricted) | Original illustrations for Lavender, Tulip, Rose, Daisy, Lily, and Wildflower. |
| Vinyl Record Player UI | Antigravity Agent | Bespoke SVG & CSS (`src/sections/MusicRoom.tsx`) | Dedicated to Oviya & Subashree (Free / Unrestricted) | Interactive spinning record player with tonearm and vinyl grooves. |

---

## 5. Audio & Sound Effects (SFX)

| Asset | Source | Licence | Implementation Details |
|---|---|---|---|
| Sound Effects (Chime, Pop, Sparkle, Tick, Whoosh, Soft Click) | Web Audio API Synthesis (`src/audio/sfx.ts`) | Self-authored code (MIT compatible) | 100% procedurally synthesized in real-time using native browser `OscillatorNode` and `GainNode`. Zero external audio sample files, zero copyright encumbrance. |

---

## 6. Personal Media & Attributions

| Item | Contributor | Privacy & Usage Note |
|---|---|---|
| **Memories & Photographs (37 photos)** | Oviya B. & Subashree | Private personal media. EXIF metadata stripped. For private display only. |
| **Video Memories (4 clips)** | Oviya B. & Subashree | Private personal media. Embedded with native HTML5 `<video>` with user-initiated playback. |
| **Lord Perumal Image (`perumal2.jpeg`)** | User supplied | Sacred blessing image. Displayed uncropped and untilted with respectful golden glow styling. |
| **Tamil Kavithaigal (Poems B1–B7)** | Original works provided in PRD Appendix B | Gift poetry composed specifically for Subashree's birthday. |
| **Letters & Wish Texts** | Oviya B. (PRD Appendix A) | Personal friendship message from Oviya to Subashree. |

