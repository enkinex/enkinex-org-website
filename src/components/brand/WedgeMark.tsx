import React from 'react';
import { colors } from './brand-tokens';

export interface WedgeMarkProps {
  /** Size in pixels (width = height) */
  size?: number;
  /** Render in single color (for monochrome/print use) */
  mono?: boolean;
  /** Is the background dark? Affects center node fill */
  onDark?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Enkinex — Wedge Flow Mark
 *
 * Three tapered streams descend and converge at a single gold point.
 * Inspired by the cuneiform wedge — the first data technology — and
 * the act of pressing structured order into raw material.
 * Each stream represents one of the three Enkinex pillars (SDD, CDL, CMA),
 * converging at the SDMesh API.
 *
 * Colors (flat, no gradients):
 *   Left stream — Gold #D4A020
 *   Center stream — Teal #00B89A (tallest — the primary pillar)
 *   Right stream — Water #1496BE
 *
 * Usage:
 *   <WedgeMark size={48} />
 *   <WedgeMark size={32} mono onDark={false} />
 */
export function WedgeMark({
  size = 48,
  mono = false,
  onDark = true,
  className,
  style,
}: WedgeMarkProps) {
  const s  = size;
  const cx = s / 2;

  const streamColors = mono
    ? (onDark
        ? ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.38)']
        : ['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.3)'])
    : [colors.gold, colors.teal, colors.water];

  // Column geometry
  const colW  = s * 0.185;   // width of each column
  const tipX  = cx;           // convergence X
  const tipY  = s * 0.830;   // convergence Y
  const tipR  = s * 0.042;   // tip dot outer radius
  const tipR2 = s * 0.018;   // tip dot inner hole

  // Three column definitions: x = left edge, topY = top of column
  const columns = [
    { x: cx - colW * 1.5, topY: s * 0.210 },  // left — gold
    { x: cx - colW * 0.5, topY: s * 0.098 },  // center — teal (tallest)
    { x: cx + colW * 0.5, topY: s * 0.210 },  // right — water
  ];

  /**
   * Each column is a quadrilateral:
   * top-left and top-right corners at full column width,
   * both bottom corners taper linearly to (tipX, tipY).
   * This creates clean straight-edged convergence.
   */
  function columnPath(x: number, topY: number): string {
    const tl = { x,           y: topY };
    const tr = { x: x + colW, y: topY };
    // Both bottom corners converge to the tip
    return [
      `M${tl.x.toFixed(3)},${tl.y.toFixed(3)}`,
      `L${tr.x.toFixed(3)},${tr.y.toFixed(3)}`,
      `L${tipX.toFixed(3)},${tipY.toFixed(3)}`,
      `L${tipX.toFixed(3)},${tipY.toFixed(3)}`,
      'Z',
    ].join(' ');
  }

  const tipColor = mono ? streamColors[0] : colors.gold;

  return (
    <svg
      viewBox={`0 0 ${s} ${s}`}
      width={s}
      height={s}
      fill="none"
      className={className}
      style={{ display: 'block', flexShrink: 0, ...style }}
      aria-label="Enkinex wedge mark"
      role="img"
    >
      {/* Three tapered columns */}
      {columns.map(({ x, topY }, i) => (
        <g key={i}>
          {/* Main column body */}
          <path d={columnPath(x, topY)} fill={streamColors[i]} />
          {/* Rounded top cap — ellipse proportioned to column width */}
          <ellipse
            cx={x + colW / 2}
            cy={topY}
            rx={colW / 2}
            ry={colW * 0.30}
            fill={streamColors[i]}
          />
        </g>
      ))}

      {/* Convergence tip — gold node with dark center hole */}
      <circle cx={tipX} cy={tipY} r={tipR}  fill={tipColor} />
      <circle cx={tipX} cy={tipY} r={tipR2} fill={onDark ? colors.dark : colors.clay} />
    </svg>
  );
}

// ─── Standalone SVG path data (size=100) ───
export const WEDGE_PATHS_100 = (() => {
  const s = 100, cx = 50;
  const colW = s * 0.185;
  const tipX = cx, tipY = s * 0.830;

  const columns = [
    { x: cx - colW * 1.5, topY: s * 0.210, color: colors.gold,  label: 'left-gold'   },
    { x: cx - colW * 0.5, topY: s * 0.098, color: colors.teal,  label: 'center-teal' },
    { x: cx + colW * 0.5, topY: s * 0.210, color: colors.water, label: 'right-water' },
  ];

  return columns.map(({ x, topY, color, label }) => ({
    label,
    color,
    bodyPath: [
      `M${x.toFixed(3)},${topY.toFixed(3)}`,
      `L${(x + colW).toFixed(3)},${topY.toFixed(3)}`,
      `L${tipX.toFixed(3)},${tipY.toFixed(3)}`,
      'Z',
    ].join(' '),
    capCx:  x + colW / 2,
    capCy:  topY,
    capRx:  colW / 2,
    capRy:  colW * 0.30,
  }));
})();

export const WEDGE_TIP_100 = {
  cx: 50,
  cy: 100 * 0.830,
  r:  100 * 0.042,
  r2: 100 * 0.018,
};
