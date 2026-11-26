import React, { useState } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { mockBusiness, mockSocialAccounts } from "@sparkr/shared";
import {
  Badge,
  Button,
  ListCard,
  ListRow,
  notYet,
  PlatformIcon,
  platformLabel,
  Screen,
  Section,
  SwitchRow,
  Text,
} from "../../../components/business/kit";

// Account info, notifications, language (multi-language like One-Tab), and connected
// services: social accounts, Google Business Profile, Stripe Connect.

const LANGUAGES = [
  ["en", "English"],
  ["zh", "中文"],
  ["es", "Español"],
  ["ko", "한국어"],
] as const;

export default function SettingsScreen() {
  const [notif, setNotif] = useState({
    bookings: true,
    reviews: true,
    applicants: true,
    payments: true,
    wallet: true,
    marketing: false,
  });
  const [lang, setLang] = useState<(typeof LANGUAGES)[number][0]>("en");
  const toggle = (k: keyof typeof notif) => (v: boolean) => setNotif((n) => ({ ...n, [k]: v }));

  return (
    <Screen>
      <Section title="Account">
        <ListCard>
          <ListRow icon="person-outline" title={mockBusiness.ownerName} subtitle="Owner" onPress={() => notYet("Edit name")} />
          <ListRow icon="mail-outline" title="kenny@tangsushie.com" subtitle="Login email" onPress={() => notYet("Change email")} />
          <ListRow icon="call-outline" title={mockBusiness.phone} subtitle="Phone" onPress={() => notYet("Change phone")} />
          <ListRow icon="lock-closed-outline" title="Change password" onPress={() => notYet("Change password")} />
          <ListRow icon="keypad-outline" title="Change PIN" subtitle="Quick unlock for staff devices" onPress={() => notYet("Change PIN")} last />
        </ListCard>
      </Section>

      <Section title="Notifications">
        <ListCard>
          <SwitchRow title="New bookings & waitlist" value={notif.bookings} onValueChange={toggle("bookings")} />
          <SwitchRow title="Google reviews" value={notif.reviews} onValueChange={toggle("reviews")} />
          <SwitchRow title="Campaign applicants & posts" value={notif.applicants} onValueChange={toggle("applicants")} />
          <SwitchRow title="Payments due" description="Paid campaigns within 72 hours" value={notif.payments} onValueChange={toggle("payments")} />
          <SwitchRow title="Low wallet balance" value={notif.wallet} onValueChange={toggle("wallet")} />
          <SwitchRow title="Sparkr news & tips" value={notif.marketing} onValueChange={toggle("marketing")} last />
        </ListCard>
      </Section>

      <Section title="Language">
        <View className="flex-row flex-wrap gap-2">
          {LANGUAGES.map(([code, label]) => (
            <Button
              key={code}
              variant={lang === code ? "default" : "outline"}
              className="rounded-full"
              size="sm"
              onPress={() => setLang(code)}
              accessibilityState={{ selected: lang === code }}
            >
              <Text>{label}</Text>
            </Button>
          ))}
        </View>
      </Section>

      <Section title="Connected social accounts">
        <ListCard>
          {mockSocialAccounts.map((a, i) => (
            <View key={a.platform} className={`flex-row items-center px-4 py-3 bg-background ${i < mockSocialAccounts.length - 1 ? "border-b border-border" : ""}`}>
              <View className="w-9 items-center mr-3">
                <PlatformIcon platform={a.platform} size={22} />
              </View>
              <View className="flex-1">
                <Text className="font-semibold">{platformLabel(a.platform)}</Text>
                {a.connected ? <Text className="text-sm text-textMuted">{a.handle}</Text> : null}
              </View>
              <Button
                variant={a.connected ? "ghost" : "default"}
                size="sm"
                onPress={() => notYet(a.connected ? `Disconnect ${platformLabel(a.platform)}` : `Connect ${platformLabel(a.platform)}`)}
              >
                <Text>{a.connected ? "Disconnect" : "Connect"}</Text>
              </Button>
            </View>
          ))}
        </ListCard>
      </Section>

      <Section title="Integrations">
        <ListCard>
          <ListRow
            icon="logo-google"
            title="Google Business Profile"
            subtitle="1 location · AI replies on"
            right={<Badge label="Connected" tone="success" />}
            onPress={() => notYet("Google connection", "Reconnect or change linked locations.")}
          />
          <ListRow
            icon="card-outline"
            title="Stripe Connect"
            subtitle="Payouts for vouchers, gift cards and tickets"
            right={<Badge label="Connected" tone="success" />}
            onPress={() => notYet("Stripe Connect", "Opens your Stripe dashboard.")}
            last
          />
        </ListCard>
        <View className="flex-row items-center gap-2 mt-2">
          <Ionicons name="shield-checkmark-outline" size={14} color={colors.textMuted} />
          <Text className="text-xs text-textMuted">Google connects securely by OAuth. Sparkr never sees your passwords.</Text>
        </View>
      </Section>
    </Screen>
  );
}
