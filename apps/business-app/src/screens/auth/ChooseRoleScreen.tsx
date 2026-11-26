import React, { useState } from "react";
import { Pressable, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
// Per-icon imports: the package's root index re-exports ~2,400 icons, which bloats the
// bundle and trips Metro's resolver.
import Store from "lucide-react-native/icons/store";
import Camera from "lucide-react-native/icons/camera";
import type { LucideIcon } from "lucide-react-native";
import { colors } from "@sparkr/ui";
import type { AuthRole, AuthStackParamList } from "../../navigation/AuthNavigator";
import AuthShell from "../../components/auth/AuthShell";
import PrimaryButton from "../../components/auth/PrimaryButton";
import FooterLink from "../../components/auth/FooterLink";
import { Text } from "../../components/ui/text";
import { cn } from "../../lib/utils";

type Props = NativeStackScreenProps<AuthStackParamList, "ChooseRole">;

// One app, two account types. This is asked once, up front; sign-up and login carry the
// answer along so the mock auth knows which role to sign in as.
const ROLES: { value: AuthRole; icon: LucideIcon; label: string; body: string }[] = [
  {
    value: "business",
    icon: Store,
    label: "Business",
    body: "Restaurants, salons, spas and other local businesses running campaigns.",
  },
  {
    value: "influencer",
    icon: Camera, // influencers visit and create content
    label: "Influencer",
    body: "Creators and reviewers who visit, post and get rewarded.",
  },
];

export default function ChooseRoleScreen({ navigation }: Props) {
  const [role, setRole] = useState<AuthRole | null>(null);

  return (
    <AuthShell
      onBack={() => navigation.goBack()}
      footer={
        <>
          <PrimaryButton
            label="Continue"
            disabled={!role}
            onPress={() => role && navigation.navigate("CreateAccount", { role })}
          />
          <View className="mt-5">
            <FooterLink
              prompt="Already have an account?"
              action="Sign in"
              onPress={() => navigation.navigate("Login", { role: role ?? "business" })}
            />
          </View>
        </>
      }
    >
      <Text className="text-[34px] leading-[40px] font-extrabold mb-2">Who are you{"\n"}joining as?</Text>
      <Text className="text-base text-textMuted mb-8">You can't change this later, so pick the one that fits.</Text>

      <View className="gap-4">
        {ROLES.map((r) => {
          const selected = r.value === role;
          return (
            <Pressable
              key={r.value}
              onPress={() => setRole(r.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              className={cn(
                "flex-row items-center rounded-2xl border p-5",
                selected ? "bg-primary border-primary" : "bg-surface border-border"
              )}
            >
              <View
                className={cn(
                  "w-12 h-12 rounded-xl items-center justify-center mr-4",
                  selected ? "bg-linen/15" : "bg-background"
                )}
              >
                <r.icon size={24} strokeWidth={1.75} color={selected ? colors.linen : colors.navy} />
              </View>
              <View className="flex-1">
                <Text className={cn("text-lg font-bold mb-1", selected && "text-background")}>{r.label}</Text>
                <Text className={cn("text-sm text-textMuted leading-5", selected && "text-primaryLight")}>
                  {r.body}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </AuthShell>
  );
}
