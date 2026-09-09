// app/provider/earnings.tsx
import { Ionicons } from "@expo/vector-icons";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    Easing,
    Image,
    Modal,
    Pressable,
    Animated as RNAnimated,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    HOMEBITE_LOGO,
    providerTheme as T,
    statusMeta,
} from "../../constants/providerTheme";
import {
    getEarnings,
    inr,
    type EarningTxn,
    type EarningsData,
    type EarningsPeriod,
} from "../../services/provider/earnings";

const PERIODS: { key: EarningsPeriod; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "custom", label: "Custom" },
];

export default function ProviderEarningsScreen() {
  const [period, setPeriod] = useState<EarningsPeriod>("week");
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<EarningTxn | null>(null);

  const load = useCallback(async (p: EarningsPeriod) => {
    setLoading(true);
    setError(null);
    try {
      setData(await getEarnings(p));
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(period);
  }, [period, load]);

  const headline = useMemo(() => {
    if (!data) return 0;
    return period === "today"
      ? data.summary.today
      : period === "month"
        ? data.summary.month
        : data.summary.week;
  }, [data, period]);

  return (
    <SafeAreaView style={s.screen} edges={["top"]}>
      <View style={s.header}>
        <Image source={HOMEBITE_LOGO} style={s.logo} resizeMode="contain" />
        <Text style={s.headerTitle}>Earnings</Text>
        <View style={{ width: 34 }} />
      </View>

      <PeriodTabs period={period} onChange={setPeriod} />

      {loading ? (
        <EarningsSkeleton />
      ) : error ? (
        <View style={s.center}>
          <Ionicons name="alert-circle-outline" size={54} color={T.danger} />
          <Text style={s.emptyTitle}>{error}</Text>
          <Pressable style={s.primaryBtn} onPress={() => load(period)}>
            <Text style={s.primaryBtnText}>Retry</Text>
          </Pressable>
        </View>
      ) : !data || data.transactions.length === 0 ? (
        <View style={s.center}>
          <Ionicons name="wallet-outline" size={60} color={T.textMuted} />
          <Text style={s.emptyTitle}>No earnings yet</Text>
          <Text style={[s.subtle, { textAlign: "center" }]}>
            Once customers order or subscribe, your earnings will appear here.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
        >
          <HeroCard amount={headline} data={data} period={period} />
          <SummaryGrid data={data} />
          <ChartCard data={data} period={period} />
          <SourceCard data={data} />
          <BreakdownCard data={data} />
          <PayoutCard data={data} />
          <TransactionsCard data={data} onSelect={setSelected} />
        </ScrollView>
      )}

      <TxnSheet txn={selected} onClose={() => setSelected(null)} />
    </SafeAreaView>
  );
}

/* ---------------- period tabs ---------------- */

function PeriodTabs({
  period,
  onChange,
}: {
  period: EarningsPeriod;
  onChange: (p: EarningsPeriod) => void;
}) {
  return (
    <View style={s.tabsRow}>
      {PERIODS.map((p) => {
        const on = p.key === period;
        return (
          <Pressable
            key={p.key}
            onPress={() => onChange(p.key)}
            style={[s.tab, on && s.tabOn]}
          >
            <Text style={on ? s.tabTextOn : s.tabText}>{p.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ---------------- animated number ---------------- */

function AnimatedAmount({ value, style }: { value: number; style?: any }) {
  const anim = useRef(new RNAnimated.Value(0)).current;
  const [shown, setShown] = useState(0);

  useEffect(() => {
    anim.setValue(0);
    const id = anim.addListener(({ value: v }) =>
      setShown(Math.round(v * value)),
    );
    RNAnimated.timing(anim, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    return () => anim.removeListener(id);
  }, [value]);

  return <Text style={style}>{inr(shown)}</Text>;
}

function HeroCard({
  amount,
  data,
  period,
}: {
  amount: number;
  data: EarningsData;
  period: EarningsPeriod;
}) {
  const label = PERIODS.find((p) => p.key === period)!.label;
  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      style={[s.card, s.heroCard]}
    >
      <Text style={s.heroLabel}>{label} earnings</Text>
      <AnimatedAmount value={amount} style={s.heroAmount} />
      <View style={s.heroFootRow}>
        <View style={s.heroFootItem}>
          <Ionicons name="receipt-outline" size={16} color="#fff" />
          <Text style={s.heroFootText}>
            {data.summary.completedOrders} orders
          </Text>
        </View>
        <View style={s.heroFootItem}>
          <Ionicons name="trending-up-outline" size={16} color="#fff" />
          <Text style={s.heroFootText}>
            {inr(data.summary.avgOrderValue)} avg
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

function SummaryGrid({ data }: { data: EarningsData }) {
  const items = [
    {
      label: "Today",
      value: data.summary.today,
      icon: "sunny-outline" as const,
    },
    {
      label: "This week",
      value: data.summary.week,
      icon: "calendar-outline" as const,
    },
    {
      label: "This month",
      value: data.summary.month,
      icon: "calendar-number-outline" as const,
    },
    {
      label: "All time",
      value: data.summary.total,
      icon: "cash-outline" as const,
    },
  ];
  return (
    <View style={s.grid}>
      {items.map((it, i) => (
        <Animated.View
          key={it.label}
          entering={FadeInDown.delay(60 * i)}
          style={[s.card, s.gridCard]}
        >
          <Ionicons name={it.icon} size={18} color={T.primary} />
          <Text style={s.gridValue}>{inr(it.value)}</Text>
          <Text style={s.subtle}>{it.label}</Text>
        </Animated.View>
      ))}
    </View>
  );
}

/* ---------------- chart ---------------- */

function ChartCard({
  data,
  period,
}: {
  data: EarningsData;
  period: EarningsPeriod;
}) {
  const max = Math.max(...data.chart.map((c) => c.value), 1);
  return (
    <Animated.View entering={FadeInDown.delay(160)} style={s.card}>
      <Text style={s.cardTitle}>Earnings over time</Text>
      <View style={s.chartRow}>
        {data.chart.map((c, i) => (
          <Bar
            key={c.label + period}
            label={c.label}
            pct={c.value / max}
            value={c.value}
            delay={i * 70}
          />
        ))}
      </View>
    </Animated.View>
  );
}

function Bar({
  label,
  pct,
  value,
  delay,
}: {
  label: string;
  pct: number;
  value: number;
  delay: number;
}) {
  const h = useRef(new RNAnimated.Value(0)).current;
  useEffect(() => {
    h.setValue(0);
    RNAnimated.timing(h, {
      toValue: pct,
      duration: 650,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [pct, delay]);

  return (
    <View style={s.barCol}>
      <Text style={s.barValue}>
        {value >= 1000 ? `${Math.round(value / 100) / 10}k` : value}
      </Text>
      <View style={s.barTrack}>
        <RNAnimated.View
          style={[
            s.barFill,
            {
              height: h.interpolate({
                inputRange: [0, 1],
                outputRange: ["2%", "100%"],
              }),
            },
          ]}
        />
      </View>
      <Text style={s.barLabel}>{label}</Text>
    </View>
  );
}

function SourceCard({ data }: { data: EarningsData }) {
  const total = data.bySource.orders + data.bySource.mealPlans || 1;
  const planPct = Math.round((data.bySource.mealPlans / total) * 100);
  return (
    <Animated.View entering={FadeInDown.delay(200)} style={s.card}>
      <Text style={s.cardTitle}>Where your money comes from</Text>
      <View style={s.splitBar}>
        <View style={{ flex: 100 - planPct, backgroundColor: T.primary }} />
        <View style={{ flex: planPct, backgroundColor: T.success }} />
      </View>
      <View style={[s.row, { justifyContent: "space-between" }]}>
        <Legend
          color={T.primary}
          label="Food orders"
          value={inr(data.bySource.orders)}
        />
        <Legend
          color={T.success}
          label="Meal plans"
          value={inr(data.bySource.mealPlans)}
        />
      </View>
      <View style={s.divider} />
      <View style={s.totalRow}>
        <Text style={s.totalLabel}>Total</Text>
        <Text style={s.totalValue}>{inr(total)}</Text>
      </View>
    </Animated.View>
  );
}

function Legend({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <View style={{ gap: 2 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <View
          style={{
            width: 9,
            height: 9,
            borderRadius: 5,
            backgroundColor: color,
          }}
        />
        <Text style={s.subtle}>{label}</Text>
      </View>
      <Text style={s.rowValueLeft}>{value}</Text>
    </View>
  );
}

function BreakdownCard({ data }: { data: EarningsData }) {
  const b = data.breakdown;
  const lines = [
    { label: "Gross sales", value: b.gross, sign: "+" as const },
    { label: "Platform fees", value: -b.fees, sign: "-" as const },
    { label: "Discounts", value: -b.discounts, sign: "-" as const },
    { label: "Refunds", value: -b.refunds, sign: "-" as const },
    { label: "Adjustments", value: b.adjustments, sign: "+" as const },
  ];
  return (
    <Animated.View entering={FadeInDown.delay(240)} style={s.card}>
      <Text style={s.cardTitle}>Breakdown</Text>
      {lines.map((l) => (
        <View key={l.label} style={s.breakRow}>
          <Text style={s.subtle}>{l.label}</Text>
          <Text style={[s.rowValueLeft, l.value < 0 && { color: T.danger }]}>
            {l.value < 0 ? `- ${inr(Math.abs(l.value))}` : inr(l.value)}
          </Text>
        </View>
      ))}
      <View style={s.divider} />
      <View style={s.totalRow}>
        <Text style={s.totalLabel}>Net earnings</Text>
        <Text style={[s.totalValue, { color: T.success }]}>{inr(b.net)}</Text>
      </View>
    </Animated.View>
  );
}

function PayoutCard({ data }: { data: EarningsData }) {
  const p = data.payouts;
  const [open, setOpen] = useState(false);
  return (
    <Animated.View entering={FadeInDown.delay(280)} style={s.card}>
      <Text style={s.cardTitle}>Payouts</Text>
      <View style={s.payoutRow}>
        <PayoutBox
          label="Available"
          value={inr(p.availableBalance)}
          tint={T.success}
        />
        <PayoutBox label="Pending" value={inr(p.pending)} tint={T.warning} />
      </View>
      <View style={s.payoutRow}>
        <PayoutBox
          label="Next payout"
          value={p.upcomingPayoutDate}
          tint={T.info}
        />
        <PayoutBox
          label="Total paid"
          value={inr(p.totalPaid)}
          tint={T.primary}
        />
      </View>

      <Pressable style={s.ghostBtn} onPress={() => setOpen((o) => !o)}>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color={T.primary}
        />
        <Text style={s.ghostBtnText}>
          {open ? "Hide" : "View"} payout history
        </Text>
      </Pressable>

      {open ? (
        <Animated.View entering={FadeIn}>
          {p.history.map((h) => (
            <View key={h.id} style={s.breakRow}>
              <View>
                <Text style={s.rowValueLeft}>{inr(h.amount)}</Text>
                <Text style={s.subtle}>
                  {new Date(h.date).toDateString().slice(4)} · {h.reference}
                </Text>
              </View>
              <Pill
                status={h.status === "paid" ? "delivered" : "accepted"}
                label={h.status === "paid" ? "Paid" : "Processing"}
              />
            </View>
          ))}
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

function PayoutBox({
  label,
  value,
  tint,
}: {
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <View style={[s.payoutBox, { borderLeftColor: tint }]}>
      <Text style={s.subtle}>{label}</Text>
      <Text style={s.payoutValue}>{value}</Text>
    </View>
  );
}

function Pill({ status, label }: { status: string; label?: string }) {
  const meta = statusMeta[status] ?? statusMeta.pending;
  return (
    <View style={[s.pill, { backgroundColor: meta.bg }]}>
      <Text style={[s.pillText, { color: meta.fg }]}>
        {label ?? meta.label}
      </Text>
    </View>
  );
}

function TransactionsCard({
  data,
  onSelect,
}: {
  data: EarningsData;
  onSelect: (t: EarningTxn) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const list = showAll ? data.transactions : data.transactions.slice(0, 6);
  return (
    <Animated.View entering={FadeInDown.delay(320)} style={s.card}>
      <Text style={s.cardTitle}>Transactions</Text>
      {list.map((t, i) => (
        <Animated.View key={t.id} entering={FadeInDown.delay(30 * i)}>
          <Pressable
            style={({ pressed }) => [s.txnRow, pressed && { opacity: 0.6 }]}
            onPress={() => onSelect(t)}
          >
            <View
              style={[
                s.txnIcon,
                {
                  backgroundColor:
                    t.source === "meal_plan" ? T.successLight : T.primaryLight,
                },
              ]}
            >
              <Ionicons
                name={t.source === "meal_plan" ? "repeat" : "fast-food-outline"}
                size={18}
                color={t.source === "meal_plan" ? T.success : T.primary}
              />
            </View>
            <View style={{ flex: 1, marginLeft: T.spacing.md }}>
              <Text style={s.rowValueLeft} numberOfLines={1}>
                #{t.orderId}
              </Text>
              <Text style={s.subtle} numberOfLines={1}>
                {t.summary}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end", gap: 3 }}>
              <Text style={s.txnNet}>{inr(t.net)}</Text>
              <Pill
                status={
                  t.payoutStatus === "paid"
                    ? "delivered"
                    : t.payoutStatus === "processing"
                      ? "accepted"
                      : "pending"
                }
                label={
                  t.payoutStatus === "paid"
                    ? "Paid"
                    : t.payoutStatus === "processing"
                      ? "Processing"
                      : "Pending"
                }
              />
            </View>
          </Pressable>
        </Animated.View>
      ))}
      {data.transactions.length > 6 ? (
        <Pressable style={s.ghostBtn} onPress={() => setShowAll((v) => !v)}>
          <Text style={s.ghostBtnText}>
            {showAll ? "Show less" : `Show all ${data.transactions.length}`}
          </Text>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}

function TxnSheet({
  txn,
  onClose,
}: {
  txn: EarningTxn | null;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={!!txn}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={s.backdrop} onPress={onClose} />
      {txn ? (
        <Animated.View entering={FadeInDown.duration(260)} style={s.sheet}>
          <View style={s.sheetHandle} />
          <Text style={s.cardTitle}>Order #{txn.orderId}</Text>
          <Text style={s.subtle}>
            {new Date(txn.date).toDateString().slice(4)} ·{" "}
            {new Date(txn.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <View style={s.divider} />
          <Text style={s.body}>{txn.summary}</Text>
          <View style={s.divider} />
          {[
            ["Gross amount", inr(txn.gross)],
            ["Platform fees", `- ${inr(txn.fees)}`],
            ["Refunds", `- ${inr(txn.refunds)}`],
          ].map(([l, v]) => (
            <View key={l} style={s.breakRow}>
              <Text style={s.subtle}>{l}</Text>
              <Text style={s.rowValueLeft}>{v}</Text>
            </View>
          ))}
          <View style={s.divider} />
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Net earning</Text>
            <Text style={[s.totalValue, { color: T.success }]}>
              {inr(txn.net)}
            </Text>
          </View>
          <Pressable style={s.primaryBtn} onPress={onClose}>
            <Text style={s.primaryBtnText}>Close</Text>
          </Pressable>
        </Animated.View>
      ) : null}
    </Modal>
  );
}

function EarningsSkeleton() {
  return (
    <View style={{ paddingTop: T.spacing.sm }}>
      {[130, 100, 180, 140].map((h, i) => (
        <Animated.View
          key={i}
          entering={FadeIn.delay(i * 90)}
          style={[s.card, { height: h, backgroundColor: T.surfaceWarm }]}
        />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.bg },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: T.spacing.xl,
    gap: T.spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: T.spacing.lg,
    paddingVertical: T.spacing.md,
  },
  logo: { width: 34, height: 34 },
  headerTitle: {
    fontFamily: T.fonts.semibold,
    fontSize: T.typography.subheading,
    color: T.text,
  },

  tabsRow: {
    flexDirection: "row",
    gap: T.spacing.sm,
    paddingHorizontal: T.spacing.lg,
    paddingBottom: T.spacing.md,
  },
  tab: {
    paddingHorizontal: T.spacing.md,
    paddingVertical: 7,
    borderRadius: T.radius.pill,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
  },
  tabOn: { backgroundColor: T.primary, borderColor: T.primary },
  tabText: {
    fontFamily: T.fonts.medium,
    fontSize: T.typography.caption,
    color: T.textSecondary,
  },
  tabTextOn: {
    fontFamily: T.fonts.semibold,
    fontSize: T.typography.caption,
    color: "#fff",
  },

  card: {
    backgroundColor: T.surface,
    borderRadius: T.radius.lg,
    padding: T.spacing.lg,
    marginHorizontal: T.spacing.lg,
    marginBottom: T.spacing.lg,
    borderWidth: 1,
    borderColor: T.border,
    ...T.shadows.card,
  },
  heroCard: {
    backgroundColor: T.primary,
    borderColor: T.primary,
    ...T.shadows.floating,
  },
  heroLabel: {
    fontFamily: T.fonts.medium,
    fontSize: T.typography.bodySmall,
    color: "rgba(255,255,255,0.85)",
  },
  heroAmount: {
    fontFamily: T.fonts.extraBold,
    fontSize: T.typography.display,
    color: "#fff",
    marginVertical: 4,
  },
  heroFootRow: {
    flexDirection: "row",
    gap: T.spacing.xl,
    marginTop: T.spacing.sm,
  },
  heroFootItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  heroFootText: {
    fontFamily: T.fonts.medium,
    fontSize: T.typography.caption,
    color: "#fff",
  },

  cardTitle: {
    fontFamily: T.fonts.semibold,
    fontSize: T.typography.bodyLarge,
    color: T.text,
    marginBottom: T.spacing.sm,
  },
  subtle: {
    fontFamily: T.fonts.regular,
    fontSize: T.typography.caption,
    color: T.textSecondary,
  },
  body: {
    fontFamily: T.fonts.regular,
    fontSize: T.typography.bodySmall,
    color: T.textSecondary,
    lineHeight: 22,
  },
  rowValueLeft: {
    fontFamily: T.fonts.semibold,
    fontSize: T.typography.bodySmall,
    color: T.text,
  },
  divider: {
    height: 1,
    backgroundColor: T.divider,
    marginVertical: T.spacing.md,
  },
  row: { flexDirection: "row", alignItems: "center", marginTop: T.spacing.md },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: T.spacing.lg - 6,
  },
  gridCard: { width: "47%", marginHorizontal: "1.5%", gap: 2 },
  gridValue: {
    fontFamily: T.fonts.bold,
    fontSize: T.typography.subheading,
    color: T.text,
  },

  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 170,
    marginTop: T.spacing.sm,
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
    gap: 5,
  },
  barTrack: {
    width: 22,
    height: 118,
    borderRadius: T.radius.sm,
    backgroundColor: T.surfaceWarm,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    backgroundColor: T.primary,
    borderRadius: T.radius.sm,
  },
  barLabel: {
    fontFamily: T.fonts.medium,
    fontSize: 11,
    color: T.textSecondary,
  },
  barValue: { fontFamily: T.fonts.semibold, fontSize: 10, color: T.textMuted },

  splitBar: {
    flexDirection: "row",
    height: 12,
    borderRadius: T.radius.pill,
    overflow: "hidden",
    marginBottom: T.spacing.sm,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontFamily: T.fonts.semibold,
    fontSize: T.typography.body,
    color: T.text,
  },
  totalValue: {
    fontFamily: T.fonts.bold,
    fontSize: T.typography.subheading,
    color: T.text,
  },

  breakRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: T.spacing.sm,
  },

  payoutRow: {
    flexDirection: "row",
    gap: T.spacing.md,
    marginBottom: T.spacing.md,
  },
  payoutBox: {
    flex: 1,
    backgroundColor: T.surfaceWarm,
    borderRadius: T.radius.md,
    padding: T.spacing.md,
    borderLeftWidth: 3,
    gap: 2,
  },
  payoutValue: {
    fontFamily: T.fonts.bold,
    fontSize: T.typography.body,
    color: T.text,
  },

  txnRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: T.spacing.md,
  },
  txnIcon: {
    width: 38,
    height: 38,
    borderRadius: T.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  txnNet: {
    fontFamily: T.fonts.bold,
    fontSize: T.typography.bodySmall,
    color: T.text,
  },

  pill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: T.radius.pill,
  },
  pillText: { fontFamily: T.fonts.semibold, fontSize: 11 },

  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: T.primary,
    borderRadius: T.radius.md,
    paddingVertical: T.spacing.lg,
    marginTop: T.spacing.lg,
  },
  primaryBtnText: {
    fontFamily: T.fonts.semibold,
    fontSize: T.typography.body,
    color: "#fff",
  },
  ghostBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: T.spacing.md,
  },
  ghostBtnText: {
    fontFamily: T.fonts.semibold,
    fontSize: T.typography.bodySmall,
    color: T.primary,
  },

  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)" },
  sheet: {
    backgroundColor: T.surface,
    borderTopLeftRadius: T.radius.xxl,
    borderTopRightRadius: T.radius.xxl,
    padding: T.spacing.xl,
    paddingBottom: T.spacing.xxxl,
  },
  sheetHandle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: T.border,
    alignSelf: "center",
    marginBottom: T.spacing.lg,
  },

  emptyTitle: {
    fontFamily: T.fonts.semibold,
    fontSize: T.typography.bodyLarge,
    color: T.text,
    textAlign: "center",
  },
});
