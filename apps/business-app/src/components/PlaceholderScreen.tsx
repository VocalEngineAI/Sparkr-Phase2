import React from "react";
import { ScrollView, View } from "react-native";
import { Text } from "./ui/Text";

type Props = {
  title: string;
  description?: string;
  /** Bullet list of what this screen will eventually contain, from docs/10-frontend-phase-plan.md */
  upcoming?: string[];
};

/**
 * Stand-in for screens not built yet. Lets navigation/tabs work end-to-end
 * while features are implemented one at a time per the phase plan.
 */
export default function PlaceholderScreen({ title, description, upcoming }: Props) {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-6 pt-16 pb-10">
        <Text className="text-2xl font-bold text-text mb-2">{title}</Text>
        {description ? (
          <Text className="text-base text-textMuted mb-6">{description}</Text>
        ) : null}
        {upcoming && upcoming.length > 0 ? (
          <View className="bg-surface rounded-xl p-4">
            <Text className="text-sm font-semibold text-textMuted mb-2">
              Coming up on this screen
            </Text>
            {upcoming.map((item) => (
              <Text key={item} className="text-sm text-text mb-1">
                • {item}
              </Text>
            ))}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
