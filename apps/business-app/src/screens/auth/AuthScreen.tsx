import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInputProps, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../context/AuthContext";
import type { AuthRole, AuthStackParamList } from "../../navigation/AuthNavigator";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

// Sign up / log in for both account types. Frontend-only for now: submitting validates
// the form and signs in with the chosen role via AuthContext — no backend call yet.

type Props = NativeStackScreenProps<AuthStackParamList, "Auth">;

const ROLES: { value: AuthRole; label: string; hint: string }[] = [
  { value: "business", label: "Business", hint: "Restaurant, salon or spa" },
  { value: "influencer", label: "Influencer", hint: "Creator or reviewer" },
];

export default function AuthScreen({ navigation, route }: Props) {
  const { mode } = route.params;
  const isSignup = mode === "signup";
  const insets = useSafeAreaInsets();
  const { signInAs } = useAuth();

  const [role, setRole] = useState<AuthRole>(route.params.role ?? "business");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (isSignup && !name.trim()) return setError(`Enter your ${role === "business" ? "business name" : "name"}.`);
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Enter a valid email address.");
    if (password.length < (isSignup ? 8 : 1))
      return setError(isSignup ? "Password must be at least 8 characters." : "Enter your password.");
    setError(null);
    signInAs(role);
  };

  const switchMode = () => {
    setError(null);
    navigation.setParams({ mode: isSignup ? "login" : "signup", role });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-6">
          <Button
            variant="outline"
            size="icon"
            onPress={() => navigation.goBack()}
            hitSlop={12}
            className="w-10 h-10 rounded-full mb-6"
          >
            <Text className="text-navy text-lg">←</Text>
          </Button>

          <Text className="text-3xl font-extrabold text-text mb-2">
            {isSignup ? "Create your account" : "Welcome back"}
          </Text>
          <Text className="text-base text-textMuted mb-8">
            {isSignup
              ? "Join Sparkr as a business or an influencer."
              : "Log in to manage your campaigns."}
          </Text>

          <Text className="text-sm font-semibold text-text mb-3">I'm a</Text>
          <View className="flex-row gap-3 mb-8">
            {ROLES.map((r) => {
              const selected = r.value === role;
              return (
                <Pressable
                  key={r.value}
                  onPress={() => setRole(r.value)}
                  className={`flex-1 rounded-2xl p-4 border ${
                    selected ? "bg-navy border-navy" : "bg-surface border-border"
                  }`}
                >
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className={`text-base font-bold ${selected ? "text-linen" : "text-text"}`}>
                      {r.label}
                    </Text>
                    {selected ? <View className="w-2.5 h-2.5 rounded-full bg-amber" /> : null}
                  </View>
                  <Text className={`text-xs ${selected ? "text-primaryLight" : "text-textMuted"}`}>
                    {r.hint}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {isSignup ? (
            <Field
              label={role === "business" ? "Business name" : "Full name"}
              value={name}
              onChangeText={setName}
              placeholder={role === "business" ? "e.g. Kenny's Kitchen" : "e.g. Alex Rivera"}
              autoCapitalize="words"
              textContentType={role === "business" ? "organizationName" : "name"}
            />
          ) : null}
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
          />
          <Field
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder={isSignup ? "At least 8 characters" : "Your password"}
            secureTextEntry
            textContentType={isSignup ? "newPassword" : "password"}
            autoComplete={isSignup ? "new-password" : "current-password"}
          />

          {!isSignup ? (
            <Pressable
              onPress={() => Alert.alert("Reset password", "Password reset isn't available yet.")}
              className="self-end -mt-1 mb-6"
            >
              <Text className="text-sm font-semibold text-navy">Forgot password?</Text>
            </Pressable>
          ) : null}

          {error ? <Text className="text-sm text-warning mb-4">{error}</Text> : null}

          <Button onPress={submit} size="lg" className="mt-2">
            <Text className="text-background text-base font-bold">{isSignup ? "Create account" : "Log in"}</Text>
          </Button>

          {isSignup ? (
            <Text className="text-xs text-textMuted text-center mt-4 leading-5">
              By creating an account you agree to Sparkr's Terms of Service and Privacy Policy.
            </Text>
          ) : null}

          <View className="flex-row justify-center mt-8">
            <Text className="text-sm text-textMuted">
              {isSignup ? "Already have an account? " : "New to Sparkr? "}
            </Text>
            <Pressable onPress={switchMode} hitSlop={8}>
              <Text className="text-sm font-bold text-navy underline">
                {isSignup ? "Log in" : "Create an account"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, ...input }: TextInputProps & { label: string }) {
  return (
    <View className="mb-5">
      <Label className="mb-2">{label}</Label>
      <Input {...input} className="h-auto rounded-xl px-4 py-3.5" />
    </View>
  );
}
