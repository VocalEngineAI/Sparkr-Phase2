import React from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { cn } from "../../lib/utils";

/**
 * Modal bottom sheet. Backdrop tap and the close button dismiss it; `footer` holds the action
 * buttons and stays above the keyboard. `header` replaces the default title row when a sheet
 * needs its own (e.g. a stepper).
 */
export function BottomSheet({
  visible,
  onClose,
  title,
  subtitle,
  header,
  children,
  footer,
  contentClassName,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  contentClassName?: string;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 justify-end">
        {/* Backdrop: a plain Pressable on purpose — it's a scrim, not a button. */}
        <Pressable onPress={onClose} accessibilityLabel="Close" accessibilityRole="button" className="absolute inset-0 bg-text/40" />
        <View className="bg-background rounded-t-[28px] max-h-[92%]" style={{ paddingBottom: insets.bottom + 12 }}>
          <View className="self-center w-9 h-1 rounded-full bg-border mt-2.5" />
          {header ?? (
            <View className="flex-row items-center pl-5 pr-2.5 pt-3 pb-1">
              <View className="flex-1">
                {title ? <Text className="text-xl font-bold">{title}</Text> : null}
                {subtitle ? <Text className="text-sm text-textMuted mt-0.5">{subtitle}</Text> : null}
              </View>
              <Button variant="ghost" size="icon" className="rounded-full" onPress={onClose} accessibilityLabel="Close">
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </Button>
            </View>
          )}
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName={cn("px-5 pt-2 pb-2", contentClassName)}>
            {children}
          </ScrollView>
          {footer ? <View className="flex-row justify-end items-center gap-2 px-5 pt-3">{footer}</View> : null}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
