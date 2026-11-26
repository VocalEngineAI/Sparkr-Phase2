import React from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { Text } from "../ui/text";

// Frame shared by every signed-out screen: linen page, back button top-left (optionally
// with an inline title beside it), scrolling content and a footer pinned to the bottom.
type Props = {
  onBack?: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function AuthShell({ onBack, title, children, footer }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6">
          <View className="flex-row items-center mb-6">
            {onBack ? (
              <Pressable
                onPress={onBack}
                hitSlop={12}
                className="w-10 h-10 rounded-full bg-surface border border-border items-center justify-center"
              >
                <Ionicons name="arrow-back" size={20} color={colors.text} />
              </Pressable>
            ) : null}
            {title ? <Text className="text-xl font-bold ml-3">{title}</Text> : null}
          </View>

          {children}

          {footer ? <View className="mt-auto pt-6">{footer}</View> : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
