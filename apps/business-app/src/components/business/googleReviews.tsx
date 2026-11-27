import React, { useState } from "react";
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { GoogleReplyTone, GoogleReview } from "@sparkr/shared";
import { Button } from "../ui/button";
import { Expand, G, GAvatar, GButton, GChip, GStars, GText, GTextField, Reveal } from "./google";
import { draftReply } from "../../lib/googleDrafts";

// Review card + reply composer for the Google management screen.

/** Owner response shown under a review. `posted` came from Google; `saved` was written
 * here and will publish once the Google connection is live. */
export type Reply = { text: string; by: "ai" | "owner"; status: "posted" | "saved" };

/**
 * Collapsed: author, stars, three lines, reply status. Tap to expand into the full text,
 * the owner reply and the composer (Draft with AI, edit, post).
 */
export function ReviewCard({
  review: r,
  reply,
  expanded,
  onToggle,
  onReply,
  autoReply,
  tone,
  businessName,
}: {
  review: GoogleReview;
  reply?: Reply;
  expanded: boolean;
  onToggle: () => void;
  onReply: (text: string) => Promise<void>;
  autoReply: boolean;
  tone: GoogleReplyTone;
  businessName: string;
}) {
  const [editing, setEditing] = useState(false);
  const composing = expanded && (!reply || editing);

  return (
    <Reveal>
      <View style={{ borderRadius: 12, borderWidth: 1, borderColor: expanded ? G.blue : G.border, backgroundColor: G.bg, overflow: "hidden" }}>
        <Button
          variant="ghost"
          className="h-auto flex-col items-stretch justify-start gap-0 rounded-none p-3.5 active:bg-[#F8F9FA]"
          onPress={onToggle}
          accessibilityState={{ expanded }}
          accessibilityLabel={`Review by ${r.author}, ${r.rating} stars`}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <GAvatar name={r.author} size={36} />
            <View style={{ flex: 1 }}>
              <GText variant="label" numberOfLines={1}>
                {r.author}
              </GText>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 1 }}>
                <GStars rating={r.rating} size={14} />
                <GText variant="caption">{r.time}</GText>
              </View>
            </View>
            <MaterialIcons name={expanded ? "expand-less" : "expand-more"} size={22} color={G.textSecondary} />
          </View>

          <GText variant="body" style={{ marginTop: 10 }} numberOfLines={expanded ? undefined : 3}>
            {r.text}
          </GText>

          {!expanded ? (
            <View style={{ marginTop: 10 }}>
              {reply ? (
                <GChip label={reply.by === "ai" ? "Replied · AI" : "Replied"} tone="green" icon="check" />
              ) : (
                <GChip label="Awaiting reply" tone="amber" icon="schedule" />
              )}
            </View>
          ) : null}
        </Button>

        {expanded ? (
          <Expand style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
            {reply && !editing ? (
              <View style={{ backgroundColor: G.surface, borderRadius: 10, padding: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <MaterialIcons name={reply.by === "ai" ? "auto-awesome" : "store"} size={14} color={G.blueText} />
                  <GText variant="caption" weight="medium" color={G.text}>
                    {businessName} (Owner)
                  </GText>
                  <GText variant="caption">· {reply.by === "ai" ? "AI reply" : "Your reply"}</GText>
                  <View style={{ flex: 1 }} />
                  <GChip label={reply.status === "posted" ? "Posted" : "Saved"} tone={reply.status === "posted" ? "green" : "blue"} />
                </View>
                <GText variant="body">{reply.text}</GText>
                {reply.status === "saved" ? (
                  <GText variant="caption" style={{ marginTop: 6 }}>
                    Publishes to Google once the connection is live.
                  </GText>
                ) : null}
                <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 8 }}>
                  <GButton label="Edit reply" icon="edit" variant="text" compact onPress={() => setEditing(true)} />
                </View>
              </View>
            ) : null}

            {composing ? (
              <ReplyComposer
                initial={editing && reply ? reply.text : ""}
                hint={!reply && autoReply ? "AI auto-replies are on, so a reply will be drafted for this review. You can still answer it yourself." : undefined}
                onDraft={() => draftReply(r, tone, businessName)}
                onCancel={editing ? () => setEditing(false) : undefined}
                onSubmit={async (text) => {
                  await onReply(text);
                  setEditing(false);
                }}
              />
            ) : null}
          </Expand>
        ) : null}
      </View>
    </Reveal>
  );
}

function ReplyComposer({
  initial,
  hint,
  onDraft,
  onCancel,
  onSubmit,
}: {
  initial: string;
  hint?: string;
  onDraft: () => string;
  onCancel?: () => void;
  onSubmit: (text: string) => Promise<void>;
}) {
  const [text, setText] = useState(initial);
  const [sending, setSending] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const busy = sending || drafting;
  const canSend = text.trim().length > 0 && !busy;

  const submit = async () => {
    if (!canSend) return;
    setSending(true);
    try {
      await onSubmit(text.trim());
    } finally {
      setSending(false);
    }
  };

  // Sample data: a short pause then canned copy in the chosen tone, so the button feels real.
  const draft = () => {
    setDrafting(true);
    setTimeout(() => {
      setText(onDraft());
      setDrafting(false);
    }, 700);
  };

  return (
    <View style={{ marginTop: 4 }}>
      {hint ? (
        <GText variant="caption" style={{ marginBottom: 8 }}>
          {hint}
        </GText>
      ) : null}
      <GTextField value={text} onChangeText={setText} multiline placeholder="Write a reply as the owner…" editable={!busy} accessibilityLabel="Reply to review" />
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 }}>
        <GButton label={text ? "Redraft with AI" : "Draft with AI"} icon="auto-awesome" variant="tonal" compact loading={drafting} disabled={sending} onPress={draft} />
        <View style={{ flex: 1 }} />
        {onCancel ? <GButton label="Cancel" variant="text" compact onPress={onCancel} disabled={busy} /> : null}
        <GButton label={initial ? "Save" : "Reply"} icon={initial ? undefined : "send"} compact loading={sending} disabled={!canSend} onPress={submit} />
      </View>
    </View>
  );
}
