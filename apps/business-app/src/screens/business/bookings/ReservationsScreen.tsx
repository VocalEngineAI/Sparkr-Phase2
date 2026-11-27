import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import {
  mockReservationSettings,
  mockReservations,
  mockWaitlist,
  type DiningTable,
  type Reservation,
  type WaitlistEntry,
} from "@sparkr/shared";
import {
  Badge,
  Button,
  Card,
  Chips,
  EmptyState,
  InfoBanner,
  ListCard,
  money,
  notYet,
  Screen,
  Segmented,
  SwitchRow,
  Text,
  useHeaderButton,
} from "../../../components/business/kit";
import { cn } from "../../../lib/utils";
import type { BookingsScreenProps } from "../../../navigation/businessTypes";
import {
  CounterSeat,
  FLOOR_LEGEND,
  InfoTile,
  Legend,
  NOW_MINUTES,
  PartyAvatar,
  STATUS,
  Sheet,
  TableShape,
  WaitRing,
  counts,
  floorState,
  formatHour,
  formatTime,
  isLate,
  tableLabel,
  toMinutes,
  type TableState,
} from "./reservationParts";

// Feature 16, modelled on OpenTable / TableWink host stands: a day strip, a covers-by-time
// chart for the service, then three views — a timeline of bookings, the floor (which
// tables are free, held or seated) and the live waitlist. Every booking and table opens a
// bottom sheet with its details and actions, so the lists stay uncluttered.

const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const settings = mockReservationSettings;
const TABLES = settings.tables;
const SEATS = TABLES.reduce((n, t) => n + t.seats, 0);

type View_ = "timeline" | "floor" | "waitlist";
type Filter = "all" | "upcoming" | "seated" | "done";

export default function ReservationsScreen({ navigation }: BookingsScreenProps<"Reservations">) {
  const [day, setDay] = useState(0);
  const [view, setView] = useState<View_>("timeline");
  const [filter, setFilter] = useState<Filter>("all");
  const [reservations, setReservations] = useState(mockReservations);
  const [waitlist, setWaitlist] = useState(mockWaitlist);
  const [waitlistOpen, setWaitlistOpen] = useState(settings.waitlistEnabled);
  const [openId, setOpenId] = useState<string | null>(null);
  const [seating, setSeating] = useState<WaitlistEntry | null>(null);

  useHeaderButton(navigation, {
    label: "Settings",
    icon: "options-outline",
    onPress: () => navigation.navigate("ReservationSettings"),
  });

  // Waitlist timers keep counting while the screen is open.
  useEffect(() => {
    const t = setInterval(() => setWaitlist((l) => l.map((w) => ({ ...w, waitedMinutes: w.waitedMinutes + 1 }))), 60_000);
    return () => clearInterval(t);
  }, []);

  const isToday = day === 0;
  const activeView: View_ = !isToday && view === "waitlist" ? "timeline" : view;
  const dayList = useMemo(
    () => reservations.filter((r) => r.dayOffset === day).sort((a, b) => toMinutes(a.time) - toMinutes(b.time)),
    [reservations, day]
  );
  const open = reservations.find((r) => r.id === openId) ?? null;

  const setStatus = (id: string, status: Reservation["status"]) =>
    setReservations((list) => list.map((r) => (r.id === id ? { ...r, status } : r)));

  const cancel = (r: Reservation) =>
    Alert.alert("Cancel reservation?", `${r.guestName}, party of ${r.partySize} at ${r.time}. The guest gets an SMS.`, [
      { text: "Keep", style: "cancel" },
      {
        text: "Cancel booking",
        style: "destructive",
        onPress: () => {
          setStatus(r.id, "cancelled");
          setOpenId(null);
        },
      },
    ]);

  const seatFromWaitlist = (w: WaitlistEntry, tableIds: string[]) => {
    setWaitlist((l) => l.filter((x) => x.id !== w.id));
    setReservations((list) => [
      ...list,
      {
        id: `walk_${w.id}`,
        guestName: w.name,
        partySize: w.partySize,
        when: `Today · ${formatTime(NOW_MINUTES)}`,
        dayOffset: 0,
        time: formatTime(NOW_MINUTES),
        status: "seated",
        tableIds,
        phone: w.phone,
        note: w.note,
        source: "walk_in",
      },
    ]);
    setSeating(null);
  };

  return (
    <Screen contentClassName="gap-6">
      <DayStrip day={day} onChange={setDay} reservations={reservations} />

      <ServiceCard dayList={dayList} isToday={isToday} day={day} waiting={waitlist.length} />

      <Segmented
        options={
          isToday
            ? ([
                ["timeline", "Bookings"],
                ["floor", "Floor"],
                ["waitlist", `Waitlist · ${waitlist.length}`],
              ] as const)
            : ([
                ["timeline", "Bookings"],
                ["floor", "Floor"],
              ] as const)
        }
        value={activeView}
        onChange={setView}
      />

      {activeView === "timeline" ? (
        <Timeline dayList={dayList} isToday={isToday} filter={filter} onFilter={setFilter} onOpen={setOpenId} />
      ) : activeView === "floor" ? (
        <Floor dayList={dayList} isToday={isToday} onOpen={setOpenId} />
      ) : (
        <Waitlist
          waitlist={waitlist}
          dayList={dayList}
          open={waitlistOpen}
          onToggleOpen={setWaitlistOpen}
          onNotify={(id) => setWaitlist((l) => l.map((w) => (w.id === id ? { ...w, notified: true } : w)))}
          onRemove={(id) => setWaitlist((l) => l.filter((w) => w.id !== id))}
          onSeat={setSeating}
        />
      )}

      {activeView === "waitlist" ? (
        <Button size="lg" onPress={() => notYet("Add to waitlist", "Enter the walk-in's name, phone and party size; Sparkr quotes a wait and texts them when their table is ready.")}>
          <Ionicons name="person-add-outline" size={16} color={colors.background} />
          <Text>Add walk-in</Text>
        </Button>
      ) : (
        <Button size="lg" onPress={() => notYet("New booking", "Enter the guest's name, phone, party size and time; they get a confirmation SMS.")}>
          <Ionicons name="add" size={18} color={colors.background} />
          <Text>New booking</Text>
        </Button>
      )}

      <ReservationSheet
        r={open}
        isToday={isToday}
        onClose={() => setOpenId(null)}
        onSeat={(r) => setStatus(r.id, "seated")}
        onFinish={(r) => {
          setStatus(r.id, "finished");
          setOpenId(null);
        }}
        onNoShow={(r) => {
          setStatus(r.id, "no_show");
          setOpenId(null);
        }}
        onCancel={cancel}
      />

      <SeatSheet entry={seating} dayList={dayList} onClose={() => setSeating(null)} onSeat={seatFromWaitlist} />
    </Screen>
  );
}

// ---------------------------------------------------------------------------
// Day strip + service overview
// ---------------------------------------------------------------------------

function DayStrip({ day, onChange, reservations }: { day: number; onChange: (d: number) => void; reservations: Reservation[] }) {
  const days = Array.from({ length: 14 }, (_, offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const booked = reservations.filter((r) => r.dayOffset === offset && counts(r)).length;
    return { offset, weekday: offset === 0 ? "Today" : DAY[d.getDay()], date: d.getDate(), month: MONTH[d.getMonth()], booked };
  });
  const selected = days[day];
  return (
    <View className="gap-2">
      <Text className="text-xs font-semibold text-textMuted uppercase tracking-wider">
        {selected.month} {selected.date}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5" contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
        {days.map((d) => {
          const on = d.offset === day;
          return (
            <Button
              key={d.offset}
              variant={on ? "default" : "secondary"}
              className="w-14 h-[68px] flex-col gap-0 px-0 rounded-2xl"
              onPress={() => onChange(d.offset)}
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${d.weekday} ${d.month} ${d.date}, ${d.booked} bookings`}
            >
              <Text className="text-[11px]">{d.weekday}</Text>
              <Text className="text-lg font-extrabold">{d.date}</Text>
              <View className={cn("w-1.5 h-1.5 rounded-full mt-0.5", d.booked ? (on ? "bg-accent" : "bg-primary") : "bg-transparent")} />
            </Button>
          );
        })}
      </ScrollView>
    </View>
  );
}

/** Navy hero: guests booked, the peak, and an OpenTable-style covers-over-the-night chart. */
function ServiceCard({ dayList, isToday, day, waiting }: { dayList: Reservation[]; isToday: boolean; day: number; waiting: number }) {
  const live = dayList.filter(counts);
  const guests = live.reduce((n, r) => n + r.partySize, 0);
  const start = settings.serviceStart * 60;
  const end = settings.serviceEnd * 60;
  const slots: { t: number; inHouse: number }[] = [];
  for (let t = start; t < end; t += 30) {
    const inHouse = live
      .filter((r) => {
        const s = toMinutes(r.time);
        return s <= t && t < s + settings.turnMinutes;
      })
      .reduce((n, r) => n + r.partySize, 0);
    slots.push({ t, inHouse });
  }
  const peak = slots.reduce((best, s) => (s.inHouse > best.inHouse ? s : best), slots[0]);
  const nowPct = ((NOW_MINUTES - start) / (end - start)) * 100;
  // Bars scale to the busiest slot (with headroom) so the shape of the night reads clearly.
  const scale = Math.max(1, peak.inHouse) * 1.15;
  const title = isToday ? "Tonight" : day === 1 ? "Tomorrow" : "Service";

  return (
    <Card tone="primary" className="p-5">
      <View className="flex-row items-start">
        <View className="flex-1">
          <Text className="text-xs font-semibold text-primaryLight uppercase tracking-wider">{title}</Text>
          <View className="flex-row items-baseline gap-1.5 mt-1">
            <Text className="text-4xl font-extrabold text-background">{guests}</Text>
            <Text className="text-primaryLight">guests</Text>
          </View>
          <Text className="text-sm text-primaryLight">
            {live.length} bookings{isToday ? ` · ${waiting} waiting` : ""}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs text-primaryLight">Busiest</Text>
          <Text className="font-bold text-background">{peak.inHouse ? formatTime(peak.t) : "—"}</Text>
          <Text className="text-xs text-primaryLight">
            {peak.inHouse} of {SEATS} seats
          </Text>
        </View>
      </View>

      <View className="mt-5">
        <View className="h-20 flex-row items-end gap-1">
          {slots.map((s) => {
            const past = isToday && s.t + 30 <= NOW_MINUTES;
            return (
              <View key={s.t} className="flex-1 h-full justify-end rounded-md bg-primaryLight/10 overflow-hidden">
                <View
                  className={cn("rounded-md", past ? "bg-primaryLight/40" : s === peak && s.inHouse ? "bg-accent" : "bg-accent/60")}
                  style={{ height: `${s.inHouse ? Math.max(6, (s.inHouse / scale) * 100) : 0}%` }}
                />
              </View>
            );
          })}
          {isToday && nowPct > 0 && nowPct < 100 ? (
            <View className="absolute top-0 bottom-0 items-center" style={{ left: `${nowPct}%`, width: 2, marginLeft: -1 }}>
              <View className="flex-1 w-0.5 bg-background" />
            </View>
          ) : null}
        </View>
        <View className="flex-row mt-1.5">
          {slots.map((s, i) => (
            <Text key={s.t} className="flex-1 text-[10px] text-primaryLight">
              {i % 2 === 0 ? formatHour(s.t / 60).replace(" ", "").toLowerCase().replace("m", "") : ""}
            </Text>
          ))}
        </View>
        <Text className="text-[11px] text-primaryLight mt-2">
          Guests in house every 30 min{isToday ? ` · line marks now (${formatTime(NOW_MINUTES)})` : ""}
        </Text>
      </View>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------

function Timeline({
  dayList,
  isToday,
  filter,
  onFilter,
  onOpen,
}: {
  dayList: Reservation[];
  isToday: boolean;
  filter: Filter;
  onFilter: (f: Filter) => void;
  onOpen: (id: string) => void;
}) {
  const by = {
    all: dayList,
    upcoming: dayList.filter((r) => r.status === "confirmed"),
    seated: dayList.filter((r) => r.status === "seated"),
    done: dayList.filter((r) => !(r.status === "confirmed" || r.status === "seated")),
  };
  const shown = by[filter];
  const groups: { time: string; items: Reservation[] }[] = [];
  for (const r of shown) {
    const g = groups[groups.length - 1];
    if (g && g.time === r.time) g.items.push(r);
    else groups.push({ time: r.time, items: [r] });
  }
  const nowIndex = isToday ? groups.findIndex((g) => toMinutes(g.time) > NOW_MINUTES) : -1;

  return (
    <View className="gap-4">
      <Chips
        options={[
          ["all", `All ${by.all.length}`],
          ["upcoming", `Upcoming ${by.upcoming.length}`],
          ["seated", `Seated ${by.seated.length}`],
          ["done", `Done ${by.done.length}`],
        ]}
        value={filter}
        onChange={onFilter}
      />

      {groups.length === 0 ? (
        <EmptyState icon="calendar-outline" title="Nothing here" detail="No bookings match this filter for the selected day." />
      ) : (
        <View>
          {groups.map((g, i) => {
            const [hm, ampm] = g.time.split(" ");
            return (
              <React.Fragment key={g.time}>
                {i === nowIndex ? <NowLine /> : null}
                <View className="flex-row">
                  <View className="w-14 pt-3">
                    <Text className="font-extrabold">{hm}</Text>
                    <Text className="text-[11px] text-textMuted">{ampm}</Text>
                  </View>
                  <View className="flex-1 border-l-2 border-border pl-3 pb-4 gap-2">
                    {g.items.map((r) => (
                      <ReservationRow key={r.id} r={r} isToday={isToday} onPress={() => onOpen(r.id)} />
                    ))}
                  </View>
                </View>
              </React.Fragment>
            );
          })}
          {isToday && nowIndex === -1 && groups.length ? <NowLine /> : null}
        </View>
      )}
    </View>
  );
}

function NowLine() {
  return (
    <View className="flex-row items-center mb-4">
      <View className="w-14">
        <Text className="text-[11px] font-bold">NOW</Text>
      </View>
      <View className="w-2.5 h-2.5 rounded-full bg-accent -ml-[5px]" />
      <View className="flex-1 h-0.5 bg-accent" />
      <Text className="text-[11px] font-semibold ml-2">{formatTime(NOW_MINUTES)}</Text>
    </View>
  );
}

function ReservationRow({ r, isToday, onPress }: { r: Reservation; isToday: boolean; onPress: () => void }) {
  const done = !(r.status === "confirmed" || r.status === "seated");
  const late = isLate(r, isToday);
  const s = STATUS[r.status];
  return (
    <Button
      variant="outline"
      className={cn("h-auto flex-row items-center justify-start gap-3 rounded-2xl p-3", r.status === "seated" && "border-success/40 bg-success/5")}
      onPress={onPress}
      accessibilityLabel={`${r.guestName}, party of ${r.partySize}, ${s.label}`}
    >
      <PartyAvatar size={r.partySize} muted={done} />
      <View className="flex-1">
        <View className="flex-row items-center gap-1.5">
          <Text className={cn("font-bold text-base", done && "text-textMuted line-through")} numberOfLines={1}>
            {r.guestName}
          </Text>
          {r.vip ? <Ionicons name="star" size={13} color={colors.accent} accessibilityLabel="VIP" /> : null}
          {r.special ? <Ionicons name="sparkles" size={13} color={colors.accent} accessibilityLabel="Special reservation" /> : null}
          {r.deposit ? <Ionicons name="cash-outline" size={13} color={colors.textMuted} accessibilityLabel="Deposit paid" /> : null}
          {r.note ? <Ionicons name="chatbox-ellipses-outline" size={13} color={colors.textMuted} accessibilityLabel="Has a note" /> : null}
          {r.source === "phone" ? <Ionicons name="call-outline" size={13} color={colors.textMuted} accessibilityLabel="Phone booking" /> : null}
          {r.source === "walk_in" ? <Ionicons name="walk-outline" size={13} color={colors.textMuted} accessibilityLabel="Walk-in" /> : null}
        </View>
        {r.tableIds?.length || !done ? (
          <View className="flex-row items-center gap-1 mt-0.5">
            <Ionicons name="grid-outline" size={11} color={colors.textMuted} />
            <Text className="text-sm text-textMuted" numberOfLines={1}>
              {tableLabel(r.tableIds, TABLES)}
            </Text>
          </View>
        ) : null}
      </View>
      {late ? <Badge label="Late" tone="warning" icon="time-outline" /> : <Badge label={s.label} tone={s.tone} />}
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Floor
// ---------------------------------------------------------------------------

function Floor({ dayList, isToday, onOpen }: { dayList: Reservation[]; isToday: boolean; onOpen: (id: string) => void }) {
  const state = floorState(TABLES, dayList);
  const dining = TABLES.filter((t) => t.area === "dining");
  const counter = TABLES.filter((t) => t.area === "counter");
  const tally = (k: TableState["kind"]) => TABLES.filter((t) => state[t.id].kind === k).reduce((n, t) => n + t.seats, 0);

  const press = (t: DiningTable) => {
    const s = state[t.id];
    if (s.r) onOpen(s.r.id);
    else notYet(`${t.area === "counter" ? "Counter seat " : ""}${t.label} is free`, "Seat a walk-in here or hold it for a booking.");
  };

  const caption = (t: DiningTable) => {
    const s = state[t.id];
    if (s.kind === "seated") return s.r!.guestName;
    if (s.kind === "reserved") return s.r!.time.replace(" PM", "p").replace(" AM", "a");
    return `${t.seats} seats`;
  };

  return (
    <View className="gap-4">
      <View className="flex-row gap-2">
        {(
          [
            ["Seated", tally("seated"), "bg-primary"],
            ["Reserved", tally("reserved"), "bg-accent"],
            ["Free", tally("free"), "bg-border"],
          ] as const
        ).map(([label, n, dot]) => (
          <View key={label} className="flex-1 bg-surface rounded-2xl p-3">
            <View className="flex-row items-center gap-1.5">
              <View className={cn("w-2 h-2 rounded-full", dot)} />
              <Text className="text-xs text-textMuted">{label}</Text>
            </View>
            <Text className="text-xl font-extrabold mt-1">
              {n}
              <Text className="text-xs text-textMuted font-normal"> seats</Text>
            </Text>
          </View>
        ))}
      </View>

      <Card className="gap-5">
        <View className="flex-row items-center justify-between">
          <Text className="font-bold">Dining room</Text>
          <Text className="text-xs text-textMuted">{isToday ? `As of ${formatTime(NOW_MINUTES)}` : "Held for bookings"}</Text>
        </View>
        <View className="flex-row flex-wrap justify-between gap-y-4">
          {dining.map((t) => (
            <TableShape key={t.id} table={t} kind={state[t.id].kind} caption={caption(t)} onPress={() => press(t)} className="w-[30%]" />
          ))}
        </View>

        <View className="gap-2">
          <Text className="font-bold">Sushi counter</Text>
          <View className="flex-row justify-between">
            {counter.map((t) => (
              <CounterSeat key={t.id} table={t} kind={state[t.id].kind} onPress={() => press(t)} />
            ))}
          </View>
          <View className="h-3 rounded-full bg-primary/80" />
        </View>

        <Legend items={FLOOR_LEGEND} />
      </Card>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Waitlist
// ---------------------------------------------------------------------------

function Waitlist({
  waitlist,
  dayList,
  open,
  onToggleOpen,
  onNotify,
  onRemove,
  onSeat,
}: {
  waitlist: WaitlistEntry[];
  dayList: Reservation[];
  open: boolean;
  onToggleOpen: (v: boolean) => void;
  onNotify: (id: string) => void;
  onRemove: (id: string) => void;
  onSeat: (w: WaitlistEntry) => void;
}) {
  const guests = waitlist.reduce((n, w) => n + w.partySize, 0);
  const longest = waitlist.reduce((m, w) => Math.max(m, w.waitedMinutes), 0);
  // Next table to free up: the seated party whose turn ends soonest.
  const nextFree = dayList
    .filter((r) => r.status === "seated")
    .map((r) => ({ r, at: toMinutes(r.time) + settings.turnMinutes }))
    .sort((a, b) => a.at - b.at)[0];

  return (
    <View className="gap-4">
      <View className="flex-row gap-2">
        {(
          [
            ["Parties", String(waitlist.length)],
            ["Guests", String(guests)],
            ["Longest", `${longest}m`],
          ] as const
        ).map(([label, value]) => (
          <View key={label} className="flex-1 bg-surface rounded-2xl p-3">
            <Text className="text-xs text-textMuted">{label}</Text>
            <Text className="text-xl font-extrabold mt-1">{value}</Text>
          </View>
        ))}
      </View>

      <ListCard>
        <SwitchRow
          icon="phone-portrait-outline"
          title="Online waitlist"
          description={open ? "Guests can join from the Sparkr app" : "Only staff can add walk-ins"}
          value={open}
          onValueChange={onToggleOpen}
          last
        />
      </ListCard>

      {nextFree ? (
        <InfoBanner
          icon="hourglass-outline"
          text={`Next table frees up around ${formatTime(nextFree.at)} (${tableLabel(nextFree.r.tableIds, TABLES)}, ${nextFree.r.guestName}).`}
        />
      ) : null}

      {waitlist.length === 0 ? (
        <EmptyState icon="people-outline" title="No one is waiting" detail="Walk-ins you add and guests who join in the app show up here." />
      ) : (
        <View className="gap-3">
          {waitlist.map((w, i) => (
            <WaitlistCard
              key={w.id}
              w={w}
              position={i + 1}
              onNotify={() => onNotify(w.id)}
              onRemove={() =>
                Alert.alert("Remove from waitlist?", `${w.name}, party of ${w.partySize}.`, [
                  { text: "Keep", style: "cancel" },
                  { text: "Remove", style: "destructive", onPress: () => onRemove(w.id) },
                ])
              }
              onSeat={() => onSeat(w)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function WaitlistCard({
  w,
  position,
  onNotify,
  onRemove,
  onSeat,
}: {
  w: WaitlistEntry;
  position: number;
  onNotify: () => void;
  onRemove: () => void;
  onSeat: () => void;
}) {
  const over = w.waitedMinutes >= w.quotedMinutes;
  return (
    <Card className={cn(over && "border-warning/40")}>
      <View className="flex-row items-center gap-4">
        <WaitRing waited={w.waitedMinutes} quoted={w.quotedMinutes} />
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-xs font-bold text-textMuted">#{position}</Text>
            <Text className="font-bold text-base flex-1" numberOfLines={1}>
              {w.name}
            </Text>
          </View>
          <Text className="text-sm text-textMuted mt-0.5">
            Party of {w.partySize} · quoted {w.quotedMinutes} min
          </Text>
          <View className="flex-row flex-wrap gap-1.5 mt-2">
            <Badge label={w.source === "app" ? "Sparkr app" : "Walk-in"} icon={w.source === "app" ? "phone-portrait-outline" : "walk-outline"} />
            {w.notified ? <Badge label="Texted" tone="success" icon="checkmark" /> : null}
            {over ? <Badge label={`${w.waitedMinutes - w.quotedMinutes}m over`} tone="warning" icon="alert-circle-outline" /> : null}
          </View>
        </View>
      </View>
      {w.note ? (
        <View className="flex-row items-center gap-1.5 mt-3 bg-surface rounded-xl px-3 py-2">
          <Ionicons name="chatbox-ellipses-outline" size={14} color={colors.textMuted} />
          <Text className="text-sm flex-1">{w.note}</Text>
        </View>
      ) : null}
      <View className="flex-row items-center gap-2 mt-3">
        <Button variant="ghost" size="icon" onPress={onRemove} accessibilityLabel={`Remove ${w.name}`}>
          <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onPress={() => notYet("Message guest", `Chat with ${w.name}${w.phone ? ` at ${w.phone}` : ""}.`)}
          accessibilityLabel={`Message ${w.name}`}
        >
          <Ionicons name="chatbubble-outline" size={18} color={colors.text} />
        </Button>
        <View className="flex-1" />
        <Button variant="outline" size="sm" onPress={onNotify}>
          <Ionicons name={w.notified ? "refresh" : "notifications-outline"} size={15} color={colors.text} />
          <Text>{w.notified ? "Text again" : "Table ready"}</Text>
        </Button>
        <Button size="sm" onPress={onSeat}>
          <Ionicons name="restaurant-outline" size={15} color={colors.background} />
          <Text>Seat</Text>
        </Button>
      </View>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Sheets
// ---------------------------------------------------------------------------

function ReservationSheet({
  r,
  isToday,
  onClose,
  onSeat,
  onFinish,
  onNoShow,
  onCancel,
}: {
  r: Reservation | null;
  isToday: boolean;
  onClose: () => void;
  onSeat: (r: Reservation) => void;
  onFinish: (r: Reservation) => void;
  onNoShow: (r: Reservation) => void;
  onCancel: (r: Reservation) => void;
}) {
  if (!r) return <Sheet visible={false} onClose={onClose}>{null}</Sheet>;
  const s = STATUS[r.status];
  const late = isLate(r, isToday);
  const source = r.source === "app" ? "Booked in Sparkr" : r.source === "phone" ? "Phone booking" : "Walk-in";

  return (
    <Sheet visible onClose={onClose} title="Reservation">
      <View className="flex-row items-center gap-4">
        <PartyAvatar size={r.partySize} big />
        <View className="flex-1">
          <Text className="text-2xl font-extrabold">{r.guestName}</Text>
          <View className="flex-row flex-wrap gap-1.5 mt-1.5">
            {late ? <Badge label="Late" tone="warning" icon="time-outline" /> : <Badge label={s.label} tone={s.tone} />}
            {r.vip ? <Badge label="VIP" tone="accent" icon="star" /> : null}
            {r.special ? <Badge label="Special" tone="accent" icon="sparkles" /> : null}
            <Badge label={source} />
          </View>
        </View>
      </View>

      <View className="flex-row gap-2">
        <InfoTile icon="time-outline" label="Time" value={r.time} />
        <InfoTile icon="people-outline" label="Party" value={`${r.partySize} guests`} />
        <InfoTile icon="grid-outline" label="Table" value={tableLabel(r.tableIds, TABLES)} />
      </View>

      {r.note ? (
        <View className="flex-row gap-2.5 bg-accent/15 rounded-2xl p-3.5">
          <Ionicons name="chatbox-ellipses-outline" size={18} color={colors.text} />
          <Text className="flex-1">{r.note}</Text>
        </View>
      ) : null}

      {r.deposit ? (
        <InfoBanner
          tone="warning"
          icon="cash-outline"
          text={`${money(r.deposit)} deposit paid in app. Your restaurant is responsible for managing this deposit against the final bill.`}
        />
      ) : null}

      {r.phone ? (
        <ListCard>
          <View className="flex-row items-center px-4 py-3 bg-background">
            <Ionicons name="call-outline" size={18} color={colors.textMuted} />
            <Text className="flex-1 ml-3 font-semibold">{r.phone}</Text>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full"
              onPress={() => notYet("Message guest", "Chat with the guest if something changes, e.g. overbooking.")}
              accessibilityLabel="Message guest"
            >
              <Ionicons name="chatbubble-outline" size={17} color={colors.text} />
            </Button>
          </View>
        </ListCard>
      ) : null}

      {r.status === "confirmed" ? (
        <View className="gap-2">
          {isToday ? (
            <>
              <Button size="lg" onPress={() => onSeat(r)}>
                <Ionicons name="checkmark-circle-outline" size={18} color={colors.background} />
                <Text>Guests arrived · Seat</Text>
              </Button>
              <View className="flex-row gap-2">
                <Button variant="outline" className="flex-1" onPress={() => notYet("Modify booking", "Change the time, party size or table; the guest gets an SMS.")}>
                  <Text>Modify</Text>
                </Button>
                <Button variant="outline" className="flex-1" onPress={() => onNoShow(r)}>
                  <Text>No-show</Text>
                </Button>
              </View>
            </>
          ) : (
            <Button size="lg" onPress={() => notYet("Modify booking", "Change the time, party size or table; the guest gets an SMS.")}>
              <Ionicons name="create-outline" size={18} color={colors.background} />
              <Text>Modify booking</Text>
            </Button>
          )}
          <Button variant="ghost" onPress={() => onCancel(r)}>
            <Text className="text-warning">Cancel booking</Text>
          </Button>
        </View>
      ) : r.status === "seated" ? (
        <Button size="lg" onPress={() => onFinish(r)}>
          <Ionicons name="checkmark-done-outline" size={18} color={colors.background} />
          <Text>Finished · Clear table</Text>
        </Button>
      ) : (
        <Text className="text-sm text-textMuted text-center">This booking is {s.label.toLowerCase()}.</Text>
      )}
    </Sheet>
  );
}

/** Pick a free table for a waitlist party: dining tables that fit, smallest first. */
function SeatSheet({
  entry,
  dayList,
  onClose,
  onSeat,
}: {
  entry: WaitlistEntry | null;
  dayList: Reservation[];
  onClose: () => void;
  onSeat: (w: WaitlistEntry, tableIds: string[]) => void;
}) {
  if (!entry) return <Sheet visible={false} onClose={onClose}>{null}</Sheet>;
  const state = floorState(TABLES, dayList);
  const fits = TABLES.filter((t) => t.area === "dining" && t.seats >= entry.partySize && state[t.id].kind !== "seated").sort(
    (a, b) => a.seats - b.seats || Number(state[a.id].kind === "reserved") - Number(state[b.id].kind === "reserved")
  );
  const freeCounter = TABLES.filter((t) => t.area === "counter" && state[t.id].kind === "free");
  const counterPick = entry.partySize <= 2 && freeCounter.length >= entry.partySize ? freeCounter.slice(0, entry.partySize) : null;

  return (
    <Sheet visible onClose={onClose} title={`Seat ${entry.name}`}>
      <Text className="text-textMuted">
        Party of {entry.partySize}. Tables that fit, smallest first. The guest gets a "your table is ready" text.
      </Text>
      <View className="flex-row flex-wrap justify-between gap-y-4">
        {fits.map((t, i) => {
          const held = state[t.id].r;
          return (
            <View key={t.id} className="w-[30%]">
              <TableShape
                table={t}
                kind={state[t.id].kind}
                caption={held ? `Held ${held.time.replace(" PM", "p")}` : i === 0 ? "Best fit" : `${t.seats} seats`}
                onPress={() => onSeat(entry, [t.id])}
              />
            </View>
          );
        })}
        {fits.length % 3 ? Array.from({ length: 3 - (fits.length % 3) }, (_, i) => <View key={i} className="w-[30%]" />) : null}
      </View>
      {counterPick ? (
        <Button variant="outline" size="lg" onPress={() => onSeat(entry, counterPick.map((t) => t.id))}>
          <Ionicons name="fish-outline" size={17} color={colors.text} />
          <Text>Sushi counter · {tableLabel(counterPick.map((t) => t.id), TABLES)}</Text>
        </Button>
      ) : null}
      {fits.length === 0 && !counterPick ? (
        <EmptyState icon="grid-outline" title="No table fits right now" detail="Text the guest when a table frees up." />
      ) : null}
    </Sheet>
  );
}
