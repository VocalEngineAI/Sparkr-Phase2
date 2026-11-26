import React, { useState } from "react";
import { Alert, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { mockImportPreview, mockImports } from "@sparkr/shared";
import {
  Badge,
  Button,
  Card,
  InfoBanner,
  ListCard,
  ListRow,
  Screen,
  Section,
  Segmented,
  Text,
} from "../../../components/business/kit";
import { Input } from "../../../components/ui/input";

// Feature 11: CSV from any rewards tool (name, phone, email, birthday, coin balance) →
// automatic import, matched by email/phone, branded cards created, free welcome message by
// SMS or email (one channel, first send free and capped).

const COLUMNS = ["name", "phone", "email", "birthday", "coin balance"];
const FREE_WELCOME_CAP = 500;

export default function ImportCustomersScreen() {
  // Demo flow: "Choose CSV" loads the sample preview rows.
  const [file, setFile] = useState<string | null>(null);
  const [channel, setChannel] = useState<"sms" | "email">("sms");
  const [message, setMessage] = useState(
    "Tang Sushie is now on Sparkr! Download the app to see your membership card and coins, and get member offers."
  );

  const importNow = () => {
    Alert.alert(
      "Import started",
      `${mockImportPreview.length} customers will get a branded membership card. Welcome ${channel === "sms" ? "SMS" : "email"} queued.`
    );
    setFile(null);
  };

  return (
    <Screen>
      <Section title="1. Upload CSV">
        <Card tone="surface">
          <Text className="text-sm">Export a CSV from your current rewards app with these columns:</Text>
          <View className="flex-row flex-wrap gap-2 mt-3">
            {COLUMNS.map((c) => (
              <Badge key={c} label={c} />
            ))}
          </View>
          <Button variant={file ? "outline" : "default"} className="mt-4" onPress={() => setFile("tang_rewards_export.csv")}>
            <Ionicons name="document-attach-outline" size={16} color={file ? colors.text : colors.background} />
            <Text>{file ? "Choose a different file" : "Choose CSV file"}</Text>
          </Button>
        </Card>
      </Section>

      {file ? (
        <>
          <Section title="2. Preview" subtitle={file}>
            <ListCard>
              {mockImportPreview.map((r, i) => (
                <ListRow
                  key={r.email}
                  title={r.name}
                  subtitle={`${r.email} · ${r.phone} · ${r.coins} coins`}
                  chevron={false}
                  last={i === mockImportPreview.length - 1}
                />
              ))}
            </ListCard>
            <Text className="text-xs text-textMuted mt-2">
              Customers who sign up with the same email or phone see their membership straight away.
            </Text>
          </Section>

          <Section title="3. Welcome message">
            <Segmented
              options={[
                ["sms", "SMS"],
                ["email", "Email"],
              ]}
              value={channel}
              onChange={setChannel}
              className="mb-3"
            />
            <Input
              value={message}
              onChangeText={setMessage}
              multiline
              className="h-28 py-3"
              style={{ textAlignVertical: "top" }}
            />
            <Text className="text-xs text-textMuted mt-2">
              The first send is free for up to {FREE_WELCOME_CAP} customers. Each customer gets one channel only.
            </Text>
            <Button className="mt-4" size="lg" onPress={importNow}>
              <Text>Import & send welcome</Text>
            </Button>
          </Section>
        </>
      ) : null}

      <Section title="Past imports">
        <ListCard>
          {mockImports.map((imp, i) => (
            <ListRow
              key={imp.id}
              icon="document-text-outline"
              title={imp.fileName}
              subtitle={`${imp.date} · ${imp.rows} customers · ${imp.matched} matched · ${imp.welcomeSent} welcome ${imp.welcomeChannel === "sms" ? "SMS" : "emails"}`}
              chevron={false}
              last={i === mockImports.length - 1}
            />
          ))}
        </ListCard>
      </Section>

      <InfoBanner text="Only contact details and coin balances import. Past visits and redemptions aren't imported." />
    </Screen>
  );
}
