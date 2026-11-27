import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { Branch, GooglePost, GoogleReplyTone } from "@sparkr/shared";
import { GoogleLogo } from "../GoogleLogo";
import { G, GButton, GCard, GChoiceRow, GFilterChip, GSheet, GText, GTextField, type MaterialIconName } from "./google";
import { draftPost, TONES } from "../../lib/googleDrafts";

// Bottom sheets and the disconnected-state card for the Google management screen. All
// state is local/mock: the OAuth hand-off, saving locations, publishing posts and the tone
// preference will call the backend later.

// ---------------------------------------------------------------------------
// Connect (not-connected state)
// ---------------------------------------------------------------------------

const CONNECT_POINTS: { icon: MaterialIconName; text: string }[] = [
  { icon: "rate-review", text: "Every review lands here, with AI replies in your tone" },
  { icon: "campaign", text: "Post updates, offers and events straight to Google" },
  { icon: "insights", text: "Rating trends, profile views, calls and direction requests" },
];

export function ConnectCard({ connecting, onConnect, businessName }: { connecting: boolean; onConnect: () => void; businessName: string }) {
  return (
    <GCard>
      <View style={{ alignItems: "center", paddingTop: 8 }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: G.surface, alignItems: "center", justifyContent: "center" }}>
          <GoogleLogo size={32} />
        </View>
        <GText variant="title" style={{ marginTop: 14, textAlign: "center" }}>
          Connect your Google Business Profile
        </GText>
        <GText variant="body" color={G.textSecondary} style={{ marginTop: 6, textAlign: "center" }}>
          Sign in with the Google account that manages {businessName}. Sparkr never sees your password.
        </GText>
      </View>

      <View style={{ marginTop: 18, gap: 12 }}>
        {CONNECT_POINTS.map((p) => (
          <View key={p.text} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <MaterialIcons name={p.icon} size={20} color={G.blueText} />
            <GText variant="body" style={{ flex: 1 }}>
              {p.text}
            </GText>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 20 }}>
        <GButton label={connecting ? "Connecting…" : "Connect Google account"} icon={connecting ? undefined : "link"} loading={connecting} onPress={onConnect} />
      </View>
      <GText variant="caption" style={{ marginTop: 10, textAlign: "center" }}>
        You'll be asked to pick the verified locations to link. You can disconnect at any time.
      </GText>
    </GCard>
  );
}

// ---------------------------------------------------------------------------
// Locations
// ---------------------------------------------------------------------------

export function LocationsSheet({
  visible,
  onClose,
  locations,
  linked,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  locations: Branch[];
  linked: string[];
  onSave: (ids: string[]) => void;
}) {
  const [picked, setPicked] = useState<string[]>(linked);
  useEffect(() => {
    if (visible) setPicked(linked);
  }, [visible, linked]);

  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <GSheet
      visible={visible}
      onClose={onClose}
      title="Manage locations"
      subtitle="Verified locations on your Google account"
      footer={
        <>
          <GButton label="Cancel" variant="text" onPress={onClose} />
          <GButton label="Done" disabled={picked.length === 0} onPress={() => onSave(picked)} />
        </>
      }
    >
      {locations.map((l) => (
        <GChoiceRow
          key={l.id}
          kind="checkbox"
          title={l.name}
          subtitle={l.isMain ? `${l.address} · Main location` : l.address}
          selected={picked.includes(l.id)}
          onPress={() => toggle(l.id)}
        />
      ))}
      <GText variant="caption" style={{ marginTop: 8 }}>
        Reviews, posts and performance are combined across linked locations. At least one must stay linked.
      </GText>
    </GSheet>
  );
}

// ---------------------------------------------------------------------------
// Post composer
// ---------------------------------------------------------------------------

export type PostDraft = { kind: GooglePost["kind"]; title: string; body: string };

const KINDS: { key: GooglePost["kind"]; label: string }[] = [
  { key: "update", label: "Update" },
  { key: "offer", label: "Offer" },
  { key: "event", label: "Event" },
];

export function PostComposerSheet({
  visible,
  onClose,
  initial,
  businessName,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  /** Editing an existing post; omit for a new one. */
  initial?: GooglePost;
  businessName: string;
  onSave: (draft: PostDraft) => Promise<void>;
}) {
  const [kind, setKind] = useState<GooglePost["kind"]>("update");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setKind(initial?.kind ?? "update");
    setTitle(initial?.title ?? "");
    setBody(initial?.body ?? "");
    setDrafting(false);
    setSaving(false);
  }, [visible, initial]);

  const busy = drafting || saving;
  const canSave = title.trim().length > 0 && body.trim().length > 0 && !busy;

  const draft = () => {
    setDrafting(true);
    setTimeout(() => {
      setBody(draftPost(kind, title, businessName));
      setDrafting(false);
    }, 800);
  };

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await onSave({ kind, title: title.trim(), body: body.trim() });
    } finally {
      setSaving(false);
    }
  };

  return (
    <GSheet
      visible={visible}
      onClose={onClose}
      title={initial ? "Edit post" : "New post on Google"}
      subtitle={initial ? undefined : "Shows on your Business Profile in Search and Maps"}
      footer={
        <>
          <GButton label="Cancel" variant="text" onPress={onClose} disabled={busy} />
          <GButton label={initial ? "Save" : "Publish"} icon={initial ? undefined : "send"} loading={saving} disabled={!canSave} onPress={save} />
        </>
      }
    >
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
        {KINDS.map((k) => (
          <GFilterChip key={k.key} label={k.label} selected={kind === k.key} onPress={() => setKind(k.key)} />
        ))}
      </View>
      <GTextField label="Title" value={title} onChangeText={setTitle} placeholder={kind === "offer" ? "e.g. $5 hand rolls, weekdays 4–6 PM" : kind === "event" ? "e.g. Omakase Night with Chef Tang" : "e.g. Winter roll is here"} editable={!busy} />
      <View style={{ height: 14 }} />
      <GTextField label="Details" value={body} onChangeText={setBody} multiline minHeight={110} placeholder="What should customers know?" editable={!busy} />
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
        <GButton label={body ? "Redraft with AI" : "Draft with AI"} icon="auto-awesome" variant="tonal" compact loading={drafting} disabled={saving} onPress={draft} />
        <GText variant="caption" style={{ flex: 1, marginLeft: 10 }}>
          Uses the title and post type.
        </GText>
      </View>
    </GSheet>
  );
}

// ---------------------------------------------------------------------------
// Reply tone
// ---------------------------------------------------------------------------

export function ToneSheet({
  visible,
  onClose,
  tone,
  onSave,
  preview,
}: {
  visible: boolean;
  onClose: () => void;
  tone: GoogleReplyTone;
  onSave: (tone: GoogleReplyTone) => void;
  /** Sample reply in a given tone, shown under the options. */
  preview: (tone: GoogleReplyTone) => string;
}) {
  const [picked, setPicked] = useState(tone);
  useEffect(() => {
    if (visible) setPicked(tone);
  }, [visible, tone]);

  return (
    <GSheet
      visible={visible}
      onClose={onClose}
      title="AI reply tone"
      subtitle="How AI replies sound when posted as the owner"
      footer={
        <>
          <GButton label="Cancel" variant="text" onPress={onClose} />
          <GButton label="Save" onPress={() => onSave(picked)} />
        </>
      }
    >
      {TONES.map((t) => (
        <GChoiceRow key={t.key} title={t.label} subtitle={t.description} selected={picked === t.key} onPress={() => setPicked(t.key)} />
      ))}
      <View style={{ backgroundColor: G.surface, borderRadius: 10, padding: 12, marginTop: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <MaterialIcons name="auto-awesome" size={14} color={G.blueText} />
          <GText variant="caption" weight="medium" color={G.text}>
            Example · 5-star review
          </GText>
        </View>
        <GText variant="body">{preview(picked)}</GText>
      </View>
    </GSheet>
  );
}
