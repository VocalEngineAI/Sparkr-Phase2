import React, { useState } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { mockFaqs } from "@sparkr/shared";
import { Button, ListCard, ListRow, notYet, Screen, Section, Text } from "../../../components/business/kit";
import { cn } from "../../../lib/utils";

// Business user guide (slide 27), FAQs, disputes (slide 43: either side can raise one if
// terms weren't met), and contact.

const GUIDE = [
  ["megaphone-outline", "Running your first influencer campaign"],
  ["ribbon-outline", "Setting up memberships, tiers and rewards"],
  ["cash-outline", "Sparkr Coins at the counter"],
  ["calendar-outline", "Reservations, deposits and no-shows"],
  ["ticket-outline", "Selling event tickets"],
] as const;

export default function HelpScreen() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <Screen>
      <Section title="Business user guide">
        <ListCard>
          {GUIDE.map(([icon, title], i) => (
            <ListRow key={title} icon={icon} title={title} onPress={() => notYet(title, "Guide article.")} last={i === GUIDE.length - 1} />
          ))}
        </ListCard>
      </Section>

      <Section title="FAQs">
        <ListCard>
          {mockFaqs.map((f, i) => {
            const expanded = open === f.id;
            return (
              <View key={f.id} className={cn(i < mockFaqs.length - 1 && "border-b border-border")}>
                <Button
                  variant="ghost"
                  className="h-auto justify-between rounded-none px-4 py-3.5"
                  onPress={() => setOpen(expanded ? null : f.id)}
                  accessibilityState={{ expanded }}
                >
                  <Text className="text-base font-semibold flex-1 mr-3">{f.question}</Text>
                  <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={18} color={colors.textMuted} />
                </Button>
                {expanded ? <Text className="text-sm text-textMuted px-4 pb-4">{f.answer}</Text> : null}
              </View>
            );
          })}
        </ListCard>
      </Section>

      <Section title="Something went wrong?">
        <ListCard>
          <ListRow
            icon="alert-circle-outline"
            title="Raise a dispute"
            subtitle="If an influencer didn't meet the campaign terms"
            onPress={() => notYet("Raise a dispute", "Pick the campaign and tell Sparkr what happened. The admin team reviews every dispute.")}
          />
          <ListRow icon="bug-outline" title="Report a problem" onPress={() => notYet("Report a problem")} last />
        </ListCard>
      </Section>

      <Section title="Contact Sparkr">
        <View className="flex-row gap-3">
          {/* Support address isn't decided yet, so this stays a placeholder. */}
          <Button variant="outline" className="flex-1" onPress={() => notYet("Email support")}>
            <Ionicons name="mail-outline" size={16} color={colors.text} />
            <Text>Email</Text>
          </Button>
          <Button className="flex-1" onPress={() => notYet("Live chat")}>
            <Ionicons name="chatbubbles-outline" size={16} color={colors.background} />
            <Text>Chat</Text>
          </Button>
        </View>
      </Section>
    </Screen>
  );
}
