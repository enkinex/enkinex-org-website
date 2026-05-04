import React from 'react';
import { colors, typography } from './brand-tokens';

export interface WordmarkProps {
  /**
   * Font size in pixels
   * @default 48
   */
  size?: number;
  /**
   * Typographic treatment:
   * - 'bold' — Full word, 700 weight, single color
   * - 'split-weight' — ENKI 300 / NEX 700, same color (recommended)
   * - 'split-color' — ENKI gold / NEX teal, 600 weight
   * @default 'split-weight'
   */
  variant?: 'bold' | 'split-weight' | 'split-color';
  /**
   * Text color — used for 'bold' and 'split-weight' variants
   * @default '#ffffff'
   */
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Enkinex — Custom Wordmark
 *
 * ENKINEX as one unbroken word in Space Grotesk.
 * Never split with a space. The ENKI/NEX distinction
 * is expressed through weight or color — not spacing.
 *
 * Requires Space Grotesk font:
 *   <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;600;700&display=swap" rel="stylesheet" />
 *
 * Usage:
 *   <Wordmark />
 *   <Wordmark variant="split-weight" color="white" size={32} />
 *   <Wordmark variant="split-color" size={24} />
 *   <Wordmark variant="bold" color={colors.dark} size={40} />
 */
export function Wordmark({
  size = 48,
  variant = 'split-weight',
  color = '#ffffff',
  className,
  style,
}: WordmarkProps) {
  const base: React.CSSProperties = {
    fontFamily: typography.display,
    fontSize:   size,
    letterSpacing: typography.trackingTight,
    lineHeight: 1,
    display:    'block',
    userSelect: 'none',
    ...style,
  };

  if (variant === 'bold') {
    return (
      <span className={className} style={{ ...base, fontWeight: 700, color }}>
        ENKINEX
      </span>
    );
  }

  if (variant === 'split-weight') {
    return (
      <span className={className} style={{ ...base, color }}>
        <span style={{ fontWeight: 300 }}>ENKI</span>
        <span style={{ fontWeight: 700 }}>NEX</span>
      </span>
    );
  }

  // split-color
  return (
    <span className={className} style={{ ...base, fontWeight: 600 }}>
      <span style={{ color: colors.goldBright }}>ENKI</span>
      <span style={{ color: colors.tealBright }}>NEX</span>
    </span>
  );
}

/**
 * Wordmark as pure SVG — for embedding in SVG contexts,
 * favicons, or when HTML text is not available.
 * Uses foreignObject to embed HTML in SVG.
 * For pure SVG text (no font loading), use WordmarkSVGText below.
 */
export interface WordmarkSVGTextProps {
  x?: number;
  y?: number;
  size?: number;
  variant?: WordmarkProps['variant'];
  color?: string;
}

/**
 * SVG <text> wordmark — no font embedding, uses system stack.
 * Best effort — exact rendering depends on font availability.
 * For guaranteed rendering, use the HTML <Wordmark> component.
 */
export function WordmarkSVGText({
  x = 0,
  y = 0,
  size = 48,
  variant = 'split-weight',
  color = '#ffffff',
}: WordmarkSVGTextProps) {
  const font = typography.display;
  const base = {
    fontFamily: font,
    fontSize:   size,
    letterSpacing: '-0.03em',
  };

  if (variant === 'bold') {
    return (
      <text x={x} y={y} {...base} fontWeight={700} fill={color}>
        ENKINEX
      </text>
    );
  }

  if (variant === 'split-weight') {
    // SVG doesn't support tspan font-weight change within one text natively
    // on all renderers, so we use two tspan elements
    return (
      <text x={x} y={y} fontFamily={font} fontSize={size}
        style={{ letterSpacing: '-0.03em' }} fill={color}>
        <tspan fontWeight={300}>ENKI</tspan>
        <tspan fontWeight={700}>NEX</tspan>
      </text>
    );
  }

  return (
    <text x={x} y={y} fontFamily={font} fontSize={size}
      style={{ letterSpacing: '-0.03em' }} fontWeight={600}>
      <tspan fill={colors.goldBright}>ENKI</tspan>
      <tspan fill={colors.tealBright}>NEX</tspan>
    </text>
  );
}
