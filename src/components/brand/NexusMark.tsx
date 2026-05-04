import React from 'react';
import { colors } from './brand-tokens';

export interface NexusMarkProps {
  /** Size in pixels (width = height) */
  size?: number;
  /** Render in a single color (for monochrome/print use) */
  mono?: boolean;
  /** Is the background dark? Affects center node fill */
  onDark?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Enkinex — Fluid Nexus Mark
 *
 * Three tapered arc streams rotating around a golden center node.
 * Each arc thickens at the tail and narrows at the head, conveying
 * directional flow. References Enki's three sacred waters converging
 * at the Abzu — the primordial nexus of intelligence.
 *
 * Colors (flat, no gradients):
 *   Arc 0 (top) — Gold #D4A020
 *   Arc 1 (lower-left) — Teal #00B89A
 *   Arc 2 (lower-right) — Water #1496BE
 *
 * Usage:
 *   <NexusMark size={48} />
 *   <NexusMark size={32} mono onDark={false} />
 */
export function NexusMark({
  size = 48,
  mono = false,
  onDark = true,
  className,
  style,
}: NexusMarkProps) {
  const s  = size;
  const cx = s / 2;
  const cy = s / 2;

  // Ring radius — the path each arc travels
  const R      = s * 0.355;
  // Stroke width: thick end (tail) → thin end (head)
  const swMax  = s * 0.130;
  const swMin  = s * 0.028;
  // Each arc sweeps 108° with 12° gaps between arcs
  const SWEEP  = 108;
  const GAP    = 12;
  // Gold arc points upward
  const START_OFFSET = -90;

  const arcColors = mono
    ? (onDark
        ? ['rgba(255,255,255,0.92)', 'rgba(255,255,255,0.62)', 'rgba(255,255,255,0.38)']
        : ['rgba(0,0,0,0.82)', 'rgba(0,0,0,0.52)', 'rgba(0,0,0,0.32)'])
    : [colors.gold, colors.teal, colors.water];

  /**
   * Build a tapered arc as a filled polygon.
   * The arc travels along radius R around (cx, cy),
   * tapering from swMax (thick tail at startDeg)
   * to swMin (thin head at endDeg).
   */
  function taperedArc(startDeg: number, endDeg: number): string {
    const STEPS = 32;
    const toRad = (d: number) => (d * Math.PI) / 180;

    // Outer edge: R + half-stroke, tapering thick→thin
    const outer: [number, number][] = [];
    for (let i = 0; i <= STEPS; i++) {
      const t   = i / STEPS;
      const deg = startDeg + (endDeg - startDeg) * t;
      const r   = R + (swMax * (1 - t) + swMin * t) / 2;
      outer.push([cx + r * Math.cos(toRad(deg)), cy + r * Math.sin(toRad(deg))]);
    }

    // Inner edge: R - half-stroke, reversed (thin→thick, drawn backwards)
    const inner: [number, number][] = [];
    for (let i = 0; i <= STEPS; i++) {
      const t   = i / STEPS;
      const deg = endDeg - (endDeg - startDeg) * t;
      const r   = R - (swMax * t + swMin * (1 - t)) / 2;
      inner.push([cx + r * Math.cos(toRad(deg)), cy + r * Math.sin(toRad(deg))]);
    }

    const outerD = outer.map((p, i) =>
      `${i === 0 ? 'M' : 'L'}${p[0].toFixed(3)},${p[1].toFixed(3)}`
    ).join(' ');
    const innerD = inner.map(p =>
      `L${p[0].toFixed(3)},${p[1].toFixed(3)}`
    ).join(' ');

    return `${outerD} ${innerD} Z`;
  }

  const arcs = [0, 1, 2].map((i) => ({
    start: START_OFFSET + i * 120 + GAP / 2,
    end:   START_OFFSET + i * 120 + GAP / 2 + SWEEP,
    color: arcColors[i],
  }));

  const nodeR = s * 0.055;
  const holeR = s * 0.025;

  return (
    <svg
      viewBox={`0 0 ${s} ${s}`}
      width={s}
      height={s}
      fill="none"
      className={className}
      style={{ display: 'block', flexShrink: 0, ...style }}
      aria-label="Enkinex logo mark"
      role="img"
    >
      {arcs.map(({ start, end, color }, i) => (
        <path key={i} d={taperedArc(start, end)} fill={color} />
      ))}
      <circle cx={cx} cy={cy} r={nodeR} fill={mono ? arcColors[0] : colors.gold} />
      <circle cx={cx} cy={cy} r={holeR} fill={onDark ? colors.dark : colors.clay} />
    </svg>
  );
}

// ─── Standalone SVG path data (size=100) for use in other tools ───
// Pre-computed at size=100 for easy scaling via transform
export const NEXUS_PATHS_100 = (() => {
  const s = 100, cx = 50, cy = 50;
  const R = s * 0.355, swMax = s * 0.130, swMin = s * 0.028;
  const SWEEP = 108, GAP = 12, START_OFFSET = -90;
  const STEPS = 32;
  const toRad = (d: number) => (d * Math.PI) / 180;

  function taperedArc(startDeg: number, endDeg: number): string {
    const outer: [number, number][] = [];
    for (let i = 0; i <= STEPS; i++) {
      const t = i / STEPS;
      const deg = startDeg + (endDeg - startDeg) * t;
      const r = R + (swMax * (1 - t) + swMin * t) / 2;
      outer.push([cx + r * Math.cos(toRad(deg)), cy + r * Math.sin(toRad(deg))]);
    }
    const inner: [number, number][] = [];
    for (let i = 0; i <= STEPS; i++) {
      const t = i / STEPS;
      const deg = endDeg - (endDeg - startDeg) * t;
      const r = R - (swMax * t + swMin * (1 - t)) / 2;
      inner.push([cx + r * Math.cos(toRad(deg)), cy + r * Math.sin(toRad(deg))]);
    }
    const outerD = outer.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(3)},${p[1].toFixed(3)}`).join(' ');
    const innerD = inner.map(p => `L${p[0].toFixed(3)},${p[1].toFixed(3)}`).join(' ');
    return `${outerD} ${innerD} Z`;
  }

  return [0, 1, 2].map((i) => ({
    path: taperedArc(START_OFFSET + i * 120 + GAP / 2, START_OFFSET + i * 120 + GAP / 2 + SWEEP),
    color: [colors.gold, colors.teal, colors.water][i],
    label: ['gold-arc', 'teal-arc', 'water-arc'][i],
  }));
})();
