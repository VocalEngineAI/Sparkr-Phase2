import React, { useState } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../kit";
import { Reveal } from "../motion";
import { Confetti } from "./Confetti";
import { D } from "./common";

/**
 * The "Turn more visits into loyal customers!" hero from the reference, sitting directly on
 * the page (no card): megaphone emblem, headline, subline and confetti. The 3D megaphone is a
 * drawn stand-in; drop the real artwork in here when it's exported.
 */
export function PromoBanner() {
  const [size, setSize] = useState({ w: 0, h: 0 });
  return (
    <Reveal>
      <View
        className="flex-row items-center"
        style={{ minHeight: 200, paddingVertical: 22, paddingHorizontal: 4 }}
        onLayout={(e) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
      >
        {size.w > 0 ? <Confetti width={size.w} height={size.h} /> : null}

        <View style={{ width: 124, height: 124, alignItems: "center", justifyContent: "center" }}>
          <View style={{ position: "absolute", width: 116, height: 116, borderRadius: 58, backgroundColor: D.blueTint }} />
          <View style={{ position: "absolute", width: 90, height: 90, borderRadius: 45, backgroundColor: D.card }} />
          <Ionicons name="megaphone" size={50} color={D.blue} style={{ transform: [{ rotate: "-12deg" }] }} />
          <View style={{ position: "absolute", right: 8, top: 16, width: 12, height: 12, borderRadius: 6, backgroundColor: D.amber }} />
          <View style={{ position: "absolute", left: 10, bottom: 20, width: 9, height: 9, borderRadius: 5, backgroundColor: D.blue }} />
        </View>

        <View className="flex-1 ml-4">
          <Text className="text-2xl font-extrabold" style={{ color: D.ink, lineHeight: 32 }}>
            Turn more visits into loyal customers!
          </Text>
          <Text className="text-sm mt-2" style={{ color: D.muted, lineHeight: 20 }}>
            Create deals, track performance, and grow your business.
          </Text>
        </View>
      </View>
    </Reveal>
  );
}
