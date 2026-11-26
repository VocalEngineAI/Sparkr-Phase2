import React, { useState } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { mockEvents, mockTickets, type Ticket } from "@sparkr/shared";
import QrScanner from "../../../components/business/QrScanner";
import { Button, Text } from "../../../components/business/kit";
import type { BookingsScreenProps } from "../../../navigation/businessTypes";

// Event entry (slide 53): staff scan the ticket QR; a valid ticket is marked as used so it
// can only be used once. Demo codes: SPK-OMK-1001, SPK-OMK-1002 (valid), SPK-OMK-1003
// (already used), SPK-SAKE-2001 (Sake Tasting).

type Result =
  | { kind: "valid"; ticket: Ticket }
  | { kind: "used"; ticket: Ticket }
  | { kind: "other_event"; ticket: Ticket }
  | { kind: "unknown"; code: string };

export default function TicketScannerScreen({ route, navigation }: BookingsScreenProps<"TicketScanner">) {
  const eventId = route.params?.eventId;
  const event = mockEvents.find((e) => e.id === eventId);
  // Local copy so "mark as used" sticks for this session.
  const [tickets, setTickets] = useState(mockTickets);
  const [result, setResult] = useState<Result | null>(null);
  const [admitted, setAdmitted] = useState(0);

  const lookup = (code: string) => {
    const ticket = tickets.find((t) => t.code.toUpperCase() === code.toUpperCase());
    if (!ticket) return setResult({ kind: "unknown", code });
    if (eventId && ticket.eventId !== eventId) return setResult({ kind: "other_event", ticket });
    setResult(ticket.status === "used" ? { kind: "used", ticket } : { kind: "valid", ticket });
  };

  const admit = (t: Ticket) => {
    const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    setTickets((list) => list.map((x) => (x.code === t.code ? { ...x, status: "used", usedAt: time } : x)));
    setAdmitted((n) => n + 1);
    setResult(null);
  };

  return (
    <QrScanner
      title="Ticket scanner"
      subtitle={event ? `${event.title} · ${admitted} admitted` : `All events · ${admitted} admitted`}
      onClose={() => navigation.goBack()}
      onScan={lookup}
      paused={!!result}
      manualPlaceholder="Ticket code, e.g. SPK-OMK-1001"
      result={result ? <ResultPanel result={result} onAdmit={admit} onDismiss={() => setResult(null)} /> : undefined}
    />
  );
}

function ResultPanel({
  result,
  onAdmit,
  onDismiss,
}: {
  result: Result;
  onAdmit: (t: Ticket) => void;
  onDismiss: () => void;
}) {
  const ticketEvent = "ticket" in result ? mockEvents.find((e) => e.id === result.ticket.eventId) : undefined;
  const ok = result.kind === "valid";
  const title =
    result.kind === "valid"
      ? "Valid ticket"
      : result.kind === "used"
        ? "Already used"
        : result.kind === "other_event"
          ? "Different event"
          : "Ticket not found";
  const detail =
    result.kind === "unknown"
      ? `“${result.code}” isn't a Sparkr ticket.`
      : result.kind === "used"
        ? `${result.ticket.holder} · scanned at ${result.ticket.usedAt}`
        : `${result.ticket.holder} · ${ticketEvent?.title ?? ""}`;

  return (
    <View className="bg-background rounded-3xl p-5">
      <View className="flex-row items-center gap-3">
        <Ionicons
          name={ok ? "checkmark-circle" : "close-circle"}
          size={40}
          color={ok ? colors.success : colors.warning}
        />
        <View className="flex-1">
          <Text className={`text-xl font-extrabold ${ok ? "text-success" : "text-warning"}`}>{title}</Text>
          <Text className="text-sm text-textMuted">{detail}</Text>
        </View>
      </View>
      {"ticket" in result ? <Text className="text-xs text-textMuted mt-2">{result.ticket.code}</Text> : null}
      <View className="flex-row gap-2 mt-4">
        {ok ? (
          <>
            <Button variant="outline" className="flex-1" onPress={onDismiss}>
              <Text>Cancel</Text>
            </Button>
            <Button className="flex-1" onPress={() => onAdmit(result.ticket)}>
              <Text>Mark as used</Text>
            </Button>
          </>
        ) : (
          <Button className="flex-1" onPress={onDismiss}>
            <Text>Scan next</Text>
          </Button>
        )}
      </View>
    </View>
  );
}
