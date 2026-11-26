import React, { useState } from "react";
import { Alert, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/AuthNavigator";
import AuthShell from "../../components/auth/AuthShell";
import IconField from "../../components/auth/IconField";
import PrimaryButton from "../../components/auth/PrimaryButton";
import { Text } from "../../components/ui/text";

type Props = NativeStackScreenProps<AuthStackParamList, "ResetPassword">;

export default function ResetPasswordScreen({ navigation, route }: Props) {
  const { role, email } = route.params;
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Frontend-only: validate, confirm, and return to login. No backend call yet.
  const submit = () => {
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (confirm !== password) return setError("Passwords don't match.");
    setError(null);
    Alert.alert("Password updated", "You can sign in with your new password.", [
      { text: "Sign in", onPress: () => navigation.popTo("Login", { role }) },
    ]);
  };

  return (
    <AuthShell onBack={() => navigation.goBack()}>
      <Text className="text-[34px] leading-[40px] font-extrabold mb-2">Create new{"\n"}password</Text>
      <Text className="text-base text-textMuted mb-8">
        Choose a new password for <Text className="text-base font-semibold">{email}</Text>.
      </Text>

      <View className="gap-4">
        <IconField
          icon="lock-closed-outline"
          secure
          value={password}
          onChangeText={setPassword}
          placeholder="New password"
          textContentType="newPassword"
          autoComplete="new-password"
        />
        <IconField
          icon="lock-closed-outline"
          secure
          value={confirm}
          onChangeText={setConfirm}
          placeholder="Confirm password"
          textContentType="newPassword"
          autoComplete="new-password"
          returnKeyType="done"
          onSubmitEditing={submit}
        />
      </View>

      {error ? <Text className="text-sm text-warning text-center mt-4">{error}</Text> : null}

      <PrimaryButton label="Reset password" onPress={submit} className="mt-6" />
    </AuthShell>
  );
}
