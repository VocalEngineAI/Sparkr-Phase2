import React, { useState } from "react";
import { Alert, Switch, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { mockBranches, mockBusiness, mockOpeningHours } from "@sparkr/shared";
import {
  Badge,
  Button,
  LinkButton,
  ListCard,
  ListRow,
  notYet,
  Screen,
  Section,
  Text,
} from "../../../components/business/kit";
import { Input } from "../../../components/ui/input";
import { cn } from "../../../lib/utils";

// Customer-facing business profile (slide 38): logo & photos, info, opening hours, and
// branches (chains pick a branch for campaigns and events).

const PRICE_RANGES = ["$", "$$", "$$$", "$$$$"];

export default function BusinessProfileScreen() {
  const [info, setInfo] = useState({
    name: mockBusiness.name,
    cuisine: mockBusiness.cuisine ?? "",
    phone: mockBusiness.phone,
    email: mockBusiness.email,
    website: mockBusiness.website,
    address: `${mockBusiness.address}, ${mockBusiness.city}`,
    description: mockBusiness.description,
  });
  const [price, setPrice] = useState(mockBusiness.priceRange);
  const [hours, setHours] = useState(mockOpeningHours);

  const field = (k: keyof typeof info, label: string, opts: { multiline?: boolean; keyboard?: "email-address" | "phone-pad" | "url" } = {}) => (
    <View>
      <Text className="text-sm font-semibold mb-1.5">{label}</Text>
      <Input
        value={info[k]}
        onChangeText={(v) => setInfo((p) => ({ ...p, [k]: v }))}
        multiline={opts.multiline}
        keyboardType={opts.keyboard}
        autoCapitalize={opts.keyboard ? "none" : undefined}
        className={opts.multiline ? "h-24 py-3" : undefined}
        style={opts.multiline ? { textAlignVertical: "top" } : undefined}
      />
    </View>
  );

  return (
    <Screen>
      <Section title="Logo & photos">
        <View className="h-32 rounded-2xl bg-primary items-center justify-center overflow-hidden">
          <Ionicons name="image-outline" size={36} color={colors.primaryLight} />
          <Button
            variant="secondary"
            size="sm"
            className="absolute right-3 bottom-3"
            onPress={() => notYet("Change cover photo")}
          >
            <Ionicons name="camera-outline" size={15} color={colors.text} />
            <Text>Cover</Text>
          </Button>
        </View>
        <View className="flex-row items-center -mt-8 ml-4">
          <View className="w-20 h-20 rounded-full bg-background border-4 border-background items-center justify-center">
            <View className="w-full h-full rounded-full bg-surface items-center justify-center">
              <Text className="text-xl font-extrabold">TS</Text>
            </View>
          </View>
          <Button variant="outline" size="sm" className="ml-3 mt-8" onPress={() => notYet("Change logo")}>
            <Text>Change logo</Text>
          </Button>
          <Button variant="ghost" size="sm" className="mt-8" onPress={() => notYet("Gallery", "Add photos customers see on your profile.")}>
            <Text>Gallery (12)</Text>
          </Button>
        </View>
      </Section>

      <Section title="Business information">
        <View className="gap-4">
          {field("name", "Business name")}
          {field("cuisine", "Category")}
          <View>
            <Text className="text-sm font-semibold mb-1.5">Price range</Text>
            <View className="flex-row gap-2">
              {PRICE_RANGES.map((p) => (
                <Button
                  key={p}
                  size="sm"
                  variant={price === p ? "default" : "secondary"}
                  className="flex-1"
                  onPress={() => setPrice(p)}
                  accessibilityState={{ selected: price === p }}
                >
                  <Text>{p}</Text>
                </Button>
              ))}
            </View>
          </View>
          {field("description", "Description", { multiline: true })}
          {field("address", "Address")}
          {field("phone", "Phone", { keyboard: "phone-pad" })}
          {field("email", "Email", { keyboard: "email-address" })}
          {field("website", "Website", { keyboard: "url" })}
        </View>
      </Section>

      <Section title="Opening hours">
        <ListCard>
          {hours.map((h, i) => (
            <View
              key={h.day}
              className={cn("flex-row items-center px-4 py-3 bg-background", i < hours.length - 1 && "border-b border-border")}
            >
              <Text className="font-semibold w-28">{h.day}</Text>
              <Text className={cn("flex-1 text-sm", h.closed ? "text-textMuted" : "")}>
                {h.closed ? "Closed" : `${h.open} – ${h.close}`}
              </Text>
              <Switch
                value={!h.closed}
                onValueChange={(open) =>
                  setHours((list) =>
                    list.map((x) =>
                      x.day === h.day ? { ...x, closed: !open, open: x.open ?? "5:00 PM", close: x.close ?? "10:00 PM" } : x
                    )
                  )
                }
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={colors.border}
                accessibilityLabel={`Open on ${h.day}`}
              />
            </View>
          ))}
        </ListCard>
      </Section>

      <Section title="Branches" action={<LinkButton label="Add" onPress={() => notYet("Add branch")} />}>
        <ListCard>
          {mockBranches.map((b, i) => (
            <ListRow
              key={b.id}
              icon="location-outline"
              title={b.name}
              subtitle={b.address}
              right={b.isMain ? <Badge label="Main" tone="accent" /> : undefined}
              onPress={() => notYet(b.name)}
              last={i === mockBranches.length - 1}
            />
          ))}
        </ListCard>
        <Text className="text-xs text-textMuted mt-2">Campaigns and events are created per branch.</Text>
      </Section>

      <Button size="lg" onPress={() => Alert.alert("Saved", "Your profile is updated in the customer app.")}>
        <Text>Save changes</Text>
      </Button>
    </Screen>
  );
}
