import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/AuthNavigator";
import AuthShell from "../../components/auth/AuthShell";
import PrimaryButton from "../../components/auth/PrimaryButton";
import { applyKey, CodeBoxes, NumberPad } from "../../components/auth/CodeEntry";
import { Text } from "../../components/ui/text";

type Props = NativeStackScreenProps<AuthStackParamList, "VerifyEmail">;

const CODE_LENGTH = 4;
const RESEND_SECONDS = 30;

export default function VerifyEmailScreen({ navigation, route }: Props) {
  const { role, email, purpose = "signup" } = route.params;
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  // Resend cooldown. Frontend-only: nothing is actually sent yet.
  useEffect(() => {
    if (secondsLeft === 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  const resend = () => {
    setCode("");
    setSecondsLeft(RESEND_SECONDS);
  };

  // Frontend-only: any complete code is accepted until the backend exists. Signing up
  // continues to the profile; a password reset continues to the new-password screen.
  const submit = () => {
    if (code.length < CODE_LENGTH) return;
    if (purpose === "reset") navigation.navigate("ResetPassword", { role, email });
    else navigation.navigate("FillProfile", { role, email });
  };

  return (
    <AuthShell
      onBack={() => navigation.goBack()}
      title={purpose === "reset" ? "Check your email" : "Verify your email"}
      footer={
        <>
          <PrimaryButton label="Continue" onPress={submit} disabled={code.length < CODE_LENGTH} />
          <View className="mt-6">
            <NumberPad onKey={(key) => setCode((c) => applyKey(c, key, CODE_LENGTH))} />
          </View>
        </>
      }
    >
      <Text className="text-base text-textMuted text-center mt-6 px-4">
        Enter the {CODE_LENGTH}-digit code we sent to
      </Text>
      <Text className="text-base font-semibold text-center mb-10">{email}</Text>

      <CodeBoxes length={CODE_LENGTH} value={code} />

      <View className="items-center mt-8">
        {secondsLeft > 0 ? (
          <Text className="text-sm text-textMuted">
            Resend code in 0:{String(secondsLeft).padStart(2, "0")}
          </Text>
        ) : (
          <Pressable onPress={resend} hitSlop={8}>
            <Text className="text-sm font-bold text-primary">Resend code</Text>
          </Pressable>
        )}
      </View>
    </AuthShell>
  );
}
