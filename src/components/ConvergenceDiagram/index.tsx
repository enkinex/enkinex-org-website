import React, {useEffect, useRef} from 'react';
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
 * Hero convergence diagram, drawn with React Flow.
 * Geometry echoes the Enkinex symbol: three pillars arranged on a triangle,
 * streaming inward to the central Enkinex API core. Each pillar is fed by
 * small architectural "port" nodes carrying its concept icons, and its plate
 * is a skewed rounded quadrilateral — the angular language of the symbol's
 * three wedge edges, inscribed in the triangle.
 */

const TEAL = '#2bc4b4';
const BLUE = '#5b8df0';
const GOLD = '#e6b85a';

const CANVAS = {w: 900, h: 540};
const PILLAR = {w: 176, h: 60};
const CORE = {w: 96, h: 96};

/* Exact equilateral geometry: the three pillar centres sit on the corners
   of an equilateral triangle with circumradius R; the core circle sits at
   its centre (centroid = circumcenter), so all three streams are equal. */
const R = 201.33;
const CX = 450;
const APEX_Y = 136;
const HALF_BASE = R * Math.sin(Math.PI / 3); // ≈ 174.36
const CENTERS = {
  gold: {x: CX, y: APEX_Y},
  blue: {x: CX - HALF_BASE, y: APEX_Y + 1.5 * R},
  teal: {x: CX + HALF_BASE, y: APEX_Y + 1.5 * R},
  core: {x: CX, y: APEX_Y + R},
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

/** Skewed rounded quadrilaterals — the wedge-plate shapes of each pillar. */
function pillarPath(shape: 'apex' | 'lean-right' | 'lean-left'): string {
  const {w, h} = PILLAR;
  const s = 18;
  const pts: Pt[] =
    shape === 'apex'
      ? [[0, 0], [w, 0], [w - s, h], [s, h]]
      : shape === 'lean-right'
        ? [[s, 0], [w, 0], [w - s, h], [0, h]]
        : [[0, 0], [w - s, 0], [w, h], [s, h]];
  return roundedPolygon(pts, 10);
}

/* ---- custom nodes -------------------------------------------------------- */

type PillarData = {
  lines: [string, string];
  color: string;
  shape: 'apex' | 'lean-right' | 'lean-left';
};

function PillarNode(props: NodeProps) {
  const {lines, color, shape} = props.data as unknown as PillarData;
  const {w, h} = PILLAR;
  const gradId = `ekx-plate-${props.id}`;
  const handles =
    shape === 'apex'
      ? {targets: Position.Top, source: Position.Bottom, sourceStyle: {}}
      : shape === 'lean-right'
        ? {targets: Position.Left, source: Position.Top, sourceStyle: {left: '75%'}}
        : {targets: Position.Right, source: Position.Top, sourceStyle: {left: '25%'}};
  const spread = ['25%', '50%', '75%'];
  return (
    <div
      className={styles.pillar}
      style={{width: w, height: h, filter: `drop-shadow(0 12px 22px ${color}33)`}}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display: 'block', overflow: 'visible'}}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#11201d" />
            <stop offset="1" stopColor="#0a1211" />
          </linearGradient>
        </defs>
        <path d={pillarPath(shape)} fill={`url(#${gradId})`} stroke={`${color}73`} strokeWidth="1.25" />
      </svg>
      <div className={styles.pillarText}>
        <span>{lines[0]}</span>
        <span>{lines[1]}</span>
      </div>
      {spread.map((pos, i) => (
        <Handle
          key={i}
          id={`in-${i + 1}`}
          type="target"
          position={handles.targets}
          style={handles.targets === Position.Top ? {left: pos} : {top: pos}}
        />
      ))}
      <Handle id="out" type="source" position={handles.source} style={handles.sourceStyle} />
    </div>
  );
}

function CoreNode() {
  return (
    <div className={styles.core} role="img" aria-label="Enkinex">
      {/* "Aurora · Gradient" symbol variation from the brand logo system:
          the whole mark carries the blue→teal→gold aurora gradient. */}
      <EnkinexMark streams="url(#ekx-aurora)" wedges="url(#ekx-aurora)" size={48} />
      <Handle id="in-top" type="target" position={Position.Top} />
      <Handle id="in-left" type="target" position={Position.Left} />
      <Handle id="in-right" type="target" position={Position.Right} />
    </div>
  );
}

type PortData = {icon: string; color: string; label: string; out: Position};

function PortNode(props: NodeProps) {
  const {icon, color, label, out} = props.data as unknown as PortData;
  return (
    <div className={styles.port} style={{borderColor: `${color}59`, color}} title={label}>
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

/** Full-canvas drafting backdrop: triangle, survey circles, glows. */
function BackdropNode() {
  const {gold, blue, teal, core} = CENTERS;
  return (
    <svg
      className={styles.backdrop}
      width={CANVAS.w}
      height={CANVAS.h}
      viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`}>
      <defs>
        <radialGradient id="ekx-glow-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0.62" />
          <stop offset="52%" stopColor={TEAL} stopOpacity="0.13" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
        </radialGradient>
        {(
          [
            ['gold', GOLD],
            ['blue', BLUE],
            ['teal', TEAL],
          ] as const
        ).map(([id, color]) => (
          <radialGradient key={id} id={`ekx-glow-${id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.5" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>
      <polygon
        points={`${gold.x},${gold.y} ${blue.x},${blue.y} ${teal.x},${teal.y}`}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.08"
        strokeDasharray="2 9"
      />
      <circle cx={core.x} cy={core.y} r="120" fill="none" stroke={TEAL} strokeOpacity="0.11" strokeDasharray="1 9" />
      {/* Circumcircle: passes exactly through the three pillar centres. */}
      <circle cx={core.x} cy={core.y} r={R} fill="none" stroke={TEAL} strokeOpacity="0.07" strokeDasharray="1 9" />
      <circle className={styles.corePulse} cx={core.x} cy={core.y} r="158" fill="url(#ekx-glow-core)" />
      <circle cx={gold.x} cy={gold.y} r="54" fill="url(#ekx-glow-gold)" />
      <circle cx={blue.x} cy={blue.y} r="54" fill="url(#ekx-glow-blue)" />
      <circle cx={teal.x} cy={teal.y} r="54" fill="url(#ekx-glow-teal)" />
    </svg>
  );
}

/* ---- custom stream edge --------------------------------------------------
   Quadratic curve bowed perpendicular to the chord (as in the brand mock):
   a faint solid bed plus an animated dashed flow with a gradient toward
   the core. */

function StreamEdge(props: EdgeProps) {
  const {sourceX, sourceY, targetX, targetY} = props;
  const {color, grad} = props.data as unknown as {color: string; grad: string};
  const mx = (sourceX + targetX) / 2;
  const my = (sourceY + targetY) / 2;
  let dx = targetX - sourceX;
  let dy = targetY - sourceY;
  const len = Math.hypot(dx, dy) || 1;
  dx /= len;
  dy /= len;
  const bend = 46;
  const cx = mx + -dy * bend;
  const cy = my + dx * bend;
  const d = `M ${sourceX} ${sourceY} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${targetX} ${targetY}`;
  return (
    <g>
      <path className={styles.streamBase} d={d} style={{stroke: color}} />
      <path className={styles.streamDash} d={d} style={{stroke: `url(#${grad})`}} />
    </g>
  );
}

/* ---- graph definition ---------------------------------------------------- */

const nodeTypes = {
  backdrop: BackdropNode,
  pillar: PillarNode,
  core: CoreNode,
  port: PortNode,
};

const edgeTypes = {
  stream: StreamEdge,
};

const staticNode = {
  draggable: false,
  selectable: false,
  focusable: false,
  connectable: false,
};

type PortSpec = {id: string; icon: string; label: string; cx: number; cy: number};

const PORTS: Record<'gold' | 'blue' | 'teal', {color: string; out: Position; items: PortSpec[]}> = {
  gold: {
    color: GOLD,
    out: Position.Bottom,
    items: [
      {id: 'port-gold-1', icon: 'sitemap', label: 'Ontology', cx: 366, cy: 22},
      {id: 'port-gold-2', icon: 'schema', label: 'Semantic model', cx: 450, cy: 18},
      {id: 'port-gold-3', icon: 'vector-triangle', label: 'Knowledge graph', cx: 534, cy: 22},
    ],
  },
  blue: {
    color: BLUE,
    out: Position.Right,
    items: [
      {id: 'port-blue-1', icon: 'topology-star-3', label: 'Mesh topology', cx: CENTERS.blue.x - 162, cy: 370},
      {id: 'port-blue-2', icon: 'hexagons', label: 'Composable domains', cx: CENTERS.blue.x - 174, cy: 438},
      {id: 'port-blue-3', icon: 'stack-2', label: 'Layered platform', cx: CENTERS.blue.x - 162, cy: 506},
    ],
  },
  teal: {
    color: TEAL,
    out: Position.Left,
    items: [
      {id: 'port-teal-1', icon: 'file-certificate', label: 'Data contracts', cx: CENTERS.teal.x + 162, cy: 370},
      {id: 'port-teal-2', icon: 'refresh', label: 'Lifecycle', cx: CENTERS.teal.x + 174, cy: 438},
      {id: 'port-teal-3', icon: 'list-check', label: 'Governance checks', cx: CENTERS.teal.x + 162, cy: 506},
    ],
  },
};

const nodes: Node[] = [
  {
    id: 'backdrop',
    type: 'backdrop',
    position: {x: 0, y: 0},
    zIndex: -1,
    ...staticNode,
    data: {},
  },
  {
    id: 'pillar-gold',
    type: 'pillar',
    position: {x: CENTERS.gold.x - PILLAR.w / 2, y: CENTERS.gold.y - PILLAR.h / 2},
    ...staticNode,
    data: {lines: ['Semantic Driven', 'Design'], color: GOLD, shape: 'apex'} satisfies PillarData,
  },
  {
    id: 'pillar-blue',
    type: 'pillar',
    position: {x: CENTERS.blue.x - PILLAR.w / 2, y: CENTERS.blue.y - PILLAR.h / 2},
    ...staticNode,
    data: {lines: ['Composable Mesh', 'Architecture'], color: BLUE, shape: 'lean-right'} satisfies PillarData,
  },
  {
    id: 'pillar-teal',
    type: 'pillar',
    position: {x: CENTERS.teal.x - PILLAR.w / 2, y: CENTERS.teal.y - PILLAR.h / 2},
    ...staticNode,
    data: {lines: ['Contract Driven', 'Lifecycle'], color: TEAL, shape: 'lean-left'} satisfies PillarData,
  },
  {
    id: 'core',
    type: 'core',
    position: {x: CENTERS.core.x - CORE.w / 2, y: CENTERS.core.y - CORE.h / 2},
    ...staticNode,
    data: {},
  },
  ...(Object.values(PORTS).flatMap((group) =>
    group.items.map((p) => ({
      id: p.id,
      type: 'port',
      position: {x: p.cx - 18, y: p.cy - 18},
      ...staticNode,
      data: {icon: p.icon, color: group.color, label: p.label, out: group.out} satisfies PortData,
    })),
  ) as Node[]),
];

const edges: Edge[] = [
  ...(['gold', 'blue', 'teal'] as const).flatMap((key) =>
    PORTS[key].items.map((p, i) => ({
      id: `e-${p.id}`,
      source: p.id,
      sourceHandle: 'out',
      target: `pillar-${key}`,
      targetHandle: `in-${i + 1}`,
      type: 'smoothstep',
      pathOptions: {borderRadius: 10},
      style: {stroke: PORTS[key].color, strokeOpacity: 0.38, strokeWidth: 1.3},
    })),
  ),
  {
    id: 'stream-gold',
    source: 'pillar-gold',
    sourceHandle: 'out',
    target: 'core',
    targetHandle: 'in-top',
    type: 'stream',
    data: {color: GOLD, grad: 'ekx-stream-gold'},
  },
  {
    id: 'stream-blue',
    source: 'pillar-blue',
    sourceHandle: 'out',
    target: 'core',
    targetHandle: 'in-left',
    type: 'stream',
    data: {color: BLUE, grad: 'ekx-stream-blue'},
  },
  {
    id: 'stream-teal',
    source: 'pillar-teal',
    sourceHandle: 'out',
    target: 'core',
    targetHandle: 'in-right',
    type: 'stream',
    data: {color: TEAL, grad: 'ekx-stream-teal'},
  },
];

export default function ConvergenceDiagram(): React.ReactElement {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rfRef = useRef<ReactFlowInstance | null>(null);

  useEffect(() => {
    if (!wrapRef.current) return undefined;
    const ro = new ResizeObserver(() => {
      rfRef.current?.fitView({padding: 0});
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={styles.flow}>
      <svg className={styles.defs} aria-hidden="true">
        <defs>
          <linearGradient id="ekx-aurora" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor={BLUE} />
            <stop offset="0.52" stopColor={TEAL} />
            <stop offset="1" stopColor={GOLD} />
          </linearGradient>
          <linearGradient id="ekx-stream-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={GOLD} stopOpacity="0.85" />
            <stop offset="1" stopColor="#eaf7f4" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="ekx-stream-blue" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor={BLUE} stopOpacity="0.85" />
            <stop offset="1" stopColor="#eaf7f4" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="ekx-stream-teal" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={TEAL} stopOpacity="0.85" />
            <stop offset="1" stopColor="#eaf7f4" stopOpacity="0.95" />
          </linearGradient>
        </defs>
      </svg>
      <ReactFlow
        nodes={nodes}
        edges={edges}
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
  );
}
