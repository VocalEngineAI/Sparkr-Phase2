import React, { useState } from "react";
import { View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/AuthNavigator";
import { useAuth } from "../../context/AuthContext";
import AuthShell from "../../components/auth/AuthShell";
import PrimaryButton from "../../components/auth/PrimaryButton";
import { applyKey, CodeBoxes, NumberPad } from "../../components/auth/CodeEntry";
import { Text } from "../../components/ui/text";

type Props = NativeStackScreenProps<AuthStackParamList, "CreatePin">;

const PIN_LENGTH = 4;

export default function CreatePinScreen({ navigation, route }: Props) {
  const { signInAs } = useAuth();
  const [pin, setPin] = useState("");

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
          <View className="mt-6">
            <NumberPad onKey={(key) => setPin((p) => applyKey(p, key, PIN_LENGTH))} />
          </View>
        </>
      }
    >
      <Text className="text-base text-textMuted text-center mt-6 mb-10 px-4">
        Add a PIN number to make your account more secure
      </Text>
      <CodeBoxes length={PIN_LENGTH} value={pin} masked />
    </AuthShell>
  );
}
