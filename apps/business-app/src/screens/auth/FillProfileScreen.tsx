import React, { useState } from "react";
import { Alert, Pressable, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import type { AuthStackParamList } from "../../navigation/AuthNavigator";
import AuthShell from "../../components/auth/AuthShell";
import IconField from "../../components/auth/IconField";
import PrimaryButton from "../../components/auth/PrimaryButton";
import { Text } from "../../components/ui/text";

type Props = NativeStackScreenProps<AuthStackParamList, "FillProfile">;

const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

export default function FillProfileScreen({ navigation, route }: Props) {
  const { role, email: signupEmail } = route.params;
  const isBusiness = role === "business";

  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState(signupEmail);
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState<string | null>(null);

  const pickGender = () =>
    Alert.alert("Gender", undefined, [
      ...GENDERS.map((g) => ({ text: g, onPress: () => setGender(g) })),
      { text: "Cancel", style: "cancel" as const },
    ]);

  const submit = () => {
    if (!fullName.trim()) return setError(`Enter your ${isBusiness ? "business name" : "full name"}.`);
    setError(null);
    navigation.navigate("CreatePin", { role });
  };

  return (
    <AuthShell onBack={() => navigation.goBack()} title="Fill Your Profile">
      {/* Avatar with an edit badge. Photo upload isn't wired up yet. */}
      <Pressable
        onPress={() => Alert.alert("Profile photo", "Photo upload isn't available yet.")}
        className="self-center mb-8"
        accessibilityLabel="Add profile photo"
      >
        <View className="w-32 h-32 rounded-full bg-surface border border-border items-center justify-center overflow-hidden">
          <Ionicons name="person" size={64} color={colors.border} />
        </View>
        <View className="absolute right-1 bottom-1 w-8 h-8 rounded-lg bg-accent items-center justify-center">
          <Ionicons name="pencil" size={15} color={colors.navy} />
        </View>
      </Pressable>

      <View className="gap-4">
        <IconField
          value={fullName}
          onChangeText={setFullName}
          placeholder={isBusiness ? "Business name" : "Full name"}
          autoCapitalize="words"
          textContentType={isBusiness ? "organizationName" : "name"}
        />
        <IconField value={nickname} onChangeText={setNickname} placeholder="Nickname" autoCapitalize="words" />
        <IconField
          value={dob}
          onChangeText={setDob}
          placeholder="Date of birth (MM/DD/YYYY)"
          keyboardType="numbers-and-punctuation"
          trailing={<Ionicons name="calendar-outline" size={18} color={colors.textMuted} />}
        />
        <IconField
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          trailing={<Ionicons name="mail-outline" size={18} color={colors.textMuted} />}
        />
        <IconField
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone number"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          prefix={
            <>
              <Text className="text-base">🇺🇸</Text>
              <Ionicons name="chevron-down" size={14} color={colors.textMuted} style={{ marginHorizontal: 4 }} />
              <Text className="text-base text-textMuted">+1</Text>
            </>
          }
        />
        <Pressable
          onPress={pickGender}
          className="h-14 rounded-2xl bg-surface border border-border px-4 flex-row items-center justify-between"
          accessibilityRole="button"
        >
          <Text className={gender ? "text-base" : "text-base text-textMuted/70"}>{gender || "Gender"}</Text>
          <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
        </Pressable>
      </View>

      {error ? <Text className="text-sm text-warning text-center mt-4">{error}</Text> : null}

      <PrimaryButton label="Continue" onPress={submit} className="mt-8" />
    </AuthShell>
  );
}
