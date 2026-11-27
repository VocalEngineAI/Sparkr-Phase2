import React from "react";
import Svg, { Circle, Rect } from "react-native-svg";
import { D } from "./common";

// Little celebratory shapes, as in the dashboard reference: tilted rectangles and dots in
// blue, amber, emerald and terracotta. Deterministic layout, so it never jitters on re-render.

const COLORS = [D.blue, D.amber, D.green, D.red]; // theme navy, amber, success, warning

type Piece = { x: number; y: number; w: number; h: number; r: number; c: number; dot?: boolean };

const BANNER: Piece[] = [
  { x: 0.05, y: 0.12, w: 10, h: 10, r: 35, c: 1 },
  { x: 0.16, y: 0.06, w: 8, h: 8, r: 15, c: 0, dot: true },
  { x: 0.3, y: 0.1, w: 9, h: 16, r: -30, c: 2 },
  { x: 0.45, y: 0.04, w: 12, h: 12, r: 45, c: 0 },
  { x: 0.62, y: 0.08, w: 9, h: 16, r: 25, c: 2 },
  { x: 0.8, y: 0.05, w: 10, h: 10, r: 10, c: 3, dot: true },
  { x: 0.93, y: 0.15, w: 8, h: 14, r: -20, c: 1 },
  { x: 0.08, y: 0.7, w: 8, h: 14, r: 50, c: 3 },
  { x: 0.24, y: 0.85, w: 10, h: 10, r: 45, c: 0 },
  { x: 0.38, y: 0.78, w: 7, h: 7, r: 0, c: 1, dot: true },
  { x: 0.7, y: 0.82, w: 9, h: 15, r: -40, c: 2 },
  { x: 0.88, y: 0.72, w: 10, h: 10, r: 30, c: 0 },
  { x: 0.97, y: 0.9, w: 8, h: 8, r: 0, c: 3, dot: true },
];

const STRIP: Piece[] = [
  { x: 0.04, y: 0.55, w: 7, h: 11, r: 40, c: 0 },
  { x: 0.13, y: 0.25, w: 6, h: 6, r: 0, c: 2, dot: true },
  { x: 0.24, y: 0.6, w: 8, h: 8, r: 45, c: 1 },
  { x: 0.36, y: 0.3, w: 6, h: 11, r: -30, c: 3 },
  { x: 0.5, y: 0.65, w: 7, h: 7, r: 20, c: 2 },
  { x: 0.63, y: 0.28, w: 6, h: 6, r: 0, c: 0, dot: true },
  { x: 0.74, y: 0.6, w: 8, h: 12, r: 35, c: 1 },
  { x: 0.86, y: 0.3, w: 7, h: 7, r: 45, c: 3 },
  { x: 0.95, y: 0.62, w: 6, h: 10, r: -25, c: 2 },
];

export function Confetti({ width, height, variant = "banner", opacity = 1 }: { width: number; height: number; variant?: "banner" | "strip"; opacity?: number }) {
  const pieces = variant === "banner" ? BANNER : STRIP;
  return (
    <Svg width={width} height={height} pointerEvents="none" style={{ position: "absolute", left: 0, top: 0 }} opacity={opacity}>
      {pieces.map((p, i) => {
        const cx = p.x * width;
        const cy = p.y * height;
        return p.dot ? (
          <Circle key={i} cx={cx} cy={cy} r={p.w / 2} fill={COLORS[p.c]} />
        ) : (
          <Rect key={i} x={cx - p.w / 2} y={cy - p.h / 2} width={p.w} height={p.h} rx={2} fill={COLORS[p.c]} transform={`rotate(${p.r} ${cx} ${cy})`} />
        );
      })}
    </Svg>
  );
}
