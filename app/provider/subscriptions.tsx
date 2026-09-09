// app/provider/subscriptions.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    FadeOut,
    Layout,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    HOMEBITE_LOGO,
    providerTheme as T,
} from "../../constants/providerTheme";
import { inr } from "../../services/provider/earnings";
import {
    DAYS,
    MENU,
    activeSubs,
    deletePlan,
    duplicatePlan,
    getMealPlans,
    getUpcomingMeals,
    isFull,
    itemById,
    makeDraftPlan,
    mealCount,
    planAnalytics,
    saveMealPlan,
    setPlanStatus,
    type MealPlan,
    type MealType,
    type PlanStatus,
    type UpcomingBlock,
} from "../../services/provider/mealPlans";

const MEAL_TYPES: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];
const STATUS_META: Record<
  PlanStatus,
  { label: string; fg: string; bg: string }
> = {
  draft: { label: "Draft", fg: T.textSecondary, bg: T.surfaceWarm },
  active: { label: "Active", fg: T.success, bg: T.successLight },
  paused: { label: "Paused", fg: T.warning, bg: T.warningLight },
  ended: { label: "Ended", fg: T.danger, bg: T.dangerLight },
};

export default function ProviderSubscriptionsScreen() {
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | PlanStatus>("all");
  const [editor, setEditor] = useState<MealPlan | null>(null);
  const [subsOf, setSubsOf] = useState<MealPlan | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, u] = await Promise.all([getMealPlans(), getUpcomingMeals()]);
      setPlans(p);
      setUpcoming(u);
    } catch {
      setError("Couldn't load your meal plans.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => planAnalytics(plans), [plans]);
  const visible =
    filter === "all" ? plans : plans.filter((p) => p.status === filter);

  const changeStatus = async (plan: MealPlan, status: PlanStatus) => {
    setPlans((ps) => ps.map((p) => (p.id === plan.id ? { ...p, status } : p)));
    try {
      await setPlanStatus(plan.id, status);
    } catch {
      load();
    }
  };

  const onDuplicate = async (plan: MealPlan) => {
    const copy = await duplicatePlan(plan.id);
    setPlans((ps) => [copy, ...ps]);
    Alert.alert(
      "Plan duplicated",
      `"${copy.name}" was created as a draft you can edit.`,
    );
  };

  const onDelete = (plan: MealPlan) => {
    const count = activeSubs(plan);
    if (count > 0) {
      Alert.alert(
        "This plan has subscribers",
        `${count} customer${count > 1 ? "s are" : " is"} subscribed. Deleting it will cut off their meals. Pausing the plan is usually the better move.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Pause instead",
            onPress: () => changeStatus(plan, "paused"),
          },
          {
            text: "Delete anyway",
            style: "destructive",
            onPress: async () => {
              await deletePlan(plan.id);
              setPlans((ps) => ps.filter((p) => p.id !== plan.id));
            },
          },
        ],
      );
      return;
    }
    Alert.alert("Delete plan?", `"${plan.name}" will be removed permanently.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deletePlan(plan.id);
          setPlans((ps) => ps.filter((p) => p.id !== plan.id));
        },
      },
    ]);
  };

  if (loading) return <Skeleton />;

  if (error)
    return (
      <SafeAreaView style={s.screen}>
        <View style={s.center}>
          <Ionicons
            name="cloud-offline-outline"
            size={54}
            color={T.textMuted}
          />
          <Text style={s.emptyTitle}>{error}</Text>
          <Pressable style={s.primaryBtn} onPress={load}>
            <Text style={s.primaryBtnText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={s.screen} edges={["top"]}>
      <View style={s.header}>
        <Image source={HOMEBITE_LOGO} style={s.logo} resizeMode="contain" />
        <Text style={s.headerTitle}>Meal Plans</Text>
        <Pressable hitSlop={12} onPress={() => setEditor(makeDraftPlan())}>
          <Ionicons name="add-circle" size={30} color={T.primary} />
        </Pressable>
      </View>

      {plans.length === 0 ? (
        <View style={s.center}>
          <Ionicons name="calendar-outline" size={64} color={T.textMuted} />
          <Text style={s.emptyTitle}>Create your first meal plan</Text>
          <Text style={[s.subtle, { textAlign: "center" }]}>
            Give customers an easy way to subscribe to your home-cooked meals.
          </Text>
          <Pressable
            style={s.primaryBtn}
            onPress={() => setEditor(makeDraftPlan())}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={s.primaryBtnText}>Create Meal Plan</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 56 }}
          showsVerticalScrollIndicator={false}
        >
          <StatsStrip stats={stats} />
          <UpcomingCard blocks={upcoming} />
          <AnalyticsCard stats={stats} />

          <View style={s.filterRow}>
            {(["all", "active", "draft", "paused", "ended"] as const).map(
              (f) => {
                const on = filter === f;
                return (
                  <Pressable
                    key={f}
                    onPress={() => setFilter(f)}
                    style={[s.tab, on && s.tabOn]}
                  >
                    <Text style={on ? s.tabTextOn : s.tabText}>
                      {f === "all" ? "All" : STATUS_META[f].label}
                    </Text>
                  </Pressable>
                );
              },
            )}
          </View>

          {visible.map((p, i) => (
            <PlanCard
              key={p.id}
              plan={p}
              index={i}
              onEdit={() => setEditor(p)}
              onSubscribers={() => setSubsOf(p)}
              onDuplicate={() => onDuplicate(p)}
              onDelete={() => onDelete(p)}
              onStatus={(st) => changeStatus(p, st)}
            />
          ))}
          {visible.length === 0 ? (
            <Text
              style={[
                s.subtle,
                { textAlign: "center", marginTop: T.spacing.xl },
              ]}
            >
              No plans in this state.
            </Text>
          ) : null}
        </ScrollView>
      )}

      <PlanEditor
        plan={editor}
        onClose={() => setEditor(null)}
        onSaved={(p) => {
          setPlans((ps) =>
            ps.some((x) => x.id === p.id)
              ? ps.map((x) => (x.id === p.id ? p : x))
              : [p, ...ps],
          );
          setEditor(null);
        }}
      />
      <SubscribersSheet plan={subsOf} onClose={() => setSubsOf(null)} />
    </SafeAreaView>
  );
}

/* ---------------- dashboard bits ---------------- */

function StatsStrip({ stats }: { stats: ReturnType<typeof planAnalytics> }) {
  const items = [
    {
      icon: "layers-outline" as const,
      value: String(stats.activePlans),
      label: "Active plans",
    },
    {
      icon: "people-outline" as const,
      value: String(stats.totalSubs),
      label: "Subscribers",
    },
    {
      icon: "cash-outline" as const,
      value: inr(stats.revenue),
      label: "Revenue",
    },
  ];
  return (
    <View style={s.statsRow}>
      {items.map((it, i) => (
        <Animated.View
          key={it.label}
          entering={FadeInDown.delay(i * 70)}
          style={[s.card, s.statCard]}
        >
          <Ionicons name={it.icon} size={19} color={T.primary} />
          <Text style={s.statValue}>{it.value}</Text>
          <Text style={s.subtle}>{it.label}</Text>
        </Animated.View>
      ))}
    </View>
  );
}

function UpcomingCard({ blocks }: { blocks: UpcomingBlock[] }) {
  const [openIdx, setOpenIdx] = useState(0);
  if (!blocks.length) return null;
  return (
    <Animated.View
      entering={FadeInDown.delay(160)}
      style={s.card}
      layout={Layout.springify()}
    >
      <Text style={s.cardTitle}>Upcoming subscription meals</Text>
      <Text style={s.subtle}>How much food you need to cook.</Text>
      {blocks.map((b, i) => {
        const open = openIdx === i;
        return (
          <View key={b.when + b.mealType} style={s.accordion}>
            <Pressable
              style={s.accordionHead}
              onPress={() => setOpenIdx(open ? -1 : i)}
            >
              <View style={{ flex: 1 }}>
                <Text style={s.rowValueLeft}>
                  {b.when} — {b.mealType}
                </Text>
                <Text style={s.subtle}>{b.totalMeals} subscription meals</Text>
              </View>
              <Ionicons
                name={open ? "chevron-up" : "chevron-down"}
                size={18}
                color={T.textMuted}
              />
            </Pressable>
            {open ? (
              <Animated.View entering={FadeIn} exiting={FadeOut}>
                {b.lines.map((l) => (
                  <View key={l.itemId} style={s.prepRow}>
                    <Image
                      source={{ uri: itemById(l.itemId)?.image }}
                      style={s.prepImg}
                    />
                    <Text
                      style={[
                        s.rowValueLeft,
                        { flex: 1, marginLeft: T.spacing.md },
                      ]}
                    >
                      {l.name}
                    </Text>
                    <Text style={s.prepServings}>{l.servings} servings</Text>
                  </View>
                ))}
              </Animated.View>
            ) : null}
          </View>
        );
      })}
    </Animated.View>
  );
}

function AnalyticsCard({ stats }: { stats: ReturnType<typeof planAnalytics> }) {
  return (
    <Animated.View entering={FadeInDown.delay(200)} style={s.card}>
      <Text style={s.cardTitle}>At a glance</Text>
      <View style={s.miniGrid}>
        <Mini
          label="New subscribers"
          value={`+${stats.growth}`}
          tint={T.success}
        />
        <Mini
          label="Cancelled"
          value={String(stats.cancelled)}
          tint={T.danger}
        />
        <Mini label="Drafts" value={String(stats.draftPlans)} tint={T.info} />
        <Mini
          label="Paused"
          value={String(stats.pausedPlans)}
          tint={T.warning}
        />
      </View>
      {stats.popular ? (
        <>
          <View style={s.divider} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="trophy-outline" size={18} color={T.warning} />
            <Text style={s.subtle}>Most popular:</Text>
            <Text style={s.rowValueLeft}>{stats.popular.name}</Text>
          </View>
        </>
      ) : null}
    </Animated.View>
  );
}

function Mini({
  label,
  value,
  tint,
}: {
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <View style={[s.miniBox, { borderLeftColor: tint }]}>
      <Text style={s.miniValue}>{value}</Text>
      <Text style={s.subtle}>{label}</Text>
    </View>
  );
}

/* ---------------- plan card ---------------- */

function PlanCard({
  plan,
  index,
  onEdit,
  onSubscribers,
  onDuplicate,
  onDelete,
  onStatus,
}: {
  plan: MealPlan;
  index: number;
  onEdit: () => void;
  onSubscribers: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onStatus: (s: PlanStatus) => void;
}) {
  const meta = STATUS_META[plan.status];
  const subs = activeSubs(plan);
  const pct = Math.min(subs / Math.max(plan.capacity, 1), 1);
  const full = isFull(plan);

  const moreActions = () =>
    Alert.alert(plan.name, "Manage this plan", [
      plan.status === "active"
        ? { text: "Pause plan", onPress: () => onStatus("paused") }
        : plan.status === "paused"
          ? { text: "Resume plan", onPress: () => onStatus("active") }
          : { text: "Publish plan", onPress: () => onStatus("active") },
      { text: "End plan", onPress: () => onStatus("ended") },
      { text: "Duplicate plan", onPress: onDuplicate },
      { text: "Delete plan", style: "destructive", onPress: onDelete },
      { text: "Cancel", style: "cancel" },
    ]);

  return (
    <Animated.View
      entering={FadeInDown.delay(60 * index).duration(380)}
      style={[s.card, { padding: 0, overflow: "hidden" }]}
    >
      <Image source={{ uri: plan.coverImage }} style={s.cover} />
      <View style={{ padding: T.spacing.lg }}>
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <View style={{ flex: 1 }}>
            <Text style={s.planName}>{plan.name || "Untitled plan"}</Text>
            <Text style={s.subtle} numberOfLines={2}>
              {plan.description || "No description yet."}
            </Text>
          </View>
          <Pressable hitSlop={12} onPress={moreActions}>
            <Ionicons name="ellipsis-vertical" size={20} color={T.textMuted} />
          </Pressable>
        </View>

        <View style={s.badgeRow}>
          <View style={[s.pill, { backgroundColor: meta.bg }]}>
            <Text style={[s.pillText, { color: meta.fg }]}>{meta.label}</Text>
          </View>
          {full ? (
            <View style={[s.pill, { backgroundColor: T.dangerLight }]}>
              <Text style={[s.pillText, { color: T.danger }]}>Full</Text>
            </View>
          ) : null}
          <View
            style={[
              s.pill,
              { backgroundColor: plan.veg ? T.successLight : T.dangerLight },
            ]}
          >
            <Text
              style={[s.pillText, { color: plan.veg ? T.success : T.danger }]}
            >
              {plan.veg ? "Veg" : "Non-veg"}
            </Text>
          </View>
          <View style={[s.pill, { backgroundColor: T.surfaceWarm }]}>
            <Text style={[s.pillText, { color: T.textSecondary }]}>
              {plan.duration}
            </Text>
          </View>
        </View>

        <View style={s.planMetaRow}>
          <Meta
            icon="pricetag-outline"
            text={`${inr(plan.price)} / ${plan.billingPeriod}`}
          />
          <Meta icon="restaurant-outline" text={`${mealCount(plan)} meals`} />
          <Meta icon="cash-outline" text={inr(plan.revenue)} />
        </View>

        <View style={{ marginTop: T.spacing.md }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={s.subtle}>Subscribers</Text>
            <Text style={s.rowValueLeft}>
              {subs} / {plan.capacity}
            </Text>
          </View>
          <View style={s.progressTrack}>
            <View
              style={[
                s.progressFill,
                {
                  width: `${pct * 100}%`,
                  backgroundColor: full ? T.danger : T.primary,
                },
              ]}
            />
          </View>
        </View>

        <View style={s.cardActions}>
          <Pressable
            style={({ pressed }) => [s.outlineBtn, pressed && { opacity: 0.7 }]}
            onPress={onSubscribers}
          >
            <Ionicons name="people-outline" size={17} color={T.primary} />
            <Text style={s.outlineBtnText}>Subscribers</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [s.outlineBtn, pressed && { opacity: 0.7 }]}
            onPress={onEdit}
          >
            <Ionicons name="create-outline" size={17} color={T.primary} />
            <Text style={s.outlineBtnText}>Edit</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

function Meta({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
      <Ionicons name={icon} size={15} color={T.textSecondary} />
      <Text style={s.subtle}>{text}</Text>
    </View>
  );
}

/* ---------------- editor (create / edit / publish) ---------------- */

type Step = 0 | 1 | 2 | 3;
const STEP_LABELS = ["Basics", "Menu", "Schedule", "Review"];

function PlanEditor({
  plan,
  onClose,
  onSaved,
}: {
  plan: MealPlan | null;
  onClose: () => void;
  onSaved: (p: MealPlan) => void;
}) {
  const [draft, setDraft] = useState<MealPlan | null>(plan);
  const [step, setStep] = useState<Step>(0);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setDraft(plan);
    setStep(0);
    setDone(false);
    setErrors({});
  }, [plan]);

  if (!plan || !draft) return <Modal visible={false} />;

  const hadSubscribers = activeSubs(plan) > 0;
  const set = <K extends keyof MealPlan>(k: K, v: MealPlan[K]) =>
    setDraft((d) => ({ ...(d as MealPlan), [k]: v }));

  const validateBasics = () => {
    const e: Record<string, string> = {};
    if (!draft.name.trim()) e.name = "Plan name is required";
    if (draft.description.trim().length < 20)
      e.description = "At least 20 characters";
    if (!draft.price || draft.price <= 0) e.price = "Enter a valid price";
    if (!draft.capacity || draft.capacity < 1)
      e.capacity = "At least 1 subscriber";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 0 && !validateBasics()) return;
    if (step === 1 && draft.itemIds.length === 0) {
      Alert.alert(
        "Pick some dishes",
        "Select at least one menu item for this plan.",
      );
      return;
    }
    setStep((step + 1) as Step);
  };

  const commit = async (status: PlanStatus) => {
    const finish = async () => {
      setSaving(true);
      try {
        const saved = await saveMealPlan({ ...draft, status });
        setDone(true);
        setTimeout(() => onSaved(saved), 800);
      } catch {
        Alert.alert("Couldn't save", "Please try again.");
      } finally {
        setSaving(false);
      }
    };

    const priceChanged = plan.price !== draft.price;
    const scheduleChanged = mealCount(plan) !== mealCount(draft);
    if (hadSubscribers && (priceChanged || scheduleChanged)) {
      Alert.alert(
        "This affects current subscribers",
        `${activeSubs(plan)} people are subscribed.${priceChanged ? " The price is changing." : ""}${scheduleChanged ? " The schedule is changing." : ""} Continue?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Continue", onPress: finish },
        ],
      );
      return;
    }
    finish();
  };

  const setDuration = (duration: MealPlan["duration"]) => {
    const weeksNeeded = duration === "monthly" ? 4 : 1;
    const weeks = Array.from({ length: weeksNeeded }).map(
      (_, i) =>
        draft.weeks[i] ?? {
          week: i + 1,
          days: DAYS.map((day) => ({ day, meals: [] })),
        },
    );
    setDraft({
      ...draft,
      duration,
      weeks,
      billingPeriod: duration === "monthly" ? "month" : "week",
    });
  };

  return (
    <Modal
      visible
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={s.screen} edges={["top"]}>
        <View style={s.header}>
          <Pressable hitSlop={12} onPress={onClose}>
            <Ionicons name="close" size={24} color={T.text} />
          </Pressable>
          <Text style={s.headerTitle}>
            {plan.name ? "Edit Plan" : "New Meal Plan"}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {done ? (
          <Animated.View entering={FadeIn} style={s.center}>
            <View style={s.successCircle}>
              <Ionicons name="checkmark" size={44} color="#fff" />
            </View>
            <Text style={s.emptyTitle}>Plan saved</Text>
          </Animated.View>
        ) : (
          <>
            <Stepper step={step} onStep={setStep} />
            <ScrollView
              contentContainerStyle={{
                padding: T.spacing.lg,
                paddingBottom: 40,
              }}
              keyboardShouldPersistTaps="handled"
            >
              {step === 0 ? (
                <BasicsStep
                  draft={draft}
                  set={set}
                  errors={errors}
                  setDuration={setDuration}
                />
              ) : null}
              {step === 1 ? <MenuStep draft={draft} set={set} /> : null}
              {step === 2 ? (
                <ScheduleStep draft={draft} setDraft={setDraft} />
              ) : null}
              {step === 3 ? <ReviewStep draft={draft} /> : null}
            </ScrollView>

            <View style={s.footer}>
              {step > 0 ? (
                <Pressable
                  style={s.outlineBtnLg}
                  onPress={() => setStep((step - 1) as Step)}
                >
                  <Text style={s.outlineBtnText}>Back</Text>
                </Pressable>
              ) : null}
              {step < 3 ? (
                <Pressable
                  style={({ pressed }) => [
                    s.primaryBtn,
                    { flex: 1, marginTop: 0, opacity: pressed ? 0.85 : 1 },
                  ]}
                  onPress={next}
                >
                  <Text style={s.primaryBtnText}>Continue</Text>
                </Pressable>
              ) : (
                <>
                  <Pressable
                    style={s.outlineBtnLg}
                    onPress={() => commit("draft")}
                    disabled={saving}
                  >
                    <Text style={s.outlineBtnText}>Save draft</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      s.primaryBtn,
                      { flex: 1, marginTop: 0, opacity: pressed ? 0.85 : 1 },
                    ]}
                    onPress={() => commit("active")}
                    disabled={saving}
                  >
                    {saving ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={s.primaryBtnText}>Publish Plan</Text>
                    )}
                  </Pressable>
                </>
              )}
            </View>
          </>
        )}
      </SafeAreaView>
    </Modal>
  );
}

function Stepper({ step, onStep }: { step: Step; onStep: (s: Step) => void }) {
  return (
    <View style={s.stepperRow}>
      {STEP_LABELS.map((l, i) => {
        const on = i === step,
          past = i < step;
        return (
          <Pressable
            key={l}
            onPress={() => past && onStep(i as Step)}
            style={{ flex: 1, alignItems: "center", gap: 4 }}
          >
            <View
              style={[
                s.stepDot,
                (on || past) && {
                  backgroundColor: T.primary,
                  borderColor: T.primary,
                },
              ]}
            >
              {past ? (
                <Ionicons name="checkmark" size={12} color="#fff" />
              ) : (
                <Text style={[s.stepDotText, on && { color: "#fff" }]}>
                  {i + 1}
                </Text>
              )}
            </View>
            <Text
              style={[
                s.subtle,
                on && { color: T.primary, fontFamily: T.fonts.semibold },
              ]}
            >
              {l}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function BasicsStep({
  draft,
  set,
  errors,
  setDuration,
}: {
  draft: MealPlan;
  set: <K extends keyof MealPlan>(k: K, v: MealPlan[K]) => void;
  errors: Record<string, string>;
  setDuration: (d: MealPlan["duration"]) => void;
}) {
  return (
    <Animated.View entering={FadeInDown.duration(300)}>
      <Image source={{ uri: draft.coverImage }} style={s.editorCover} />
      <Pressable
        style={s.ghostBtn}
        onPress={() =>
          Alert.alert(
            "Cover image",
            "Hook this to your image picker / menu photos.",
          )
        }
      >
        <Ionicons name="image-outline" size={18} color={T.primary} />
        <Text style={s.ghostBtnText}>Change cover image</Text>
      </Pressable>

      <Field label="Plan name" error={errors.name}>
        <TextInput
          style={s.input}
          value={draft.name}
          onChangeText={(v) => set("name", v)}
          placeholder="Weekly Lunch Plan"
          placeholderTextColor={T.textMuted}
        />
      </Field>

      <Field label="Description" error={errors.description}>
        <TextInput
          style={[s.input, { height: 96, textAlignVertical: "top" }]}
          multiline
          value={draft.description}
          onChangeText={(v) => set("description", v)}
          placeholder="What's included, how it's delivered..."
          placeholderTextColor={T.textMuted}
        />
      </Field>

      <Field label="Food category">
        <TextInput
          style={s.input}
          value={draft.category}
          onChangeText={(v) => set("category", v)}
          placeholderTextColor={T.textMuted}
        />
      </Field>

      <Field label="Cuisine">
        <TextInput
          style={s.input}
          value={draft.cuisine}
          onChangeText={(v) => set("cuisine", v)}
          placeholderTextColor={T.textMuted}
        />
      </Field>

      <View style={[s.row, { justifyContent: "space-between" }]}>
        <Text style={s.rowValueLeft}>Pure vegetarian</Text>
        <Switch
          value={draft.veg}
          onValueChange={(v) => set("veg", v)}
          trackColor={{ true: T.success, false: T.border }}
          thumbColor="#fff"
        />
      </View>

      <View style={s.divider} />

      <Field label="Duration">
        <View style={s.chipWrap}>
          {(["weekly", "monthly", "custom"] as const).map((d) => {
            const on = draft.duration === d;
            return (
              <Pressable
                key={d}
                onPress={() => setDuration(d)}
                style={[s.chip, on && s.chipOn]}
              >
                <Text style={on ? s.chipTextOn : s.chipText}>{d}</Text>
              </Pressable>
            );
          })}
        </View>
      </Field>

      <View style={{ flexDirection: "row", gap: T.spacing.md }}>
        <View style={{ flex: 1 }}>
          <Field
            label={`Price (per ${draft.billingPeriod})`}
            error={errors.price}
          >
            <TextInput
              style={s.input}
              keyboardType="number-pad"
              value={draft.price ? String(draft.price) : ""}
              onChangeText={(v) =>
                set("price", Number(v.replace(/\D/g, "")) || 0)
              }
              placeholder="700"
              placeholderTextColor={T.textMuted}
            />
          </Field>
        </View>
        <View style={{ flex: 1 }}>
          <Field label="Max subscribers" error={errors.capacity}>
            <TextInput
              style={s.input}
              keyboardType="number-pad"
              value={draft.capacity ? String(draft.capacity) : ""}
              onChangeText={(v) =>
                set("capacity", Number(v.replace(/\D/g, "")) || 0)
              }
              placeholder="20"
              placeholderTextColor={T.textMuted}
            />
          </Field>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: T.spacing.md }}>
        <View style={{ flex: 1 }}>
          <Field label="Start date">
            <TextInput
              style={s.input}
              value={draft.startDate}
              onChangeText={(v) => set("startDate", v)}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={T.textMuted}
            />
          </Field>
        </View>
        <View style={{ flex: 1 }}>
          <Field label="End date (optional)">
            <TextInput
              style={s.input}
              value={draft.endDate ?? ""}
              onChangeText={(v) => set("endDate", v || null)}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={T.textMuted}
            />
          </Field>
        </View>
      </View>
    </Animated.View>
  );
}

function MenuStep({
  draft,
  set,
}: {
  draft: MealPlan;
  set: <K extends keyof MealPlan>(k: K, v: MealPlan[K]) => void;
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const cats = ["All", ...Array.from(new Set(MENU.map((m) => m.category)))];

  const list = MENU.filter(
    (m) =>
      (cat === "All" || m.category === cat) &&
      m.name.toLowerCase().includes(q.toLowerCase()),
  );

  const toggle = (id: string) =>
    set(
      "itemIds",
      draft.itemIds.includes(id)
        ? draft.itemIds.filter((x) => x !== id)
        : [...draft.itemIds, id],
    );

  return (
    <Animated.View entering={FadeInDown.duration(300)}>
      <Text style={s.cardTitle}>Choose dishes for this plan</Text>
      <View style={s.searchWrap}>
        <Ionicons name="search" size={18} color={T.textMuted} />
        <TextInput
          style={s.searchInput}
          value={q}
          onChangeText={setQ}
          placeholder="Search your menu"
          placeholderTextColor={T.textMuted}
        />
      </View>
      <View style={[s.chipWrap, { marginBottom: T.spacing.lg }]}>
        {cats.map((c) => (
          <Pressable
            key={c}
            onPress={() => setCat(c)}
            style={[s.chip, cat === c && s.chipOn]}
          >
            <Text style={cat === c ? s.chipTextOn : s.chipText}>{c}</Text>
          </Pressable>
        ))}
      </View>

      {list.map((m, i) => {
        const on = draft.itemIds.includes(m.id);
        return (
          <Animated.View key={m.id} entering={FadeInDown.delay(i * 35)}>
            <Pressable
              style={[
                s.menuRow,
                on && {
                  borderColor: T.primary,
                  backgroundColor: T.primaryLight,
                },
              ]}
              onPress={() => toggle(m.id)}
            >
              <Image source={{ uri: m.image }} style={s.menuImg} />
              <View style={{ flex: 1, marginLeft: T.spacing.md }}>
                <Text style={s.rowValueLeft}>{m.name}</Text>
                <Text style={s.subtle}>
                  {m.category} · {inr(m.price)} · {m.veg ? "Veg" : "Non-veg"}
                </Text>
              </View>
              <Ionicons
                name={on ? "checkbox" : "square-outline"}
                size={22}
                color={on ? T.primary : T.textMuted}
              />
            </Pressable>
          </Animated.View>
        );
      })}
      {list.length === 0 ? (
        <Text
          style={[s.subtle, { textAlign: "center", marginTop: T.spacing.xl }]}
        >
          No dishes match.
        </Text>
      ) : null}

      <Text style={[s.subtle, { marginTop: T.spacing.lg }]}>
        {draft.itemIds.length} dish(es) selected
      </Text>
    </Animated.View>
  );
}

function ScheduleStep({
  draft,
  setDraft,
}: {
  draft: MealPlan;
  setDraft: (p: MealPlan) => void;
}) {
  const [openWeek, setOpenWeek] = useState(1);
  const [openDay, setOpenDay] = useState<string | null>(DAYS[0]);
  const selectable = draft.itemIds.map((id) => itemById(id)!).filter(Boolean);

  const updateDay = (
    week: number,
    day: string,
    fn: (
      meals: MealPlan["weeks"][0]["days"][0]["meals"],
    ) => MealPlan["weeks"][0]["days"][0]["meals"],
  ) =>
    setDraft({
      ...draft,
      weeks: draft.weeks.map((w) =>
        w.week !== week
          ? w
          : {
              ...w,
              days: w.days.map((d) =>
                d.day !== day ? d : { ...d, meals: fn(d.meals) },
              ),
            },
      ),
    });

  return (
    <Animated.View entering={FadeInDown.duration(300)}>
      <Text style={s.cardTitle}>
        {draft.duration === "monthly" ? "Monthly schedule" : "Weekly schedule"}
      </Text>
      <Text style={[s.subtle, { marginBottom: T.spacing.lg }]}>
        Decide what you'll cook each day.
      </Text>

      {draft.weeks.map((w) => {
        const wOpen = openWeek === w.week;
        return (
          <Animated.View
            key={w.week}
            layout={Layout.springify()}
            style={s.weekCard}
          >
            <Pressable
              style={s.accordionHead}
              onPress={() => setOpenWeek(wOpen ? -1 : w.week)}
            >
              <Text style={s.rowValueLeft}>Week {w.week}</Text>
              <Text
                style={[
                  s.subtle,
                  { marginLeft: "auto", marginRight: T.spacing.sm },
                ]}
              >
                {w.days.reduce((n, d) => n + d.meals.length, 0)} meals
              </Text>
              <Ionicons
                name={wOpen ? "chevron-up" : "chevron-down"}
                size={18}
                color={T.textMuted}
              />
            </Pressable>

            {wOpen ? (
              <Animated.View entering={FadeIn} exiting={FadeOut}>
                {w.days.map((d) => {
                  const dOpen =
                    openDay === `${w.week}-${d.day}` || openDay === d.day;
                  return (
                    <View key={d.day} style={s.dayBlock}>
                      <Pressable
                        style={s.accordionHead}
                        onPress={() =>
                          setOpenDay(dOpen ? null : `${w.week}-${d.day}`)
                        }
                      >
                        <Text style={s.dayName}>{d.day}</Text>
                        <Text
                          style={[
                            s.subtle,
                            { marginLeft: "auto", marginRight: T.spacing.sm },
                          ]}
                        >
                          {d.meals.length
                            ? `${d.meals.length} meal(s)`
                            : "Rest day"}
                        </Text>
                        <Ionicons
                          name={dOpen ? "remove" : "add"}
                          size={18}
                          color={T.primary}
                        />
                      </Pressable>

                      {dOpen ? (
                        <Animated.View entering={FadeIn} exiting={FadeOut}>
                          {d.meals.map((meal) => (
                            <View key={meal.id} style={s.mealBox}>
                              <View style={s.chipWrap}>
                                {MEAL_TYPES.map((mt) => (
                                  <Pressable
                                    key={mt}
                                    onPress={() =>
                                      updateDay(w.week, d.day, (ms) =>
                                        ms.map((m) =>
                                          m.id === meal.id
                                            ? { ...m, mealType: mt }
                                            : m,
                                        ),
                                      )
                                    }
                                    style={[
                                      s.chipSm,
                                      meal.mealType === mt && s.chipOn,
                                    ]}
                                  >
                                    <Text
                                      style={
                                        meal.mealType === mt
                                          ? s.chipTextOn
                                          : s.chipText
                                      }
                                    >
                                      {mt}
                                    </Text>
                                  </Pressable>
                                ))}
                                <Pressable
                                  hitSlop={8}
                                  style={{ marginLeft: "auto" }}
                                  onPress={() =>
                                    updateDay(w.week, d.day, (ms) =>
                                      ms.filter((m) => m.id !== meal.id),
                                    )
                                  }
                                >
                                  <Ionicons
                                    name="trash-outline"
                                    size={18}
                                    color={T.danger}
                                  />
                                </Pressable>
                              </View>

                              <Text
                                style={[s.label, { marginTop: T.spacing.md }]}
                              >
                                Dishes
                              </Text>
                              <View style={s.chipWrap}>
                                {selectable.map((it) => {
                                  const on = meal.itemIds.includes(it.id);
                                  return (
                                    <Pressable
                                      key={it.id}
                                      onPress={() =>
                                        updateDay(w.week, d.day, (ms) =>
                                          ms.map((m) =>
                                            m.id !== meal.id
                                              ? m
                                              : {
                                                  ...m,
                                                  itemIds: on
                                                    ? m.itemIds.filter(
                                                        (x) => x !== it.id,
                                                      )
                                                    : [...m.itemIds, it.id],
                                                },
                                          ),
                                        )
                                      }
                                      style={[s.chipSm, on && s.chipOn]}
                                    >
                                      <Text
                                        style={on ? s.chipTextOn : s.chipText}
                                      >
                                        {it.name}
                                      </Text>
                                    </Pressable>
                                  );
                                })}
                              </View>

                              <Text
                                style={[s.label, { marginTop: T.spacing.md }]}
                              >
                                Servings
                              </Text>
                              <View style={s.chipWrap}>
                                {([1, 2, 4] as const).map((sv) => (
                                  <Pressable
                                    key={sv}
                                    onPress={() =>
                                      updateDay(w.week, d.day, (ms) =>
                                        ms.map((m) =>
                                          m.id === meal.id
                                            ? { ...m, servings: sv }
                                            : m,
                                        ),
                                      )
                                    }
                                    style={[
                                      s.chipSm,
                                      meal.servings === sv && s.chipOn,
                                    ]}
                                  >
                                    <Text
                                      style={
                                        meal.servings === sv
                                          ? s.chipTextOn
                                          : s.chipText
                                      }
                                    >
                                      {sv === 4
                                        ? "Family portion"
                                        : `${sv} serving${sv > 1 ? "s" : ""}`}
                                    </Text>
                                  </Pressable>
                                ))}
                              </View>
                            </View>
                          ))}

                          <Pressable
                            style={s.ghostBtn}
                            onPress={() =>
                              updateDay(w.week, d.day, (ms) => [
                                ...ms,
                                {
                                  id: Math.random().toString(36).slice(2, 8),
                                  mealType: "Lunch",
                                  itemIds: [],
                                  servings: 1,
                                },
                              ])
                            }
                          >
                            <Ionicons name="add" size={18} color={T.primary} />
                            <Text style={s.ghostBtnText}>
                              Add meal to {d.day}
                            </Text>
                          </Pressable>
                        </Animated.View>
                      ) : null}
                    </View>
                  );
                })}
              </Animated.View>
            ) : null}
          </Animated.View>
        );
      })}

      {draft.duration !== "weekly" ? (
        <Pressable
          style={s.ghostBtn}
          onPress={() =>
            setDraft({
              ...draft,
              weeks: [
                ...draft.weeks,
                {
                  week: draft.weeks.length + 1,
                  days: DAYS.map((day) => ({ day, meals: [] })),
                },
              ],
            })
          }
        >
          <Ionicons name="add-circle-outline" size={18} color={T.primary} />
          <Text style={s.ghostBtnText}>Add another week</Text>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}

function ReviewStep({ draft }: { draft: MealPlan }) {
  return (
    <Animated.View entering={FadeInDown.duration(300)}>
      <Image source={{ uri: draft.coverImage }} style={s.editorCover} />
      <Text style={s.planName}>{draft.name}</Text>
      <Text style={s.subtle}>{draft.description}</Text>
      <View style={s.divider} />
      {[
        ["Price", `${inr(draft.price)} / ${draft.billingPeriod}`],
        ["Duration", draft.duration],
        ["Total meals", `${mealCount(draft)}`],
        ["Dishes included", `${draft.itemIds.length}`],
        ["Capacity", `${draft.capacity} subscribers`],
        ["Start date", draft.startDate],
        ["End date", draft.endDate ?? "Ongoing"],
        ["Diet", draft.veg ? "Pure veg" : "Includes non-veg"],
      ].map(([l, v]) => (
        <View key={l} style={s.breakRow}>
          <Text style={s.subtle}>{l}</Text>
          <Text style={s.rowValueLeft}>{v}</Text>
        </View>
      ))}
      <View style={s.divider} />
      <Text style={s.cardTitle}>Schedule</Text>
      {draft.weeks.map((w) => (
        <View key={w.week} style={{ marginBottom: T.spacing.md }}>
          <Text style={s.dayName}>Week {w.week}</Text>
          {w.days
            .filter((d) => d.meals.length)
            .map((d) => (
              <View key={d.day} style={s.breakRow}>
                <Text style={s.subtle}>{d.day}</Text>
                <Text
                  style={[
                    s.rowValueLeft,
                    { maxWidth: "65%", textAlign: "right" },
                  ]}
                >
                  {d.meals
                    .map(
                      (m) =>
                        `${m.mealType}: ${
                          m.itemIds
                            .map((i) => itemById(i)?.name)
                            .filter(Boolean)
                            .join(" + ") || "—"
                        }`,
                    )
                    .join("  |  ")}
                </Text>
              </View>
            ))}
          {w.days.every((d) => !d.meals.length) ? (
            <Text style={s.subtle}>No meals set for this week.</Text>
          ) : null}
        </View>
      ))}
    </Animated.View>
  );
}

/* ---------------- subscribers ---------------- */

function SubscribersSheet({
  plan,
  onClose,
}: {
  plan: MealPlan | null;
  onClose: () => void;
}) {
  const [filter, setFilter] = useState<
    "all" | "active" | "paused" | "cancelled" | "completed"
  >("all");
  if (!plan) return <Modal visible={false} />;
  const list =
    filter === "all"
      ? plan.subscribers
      : plan.subscribers.filter((x) => x.status === filter);
  const tint: Record<string, { fg: string; bg: string }> = {
    active: { fg: T.success, bg: T.successLight },
    paused: { fg: T.warning, bg: T.warningLight },
    cancelled: { fg: T.danger, bg: T.dangerLight },
    completed: { fg: T.info, bg: T.infoLight },
  };

  return (
    <Modal
      visible
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={s.screen} edges={["top"]}>
        <View style={s.header}>
          <Pressable hitSlop={12} onPress={onClose}>
            <Ionicons name="close" size={24} color={T.text} />
          </Pressable>
          <Text style={s.headerTitle}>Subscribers</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={[s.card, { marginTop: 0 }]}>
          <Text style={s.planName}>{plan.name}</Text>
          <View style={s.planMetaRow}>
            <Meta icon="people-outline" text={`${activeSubs(plan)} active`} />
            <Meta
              icon="albums-outline"
              text={`${plan.subscribers.length} total`}
            />
            <Meta icon="cash-outline" text={inr(plan.revenue)} />
          </View>
          <View style={s.planMetaRow}>
            <Meta
              icon="trending-up-outline"
              text={`+${plan.newSubscribers} new`}
            />
            <Meta
              icon="close-circle-outline"
              text={`${plan.cancelledSubscribers} cancelled`}
            />
          </View>
        </View>

        <View style={s.filterRow}>
          {(["all", "active", "paused", "cancelled", "completed"] as const).map(
            (f) => (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={[s.tab, filter === f && s.tabOn]}
              >
                <Text style={filter === f ? s.tabTextOn : s.tabText}>
                  {f[0].toUpperCase() + f.slice(1)}
                </Text>
              </Pressable>
            ),
          )}
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: T.spacing.lg,
            paddingBottom: 40,
          }}
        >
          {list.map((sub, i) => (
            <Animated.View
              key={sub.id}
              entering={FadeInDown.delay(i * 30)}
              style={s.subRow}
            >
              <View style={s.subAvatar}>
                <Text style={s.subAvatarText}>{sub.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: T.spacing.md }}>
                <Text style={s.rowValueLeft}>{sub.name}</Text>
                <Text style={s.subtle}>
                  Since {sub.startDate} · {sub.nextMeal}
                </Text>
              </View>
              <View style={[s.pill, { backgroundColor: tint[sub.status].bg }]}>
                <Text style={[s.pillText, { color: tint[sub.status].fg }]}>
                  {sub.status}
                </Text>
              </View>
            </Animated.View>
          ))}
          {list.length === 0 ? (
            <View
              style={{
                alignItems: "center",
                marginTop: T.spacing.huge,
                gap: T.spacing.sm,
              }}
            >
              <Ionicons name="people-outline" size={54} color={T.textMuted} />
              <Text style={s.emptyTitle}>No subscribers here yet</Text>
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: T.spacing.lg }}>
      <Text style={s.label}>{label}</Text>
      {children}
      {error ? (
        <Animated.Text entering={FadeIn} style={s.error}>
          {error}
        </Animated.Text>
      ) : null}
    </View>
  );
}

function Skeleton() {
  return (
    <SafeAreaView style={s.screen} edges={["top"]}>
      <View style={s.header}>
        <Image source={HOMEBITE_LOGO} style={s.logo} resizeMode="contain" />
        <Text style={s.headerTitle}>Meal Plans</Text>
        <View style={{ width: 30 }} />
      </View>
      {[90, 160, 200, 200].map((h, i) => (
        <Animated.View
          key={i}
          entering={FadeIn.delay(i * 90)}
          style={[s.card, { height: h, backgroundColor: T.surfaceWarm }]}
        />
      ))}
    </SafeAreaView>
  );
}

/* ---------------- styles ---------------- */

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
  cardTitle: {
    fontFamily: T.fonts.semibold,
    fontSize: T.typography.bodyLarge,
    color: T.text,
    marginBottom: T.spacing.xs,
  },
  subtle: {
    fontFamily: T.fonts.regular,
    fontSize: T.typography.caption,
    color: T.textSecondary,
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: T.spacing.md,
  },

  statsRow: { flexDirection: "row", paddingHorizontal: T.spacing.lg - 6 },
  statCard: { flex: 1, marginHorizontal: 6, alignItems: "center", gap: 2 },
  statValue: {
    fontFamily: T.fonts.bold,
    fontSize: T.typography.body,
    color: T.text,
  },

  accordion: {
    borderTopWidth: 1,
    borderTopColor: T.divider,
    marginTop: T.spacing.sm,
  },
  accordionHead: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: T.spacing.md,
  },
  prepRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: T.spacing.sm,
  },
  prepImg: {
    width: 38,
    height: 38,
    borderRadius: T.radius.sm,
    backgroundColor: T.surfaceWarm,
  },
  prepServings: {
    fontFamily: T.fonts.bold,
    fontSize: T.typography.bodySmall,
    color: T.primary,
  },

  miniGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: T.spacing.md,
    marginTop: T.spacing.sm,
  },
  miniBox: {
    width: "46%",
    backgroundColor: T.surfaceWarm,
    borderRadius: T.radius.md,
    padding: T.spacing.md,
    borderLeftWidth: 3,
    gap: 2,
  },
  miniValue: {
    fontFamily: T.fonts.bold,
    fontSize: T.typography.body,
    color: T.text,
  },

  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: T.spacing.sm,
    paddingHorizontal: T.spacing.lg,
    marginBottom: T.spacing.md,
  },
  tab: {
    paddingHorizontal: T.spacing.md,
    paddingVertical: 6,
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

  cover: { width: "100%", height: 132, backgroundColor: T.surfaceWarm },
  editorCover: {
    width: "100%",
    height: 150,
    borderRadius: T.radius.lg,
    backgroundColor: T.surfaceWarm,
  },
  planName: {
    fontFamily: T.fonts.bold,
    fontSize: T.typography.subheading,
    color: T.text,
    marginBottom: 2,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: T.spacing.sm,
    marginTop: T.spacing.md,
  },
  planMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: T.spacing.lg,
    marginTop: T.spacing.md,
  },

  progressTrack: {
    height: 7,
    borderRadius: T.radius.pill,
    backgroundColor: T.surfaceWarm,
    marginTop: 6,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: T.radius.pill },

  cardActions: {
    flexDirection: "row",
    gap: T.spacing.md,
    marginTop: T.spacing.lg,
  },
  outlineBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: T.spacing.md,
    borderRadius: T.radius.md,
    borderWidth: 1,
    borderColor: T.primary,
    backgroundColor: T.primaryLight,
  },
  outlineBtnLg: {
    paddingVertical: T.spacing.lg,
    paddingHorizontal: T.spacing.xl,
    borderRadius: T.radius.md,
    borderWidth: 1,
    borderColor: T.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineBtnText: {
    fontFamily: T.fonts.semibold,
    fontSize: T.typography.bodySmall,
    color: T.primary,
  },

  pill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: T.radius.pill,
  },
  pillText: {
    fontFamily: T.fonts.semibold,
    fontSize: 11,
    textTransform: "capitalize",
  },

  stepperRow: {
    flexDirection: "row",
    paddingHorizontal: T.spacing.lg,
    paddingBottom: T.spacing.md,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: T.radius.pill,
    borderWidth: 1.5,
    borderColor: T.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: T.surface,
  },
  stepDotText: {
    fontFamily: T.fonts.semibold,
    fontSize: 11,
    color: T.textSecondary,
  },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: T.radius.md,
    paddingHorizontal: T.spacing.md,
    backgroundColor: T.surface,
    marginBottom: T.spacing.md,
  },
  searchInput: {
    flex: 1,
    paddingVertical: T.spacing.md,
    fontFamily: T.fonts.regular,
    fontSize: T.typography.bodySmall,
    color: T.text,
  },

  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: T.spacing.md,
    borderRadius: T.radius.md,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: T.surface,
    marginBottom: T.spacing.md,
  },
  menuImg: {
    width: 46,
    height: 46,
    borderRadius: T.radius.sm,
    backgroundColor: T.surfaceWarm,
  },

  weekCard: {
    backgroundColor: T.surface,
    borderRadius: T.radius.lg,
    borderWidth: 1,
    borderColor: T.border,
    paddingHorizontal: T.spacing.lg,
    marginBottom: T.spacing.md,
  },
  dayBlock: { borderTopWidth: 1, borderTopColor: T.divider },
  dayName: {
    fontFamily: T.fonts.semibold,
    fontSize: T.typography.bodySmall,
    color: T.text,
  },
  mealBox: {
    backgroundColor: T.surfaceWarm,
    borderRadius: T.radius.md,
    padding: T.spacing.md,
    marginBottom: T.spacing.md,
  },

  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: T.spacing.sm,
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: T.spacing.md,
    paddingVertical: 7,
    borderRadius: T.radius.pill,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: T.surfaceWarm,
  },
  chipSm: {
    paddingHorizontal: T.spacing.md,
    paddingVertical: 5,
    borderRadius: T.radius.pill,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: T.surface,
  },
  chipOn: { borderColor: T.primary, backgroundColor: T.primaryLight },
  chipText: {
    fontFamily: T.fonts.medium,
    fontSize: T.typography.caption,
    color: T.textSecondary,
    textTransform: "capitalize",
  },
  chipTextOn: {
    fontFamily: T.fonts.semibold,
    fontSize: T.typography.caption,
    color: T.primary,
    textTransform: "capitalize",
  },

  breakRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: T.spacing.sm,
    gap: T.spacing.md,
  },

  label: {
    fontFamily: T.fonts.medium,
    fontSize: T.typography.caption,
    color: T.textSecondary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: T.radius.md,
    backgroundColor: T.surface,
    paddingHorizontal: T.spacing.lg,
    paddingVertical: T.spacing.md,
    fontFamily: T.fonts.regular,
    fontSize: T.typography.bodySmall,
    color: T.text,
  },
  error: {
    fontFamily: T.fonts.medium,
    fontSize: T.typography.caption,
    color: T.danger,
    marginTop: 5,
  },

  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: T.primary,
    borderRadius: T.radius.md,
    paddingVertical: T.spacing.lg,
    paddingHorizontal: T.spacing.xl,
    marginTop: T.spacing.md,
  },
  primaryBtnText: {
    fontFamily: T.fonts.semibold,
    fontSize: T.typography.body,
    color: "#fff",
  },
  ghostBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: T.spacing.md,
  },
  ghostBtnText: {
    fontFamily: T.fonts.semibold,
    fontSize: T.typography.bodySmall,
    color: T.primary,
  },

  footer: {
    flexDirection: "row",
    gap: T.spacing.md,
    padding: T.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: T.divider,
    backgroundColor: T.surface,
  },

  subRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: T.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: T.divider,
  },
  subAvatar: {
    width: 40,
    height: 40,
    borderRadius: T.radius.pill,
    backgroundColor: T.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  subAvatarText: {
    fontFamily: T.fonts.bold,
    fontSize: T.typography.body,
    color: T.primary,
  },

  emptyTitle: {
    fontFamily: T.fonts.semibold,
    fontSize: T.typography.bodyLarge,
    color: T.text,
    textAlign: "center",
  },
  successCircle: {
    width: 82,
    height: 82,
    borderRadius: T.radius.pill,
    backgroundColor: T.success,
    alignItems: "center",
    justifyContent: "center",
  },
});
