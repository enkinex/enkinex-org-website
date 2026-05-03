import { ReactFlow } from "reactflow"

import { ButtonNode } from "@/components/diagram/ButtonNode";
import { CircleNode } from "@/components/diagram/CircleNode";

import "reactflow/dist/style.css";

const nodeTypes = {
  circle: CircleNode,
  button: ButtonNode,
};

const initialNodes = [
  {
    id: "sdd",
    type: "circle",
    position: { x: 82, y: 0 },
    zIndex: 100,
    data: {
      title: "Semantic Driven",
      caption: "Design",
      background: "rgba(91, 63, 2, 0.9)",
      border: "rgba(251, 146, 60, 0.8)",
    },
  },
  {
    id: "cdl",
    type: "circle",
    position: { x: 0, y: 148 },
    data: {
      title: "Contract Driven",
      caption: "Lifecycle",
      background: "rgba(0, 75, 95, 0.9)",
      border: "rgba(96, 165, 250, 0.8)",
    },
  },
  {
    id: "cma",
    type: "circle",
    position: { x: 168, y: 148 },
    data: {
      title: "Composable Mesh",
      caption: "Architecture",
      background: "rgba(34, 168, 152, 0.6)",
      border: "rgba(52, 211, 153, 0.8)",
    },
  },
  {
    id: "api",
    type: "button",
    position: { x: 112, y: 416 },
    data: { label: "SDMesh API" },
  },
];

const initialEdges = [
  {
    id: "sddToApi",
    source: "sdd",
    target: "api",
    type: "straight",
    animated: true,
    style: {
      stroke: "rgb(239, 199, 43)",
      strokeWidth: 2,
      strokeDasharray: "3 3",
    },
  },
  {
    id: "cdlToApi",
    source: "cdl",
    target: "api",
    type: "straight",
    zIndex: 50,
    animated: true,
    style: {
      stroke: "rgb(54, 254, 254)",
      strokeWidth: 2,
      strokeDasharray: "3 3",
    },
  },
  {
    id: "cmaToApi",
    source: "cma",
    target: "api",
    type: "straight",
    animated: true,
    style: {
      stroke: "rgba(52, 211, 153, 0.8)",
      strokeWidth: 2,
      strokeDasharray: "3 3",
    },
  },
];

const proOptions = { hideAttribution: true };
const reactFlowStyle = {
  background: "transparent",
};

export const SDMeshDiagram = () => {
  return (
    <div style={{ height: "480px", width: "348px" }}>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        style={reactFlowStyle}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
      />
    </div>
  );
};
