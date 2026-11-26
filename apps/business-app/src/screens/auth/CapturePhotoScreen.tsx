import React, { useRef, useState } from "react";
import { Image, Linking, Pressable, StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { CameraView, useCameraPermissions, type CameraType } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import type { AuthStackParamList } from "../../navigation/AuthNavigator";
import PrimaryButton from "../../components/auth/PrimaryButton";
import { Text } from "../../components/ui/text";

type Props = NativeStackScreenProps<AuthStackParamList, "CapturePhoto">;

// Full-screen camera for the profile photo: front camera by default, a circular guide for
// framing, shutter → preview → "Use photo" hands the picture back to the profile screen.
export default function CapturePhotoScreen({ navigation, route }: Props) {
  const { role, email } = route.params;
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("front");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const camera = useRef<CameraView>(null);

  const take = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const shot = await camera.current?.takePictureAsync({ quality: 0.8 });
      if (shot?.uri) setPhotoUri(shot.uri);
    } finally {
      setBusy(false);
    }
  };

  // Jump back to the profile screen already in the stack, adding the photo to its params.
  const usePhoto = () => {
    if (!photoUri) return;
    navigation.popTo("FillProfile", { role, email, photoUri }, { merge: true });
  };

  if (!permission) return <View className="flex-1 bg-navy" />;

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-background px-6 justify-center" style={{ paddingTop: insets.top }}>
        <StatusBar style="dark" />
        <Ionicons name="camera-outline" size={48} color={colors.navy} />
        <Text className="text-2xl font-extrabold mt-6 mb-2">Camera access</Text>
        <Text className="text-base text-textMuted mb-8">
          Sparkr uses the camera to take your profile photo.
        </Text>
        {permission.canAskAgain ? (
          <PrimaryButton label="Allow camera" onPress={requestPermission} />
        ) : (
          <PrimaryButton label="Open settings" onPress={() => Linking.openSettings()} />
        )}
        <Pressable onPress={() => navigation.goBack()} className="self-center mt-6" hitSlop={8}>
          <Text className="text-sm font-bold text-primary">Not now</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-navy">
      <StatusBar style="light" />

      {photoUri ? (
        <Image source={{ uri: photoUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      ) : (
        <CameraView ref={camera} style={StyleSheet.absoluteFill} facing={facing} />
      )}

      {/* Framing guide */}
      <View style={StyleSheet.absoluteFill} className="items-center justify-center" pointerEvents="none">
        <View className="w-72 h-72 rounded-full border-2 border-linen/80" />
      </View>

      {/* Top bar */}
      <View style={{ paddingTop: insets.top + 8 }} className="px-5 flex-row items-center justify-between">
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          className="w-10 h-10 rounded-full bg-navy/60 items-center justify-center"
          accessibilityLabel="Close"
        >
          <Ionicons name="close" size={22} color={colors.linen} />
        </Pressable>
        <Text className="text-linen text-base font-bold">Profile photo</Text>
        <View className="w-10" />
      </View>

      <View className="flex-1" />

      {/* Controls */}
      <View style={{ paddingBottom: insets.bottom + 24 }} className="px-6">
        {photoUri ? (
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => setPhotoUri(null)}
              className="flex-1 h-14 rounded-2xl border border-linen/60 items-center justify-center active:opacity-80"
            >
              <Text className="text-linen text-base font-semibold">Retake</Text>
            </Pressable>
            <Pressable
              onPress={usePhoto}
              className="flex-1 h-14 rounded-2xl bg-linen items-center justify-center active:opacity-80"
            >
              <Text className="text-navy text-base font-bold">Use photo</Text>
            </Pressable>
          </View>
        ) : (
          <View className="flex-row items-center justify-between">
            <View className="w-14" />
            <Pressable
              onPress={take}
              disabled={busy}
              accessibilityLabel="Take photo"
              className="w-20 h-20 rounded-full border-4 border-linen items-center justify-center active:opacity-80"
            >
              <View className="w-16 h-16 rounded-full bg-linen" />
            </Pressable>
            <Pressable
              onPress={() => setFacing((f) => (f === "front" ? "back" : "front"))}
              hitSlop={10}
              accessibilityLabel="Flip camera"
              className="w-14 h-14 rounded-full bg-navy/60 items-center justify-center"
            >
              <Ionicons name="camera-reverse-outline" size={26} color={colors.linen} />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
