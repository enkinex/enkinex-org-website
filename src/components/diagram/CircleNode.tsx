import type { CSSProperties } from "react";
import { Handle, Position, type NodeProps } from "reactflow";

export const CircleNode = ({
  data,
}: NodeProps<{
  title: string;
  caption: string;
  background: string;
  border: string;
}>) => {
  const { title, caption, background, border } = data;

  const nodeStyle: CSSProperties = {
    width: 196,
    height: 196,
    borderRadius: "50%",
    backgroundColor: background,
    borderColor: border,
    borderWidth: "1px",
    borderStyle: "solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "white",
    fontSize: "16px",
  };

  return (
    <>
      <div style={nodeStyle}>
        <div>
          {title}
          <br />
          <strong>{caption}</strong>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </>
  );
};
