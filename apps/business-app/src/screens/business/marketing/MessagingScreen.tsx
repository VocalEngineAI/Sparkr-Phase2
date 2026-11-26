import React, { useState } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { mockSegments, mockSmsAutomations, mockSmsCampaigns, mockSmsCredits, type SmsCampaign } from "@sparkr/shared";
import {
  Actions,
  Badge,
  Button,
  Card,
  Chips,
  InfoBanner,
  ListCard,
  notYet,
  ProgressBar,
  Screen,
  Section,
  Segmented,
  SwitchRow,
  Text,
} from "../../../components/business/kit";
import { Input } from "../../../components/ui/input";

// Features 4–5: mass SMS to opted-in customers by segment, AI copy assistant, automated
// triggers, and personalised picture messages (AI writes each customer's first name on a
// real team photo). Bundles of 500/1,000 or pay per message.

const DRAFTS = {
  promo: "Tang Sushie: $5 hand rolls are back, weekdays 4–6 PM. Show this text for a free miso soup. Reply STOP to opt out.",
  birthday: "Happy birthday from Tang Sushie! 🎂 Enjoy a free dessert on us this week. Reply STOP to opt out.",
  winback: "We miss you at Tang Sushie! Here's 10% off your next visit, valid 14 days. Reply STOP to opt out.",
} as const;

const STATUS_TONE = { sent: "success", scheduled: "accent", draft: "neutral" } as const;

export default function MessagingScreen() {
  const [tab, setTab] = useState<"campaigns" | "automations" | "picture">("campaigns");
  const [automations, setAutomations] = useState(mockSmsAutomations);

  return (
    <Screen>
      <Card tone="primary">
        <Text className="text-sm text-primaryLight">Message credits</Text>
        <View className="flex-row items-end gap-6 mt-1">
          <View>
            <Text className="text-3xl font-extrabold text-background">{mockSmsCredits.sms}</Text>
            <Text className="text-xs text-primaryLight">SMS left</Text>
          </View>
          <View>
            <Text className="text-3xl font-extrabold text-background">{mockSmsCredits.mms}</Text>
            <Text className="text-xs text-primaryLight">Picture messages left</Text>
          </View>
        </View>
        <View className="flex-row gap-2 mt-4">
          <Button variant="secondary" size="sm" onPress={() => notYet("Buy 500 messages", "Paid from your business wallet.")}>
            <Text>Buy 500</Text>
          </Button>
          <Button variant="secondary" size="sm" onPress={() => notYet("Buy 1,000 messages", "Paid from your business wallet.")}>
            <Text>Buy 1,000</Text>
          </Button>
        </View>
      </Card>

      <Segmented
        options={[
          ["campaigns", "Campaigns"],
          ["automations", "Automations"],
          ["picture", "Picture msgs"],
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === "campaigns" ? (
        <>
          <Composer />
          <Section title="Recent & scheduled">
            <View className="gap-3">
              {mockSmsCampaigns.map((c) => (
                <CampaignCard key={c.id} c={c} />
              ))}
            </View>
          </Section>
        </>
      ) : null}

      {tab === "automations" ? (
        <Section title="Automated triggers">
          <ListCard>
            {automations.map((a, i) => (
              <SwitchRow
                key={a.id}
                title={a.name}
                description={`${a.description}${a.enabled ? ` · ${a.sentThisMonth} sent this month` : ""}`}
                value={a.enabled}
                onValueChange={(v) =>
                  setAutomations((list) => list.map((x) => (x.id === a.id ? { ...x, enabled: v } : x)))
                }
                last={i === automations.length - 1}
              />
            ))}
          </ListCard>
          <Text className="text-xs text-textMuted mt-2">
            Triggers only message customers who opted in to SMS.
          </Text>
        </Section>
      ) : null}

      {tab === "picture" ? <PictureMessages /> : null}
    </Screen>
  );
}

function Composer() {
  const [segment, setSegment] = useState(mockSegments[2].id);
  const [message, setMessage] = useState("");
  const audience = mockSegments.find((s) => s.id === segment);

  return (
    <Section title="New SMS campaign">
      <Card>
        <Text className="text-sm text-textMuted mb-2">Send to</Text>
        <Chips
          options={mockSegments.map((s) => [s.id, `${s.name} (${s.count})`] as const)}
          value={segment}
          onChange={setSegment}
        />

        <View className="flex-row items-center justify-between mt-4 mb-2">
          <Text className="text-sm text-textMuted">Message</Text>
          <Text className="text-xs text-textMuted">{message.length}/160</Text>
        </View>
        <Input
          value={message}
          onChangeText={setMessage}
          placeholder="Write a message, or let AI draft one"
          multiline
          className="h-28 py-3"
          style={{ textAlignVertical: "top" }}
        />

        <Text className="text-xs text-textMuted mt-3 mb-2">AI copy assistant</Text>
        <View className="flex-row gap-2">
          {(
            [
              ["promo", "Promo"],
              ["birthday", "Birthday"],
              ["winback", "Win-back"],
            ] as const
          ).map(([k, label]) => (
            <Button key={k} variant="secondary" size="sm" className="flex-1" onPress={() => setMessage(DRAFTS[k])}>
              <Ionicons name="sparkles-outline" size={14} color={colors.text} />
              <Text>{label}</Text>
            </Button>
          ))}
        </View>

        <Actions className="mt-4">
          <Button variant="outline" size="sm" onPress={() => notYet("Schedule", "Pick a time from hourly up to monthly.")}>
            <Text>Schedule</Text>
          </Button>
          <Button
            size="sm"
            disabled={!message.trim()}
            onPress={() => notYet("Send now", `Would send to ${audience?.count ?? 0} opted-in customers.`)}
          >
            <Text>Send to {audience?.count ?? 0}</Text>
          </Button>
        </Actions>
      </Card>
    </Section>
  );
}

function CampaignCard({ c }: { c: SmsCampaign }) {
  return (
    <Card>
      <View className="flex-row items-start justify-between gap-2">
        <View className="flex-1">
          <Text className="font-semibold">{c.name}</Text>
          <Text className="text-xs text-textMuted mt-0.5">
            {c.audience} · {c.when}
          </Text>
        </View>
        <View className="items-end gap-1">
          <Badge label={c.status[0].toUpperCase() + c.status.slice(1)} tone={STATUS_TONE[c.status]} />
          {c.kind === "mms" ? <Badge label="Picture" icon="image-outline" /> : null}
        </View>
      </View>
      {c.delivered !== undefined ? (
        <>
          <ProgressBar pct={((c.clicks ?? 0) / c.delivered) * 100} className="mt-3" />
          <Text className="text-xs text-textMuted mt-1.5">
            {c.delivered} of {c.recipients} delivered · {c.clicks} clicks (
            {Math.round(((c.clicks ?? 0) / c.delivered) * 100)}%)
          </Text>
        </>
      ) : (
        <Text className="text-xs text-textMuted mt-2">{c.recipients} recipients</Text>
      )}
    </Card>
  );
}

// Feature 5: one real team photo with a blank sign; AI writes each customer's first name.
function PictureMessages() {
  const [name, setName] = useState("Kenny");
  return (
    <>
      <Section title="Team photo">
        <Card tone="surface" className="items-center">
          <View className="w-full aspect-[4/3] rounded-xl bg-primary items-center justify-end pb-6 overflow-hidden">
            <Ionicons name="people" size={96} color={colors.primaryLight} style={{ position: "absolute", top: 36 }} />
            <View className="bg-background rounded-lg px-6 py-3 border-2 border-border" style={{ transform: [{ rotate: "-3deg" }] }}>
              <Text className="text-2xl font-extrabold">Hi {name || "…"}!</Text>
            </View>
          </View>
          <Text className="text-xs text-textMuted mt-3 text-center">
            Preview: AI finds the blank sign and adds each customer's first name. Nothing else in the photo changes.
          </Text>
          <View className="w-full mt-3">
            <Input value={name} onChangeText={setName} placeholder="Preview a name" className="bg-background" />
          </View>
          <Button variant="outline" className="mt-3 w-full" onPress={() => notYet("Replace photo", "Upload one real photo of your team, owner or chef holding a blank white sign.")}>
            <Ionicons name="camera-outline" size={16} color={colors.text} />
            <Text>Replace photo</Text>
          </Button>
        </Card>
      </Section>

      <Section title="Message">
        <Card>
          <Text className="text-sm">Hey {name || "there"}, we missed you! 10% off at Tang Sushie today.</Text>
          <Actions>
            <Button size="sm" onPress={() => notYet("Send picture message", "Pick a segment, then send.")}>
              <Text>Choose audience</Text>
            </Button>
          </Actions>
        </Card>
      </Section>

      <InfoBanner text="Picture messages cost about 2¢ each versus 1¢ for SMS, so they use picture-message credits. Plain SMS is always available." />
    </>
  );
}
