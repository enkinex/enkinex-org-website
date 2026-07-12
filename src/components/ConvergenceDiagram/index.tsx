import React, {useLayoutEffect, useRef, useState} from 'react';
import {
  ReactFlow,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
  type EdgeProps,
  type ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import EnkinexMark from '@site/src/components/EnkinexMark';
import styles from './styles.module.css';

/**
 * Hero convergence diagram, drawn with React Flow — responsive twin layouts.
 *
 * Horizontal (wide containers): an inverted org chart that reads top-down
 * with the data flow. Level 1 is the concept ports (three per pillar);
 * level 2 is the pillar row of rounded-rectangle plates; level 3 is the
 * Enkinex symbol alone at the bottom. The three levels sit on equidistant
 * drawn guideline rows with equal sheet margins above the icons and below
 * the symbol. Side pillars reach the symbol with rounded L connectors into
 * its left/right rims; the centre pillar streams straight down into its top.
 *
 * Vertical (narrow containers): a step-by-step flow. The pillars become
 * rounded rows stacked top to bottom, two ports fork to the right of each
 * row, and a single teal trunk on the left carries the flow — a rounded C
 * from the first row, straight joins from the others — down into the
 * symbol, which anchors the sheet as the final row.
 */

const TEAL = '#2bc4b4';
const BLUE = '#5b8df0';
const GOLD = '#e6b85a';

const PILLAR = {w: 176, h: 60};
/* Core diameter matches the pillar height so the levels feel balanced. */
const CORE = {w: 60, h: 60};
const PORT = 36;

type Mode = 'horizontal' | 'vertical';

/* Container width (px) below which the vertical layout takes over. */
const VERTICAL_BREAKPOINT = 620;

/* ---- layout sheets ------------------------------------------------------ */

/* The three levels sit on drawn guideline rows 112px apart (the average of
   the old uneven gaps, snapped to the 8px grid), with a 20px sheet margin
   above the icon tops and below the symbol circle alike. */
const H = {
  canvas: {w: 740, h: 312},
  portY: 38,
  portDx: 84,
  pillarY: 150,
  x: {blue: 118, gold: 370, teal: 622},
  core: {x: 370, y: 262},
  /* Construction lines: the icon and pillar guideline rows (the symbol row
     is already marked by its survey ring), plus two verticals through the
     empty corridors between the pillars — never along a connector. */
  guides: {h: [38, 150], v: [244, 496]},
};

/* A 4x4 sheet: four equal 116px rows, each content row centred in its band.
   The pillars fill the two central columns (w = 2 x pillar width), the ports
   end flush with the right edge, and the trunk rides the first column's
   left boundary (inset 4px so strokes and junction dots stay unclipped). */
const V = {
  canvas: {w: 352, h: 464},
  x: 176,
  rows: {gold: 58, teal: 174, blue: 290},
  core: {x: 176, y: 406},
  trunkX: 4,
  port: {x: 334, dy: 30},
  /* Construction lines: the three row boundaries of the 4x4 grid plus the
     sheet's vertical centreline — the trunk column carries the connectors. */
  guides: {h: [116, 232, 348], v: [176]},
};

/* Tabler icons (MIT), inlined as path markup — stroke follows currentColor. */
const ICONS: Record<string, string> = {
  sitemap:
    '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 17a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm12 0a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2zM9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2zM6 15v-1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1m-6-6v3"/>',
  schema:
    '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 2h5v4H5zm10 8h5v4h-5zM5 18h5v4H5zm0-8h5v4H5zm5 2h5M7.5 6v4m0 4v4"/>',
  'vector-triangle':
    '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM3 18a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zm14 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm-10.5-.9l5-9.1m6 9.1l-5-9.1M7 19h10"/>',
  'topology-star-3':
    '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19a2 2 0 1 0-4 0a2 2 0 0 0 4 0m8-14a2 2 0 1 0-4 0a2 2 0 0 0 4 0m-8 0a2 2 0 1 0-4 0a2 2 0 0 0 4 0m-4 7a2 2 0 1 0-4 0a2 2 0 0 0 4 0m12 7a2 2 0 1 0-4 0a2 2 0 0 0 4 0m-4-7a2 2 0 1 0-4 0a2 2 0 0 0 4 0m8 0a2 2 0 1 0-4 0a2 2 0 0 0 4 0M6 12h4m4 0h4m-3-5l-2 3M9 7l2 3m0 4l-2 3m4-3l2 3"/>',
  hexagons:
    '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 18v-5l4-2l4 2v5l-4 2zm4-7V6l4-2l4 2v5m-4 2l4-2l4 2v5l-4 2l-4-2"/>',
  'stack-2':
    '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4L4 8l8 4l8-4zm-8 8l8 4l8-4M4 16l8 4l8-4"/>',
  'file-certificate':
    '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M5 8V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2h-5"/><path d="M3 14a3 3 0 1 0 6 0a3 3 0 1 0-6 0"/><path d="M4.5 17L3 22l3-1.5L9 22l-1.5-5"/></g>',
  refresh:
    '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4m-4 4a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"/>',
  'list-check':
    '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.5 5.5L5 7l2.5-2.5m-4 7L5 13l2.5-2.5m-4 7L5 19l2.5-2.5M11 6h9m-9 6h9m-9 6h9"/>',
};

/* ---- geometry helpers --------------------------------------------------- */

type Pt = [number, number];

/** Closed polygon path with quadratic-rounded corners. */
function roundedPolygon(pts: Pt[], r: number): string {
  const n = pts.length;
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = pts[(i + n - 1) % n];
    const b = pts[i];
    const c = pts[(i + 1) % n];
    const v1 = [a[0] - b[0], a[1] - b[1]];
    const v2 = [c[0] - b[0], c[1] - b[1]];
    const l1 = Math.hypot(v1[0], v1[1]);
    const l2 = Math.hypot(v2[0], v2[1]);
    const rr = Math.min(r, l1 / 2, l2 / 2);
    const p1 = [b[0] + (v1[0] / l1) * rr, b[1] + (v1[1] / l1) * rr];
    const p2 = [b[0] + (v2[0] / l2) * rr, b[1] + (v2[1] / l2) * rr];
    d += `${i === 0 ? 'M' : 'L'} ${p1[0].toFixed(2)} ${p1[1].toFixed(2)} `;
    d += `Q ${b[0]} ${b[1]} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)} `;
  }
  return d + 'Z';
}

/** Open polyline path with quadratic-rounded interior corners. */
function orthoPath(pts: Pt[], r: number): string {
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)} `;
  for (let i = 1; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    const [cx, cy] = pts[i + 1];
    const l1 = Math.hypot(ax - bx, ay - by);
    const l2 = Math.hypot(cx - bx, cy - by);
    const rr = Math.min(r, l1 / 2, l2 / 2);
    const p1 = [bx + ((ax - bx) / l1) * rr, by + ((ay - by) / l1) * rr];
    const p2 = [bx + ((cx - bx) / l2) * rr, by + ((cy - by) / l2) * rr];
    d += `L ${p1[0].toFixed(2)} ${p1[1].toFixed(2)} Q ${bx} ${by} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)} `;
  }
  const [ex, ey] = pts[pts.length - 1];
  return d + `L ${ex.toFixed(2)} ${ey.toFixed(2)}`;
}

/** Pillar plate: a rounded rectangle with tight engineer-board corners. */
function pillarPath(): string {
  const {w, h} = PILLAR;
  return roundedPolygon([[0, 0], [w, 0], [w, h], [0, h]], 8);
}

/* ---- custom nodes -------------------------------------------------------- */

type HandleSpec = {position: Position; style?: React.CSSProperties};

type PillarData = {
  lines: [string, string];
  color: string;
  out: HandleSpec;
  ins: HandleSpec[];
};

function PillarNode(props: NodeProps) {
  const {lines, color, out, ins} = props.data as unknown as PillarData;
  const {w, h} = PILLAR;
  const gradId = `ekx-plate-${props.id}`;
  const d = pillarPath();
  return (
    <div className={styles.pillar} style={{width: w, height: h}}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display: 'block', overflow: 'visible'}}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#11201d" />
            <stop offset="1" stopColor="#0a1211" />
          </linearGradient>
        </defs>
        <path d={d} fill={`url(#${gradId})`} />
        {/* Pen trace pressed into the sheet: a dark groove offset below the
            line, a tight ink bleed hugging it, then the crisp stroke. */}
        <path d={d} fill="none" stroke="#000" strokeOpacity="0.4" strokeWidth="1.4" transform="translate(0.7 1.1)" />
        <path d={d} fill="none" stroke={color} strokeOpacity="0.14" strokeWidth="3" />
        <path d={d} fill="none" stroke={color} strokeOpacity="0.8" strokeWidth="1.35" />
      </svg>
      <div className={styles.pillarText}>
        <span>{lines[0]}</span>
        <span>{lines[1]}</span>
      </div>
      {ins.map((spec, i) => (
        <Handle key={i} id={`in-${i + 1}`} type="target" position={spec.position} style={spec.style} />
      ))}
      <Handle id="out" type="source" position={out.position} style={out.style} />
    </div>
  );
}

type CoreData = {ins: {id: string; position: Position}[]};

function CoreNode(props: NodeProps) {
  const {ins} = props.data as unknown as CoreData;
  return (
    <div className={styles.core} role="img" aria-label="Enkinex">
      {/* "Aurora · Gradient" symbol variation from the brand logo system:
          the whole mark carries the blue→teal→gold aurora gradient. */}
      <EnkinexMark streams="url(#ekx-aurora)" wedges="url(#ekx-aurora)" size={30} />
      {ins.map((spec) => (
        <Handle key={spec.id} id={spec.id} type="target" position={spec.position} />
      ))}
    </div>
  );
}

type PortData = {icon: string; color: string; label: string; out: Position};

function PortNode(props: NodeProps) {
  const {icon, color, label, out} = props.data as unknown as PortData;
  return (
    <div className={styles.port} style={{borderColor: `${color}80`, color}} title={label}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        role="img"
        aria-label={label}
        dangerouslySetInnerHTML={{__html: ICONS[icon]}}
      />
      <Handle id="out" type="source" position={out} />
    </div>
  );
}

/** Full-canvas drafting backdrop: the dashed survey circle around the core
    plus the dotted construction guidelines the content rows sit on. */
type BackdropData = {
  canvas: {w: number; h: number};
  core: {x: number; y: number};
  ring: number;
  guides: {h: number[]; v: number[]};
};

function BackdropNode(props: NodeProps) {
  const {canvas, core, ring, guides} = props.data as unknown as BackdropData;
  const guideProps = {stroke: TEAL, strokeOpacity: 0.18, strokeDasharray: '1 9'};
  return (
    <svg
      className={styles.backdrop}
      width={canvas.w}
      height={canvas.h}
      viewBox={`0 0 ${canvas.w} ${canvas.h}`}
      style={{overflow: 'visible'}}>
      {guides.h.map((y) => (
        <line key={`h-${y}`} x1="0" y1={y} x2={canvas.w} y2={y} {...guideProps} />
      ))}
      {guides.v.map((x) => (
        <line key={`v-${x}`} x1={x} y1="0" x2={x} y2={canvas.h} {...guideProps} />
      ))}
      <circle cx={core.x} cy={core.y} r={ring} fill="none" stroke={TEAL} strokeOpacity="0.18" strokeDasharray="1 9" />
    </svg>
  );
}

/* ---- custom flow edge -----------------------------------------------------
   Rounded orthogonal connectors drawn like pen lines: a solid ink run plus a
   quiet animated dash riding it (same colour — no gradients, no glow). Kinds:
   - straight: direct segment between handles.
   - corner:   L shape — along the source axis, one rounded turn, into the
               target side.
   - trunk:    C shape — out of the source, down the trunk line, into the
               target side (two rounded turns).
   - join:     straight stub from the source onto the trunk line, ending in
               a junction dot. */

type FlowKind = 'straight' | 'corner' | 'trunk' | 'join';
type FlowData = {color: string; kind: FlowKind; trunkX?: number};

function FlowEdge(props: EdgeProps) {
  const {sourceX, sourceY, targetX, targetY} = props;
  const {color, kind, trunkX = 0} = props.data as unknown as FlowData;
  const pts: Pt[] =
    kind === 'corner'
      ? [[sourceX, sourceY], [sourceX, targetY], [targetX, targetY]]
      : kind === 'trunk'
        ? [[sourceX, sourceY], [trunkX, sourceY], [trunkX, targetY], [targetX, targetY]]
        : kind === 'join'
          ? [[sourceX, sourceY], [trunkX, sourceY]]
          : [[sourceX, sourceY], [targetX, targetY]];
  const d = orthoPath(pts, 16);
  const [ex, ey] = pts[pts.length - 1];
  return (
    <g>
      <path className={styles.streamBase} d={d} style={{stroke: color}} />
      <path className={styles.streamDash} d={d} style={{stroke: color}} />
      {kind === 'join' && <circle cx={ex} cy={ey} r="2.6" fill={color} fillOpacity="0.9" />}
    </g>
  );
}

/* Port connector: one continuous plumbing path — straight run, rounded
   corner, straight shelf at the halfway line, rounded corner, straight run.
   `axis` is the main travel direction ('v' drops between rows, 'h' runs
   between columns); aligned endpoints collapse to a plain straight line. */

type PipeData = {color: string; axis: 'v' | 'h'};

function PipeEdge(props: EdgeProps) {
  const {sourceX, sourceY, targetX, targetY} = props;
  const {color, axis} = props.data as unknown as PipeData;
  let pts: Pt[];
  if (axis === 'v') {
    const my = (sourceY + targetY) / 2;
    pts =
      Math.abs(sourceX - targetX) < 0.5
        ? [[sourceX, sourceY], [targetX, targetY]]
        : [[sourceX, sourceY], [sourceX, my], [targetX, my], [targetX, targetY]];
  } else {
    const mx = (sourceX + targetX) / 2;
    pts =
      Math.abs(sourceY - targetY) < 0.5
        ? [[sourceX, sourceY], [targetX, targetY]]
        : [[sourceX, sourceY], [mx, sourceY], [mx, targetY], [targetX, targetY]];
  }
  return <path className={styles.pipe} d={orthoPath(pts, 8)} style={{stroke: color}} />;
}

/* ---- graph definition ---------------------------------------------------- */

const nodeTypes = {
  backdrop: BackdropNode,
  pillar: PillarNode,
  core: CoreNode,
  port: PortNode,
};

const edgeTypes = {
  flow: FlowEdge,
  pipe: PipeEdge,
};

const staticNode = {
  draggable: false,
  selectable: false,
  focusable: false,
  connectable: false,
};

type PillarKey = 'gold' | 'blue' | 'teal';

/* All three concept ports ride the horizontal layout; the narrow vertical
   sheet keeps only the two listed in `verticalIcons` (by index). */
const PILLAR_DEFS: Record<
  PillarKey,
  {
    color: string;
    lines: [string, string];
    icons: {icon: string; label: string}[];
    verticalIcons: [number, number];
  }
> = {
  gold: {
    color: GOLD,
    lines: ['Semantic Driven', 'Design'],
    icons: [
      {icon: 'sitemap', label: 'Ontology'},
      {icon: 'schema', label: 'Semantic model'},
      {icon: 'vector-triangle', label: 'Knowledge graph'},
    ],
    verticalIcons: [0, 2],
  },
  blue: {
    color: BLUE,
    lines: ['Composable Flow', 'Architecture'],
    icons: [
      {icon: 'topology-star-3', label: 'Flow topology'},
      {icon: 'hexagons', label: 'Composable domains'},
      {icon: 'stack-2', label: 'Layered platform'},
    ],
    verticalIcons: [0, 2],
  },
  teal: {
    color: TEAL,
    lines: ['Contract Driven', 'Lifecycle'],
    icons: [
      {icon: 'file-certificate', label: 'Data contracts'},
      {icon: 'refresh', label: 'Lifecycle'},
      {icon: 'list-check', label: 'Governance checks'},
    ],
    verticalIcons: [0, 1],
  },
};

function portEdge(
  portId: string,
  pillarId: string,
  inHandle: string,
  color: string,
  axis: PipeData['axis'],
): Edge {
  return {
    id: `e-${portId}`,
    source: portId,
    sourceHandle: 'out',
    target: pillarId,
    targetHandle: inHandle,
    type: 'pipe',
    data: {color, axis} satisfies PipeData,
  };
}

/** Inverted org chart: ports on level 1, pillar row on level 2, symbol last. */
function buildHorizontal(): {nodes: Node[]; edges: Edge[]} {
  const streams: Record<PillarKey, {kind: FlowKind; coreHandle: string}> = {
    blue: {kind: 'corner', coreHandle: 'in-left'},
    gold: {kind: 'straight', coreHandle: 'in-top'},
    teal: {kind: 'corner', coreHandle: 'in-right'},
  };

  const nodes: Node[] = [
    {
      id: 'backdrop',
      type: 'backdrop',
      position: {x: 0, y: 0},
      zIndex: -1,
      ...staticNode,
      data: {
        canvas: H.canvas,
        core: H.core,
        ring: 48,
        guides: H.guides,
      } satisfies BackdropData,
    },
    {
      id: 'core',
      type: 'core',
      position: {x: H.core.x - CORE.w / 2, y: H.core.y - CORE.h / 2},
      ...staticNode,
      data: {
        ins: [
          {id: 'in-left', position: Position.Left},
          {id: 'in-right', position: Position.Right},
          {id: 'in-top', position: Position.Top},
        ],
      } satisfies CoreData,
    },
  ];
  const edges: Edge[] = [];

  for (const key of ['blue', 'gold', 'teal'] as PillarKey[]) {
    const def = PILLAR_DEFS[key];
    const cx = H.x[key];
    nodes.push({
      id: `pillar-${key}`,
      type: 'pillar',
      position: {x: cx - PILLAR.w / 2, y: H.pillarY - PILLAR.h / 2},
      ...staticNode,
      data: {
        lines: def.lines,
        color: def.color,
        out: {position: Position.Bottom},
        /* Connection points quarter the plate's top edge, so the three
           connectors are as far from each other as from the corners. */
        ins: [1, 2, 3].map((i) => ({
          position: Position.Top,
          style: {left: `${i * 25}%`},
        })),
      } satisfies PillarData,
    });
    def.icons.forEach((p, i) => {
      const id = `port-${key}-${i + 1}`;
      /* All three ports sit on the icon guideline row, centred over the
         plate; the outer ones spread wider than their connection points so
         the pipe edges step inward, echoing the old apex arrangement. */
      nodes.push({
        id,
        type: 'port',
        position: {
          x: cx + (i - 1) * H.portDx - PORT / 2,
          y: H.portY - PORT / 2,
        },
        ...staticNode,
        data: {icon: p.icon, color: def.color, label: p.label, out: Position.Bottom} satisfies PortData,
      });
      edges.push(portEdge(id, `pillar-${key}`, `in-${i + 1}`, def.color, 'v'));
    });
    edges.push({
      id: `stream-${key}`,
      source: `pillar-${key}`,
      sourceHandle: 'out',
      target: 'core',
      targetHandle: streams[key].coreHandle,
      type: 'flow',
      data: {color: def.color, kind: streams[key].kind} satisfies FlowData,
    });
  }
  return {nodes, edges};
}

/** Stepped flow: pillar rows top to bottom, one teal trunk into the symbol. */
function buildVertical(): {nodes: Node[]; edges: Edge[]} {
  const order: PillarKey[] = ['gold', 'teal', 'blue'];

  const nodes: Node[] = [
    {
      id: 'backdrop',
      type: 'backdrop',
      position: {x: 0, y: 0},
      zIndex: -1,
      ...staticNode,
      data: {
        canvas: V.canvas,
        core: V.core,
        ring: 46,
        guides: V.guides,
      } satisfies BackdropData,
    },
    {
      id: 'core',
      type: 'core',
      position: {x: V.core.x - CORE.w / 2, y: V.core.y - CORE.h / 2},
      ...staticNode,
      data: {ins: [{id: 'in-left', position: Position.Left}]} satisfies CoreData,
    },
  ];
  const edges: Edge[] = [];

  order.forEach((key, row) => {
    const def = PILLAR_DEFS[key];
    const cy = V.rows[key];
    nodes.push({
      id: `pillar-${key}`,
      type: 'pillar',
      position: {x: V.x - PILLAR.w / 2, y: cy - PILLAR.h / 2},
      ...staticNode,
      data: {
        lines: def.lines,
        color: def.color,
        out: {position: Position.Left},
        /* The row's right side divides into three equal segments: the two
           connection points sit as far from each other as from the row's
           corners. */
        ins: [
          {position: Position.Right, style: {top: '33.33%'}},
          {position: Position.Right, style: {top: '66.67%'}},
        ],
      } satisfies PillarData,
    });
    def.verticalIcons.forEach((iconIdx, i) => {
      const p = def.icons[iconIdx];
      const id = `port-${key}-${i + 1}`;
      nodes.push({
        id,
        type: 'port',
        position: {
          x: V.port.x - PORT / 2,
          y: cy + (i === 0 ? -V.port.dy : V.port.dy) - PORT / 2,
        },
        ...staticNode,
        data: {icon: p.icon, color: def.color, label: p.label, out: Position.Left} satisfies PortData,
      });
      edges.push(portEdge(id, `pillar-${key}`, `in-${i + 1}`, def.color, 'h'));
    });
    /* One flow colour throughout — the branches never overlap. The first row
       rides the whole trunk; the others join it with straight stubs. */
    edges.push({
      id: `stream-${key}`,
      source: `pillar-${key}`,
      sourceHandle: 'out',
      target: 'core',
      targetHandle: 'in-left',
      type: 'flow',
      data: {color: TEAL, kind: row === 0 ? 'trunk' : 'join', trunkX: V.trunkX} satisfies FlowData,
    });
  });
  return {nodes, edges};
}

const GRAPHS: Record<Mode, {nodes: Node[]; edges: Edge[]}> = {
  horizontal: buildHorizontal(),
  vertical: buildVertical(),
};

export default function ConvergenceDiagram(): React.ReactElement {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rfRef = useRef<ReactFlowInstance | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const measure = () =>
      setMode(el.clientWidth < VERTICAL_BREAKPOINT ? 'vertical' : 'horizontal');
    measure();
    const ro = new ResizeObserver(() => {
      measure();
      rfRef.current?.fitView({padding: 0});
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const graph = mode ? GRAPHS[mode] : null;

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <svg className={styles.defs} aria-hidden="true">
        <defs>
          <linearGradient id="ekx-aurora" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor={BLUE} />
            <stop offset="0.52" stopColor={TEAL} />
            <stop offset="1" stopColor={GOLD} />
          </linearGradient>
        </defs>
      </svg>
      {graph && (
        <div className={`${styles.flow} ${mode === 'vertical' ? styles.vertical : ''}`}>
          <ReactFlow
            key={mode}
            nodes={graph.nodes}
            edges={graph.edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onInit={(instance) => {
              rfRef.current = instance;
              instance.fitView({padding: 0});
            }}
            fitView
            fitViewOptions={{padding: 0}}
            minZoom={0.15}
            nodesDraggable={false}
            nodesConnectable={false}
            nodesFocusable={false}
            edgesFocusable={false}
            elementsSelectable={false}
            panOnDrag={false}
            panOnScroll={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            preventScrolling={false}
            proOptions={{hideAttribution: true}}
          />
        </div>
      )}
    </div>
  );
}
