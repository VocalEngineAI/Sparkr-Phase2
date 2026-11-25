import React, { useState } from "react";
import { Pressable, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import type { AuthStackParamList } from "../../navigation/AuthNavigator";
import { useAuth } from "../../context/AuthContext";
import AuthShell from "../../components/auth/AuthShell";
import PrimaryButton from "../../components/auth/PrimaryButton";
import { Text } from "../../components/ui/text";
import { cn } from "../../lib/utils";

type Props = NativeStackScreenProps<AuthStackParamList, "CreatePin">;

const PIN_LENGTH = 4;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"] as const;

export default function CreatePinScreen({ navigation, route }: Props) {
  const { signInAs } = useAuth();
  const [pin, setPin] = useState("");

  const press = (key: string) => {
    if (key === "⌫") return setPin((p) => p.slice(0, -1));
    if (key && pin.length < PIN_LENGTH) setPin((p) => p + key);
  };

  // Frontend-only: the PIN isn't stored anywhere yet; completing it signs the user in.
  const submit = () => {
    if (pin.length === PIN_LENGTH) signInAs(route.params.role);
  };

  return (
    <AuthShell
      onBack={() => navigation.goBack()}
      title="Create New PIN"
      footer={
        <>
          <PrimaryButton label="Continue" onPress={submit} disabled={pin.length < PIN_LENGTH} />

          <View className="flex-row flex-wrap mt-6 -mx-1">
            {KEYS.map((key, i) => (
              <Pressable
                key={i}
                onPress={() => press(key)}
                disabled={!key}
                accessibilityLabel={key === "⌫" ? "Delete" : key}
                className="w-1/3 h-16 items-center justify-center rounded-2xl active:bg-surface"
              >
                {key === "⌫" ? (
                  <Ionicons name="backspace-outline" size={24} color={colors.text} />
                ) : (
                  <Text className="text-2xl font-semibold">{key}</Text>
                )}
              </Pressable>
            ))}
          </View>
        </>
      }
    >
      <Text className="text-base text-textMuted text-center mt-6 mb-10 px-4">
        Add a PIN number to make your account more secure
      </Text>

      <View className="flex-row justify-center gap-4">
        {Array.from({ length: PIN_LENGTH }).map((_, i) => {
          const filled = i < pin.length;
          const current = i === pin.length;
          return (
            <View
              key={i}
              className={cn(
                "w-16 h-16 rounded-2xl bg-surface border items-center justify-center",
                current ? "border-accent border-2" : "border-border"
              )}
            >
              {filled ? <View className="w-3.5 h-3.5 rounded-full bg-text" /> : null}
            </View>
          );
        })}
      </View>
    </AuthShell>
  );
}
