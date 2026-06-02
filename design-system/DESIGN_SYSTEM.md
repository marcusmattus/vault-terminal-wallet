# Vault Terminal Wallet — Design System

A complete brand + design system for **Vault Terminal Wallet**: a military-grade, terminal-native crypto wallet with KYC verification, biometric access, transaction risk scoring, and a command-line mobile interface.

## Sources

| Asset | Description |
|---|---|
| `uploads/ChatGPT Image May 28, 2026, 02_09_37 PM.png` | App icon / logo concept — geometric "T" inside terminal window, neon green glow |
| Product brief (pasted) | Full feature spec, screen map, tech stack, brand direction, color tokens |

> No Figma file or codebase repo was provided. This design system was synthesized from the brand brief and uploaded logo asset.

---

## Product Overview

**Vault Terminal Wallet** is an Expo React Native app that combines:

- **Wallet layer** — create/import wallets, send/receive crypto, connect dApps
- **Security layer** — biometric unlock, PIN fallback, risk scoring, address screening, spending limits
- **KYC layer** — 5-tier verification (UNVERIFIED → FULL_VERIFIED) gating transaction limits
- **Terminal UI** — command-line aesthetic, monospace fonts, green-on-black, CRT scanlines

**Target user:** crypto-native developers, institutional operators, privacy-first power users. **Not** casual retail crypto apps.

**Tech stack:** Expo Router · TypeScript · NativeWind · Zustand · React Query · ethers.js/viem · Sumsub/Onfido KYC · TRM Labs AML · Supabase/Hono API

---

## CONTENT FUNDAMENTALS

### Tone
- **Precise, tactical, encrypted.** Every string reads like a system log or terminal output.
- Calm authority — never excited, never casual, never emoji.
- Institutional gravitas with hacker-terminal efficiency.

### Voice rules
- **System → User** (the wallet speaks to the operator, not a consumer)
- Third person system logs preferred over first person: `> session established` not `We set up your session`
- Commands and status are **lowercase** with `>` prefix: `> biometric layer active`
- UI labels are **UPPERCASE** or Title Case for headers; lowercase for prompts
- No contractions in system messages. No exclamation marks. No em-dashes in UI copy.
- Numbers are always formatted with precision: `0.003821 ETH`, not `~0.004 ETH`

### Copy examples
```
> initializing secure wallet...
> biometric layer active
> kyc status: FULL_VERIFIED
> address risk engine: online
> vault ready

TRANSACTION CONFIRMED
Risk Score: LOW [12/100]
0.15000000 ETH → 0x4f3a...9d2e
```

### KYC status strings
```
UNVERIFIED   BASIC_VERIFIED   FULL_VERIFIED   RESTRICTED   SUSPENDED
```

### Casing rules
- Screen titles: `WALLET DASHBOARD`, `SECURITY CENTRE`, `KYC STATUS`
- Labels: `NETWORK`, `BALANCE`, `RISK SCORE`
- Terminal prompts: `> scanning address...`
- Values: `0.00314159 BTC`, `$4,821.33`

---

## VISUAL FOUNDATIONS

### Color Philosophy
Deep black canvas with neon terminal green as the primary signal color. The palette is deliberately narrow — every color carries semantic weight. No decorative color.

### Color System
| Token | Value | Role |
|---|---|---|
| `--bg-primary` | `#050505` | Main app background |
| `--bg-secondary` | `#0D1117` | Cards, panels |
| `--bg-elevated` | `#161B22` | Modals, popovers |
| `--green-primary` | `#00FF88` | Primary text, active states, CTA |
| `--green-secondary` | `#39FFB6` | Hover states, secondary highlights |
| `--green-dim` | `#00994D` | Inactive/muted green elements |
| `--cyan-accent` | `#00D1FF` | Links, network indicators, data |
| `--yellow-warning` | `#FFCC00` | Warnings, BASIC_VERIFIED status |
| `--red-danger` | `#FF4D4D` | Errors, RESTRICTED, high-risk txns |
| `--border-subtle` | `#1F2937` | Card borders, dividers |
| `--border-active` | `#00FF88` | Focus rings, active card borders |
| `--text-muted` | `#8B949E` | Labels, secondary text |
| `--text-dim` | `#3D4A5C` | Disabled, placeholders |
| `--white` | `#FFFFFF` | High-contrast values |

### Typography
**All UI text is monospace.** This is a hard rule — the terminal aesthetic depends on it.

- **Primary:** JetBrains Mono — used for all terminal output, prompts, values
- **Secondary:** Space Mono — used for headers, section titles
- **Tertiary:** IBM Plex Mono — used for code blocks, addresses, hashes
- **System/Labels:** Inter — used only for non-terminal UI labels (sparingly)

Type scale is functional, not decorative. No display type. No serifs.

### Backgrounds
- **Solid black** (`#050505`) as base — no gradients, no images
- Subtle `#0D1117` for card surfaces — a barely-perceptible lift
- **CRT scanlines** as optional CSS overlay (repeating horizontal lines, ~3% opacity)
- **Glow effects** via `box-shadow` / `text-shadow` using green primary

### Animation
- Terminal typing: character-by-character reveal at ~40ms/char
- Blinking cursor: `opacity` 0↔1, 600ms interval, `step-end` easing
- Scan sweeps: vertical line traversal, 1.2s linear
- Transitions: `200ms ease` for state changes; no bounce, no spring
- Loading: encrypted progress bars (filling left-to-right with green)
- **No decorative animations** — every motion has a security-system purpose

### Hover/Press States
- Hover: green glow intensifies (`box-shadow` spreads); `--green-secondary` text tint
- Press: slight scale down (`scale(0.97)`), brightness bump
- Focus: 1px solid `--green-primary` ring, glow spread

### Borders
- Default card border: `1px solid #1F2937`
- Active/focus border: `1px solid #00FF88`
- Glow border: `1px solid #00FF88` + `box-shadow: 0 0 8px rgba(0,255,136,0.4)`
- No border-radius on hard terminal elements; subtle `4px` radius on cards

### Shadows / Glow
- Primary glow: `0 0 12px rgba(0,255,136,0.35), 0 0 40px rgba(0,255,136,0.12)`
- Subtle glow: `0 0 6px rgba(0,255,136,0.2)`
- Warning glow: `0 0 8px rgba(255,204,0,0.4)`
- Danger glow: `0 0 8px rgba(255,77,77,0.4)`
- No traditional drop shadows — only neon glows

### Corner Radii
- Terminal cards: `4px` (nearly square — tactical)
- App icon / modal: `12px`
- Badges / chips: `2px`
- Buttons: `4px`

### Cards
- Background: `#0D1117`
- Border: `1px solid #1F2937`
- Hover: border becomes `#00FF88`, adds glow
- No inner shadow; outer glow on active state
- Padding: `16px` (compact terminal density)

### Imagery
- No photography
- No illustrations
- Data visualization only (charts, network graphs, risk gauges)
- Everything rendered in the terminal palette

### Layout Rules
- **Mobile-first**: 390px wide design base
- Dense information layout — no wasted whitespace
- Fixed-width monospace values aligned on decimal point
- Status bars always visible; no hidden chrome
- Terminal prompt line always anchored to bottom of screen context

---

## ICONOGRAPHY

Lucide Icons (via CDN) — `https://unpkg.com/lucide@latest` — thin stroke, geometric, sharp corners. Matches terminal aesthetic well.

Icon size: `20px` standard, `16px` compact, `24px` featured.
Icon color: inherits from context (`--green-primary`, `--text-muted`, status colors).
No icon fills — outline only.
No emoji used anywhere in the product.

**Custom icon assets:** See `assets/icons/` for SVG versions of key wallet icons.

**Key icons used:**
| Usage | Lucide name |
|---|---|
| Wallet | `wallet` |
| Send | `send` |
| Receive | `download` |
| Shield / Security | `shield-check` |
| Biometric | `fingerprint` |
| Vault | `lock` |
| Network | `activity` |
| Transaction | `arrow-right-left` |
| Alert | `alert-triangle` |
| Terminal | `terminal` |
| Settings | `settings` |
| KYC | `user-check` |
| Risk | `zap` |
| Device | `smartphone` |

---

## File Index

Paths are relative to the repo root.

```
design-system/
├── DESIGN_SYSTEM.md              ← This file
└── colors_and_type.css           ← CSS variables (colors, type, spacing, glows)

assets/
├── brand/
│   ├── logo-main.svg             ← Horizontal wordmark + symbol
│   ├── logo-symbol.svg           ← Terminal T symbol only
│   └── logo-monochrome.svg       ← White/gray monochrome version
└── icons/                        ← Custom SVG icon set
    ├── wallet.svg
    ├── send.svg
    ├── receive.svg
    ├── shield.svg
    ├── biometric.svg
    ├── vault.svg
    ├── network.svg
    ├── risk.svg
    ├── terminal.svg
    └── kyc.svg
```

The JSX prototypes, HTML previews, and `SKILL.md` from the source design
package are reference-only and intentionally not shipped in this repo —
the React Native screens under `app/` are the canonical implementation.
