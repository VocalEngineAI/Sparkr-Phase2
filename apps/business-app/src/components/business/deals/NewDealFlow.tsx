import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import type { Deal, DealDaily, DealKind, DealTiming } from "@sparkr/shared";
import { Button, Text } from "../kit";
import { Input } from "../../ui/input";
import { BottomSheet } from "../BottomSheet";
import { cn } from "../../../lib/utils";
import { DAY, DAY_SHORT, dealStatus, describeTiming, HOUR, isValidHM, parseDateTime, toDateInput, toTimeInput } from "../../../lib/dealTime";
import { DealCard } from "./DealCard";
import { D, KIND } from "./common";

// New / edit deal flow: a type picker sheet, then a four-step editor (details → schedule →
// rules → review). Everything is local state; `onSave` hands back a complete `Deal`.
// Image upload isn't supported by the data model yet, so the details step has no image field.

// ---------------------------------------------------------------------------
// Step 0: pick a type
// ---------------------------------------------------------------------------

const KINDS: DealKind[] = ["happy_hour", "flash", "secret_menu", "limited_time"];

export function DealTypeSheet({ visible, onClose, onPick }: { visible: boolean; onClose: () => void; onPick: (kind: DealKind) => void }) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="New deal" subtitle="What kind of offer is it?">
      <View className="gap-2.5 pb-2">
        {KINDS.map((k) => (
          <Button
            key={k}
            variant="ghost"
            className="h-auto flex-row items-center justify-start gap-0 rounded-2xl p-4 active:opacity-80"
            style={{ backgroundColor: D.blueTint }}
            onPress={() => onPick(k)}
            accessibilityLabel={`${KIND[k].label}: ${KIND[k].description}`}
          >
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: D.card, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
              <Ionicons name={KIND[k].icon} size={20} color={D.blue} />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-base" style={{ color: D.ink }}>
                {KIND[k].label}
              </Text>
              <Text className="text-sm mt-0.5" style={{ color: D.muted }}>
                {KIND[k].description}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={D.blue} style={{ marginLeft: 8 }} />
          </Button>
        ))}
      </View>
    </BottomSheet>
  );
}

// ---------------------------------------------------------------------------
// Steps 1–4: the editor
// ---------------------------------------------------------------------------

type Mode = DealTiming["type"];

type Form = {
  title: string;
  highlight: string;
  offer: string;
  description: string;
  mode: Mode;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  days: number[];
  winStart: string;
  winEnd: string;
  minSpend: string;
  limit: string;
  expires: string;
};

const STEPS = ["Details", "Schedule", "Rules", "Review"] as const;

function defaults(kind: DealKind, now: number): Form {
  const base: Form = {
    title: "",
    highlight: "",
    offer: "",
    description: "",
    mode: "window",
    startDate: toDateInput(now),
    startTime: toTimeInput(now),
    endDate: toDateInput(now + 2 * HOUR),
    endTime: toTimeInput(now + 2 * HOUR),
    days: [1, 2, 3, 4, 5],
    winStart: "16:00",
    winEnd: "18:00",
    minSpend: "",
    limit: "",
    expires: "",
  };
  if (kind === "happy_hour") return { ...base, mode: "recurring" };
  if (kind === "secret_menu") return { ...base, mode: "ongoing" };
  if (kind === "limited_time") return { ...base, endDate: toDateInput(now + 14 * DAY), endTime: "23:59" };
  return base;
}

function fromDeal(d: Deal): Form {
  const f = defaults(d.kind, Date.now());
  const t = d.timing;
  return {
    ...f,
    title: d.title,
    highlight: d.highlight ?? "",
    offer: d.offer ?? "",
    description: d.description ?? "",
    mode: t.type,
    startDate: toDateInput(Date.parse(t.startsAt)),
    startTime: toTimeInput(Date.parse(t.startsAt)),
    endDate: t.type === "window" ? toDateInput(Date.parse(t.endsAt)) : f.endDate,
    endTime: t.type === "window" ? toTimeInput(Date.parse(t.endsAt)) : f.endTime,
    days: t.type === "recurring" ? t.days : f.days,
    winStart: t.type === "recurring" ? t.start : f.winStart,
    winEnd: t.type === "recurring" ? t.end : f.winEnd,
    minSpend: d.minSpend ? String(d.minSpend) : "",
    limit: d.redemptionLimit ? String(d.redemptionLimit) : "",
    expires: d.expires ?? "",
  };
}

function emptyHistory(): DealDaily[] {
  const now = Date.now();
  return Array.from({ length: 30 }, (_, i) => ({ date: toDateInput(now - (29 - i) * DAY), views: 0, saves: 0, redemptions: 0, revenue: 0 }));
}

function buildTiming(f: Form, previous?: DealTiming): DealTiming | null {
  if (f.mode === "window") {
    const s = parseDateTime(f.startDate, f.startTime);
    const e = parseDateTime(f.endDate, f.endTime);
    if (s === null || e === null || e <= s) return null;
    return { type: "window", startsAt: new Date(s).toISOString(), endsAt: new Date(e).toISOString() };
  }
  const startsAt = parseDateTime(f.startDate, f.startTime);
  const since = previous && previous.type === f.mode ? previous.startsAt : startsAt !== null ? new Date(startsAt).toISOString() : new Date().toISOString();
  if (f.mode === "ongoing") return { type: "ongoing", startsAt: since };
  if (f.days.length === 0 || !isValidHM(f.winStart) || !isValidHM(f.winEnd) || f.winEnd <= f.winStart) return null;
  return { type: "recurring", days: [...f.days].sort(), start: f.winStart, end: f.winEnd, startsAt: since };
}

function buildDeal(f: Form, kind: DealKind, timing: DealTiming, active: boolean, initial?: Deal): Deal {
  const minSpend = Number(f.minSpend) || undefined;
  const redemptionLimit = Number(f.limit) || undefined;
  const base: Deal = initial ?? {
    id: `d_${Date.now()}`,
    title: "",
    kind,
    schedule: "",
    timing,
    status: "live",
    active,
    redemptions: 0,
    views: 0,
    saves: 0,
    revenue: 0,
    history: emptyHistory(),
  };
  const next: Deal = {
    ...base,
    kind,
    title: f.title.trim(),
    highlight: f.highlight.trim().toUpperCase() || undefined,
    offer: f.offer.trim() || undefined,
    description: f.description.trim() || undefined,
    timing,
    schedule: describeTiming(timing),
    minSpend,
    redemptionLimit,
    expires: f.expires.trim() || undefined,
    active,
    status: "live",
  };
  next.status = dealStatus(next);
  return next;
}

export function DealEditorSheet({
  visible,
  kind,
  initial,
  onClose,
  onSave,
}: {
  visible: boolean;
  kind: DealKind;
  /** Editing an existing deal; omit for a new one. */
  initial?: Deal;
  onClose: () => void;
  onSave: (deal: Deal) => void;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(() => (initial ? fromDeal(initial) : defaults(kind, Date.now())));
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setStep(0);
    setTouched(false);
    setForm(initial ? fromDeal(initial) : defaults(kind, Date.now()));
  }, [visible, kind, initial]);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => ({ ...f, [key]: value }));

  const timing = useMemo(() => buildTiming(form, initial?.timing), [form, initial]);
  const titleError = touched && !form.title.trim() ? "Give the deal a title." : null;
  const scheduleError =
    touched && !timing
      ? form.mode === "window"
        ? "Enter a valid start and end (YYYY-MM-DD and HH:MM). The end must be after the start."
        : form.mode === "recurring"
          ? "Pick at least one day and a valid time window (HH:MM, end after start)."
          : "Enter a valid start date and time."
      : null;
  const stepValid = step === 0 ? !!form.title.trim() : step === 1 ? !!timing : true;
  const preview = timing && form.title.trim() ? buildDeal(form, kind, timing, initial?.active ?? true, initial) : null;

  const next = () => {
    setTouched(true);
    if (!stepValid) return;
    setTouched(false);
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };
  const back = () => setStep((s) => Math.max(0, s - 1));
  const save = (active: boolean) => {
    if (!timing || !form.title.trim()) return;
    onSave(buildDeal(form, kind, timing, active, initial));
  };

  const header = (
    <View className="pl-2 pr-2.5 pt-2 pb-1">
      <View className="flex-row items-center">
        <Button variant="ghost" size="icon" className="rounded-full" onPress={step === 0 ? onClose : back} accessibilityLabel={step === 0 ? "Close" : "Back"}>
          <Ionicons name={step === 0 ? "close" : "chevron-back"} size={22} color={colors.text} />
        </Button>
        <View className="flex-1 ml-1">
          <Text className="text-xl font-bold" numberOfLines={1}>
            {initial ? `Edit ${KIND[kind].label.toLowerCase()}` : `New ${KIND[kind].label.toLowerCase()}`}
          </Text>
          <Text className="text-sm text-textMuted">
            Step {step + 1} of {STEPS.length} · {STEPS[step]}
          </Text>
        </View>
        <View className="rounded-full px-3 py-1" style={{ backgroundColor: D.blueTint }}>
          <Text className="text-xs font-bold" style={{ color: D.blue }}>
            {KIND[kind].label}
          </Text>
        </View>
      </View>
      <View className="flex-row gap-1.5 mt-3 px-3">
        {STEPS.map((s, i) => (
          <View key={s} className="flex-1 h-1 rounded-full" style={{ backgroundColor: i <= step ? D.blue : colors.border }} />
        ))}
      </View>
    </View>
  );

  const footer =
    step < STEPS.length - 1 ? (
      <>
        <Button variant="ghost" onPress={step === 0 ? onClose : back}>
          <Text>{step === 0 ? "Cancel" : "Back"}</Text>
        </Button>
        <Button className="rounded-full px-6" style={{ backgroundColor: D.blue }} onPress={next} disabled={touched && !stepValid}>
          <Text>Next</Text>
        </Button>
      </>
    ) : initial ? (
      <>
        <Button variant="ghost" onPress={back}>
          <Text>Back</Text>
        </Button>
        <Button className="rounded-full px-6" style={{ backgroundColor: D.blue }} onPress={() => save(initial.active)} disabled={!preview}>
          <Text>Save changes</Text>
        </Button>
      </>
    ) : (
      <>
        <Button variant="secondary" className="rounded-full" onPress={() => save(false)} disabled={!preview}>
          <Text>Save switched off</Text>
        </Button>
        <Button className="rounded-full px-6" style={{ backgroundColor: D.blue }} onPress={() => save(true)} disabled={!preview}>
          <Text>Publish</Text>
        </Button>
      </>
    );

  return (
    <BottomSheet visible={visible} onClose={onClose} header={header} footer={footer}>
      {step === 0 ? (
        <View className="gap-4 pb-2">
          <Field label="Title" error={titleError}>
            <Input value={form.title} onChangeText={(v) => set("title", v)} placeholder={kind === "happy_hour" ? "e.g. Sushi Happy Hour" : "e.g. Half-price sake flight"} returnKeyType="next" />
          </Field>
          <Field label="Headline" hint="Short and bold, e.g. 20% OFF or $5 ROLLS.">
            <Input value={form.highlight} onChangeText={(v) => set("highlight", v)} placeholder="20% OFF" autoCapitalize="characters" maxLength={14} />
          </Field>
          <Field label="Offer details" hint="What the customer gets.">
            <Input value={form.offer} onChangeText={(v) => set("offer", v)} placeholder="e.g. Any hand roll for $5, up to 2 per visit" />
          </Field>
          <Field label="Description" hint="Optional. Shown under Quick Stats.">
            <Input
              value={form.description}
              onChangeText={(v) => set("description", v)}
              placeholder="A sentence or two about the offer"
              multiline
              className="h-auto min-h-[88px] py-3"
              textAlignVertical="top"
            />
          </Field>
        </View>
      ) : null}

      {step === 1 ? <ScheduleStep form={form} set={set} error={scheduleError} timing={timing} /> : null}

      {step === 2 ? (
        <View className="gap-4 pb-2">
          <Field label="Minimum spend" hint="Leave blank for none.">
            <Input value={form.minSpend} onChangeText={(v) => set("minSpend", v.replace(/[^\d.]/g, ""))} placeholder="$0" keyboardType="decimal-pad" />
          </Field>
          <Field label={kind === "happy_hour" ? "Redemptions per visit" : "Total redemptions"} hint={kind === "happy_hour" ? "How many times one customer can redeem per visit." : "The deal closes when this many are used."}>
            <Input value={form.limit} onChangeText={(v) => set("limit", v.replace(/\D/g, ""))} placeholder="No limit" keyboardType="number-pad" />
          </Field>
          <Field label="Expiry note" hint="Optional, shown in the rules (e.g. “Tonight”, “While stocks last”).">
            <Input value={form.expires} onChangeText={(v) => set("expires", v)} placeholder="Optional" />
          </Field>
        </View>
      ) : null}

      {step === 3 ? (
        <View className="gap-4 pb-2">
          {preview ? <DealCard deal={preview} status={preview.status} expanded readOnly /> : null}
          <View className="rounded-2xl border border-border overflow-hidden">
            {STEPS.slice(0, 3).map((s, i) => (
              <Button
                key={s}
                variant="ghost"
                className={cn("h-auto flex-row items-center justify-start gap-0 rounded-none px-4 py-3", i < 2 && "border-b border-border")}
                onPress={() => setStep(i)}
                accessibilityLabel={`Edit ${s.toLowerCase()}`}
              >
                <Text className="flex-1 text-sm font-semibold">{s}</Text>
                <Text className="text-sm mr-1" style={{ color: D.blue }}>
                  Edit
                </Text>
                <Ionicons name="chevron-forward" size={16} color={D.blue} />
              </Button>
            ))}
          </View>
        </View>
      ) : null}
    </BottomSheet>
  );
}

// ---------------------------------------------------------------------------
// Schedule step
// ---------------------------------------------------------------------------

const MODES: { key: Mode; label: string }[] = [
  { key: "window", label: "Date range" },
  { key: "recurring", label: "Repeats weekly" },
  { key: "ongoing", label: "Always on" },
];

function ScheduleStep({
  form,
  set,
  error,
  timing,
}: {
  form: Form;
  set: <K extends keyof Form>(key: K, value: Form[K]) => void;
  error: string | null;
  timing: DealTiming | null;
}) {
  const now = Date.now();
  const setStart = (ms: number) => {
    set("startDate", toDateInput(ms));
    set("startTime", toTimeInput(ms));
  };
  const setEnd = (ms: number) => {
    set("endDate", toDateInput(ms));
    set("endTime", toTimeInput(ms));
  };
  const startMs = parseDateTime(form.startDate, form.startTime) ?? now;
  const tonight = new Date(now);
  tonight.setHours(17, 0, 0, 0);
  const tomorrowNoon = new Date(now + DAY);
  tomorrowNoon.setHours(12, 0, 0, 0);
  const midnight = new Date(startMs);
  midnight.setHours(23, 59, 0, 0);

  return (
    <View className="gap-4 pb-2">
      <View className="flex-row gap-2">
        {MODES.map((m) => {
          const on = form.mode === m.key;
          return (
            <Button
              key={m.key}
              size="sm"
              variant={on ? "default" : "outline"}
              className="flex-1 px-1 rounded-full"
              style={on ? { backgroundColor: D.blue } : undefined}
              onPress={() => set("mode", m.key)}
              accessibilityState={{ selected: on }}
            >
              <Text numberOfLines={1} className="text-xs">
                {m.label}
              </Text>
            </Button>
          );
        })}
      </View>

      {form.mode === "recurring" ? (
        <>
          <Field label="Days">
            <View className="flex-row gap-1.5">
              {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                const on = form.days.includes(d);
                return (
                  <Button
                    key={d}
                    size="sm"
                    variant={on ? "default" : "outline"}
                    className="flex-1 px-0 rounded-full"
                    style={on ? { backgroundColor: D.blue } : undefined}
                    onPress={() => set("days", on ? form.days.filter((x) => x !== d) : [...form.days, d])}
                    accessibilityState={{ selected: on }}
                    accessibilityLabel={DAY_SHORT[d]}
                  >
                    <Text className="text-xs">{DAY_SHORT[d].slice(0, 2)}</Text>
                  </Button>
                );
              })}
            </View>
            <View className="flex-row gap-2 mt-2">
              <Preset label="Weekdays" onPress={() => set("days", [1, 2, 3, 4, 5])} />
              <Preset label="Weekends" onPress={() => set("days", [0, 6])} />
              <Preset label="Every day" onPress={() => set("days", [0, 1, 2, 3, 4, 5, 6])} />
            </View>
          </Field>
          <Field label="Hours" hint="24-hour time, e.g. 16:00.">
            <View className="flex-row items-center gap-2">
              <Input value={form.winStart} onChangeText={(v) => set("winStart", v)} placeholder="16:00" className="flex-1" keyboardType="numbers-and-punctuation" />
              <Text className="text-textMuted">to</Text>
              <Input value={form.winEnd} onChangeText={(v) => set("winEnd", v)} placeholder="18:00" className="flex-1" keyboardType="numbers-and-punctuation" />
            </View>
            <View className="flex-row gap-2 mt-2">
              <Preset
                label="4–6 PM"
                onPress={() => {
                  set("winStart", "16:00");
                  set("winEnd", "18:00");
                }}
              />
              <Preset
                label="5–7 PM"
                onPress={() => {
                  set("winStart", "17:00");
                  set("winEnd", "19:00");
                }}
              />
              <Preset
                label="9–11 PM"
                onPress={() => {
                  set("winStart", "21:00");
                  set("winEnd", "23:00");
                }}
              />
            </View>
          </Field>
        </>
      ) : (
        <Field label="Starts" hint="YYYY-MM-DD and 24-hour time.">
          <View className="flex-row items-center gap-2">
            <Input value={form.startDate} onChangeText={(v) => set("startDate", v)} placeholder="2026-12-15" className="flex-[1.4]" keyboardType="numbers-and-punctuation" />
            <Input value={form.startTime} onChangeText={(v) => set("startTime", v)} placeholder="17:00" className="flex-1" keyboardType="numbers-and-punctuation" />
          </View>
          <View className="flex-row gap-2 mt-2">
            <Preset label="Now" onPress={() => setStart(now)} />
            <Preset label="Tonight 5 PM" onPress={() => setStart(tonight.getTime())} />
            <Preset label="Tomorrow noon" onPress={() => setStart(tomorrowNoon.getTime())} />
          </View>
        </Field>
      )}

      {form.mode === "window" ? (
        <Field label="Ends">
          <View className="flex-row items-center gap-2">
            <Input value={form.endDate} onChangeText={(v) => set("endDate", v)} placeholder="2026-12-31" className="flex-[1.4]" keyboardType="numbers-and-punctuation" />
            <Input value={form.endTime} onChangeText={(v) => set("endTime", v)} placeholder="23:59" className="flex-1" keyboardType="numbers-and-punctuation" />
          </View>
          <View className="flex-row flex-wrap gap-2 mt-2">
            <Preset label="+2 hours" onPress={() => setEnd(startMs + 2 * HOUR)} />
            <Preset label="Until midnight" onPress={() => setEnd(midnight.getTime())} />
            <Preset label="+1 week" onPress={() => setEnd(startMs + 7 * DAY)} />
            <Preset label="+2 weeks" onPress={() => setEnd(startMs + 14 * DAY)} />
          </View>
        </Field>
      ) : null}

      <View className="rounded-xl px-3 py-2.5" style={{ backgroundColor: error ? D.redTint : D.blueTint }}>
        <Text className="text-sm" style={{ color: error ? D.red : D.blue, fontWeight: error ? "400" : "600" }}>
          {error ?? (timing ? describeTiming(timing) : "Set when the deal runs.")}
        </Text>
      </View>
    </View>
  );
}

function Preset({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Button size="sm" variant="secondary" className="h-8 rounded-full px-3" onPress={onPress}>
      <Text className="text-xs">{label}</Text>
    </Button>
  );
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string | null; children: React.ReactNode }) {
  return (
    <View>
      <Text className="text-xs font-semibold text-textMuted mb-1.5">{label.toUpperCase()}</Text>
      {children}
      {error ? <Text className="text-xs text-warning mt-1.5">{error}</Text> : hint ? <Text className="text-xs text-textMuted mt-1.5">{hint}</Text> : null}
    </View>
  );
}
