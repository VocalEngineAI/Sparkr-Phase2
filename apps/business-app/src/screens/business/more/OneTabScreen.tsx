import React, { useState } from "react";
import { Alert, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { mockBusiness, mockOneTab, type OneTabPage } from "@sparkr/shared";
import {
  Badge,
  Button,
  Card,
  InfoBanner,
  ListCard,
  ListRow,
  notYet,
  Screen,
  Section,
  Text,
} from "../../../components/business/kit";
import { Input } from "../../../components/ui/input";
import { cn } from "../../../lib/utils";

// Feature 9: paid One-Tab add-on. Setup form in the app → admin approves within 5 business
// days, sets the page up and mails the NFC tag → live (NFC tap opens it) → self-service
// editing of info, photos, menus and links (Feature 15 NFC tags live here too).

export default function OneTabScreen() {
  const [page, setPage] = useState<OneTabPage>(mockOneTab);

  if (page.status === "not_started") return <SetupForm onSubmit={() => setPage({ ...page, status: "in_review" })} />;

  const live = page.status === "live";

  return (
    <Screen>
      <Card tone={live ? "primary" : "surface"}>
        <View className="flex-row items-center justify-between">
          <Text className={cn("font-bold text-lg", live && "text-background")}>
            {live ? "Your page is live" : "In review"}
          </Text>
          <Badge label={live ? "Live" : "Pending"} tone={live ? "accent" : "neutral"} />
        </View>
        <Text className={cn("text-sm mt-1", live ? "text-primaryLight" : "text-textMuted")}>{page.url}</Text>
        {live ? (
          <Button variant="secondary" size="sm" className="self-start mt-3" onPress={() => notYet("Open page")}>
            <Ionicons name="open-outline" size={15} color={colors.text} />
            <Text>View page</Text>
          </Button>
        ) : null}
      </Card>

      <Section title="Approval status">
        <Card>
          {page.steps.map((s, i) => (
            <View key={s.label} className="flex-row">
              <View className="items-center mr-3">
                <View
                  className={cn(
                    "w-7 h-7 rounded-full items-center justify-center",
                    s.done ? "bg-primary" : "bg-surface border border-border"
                  )}
                >
                  {s.done ? <Ionicons name="checkmark" size={15} color={colors.background} /> : <Text className="text-xs">{i + 1}</Text>}
                </View>
                {i < page.steps.length - 1 ? <View className="w-0.5 flex-1 bg-border my-1" /> : null}
              </View>
              <View className={cn("flex-1", i < page.steps.length - 1 && "pb-4")}>
                <View className="flex-row justify-between">
                  <Text className="font-semibold">{s.label}</Text>
                  {s.date ? <Text className="text-xs text-textMuted">{s.date}</Text> : null}
                </View>
                <Text className="text-sm text-textMuted">{s.detail}</Text>
              </View>
            </View>
          ))}
        </Card>
      </Section>

      <Section title="Edit landing page">
        <ListCard>
          {(
            [
              ["information-circle-outline", "Business info", "Name, description, contact and hours"],
              ["images-outline", "Photos", "Cover and gallery"],
              ["restaurant-outline", "Menus", "Upload or update your menu"],
              ["link-outline", "Links", "Website, booking and socials"],
            ] as const
          ).map(([icon, title, subtitle], i, arr) => (
            <ListRow
              key={title}
              icon={icon}
              title={title}
              subtitle={subtitle}
              onPress={live ? () => notYet(`Edit ${title.toLowerCase()}`, "Changes go live in near real time.") : undefined}
              chevron={live}
              last={i === arr.length - 1}
            />
          ))}
        </ListCard>
        {!live ? <Text className="text-xs text-textMuted mt-2">Editing unlocks once your page is approved.</Text> : null}
      </Section>

      {live ? (
        <Section title="NFC tags">
          <ListCard>
            {page.nfcTags.map((t, i) => (
              <ListRow
                key={t.id}
                icon="radio-outline"
                iconTone={t.status === "active" ? "success" : "neutral"}
                title={t.location}
                subtitle={t.status === "active" ? `${t.tapsThisMonth} taps this month` : "Not active"}
                right={<Badge label={t.status === "active" ? "Active" : "Inactive"} tone={t.status === "active" ? "success" : "neutral"} />}
                chevron={false}
                last={i === page.nfcTags.length - 1}
              />
            ))}
          </ListCard>
          <Text className="text-xs text-textMuted mt-2">
            A tap opens your page; new customers can join from it, and Sparkr users go straight to their membership.
          </Text>
        </Section>
      ) : null}

      <InfoBanner text={`Monthly advanced analytics for ${mockBusiness.name}'s page are emailed to ${mockBusiness.email}.`} />
    </Screen>
  );
}

function SetupForm({ onSubmit }: { onSubmit: () => void }) {
  const [form, setForm] = useState({
    name: mockBusiness.name,
    address: `${mockBusiness.address}, ${mockBusiness.city}`,
    phone: mockBusiness.phone,
    website: mockBusiness.website,
    description: mockBusiness.description,
  });
  const field = (k: keyof typeof form, label: string, multiline = false) => (
    <View>
      <Text className="text-sm font-semibold mb-1.5">{label}</Text>
      <Input
        value={form[k]}
        onChangeText={(v) => setForm((f) => ({ ...f, [k]: v }))}
        multiline={multiline}
        className={multiline ? "h-24 py-3" : undefined}
        style={multiline ? { textAlignVertical: "top" } : undefined}
      />
    </View>
  );

  return (
    <Screen>
      <InfoBanner text="One-Tab is a paid add-on. Fill in your details and Sparkr approves your page within 5 business days, then mails your NFC tag." />
      <View className="gap-4">
        {field("name", "Business name")}
        {field("address", "Address")}
        {field("phone", "Phone")}
        {field("website", "Website")}
        {field("description", "Description", true)}
      </View>
      <Button
        size="lg"
        onPress={() =>
          Alert.alert("Submit for approval?", "The add-on is charged to your wallet once approved.", [
            { text: "Cancel", style: "cancel" },
            { text: "Submit", onPress: onSubmit },
          ])
        }
      >
        <Text>Submit setup form</Text>
      </Button>
    </Screen>
  );
}
