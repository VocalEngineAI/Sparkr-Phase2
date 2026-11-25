import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "../../components/ui/Text";
import { useAuth } from "../../context/AuthContext";

export default function RoleSelectScreen() {
  const { signInAs } = useAuth();

  return (
    <View className="flex-1 bg-background items-center justify-center px-6">
      <Text className="text-3xl font-bold text-primary mb-2">Sparkr</Text>
      <Text className="text-base text-textMuted mb-10 text-center">
        Log in as a business or an influencer
      </Text>

      <Pressable
        onPress={() => signInAs("business")}
        className="w-full bg-primary rounded-xl py-4 mb-4 items-center active:opacity-80"
      >
        <Text className="text-white text-base font-semibold">
          Continue as a Business
        </Text>
      </Pressable>

      <Pressable
        onPress={() => signInAs("influencer")}
        className="w-full bg-surface border border-border rounded-xl py-4 items-center active:opacity-80"
      >
        <Text className="text-primary text-base font-semibold">
          Continue as an Influencer
        </Text>
      </Pressable>
    </View>
  );
}
