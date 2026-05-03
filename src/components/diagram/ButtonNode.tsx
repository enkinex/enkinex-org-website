import type { CSSProperties } from "react";
import { Handle, Position, type NodeProps } from "reactflow";

export const ButtonNode = ({ data }: NodeProps<{ label: string }>) => {
  const { label } = data;

  const nodeStyle: CSSProperties = {
    backgroundColor: "rgb(34, 168, 152)",
    borderRadius: "32px",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    textAlign: "center",
    width: "140px",
    height: "48px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <>
      <div style={nodeStyle}>{label}</div>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
    </>
  );
};
