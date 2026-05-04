# Enkinex Brand Identity — Component Library

## Files

| File              | Purpose                                 |
|-------------------|-----------------------------------------|
| `brand-tokens.ts` | Color palette, typography constants     |
| `NexusMark.tsx`   | Fluid Nexus icon mark + SVG path data   |
| `WedgeMark.tsx`   | Wedge Flow icon mark + SVG path data    |
| `Wordmark.tsx`    | ENKINEX wordmark (HTML + SVG variants)  |
| `Logo.tsx`        | Full lockup component (mark + wordmark) |
| `index.ts`        | Barrel export                           |

---

## Quick Start

```tsx
import {Logo, colors} from './index';

// Primary lockup — navbar
<Logo iconSize={32} showTagline={false}/>

// Hero section
<Logo iconSize={56} layout="vertical" showTagline/>

// Light background (e.g. printed doc)
<Logo onDark={false} wordmarkColor={colors.dark}/>

// Monochrome print
<Logo mono onDark={false} wordmarkColor="black"/>

// Mark only — favicon, app icon
<Logo layout="mark-only" iconSize={32}/>
```

---

## Brand Colors

| Token                | Hex       | Usage                                |
|----------------------|-----------|--------------------------------------|
| `colors.gold`        | `#D4A020` | Sumerian Gold — primary accent       |
| `colors.goldBright`  | `#F0BC3A` | Gold highlight, split-color wordmark |
| `colors.goldDeep`    | `#9A7418` | Gold on light backgrounds            |
| `colors.teal`        | `#00B89A` | Enki Teal — water, intelligence      |
| `colors.tealBright`  | `#1ADFC0` | Teal highlight, split-color wordmark |
| `colors.water`       | `#1496BE` | Water Blue — data flow               |
| `colors.waterBright` | `#28BADE` | Water highlight                      |
| `colors.dark`        | `#0A0A14` | Tablet Dark — primary background     |
| `colors.mid`         | `#13131F` | Card / surface background            |
| `colors.clay`        | `#EDE9DF` | Clay Light — light background        |

---

## Marks

### Fluid Nexus (`<NexusMark />`)

Three tapered arc streams rotating around a golden center.
Each arc thickens at the tail and narrows at the head — conveying
directional flow. References Enki's three sacred waters.

```tsx
<NexusMark size={48}/>                    // default — full color
<NexusMark size={32} mono onDark/>        // monochrome on dark
<NexusMark size={32} mono onDark={false}/> // monochrome on light
```

### Wedge Flow (`<WedgeMark />`)

Three streams converge to a single gold point.
The cuneiform wedge as pure geometry — data flowing into wisdom.

```tsx
<WedgeMark size={48}/>
<WedgeMark size={32} mono/>
```

---

## Wordmark

Always **ENKINEX** — one word, never broken with a space.

```tsx
<Wordmark variant="split-weight" color="white" size={40}/>
// → ENKI (300 weight) + NEX (700 weight), white

<Wordmark variant="split-color" size={40}/>
// → ENKI (gold) + NEX (teal), 600 weight

<Wordmark variant="bold" color={colors.dark} size={40}/>
// → ENKINEX (700 weight, dark — for light bg)
```

**Font:** Space Grotesk — load from Google Fonts:

```html

<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;600;700&display=swap" rel="stylesheet"/>
```

---

## Logo Lockup Sizes

| Preset            | Icon  | Usage                |
|-------------------|-------|----------------------|
| `<LogoNavbar />`  | 32px  | Site header, navbar  |
| `<LogoHero />`    | 56px  | Landing page hero    |
| `<LogoFavicon />` | 16px  | Favicon (mark only)  |
| `<LogoAppIcon />` | 128px | App icon (mark only) |

---

## SVG Path Data

For non-React contexts (Figma imports, print, etc.):

```ts
import {NEXUS_PATHS_100, WEDGE_PATHS_100, WEDGE_TIP_100} from './index';

// NEXUS_PATHS_100 — array of { path, color, label } at size=100
// Scale with: transform="scale(0.48)" for 48px output

// WEDGE_PATHS_100 — array of { label, color, bodyPath, capCx, capCy, capRx, capRy }
// WEDGE_TIP_100 — { cx, cy, r, r2 } for the convergence dot
```

---

## Rules

- **Never** use a space in ENKINEX
- **Never** use gradients on the icon marks — flat fills only
- **Never** use the icon mark at less than 12px
- **Always** maintain the color order: Gold (top/left), Teal (center), Water (right)
- On light backgrounds: use `onDark={false}` so the center node uses Clay fill
- Minimum clear space: 0.5× icon height on all sides

---

*Enkinex Data Ltda — enkinex.com · enkinex.ai*
