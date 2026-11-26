import React, { useRef, useState } from "react";
import { KeyboardAvoidingView, Linking, Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Text } from "../ui/text";

// Full-screen QR scanner shared by the ticket scanner (event entry) and the cashier coin
// scanner. Scans pause while a result is showing (`paused`), so one code is read once.
// Manual entry is the fallback for damaged codes and for testing on a simulator.

type Props = {
  title: string;
  subtitle?: string;
  onClose: () => void;
  onScan: (code: string) => void;
  /** Stop reading codes while the parent shows a result. */
  paused: boolean;
  /** Result panel shown over the bottom of the camera. */
  result?: React.ReactNode;
  manualPlaceholder?: string;
};

export default function QrScanner({ title, subtitle, onClose, onScan, paused, result, manualPlaceholder }: Props) {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [manual, setManual] = useState(false);
  const [code, setCode] = useState("");
  // Guards against the camera firing several events for one code before `paused` updates.
  const lastScan = useRef(0);

  const handleScan = (value: string) => {
    const now = Date.now();
    if (paused || now - lastScan.current < 1500) return;
    lastScan.current = now;
    onScan(value.trim());
  };

  const header = (
    <View className="flex-row items-center px-5" style={{ paddingTop: insets.top + 8 }}>
      <View className="flex-1">
        <Text className="text-xl font-bold text-background">{title}</Text>
        {subtitle ? <Text className="text-sm text-primaryLight">{subtitle}</Text> : null}
      </View>
      <Button
        variant="secondary"
        size="icon"
        className="rounded-full bg-background/15 active:bg-background/25"
        onPress={onClose}
        accessibilityLabel="Close scanner"
      >
        <Ionicons name="close" size={22} color={colors.background} />
      </Button>
    </View>
  );

  if (!permission) return <View className="flex-1 bg-primary" />;

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-primary">
        <StatusBar style="light" />
        {header}
        <View className="flex-1 justify-center px-6">
          <Ionicons name="qr-code-outline" size={48} color={colors.linen} />
          <Text className="text-2xl font-extrabold text-background mt-6 mb-2">Camera access</Text>
          <Text className="text-base text-primaryLight mb-8">Sparkr uses the camera to scan QR codes.</Text>
          <Button
            variant="secondary"
            size="lg"
            onPress={permission.canAskAgain ? requestPermission : () => Linking.openSettings()}
          >
            <Text>{permission.canAskAgain ? "Allow camera" : "Open settings"}</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView className="flex-1 bg-primary" behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <StatusBar style="light" />
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={paused ? undefined : ({ data }) => handleScan(data)}
      />
      <View style={StyleSheet.absoluteFill} className="bg-primary/40" pointerEvents="none" />

      {header}

      {/* Framing guide */}
      <View className="flex-1 items-center justify-center" pointerEvents="none">
        <View className="w-64 h-64 rounded-3xl border-4 border-accent" />
        <Text className="text-sm text-background mt-4">Point at the QR code</Text>
      </View>

      <View className="px-5" style={{ paddingBottom: insets.bottom + 16 }}>
        {result ? (
          result
        ) : manual ? (
          <View className="bg-background rounded-3xl p-4">
            <Text className="font-semibold mb-2">Enter code</Text>
            <Input
              value={code}
              onChangeText={setCode}
              placeholder={manualPlaceholder ?? "Code"}
              autoCapitalize="characters"
              autoCorrect={false}
              autoFocus
              onSubmitEditing={() => code.trim() && onScan(code.trim())}
            />
            <View className="flex-row gap-2 mt-3">
              <Button variant="outline" className="flex-1" onPress={() => setManual(false)}>
                <Text>Cancel</Text>
              </Button>
              <Button
                className="flex-1"
                disabled={!code.trim()}
                onPress={() => {
                  onScan(code.trim());
                  setCode("");
                }}
              >
                <Text>Look up</Text>
              </Button>
            </View>
          </View>
        ) : (
          <Button variant="secondary" size="lg" onPress={() => setManual(true)}>
            <Ionicons name="keypad-outline" size={18} color={colors.text} />
            <Text>Enter code manually</Text>
          </Button>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
