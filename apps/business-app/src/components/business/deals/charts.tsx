import React, { useEffect, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import Svg, { Circle, Line, Path, Polyline, Rect, Text as SvgText } from "react-native-svg";
import { Text } from "../../ui/text";
import { D } from "./common";

// Lightweight charts on react-native-svg (already installed) — no chart library needed.

/** Counts from 0 to `target` over `duration` ms; re-runs when the target changes. */
export function useCountUp(target: number, duration = 700) {
  const [value, setValue] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    const start = Date.now();
    const begin = from.current;
    let raf = 0;
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(begin + (target - begin) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else from.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function points(data: number[], width: number, height: number, pad = 2) {
  const max = Math.max(1, ...data);
  const n = data.length;
  const stepX = n > 1 ? (width - pad * 2) / (n - 1) : 0;
  return data.map((v, i) => ({ x: pad + i * stepX, y: height - pad - (v / max) * (height - pad * 2) }));
}

export function Sparkline({ data, width = 80, height = 26, color = D.blue }: { data: number[]; width?: number; height?: number; color?: string }) {
  if (data.length < 2) return <View style={{ width, height }} />;
  const pts = points(data, width, height);
  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `M${pts[0].x},${height} L${line.replace(/ /g, " L")} L${pts[pts.length - 1].x},${height} Z`;
  return (
    <Svg width={width} height={height}>
      <Path d={area} fill={color} opacity={0.12} />
      <Polyline points={line} fill="none" stroke={color} strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
    </Svg>
  );
}

/**
 * Line chart with tappable columns. Each column is a full-height Pressable, so a thumb lands
 * on the nearest day; the selected day gets a marker line and a value callout.
 */
export function LineChart({
  data,
  labels,
  height = 170,
  color = D.blue,
  selected,
  onSelect,
  format,
}: {
  data: number[];
  labels: string[];
  height?: number;
  color?: string;
  selected: number | null;
  onSelect: (i: number | null) => void;
  format: (v: number) => string;
}) {
  const [width, setWidth] = useState(0);
  const top = 26;
  const bottom = 20;
  const plotH = height - top - bottom;
  const pts = width ? points(data, width, plotH, 6).map((p) => ({ x: p.x, y: p.y + top })) : [];
  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area = pts.length ? `M${pts[0].x},${top + plotH} L${line.replace(/ /g, " L")} L${pts[pts.length - 1].x},${top + plotH} Z` : "";
  const max = Math.max(1, ...data);
  const sel = selected !== null && pts[selected] ? pts[selected] : null;
  const xLabelIdx = data.length > 2 ? [0, Math.floor((data.length - 1) / 2), data.length - 1] : data.map((_, i) => i);

  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} style={{ height }}>
      {width > 0 && data.length > 1 ? (
        <>
          <Svg width={width} height={height}>
            {[0, 0.5, 1].map((f) => (
              <Line key={f} x1={0} x2={width} y1={top + plotH - f * (plotH - 12)} y2={top + plotH - f * (plotH - 12)} stroke={D.line} strokeDasharray="3 4" strokeWidth={1} />
            ))}
            <Path d={area} fill={color} opacity={0.1} />
            <Polyline points={line} fill="none" stroke={color} strokeWidth={2.25} strokeLinejoin="round" strokeLinecap="round" />
            {sel ? (
              <>
                <Line x1={sel.x} x2={sel.x} y1={top - 4} y2={top + plotH} stroke={D.muted} strokeWidth={1} strokeDasharray="2 3" />
                <Circle cx={sel.x} cy={sel.y} r={6} fill="#FFFFFF" stroke={color} strokeWidth={2.5} />
                <Callout x={sel.x} width={width} text={format(data[selected!])} color={color} />
              </>
            ) : (
              <Circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r={4} fill={color} />
            )}
            {xLabelIdx.map((i) => (
              <SvgText
                key={i}
                x={pts[i].x}
                y={height - 4}
                fontSize={11}
                fill={D.muted}
                fontFamily="DMSans_400Regular"
                textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"}
              >
                {labels[i]}
              </SvgText>
            ))}
          </Svg>
          {/* Hit targets: one column per day. Plain Pressables on purpose — invisible chart hit areas. */}
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom, flexDirection: "row" }}>
            {data.map((v, i) => (
              <Pressable
                key={i}
                style={{ flex: 1 }}
                onPress={() => onSelect(selected === i ? null : i)}
                accessibilityRole="button"
                accessibilityLabel={`${labels[i]}: ${format(v)}`}
                accessibilityState={{ selected: selected === i }}
              />
            ))}
          </View>
          <Text className="absolute right-0 top-0 text-[11px]" style={{ color: D.muted }}>
            peak {format(max)}
          </Text>
        </>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-sm" style={{ color: D.muted }}>
            Not enough data yet
          </Text>
        </View>
      )}
    </View>
  );
}

function Callout({ x, width, text, color }: { x: number; width: number; text: string; color: string }) {
  const w = Math.max(44, text.length * 7 + 16);
  const left = Math.min(Math.max(0, x - w / 2), width - w);
  return (
    <>
      <Rect x={left} y={2} width={w} height={20} rx={10} fill={color} />
      <SvgText x={left + w / 2} y={16} fontSize={11} fill="#FFFFFF" fontFamily="DMSans_600SemiBold" textAnchor="middle">
        {text}
      </SvgText>
    </>
  );
}
