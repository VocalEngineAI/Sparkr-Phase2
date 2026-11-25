import React, { useState } from "react";
import { Alert, Pressable, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthRole, AuthStackParamList } from "../../navigation/AuthNavigator";
import { useAuth } from "../../context/AuthContext";
import AuthShell from "../../components/auth/AuthShell";
import IconField from "../../components/auth/IconField";
import Checkbox from "../../components/auth/Checkbox";
import PrimaryButton from "../../components/auth/PrimaryButton";
import FooterLink from "../../components/auth/FooterLink";
import RoleSelector from "../../components/auth/RoleSelector";
import { OrDivider, SocialRow } from "../../components/auth/Social";
import { Text } from "../../components/ui/text";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

const EMAIL = /^\S+@\S+\.\S+$/;

export default function LoginScreen({ navigation }: Props) {
  const { signInAs } = useAuth();
  const [role, setRole] = useState<AuthRole>("business");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Frontend-only: validate, then sign in with the chosen role. No backend call yet.
  const submit = () => {
    if (!EMAIL.test(email.trim())) return setError("Enter a valid email address.");
    if (!password) return setError("Enter your password.");
    setError(null);
    signInAs(role);
  };

  return (
    <AuthShell
      onBack={() => navigation.goBack()}
      footer={
        <FooterLink
          prompt="Don't have an account?"
          action="Sign up"
          onPress={() => navigation.navigate("CreateAccount")}
        />
      }
    >
      <Text className="text-[34px] leading-[40px] font-extrabold mb-6">Login to your{"\n"}Account</Text>

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
          textContentType="password"
          autoComplete="current-password"
        />
      </View>

      <View className="items-center mt-5">
        <Checkbox checked={remember} onChange={setRemember} label="Remember me" />
      </View>

      {error ? <Text className="text-sm text-warning text-center mt-4">{error}</Text> : null}

      <PrimaryButton label="Sign in" onPress={submit} className="mt-5" />

      <Pressable
        onPress={() => Alert.alert("Reset password", "Password reset isn't available yet.")}
        hitSlop={8}
        className="self-center mt-5"
      >
        <Text className="text-sm font-bold text-primary">Forgot the password?</Text>
      </Pressable>

      <OrDivider label="or continue with" className="my-7" />
      <SocialRow />
    </AuthShell>
  );
}
