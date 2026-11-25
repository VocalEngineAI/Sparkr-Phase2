import React, { useState } from "react";
import { View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/AuthNavigator";
import AuthShell from "../../components/auth/AuthShell";
import IconField from "../../components/auth/IconField";
import PrimaryButton from "../../components/auth/PrimaryButton";
import FooterLink from "../../components/auth/FooterLink";
import { Text } from "../../components/ui/text";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

const EMAIL = /^\S+@\S+\.\S+$/;

export default function ForgotPasswordScreen({ navigation, route }: Props) {
  const { role } = route.params;
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Frontend-only: validate, then on to the code screen. Nothing is actually sent yet.
  const submit = () => {
    if (!EMAIL.test(email.trim())) return setError("Enter a valid email address.");
    setError(null);
    navigation.navigate("VerifyEmail", { role, email: email.trim(), purpose: "reset" });
  };

  return (
    <AuthShell
      onBack={() => navigation.goBack()}
      footer={
        <FooterLink prompt="Remembered it?" action="Sign in" onPress={() => navigation.goBack()} />
      }
    >
      <Text className="text-[34px] leading-[40px] font-extrabold mb-2">Forgot{"\n"}password?</Text>
      <Text className="text-base text-textMuted mb-8">
        Enter the email for your account and we'll send you a code to reset your password.
      </Text>

      <View className="gap-4">
        <IconField
          icon="mail-outline"
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          returnKeyType="send"
          onSubmitEditing={submit}
        />
      </View>

      {error ? <Text className="text-sm text-warning text-center mt-4">{error}</Text> : null}

      <PrimaryButton label="Send code" onPress={submit} className="mt-6" />
    </AuthShell>
  );
}
