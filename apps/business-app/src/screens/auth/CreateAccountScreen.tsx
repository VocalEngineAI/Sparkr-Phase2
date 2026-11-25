import React, { useState } from "react";
import { View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthRole, AuthStackParamList } from "../../navigation/AuthNavigator";
import AuthShell from "../../components/auth/AuthShell";
import IconField from "../../components/auth/IconField";
import Checkbox from "../../components/auth/Checkbox";
import PrimaryButton from "../../components/auth/PrimaryButton";
import FooterLink from "../../components/auth/FooterLink";
import RoleSelector from "../../components/auth/RoleSelector";
import { OrDivider, SocialRow } from "../../components/auth/Social";
import { Text } from "../../components/ui/text";

type Props = NativeStackScreenProps<AuthStackParamList, "CreateAccount">;

const EMAIL = /^\S+@\S+\.\S+$/;

export default function CreateAccountScreen({ navigation }: Props) {
  const [role, setRole] = useState<AuthRole>("business");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Frontend-only: validate, then carry on to the profile step. No backend call yet.
  const submit = () => {
    if (!EMAIL.test(email.trim())) return setError("Enter a valid email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    setError(null);
    navigation.navigate("FillProfile", { role, email: email.trim() });
  };

  return (
    <AuthShell
      onBack={() => navigation.goBack()}
      footer={
        <FooterLink
          prompt="Already have an account?"
          action="Sign in"
          onPress={() => navigation.navigate("Login")}
        />
      }
    >
      <Text className="text-[34px] leading-[40px] font-extrabold mb-6">Create your{"\n"}Account</Text>

      <RoleSelector value={role} onChange={setRole} />

      <View className="gap-4 mt-6">
        <IconField
          icon="mail-outline"
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
        />
        <IconField
          icon="lock-closed-outline"
          secure
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          textContentType="newPassword"
          autoComplete="new-password"
        />
      </View>

      <View className="items-center mt-5">
        <Checkbox checked={remember} onChange={setRemember} label="Remember me" />
      </View>

      {error ? <Text className="text-sm text-warning text-center mt-4">{error}</Text> : null}

      <PrimaryButton label="Sign up" onPress={submit} className="mt-5" />

      <OrDivider label="or continue with" className="my-7" />
      <SocialRow />
    </AuthShell>
  );
}
