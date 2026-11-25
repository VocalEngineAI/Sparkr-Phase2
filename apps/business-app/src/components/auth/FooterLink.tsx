import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "../ui/text";

// "Don't have an account? Sign up" — prompt in muted text, action as a bold link.
type Props = { prompt: string; action: string; onPress: () => void };

export default function FooterLink({ prompt, action, onPress }: Props) {
  return (
    <View className="flex-row justify-center items-center">
      <Text className="text-sm text-textMuted">{prompt} </Text>
      <Pressable onPress={onPress} hitSlop={8}>
        <Text className="text-sm font-bold text-primary">{action}</Text>
      </Pressable>
    </View>
  );
}
