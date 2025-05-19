import type { CSSProperties } from "react";

export function getContainerStyle(): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "repeat(16, 1fr)",
    gridAutoRows: "minmax(auto, auto)",
    width: "100%",
    minHeight: "100dvh",
    backgroundColor: "#000", // fond noir
    gap: "15px",
    padding: "20px",
    boxSizing: "border-box" as const,
    overflow: "auto",
  };
}

export function getBlocStyle(x: number, y: number, w: number): CSSProperties {
  return {
    gridColumn: `${x} / span ${w}`,
    gridRow: `${y}`,
    border: "1px solid #fff",
    borderRadius: "4px",
    backgroundColor: "#000", // fond noir
    color: "#fff", // texte blanc
    padding: "20px",
    overflow: "auto",
    boxSizing: "border-box" as const,
    transition: "all 0.3s ease",
    boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)",
    height: "auto",
  };
}
