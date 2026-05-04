/**
 * Enkinex Brand Tokens
 * Generated from brand identity exploration
 */

export const colors = {
  /** Sumerian Gold — primary accent, warmth, authority */
  gold:    '#D4A020',
  goldBright: '#F0BC3A',
  goldDeep:   '#9A7418',

  /** Enki Teal — water, intelligence, clarity */
  teal:    '#00B89A',
  tealBright: '#1ADFC0',

  /** Water Blue — data flow, depth */
  water:   '#1496BE',
  waterBright: '#28BADE',

  /** Backgrounds */
  dark:    '#0A0A14',
  mid:     '#13131F',
  clay:    '#EDE9DF',
} as const;

export const typography = {
  /** Primary display font — Space Grotesk */
  display: "'Space Grotesk', system-ui, sans-serif",
  /** Wordmark letter-spacing */
  trackingTight: '-0.03em',
} as const;

export type BrandColor = keyof typeof colors;
