import React, { useState } from "react";
import { Alert, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { mockCoinSettings, mockCustomers, type Customer } from "@sparkr/shared";
import QrScanner from "../../../components/business/QrScanner";
import TierBadge from "../../../components/business/TierBadge";
import { Button, money, Segmented, Text } from "../../../components/business/kit";
import { Input } from "../../../components/ui/input";
import type { CustomersScreenProps } from "../../../navigation/businessTypes";

// Cashier flow (Feature 14): scan the member's card QR → enter the bill → add coins at the
// reward rate, or redeem coins toward the bill. Every action is confirmed.
// Demo: the member QR encodes the customer id (e.g. "c_1"); any other code is unknown.

export default function CoinScannerScreen({ navigation }: CustomersScreenProps<"CoinScanner">) {
  const [member, setMember] = useState<Customer | null>(null);
  const [unknown, setUnknown] = useState<string | null>(null);

  const lookup = (code: string) => {
    const c = mockCustomers.find((x) => x.id === code || x.email === code.toLowerCase());
    if (c) setMember(c);
    else setUnknown(code);
  };

  const reset = () => {
    setMember(null);
    setUnknown(null);
  };

  return (
    <QrScanner
      title="Scan member QR"
      subtitle="Add or redeem Sparkr Coins"
      onClose={() => navigation.goBack()}
      onScan={lookup}
      paused={!!member || !!unknown}
      manualPlaceholder="Member code, e.g. c_1"
      result={
        member ? (
          <CoinPanel member={member} onDone={reset} />
        ) : unknown ? (
          <View className="bg-background rounded-3xl p-5">
            <View className="flex-row items-center gap-2">
              <Ionicons name="alert-circle" size={22} color={colors.warning} />
              <Text className="font-bold text-lg">Not a Tang Sushie member</Text>
            </View>
            <Text className="text-sm text-textMuted mt-1">
              “{unknown}” isn't a member card. Ask them to join from your page (NFC tap) first.
            </Text>
            <Button className="mt-4" onPress={reset}>
              <Text>Scan again</Text>
            </Button>
          </View>
        ) : undefined
      }
    />
  );
}

function CoinPanel({ member, onDone }: { member: Customer; onDone: () => void }) {
  const [mode, setMode] = useState<"earn" | "redeem">("earn");
  const [bill, setBill] = useState("");
  const amount = Number(bill.replace(/[^0-9.]/g, "")) || 0;
  const earned = Math.floor((amount * mockCoinSettings.rewardRatePct) / 100);
  const redeemable = Math.min(member.coins, Math.floor(amount));

  const confirm = () => {
    const msg =
      mode === "earn"
        ? `Add ${earned} coins to ${member.name}?`
        : `Redeem ${redeemable} coins ($${redeemable}) from ${member.name}? They pay ${money(amount - redeemable, true)}.`;
    Alert.alert("Confirm", msg, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: () => {
          Alert.alert("Done", mode === "earn" ? `${earned} coins added.` : `${redeemable} coins redeemed.`);
          onDone();
        },
      },
    ]);
  };

  return (
    <View className="bg-background rounded-3xl p-5">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="font-bold text-lg">{member.name}</Text>
          <Text className="text-sm text-textMuted">{member.coins} coins available</Text>
        </View>
        <TierBadge tier={member.tier} />
      </View>

      <Segmented
        options={[
          ["earn", "Add coins"],
          ["redeem", "Redeem coins"],
        ]}
        value={mode}
        onChange={setMode}
        className="mt-4"
      />

      <Input
        value={bill}
        onChangeText={setBill}
        placeholder="Bill amount ($)"
        keyboardType="decimal-pad"
        className="mt-3"
      />
      <Text className="text-sm text-textMuted mt-2">
        {amount === 0
          ? "Enter the bill total."
          : mode === "earn"
            ? `${mockCoinSettings.rewardRatePct}% reward rate → ${earned} coins`
            : `Use ${redeemable} coins · customer pays ${money(amount - redeemable, true)}`}
      </Text>

      <View className="flex-row gap-2 mt-4">
        <Button variant="outline" className="flex-1" onPress={onDone}>
          <Text>Cancel</Text>
        </Button>
        <Button className="flex-1" disabled={amount === 0 || (mode === "earn" ? earned === 0 : redeemable === 0)} onPress={confirm}>
          <Text>{mode === "earn" ? `Add ${earned}` : `Redeem ${redeemable}`}</Text>
        </Button>
      </View>
    </View>
  );
}
