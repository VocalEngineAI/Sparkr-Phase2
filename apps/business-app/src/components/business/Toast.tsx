import React, { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeOutDown, ReduceMotion } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

type ToastState = { message: string; tone: "success" | "neutral" } | null;

/** White confirmation toast with a green check, pinned above the tab bar. `show()` replaces any current toast. */
export function useToast(durationMs = 2600) {
  const [toast, setToast] = useState<ToastState>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(
    (message: string, tone: "success" | "neutral" = "success") => {
      if (timer.current) clearTimeout(timer.current);
      setToast({ message, tone });
      timer.current = setTimeout(() => setToast(null), durationMs);
    },
    [durationMs]
  );
  const hide = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setToast(null);
  }, []);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return { toast, show, hide };
}

export function Toast({ toast, onHide }: { toast: ToastState; onHide: () => void }) {
  const insets = useSafeAreaInsets();
  if (!toast) return null;
  return (
    <View pointerEvents="box-none" className="absolute left-0 right-0 items-center" style={{ bottom: insets.bottom + 16 }}>
      <Animated.View
        entering={FadeInDown.duration(220).reduceMotion(ReduceMotion.System)}
        exiting={FadeOutDown.duration(180).reduceMotion(ReduceMotion.System)}
        style={{ maxWidth: "92%" }}
        accessibilityLiveRegion="polite"
      >
        <View className="flex-row items-center bg-background border border-border rounded-full pl-3 pr-1 py-1.5 gap-2.5">
          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: toast.tone === "success" ? colors.success : colors.textMuted, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name={toast.tone === "success" ? "checkmark" : "pause"} size={16} color="#FFFFFF" />
          </View>
          <Text className="text-[15px] font-semibold" style={{ color: colors.text }} numberOfLines={2}>
            {toast.message}
          </Text>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onPress={onHide} accessibilityLabel="Dismiss">
            <Ionicons name="close" size={18} color={colors.text} />
          </Button>
        </View>
      </Animated.View>
    </View>
  );
}
