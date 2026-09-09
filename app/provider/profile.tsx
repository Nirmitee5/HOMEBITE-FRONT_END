// app/provider/profile.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
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
    providerTypeLabel,
} from "../../constants/providerTheme";
import {
    CUISINE_OPTIONS,
    MEAL_TYPE_OPTIONS,
    SPECIALTY_OPTIONS,
    getProviderProfile,
    updateProviderProfile,
    uploadProfilePhoto,
    validateProfile,
    type ProviderProfile,
    type ValidationErrors,
} from "../../services/provider/profile";

export default function ProviderProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProfile(await getProviderProfile());
    } catch {
      setError("Couldn't load your profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <ProfileSkeleton />;

  if (error || !profile)
    return (
      <SafeAreaView style={s.screen}>
        <View style={s.center}>
          <Ionicons
            name="cloud-offline-outline"
            size={54}
            color={T.textMuted}
          />
          <Text style={s.emptyTitle}>{error ?? "Profile unavailable"}</Text>
          <Pressable style={s.primaryBtn} onPress={load}>
            <Text style={s.primaryBtnText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={s.screen} edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <ProfileHero
          profile={profile}
          onEdit={() => setEditing(true)}
          onPhoto={(uri) => setProfile({ ...profile, photo: uri })}
        />
        <StatsRow profile={profile} />
        <AboutCard profile={profile} />
        <SpecialtiesCard profile={profile} />
        <AvailabilityCard
          profile={profile}
          onChange={(availability) => {
            setProfile({ ...profile, availability });
            updateProviderProfile({ availability }).catch(() => {});
          }}
        />
        <NotificationsCard
          profile={profile}
          onChange={(notifications) => {
            setProfile({ ...profile, notifications });
            updateProviderProfile({ notifications }).catch(() => {});
          }}
        />
        <SettingsCard onLogout={() => confirmLogout(router)} />
      </ScrollView>

      <EditProfileSheet
        visible={editing}
        profile={profile}
        onClose={() => setEditing(false)}
        onSaved={(p) => {
          setProfile(p);
          setEditing(false);
        }}
      />
    </SafeAreaView>
  );
}

/* ---------------- header ---------------- */

function Header() {
  return (
    <View style={s.header}>
      <Image source={HOMEBITE_LOGO} style={s.logo} resizeMode="contain" />
      <Text style={s.headerTitle}>My Profile</Text>
      <View style={{ width: 34 }} />
    </View>
  );
}

/* ---------------- hero + photo ---------------- */

function ProfileHero({
  profile,
  onEdit,
  onPhoto,
}: {
  profile: ProviderProfile;
  onEdit: () => void;
  onPhoto: (uri: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const pick = async (mode: "camera" | "gallery") => {
    let ImagePicker: any;
    try {
      ImagePicker = require("expo-image-picker");
    } catch {
      Alert.alert(
        "Photo picker missing",
        "Run: npx expo install expo-image-picker",
      );
      return;
    }
    const perm =
      mode === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Allow access to update your photo.");
      return;
    }

    const res =
      mode === "camera"
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
    if (res.canceled) return;

    const uri = res.assets[0].uri;
    setUploading(true);
    try {
      onPhoto(await uploadProfilePhoto(uri));
    } catch {
      Alert.alert("Upload failed", "Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const choose = () =>
    Alert.alert("Profile photo", "Choose a source", [
      { text: "Take photo", onPress: () => pick("camera") },
      { text: "Choose from gallery", onPress: () => pick("gallery") },
      { text: "Cancel", style: "cancel" },
    ]);

  const status = {
    approved: {
      label: "Verified provider",
      icon: "checkmark-circle" as const,
      fg: T.success,
      bg: T.successLight,
    },
    pending: {
      label: "Approval pending",
      icon: "time-outline" as const,
      fg: T.warning,
      bg: T.warningLight,
    },
    under_review: {
      label: "Under review",
      icon: "search-outline" as const,
      fg: T.info,
      bg: T.infoLight,
    },
    rejected: {
      label: "Application rejected",
      icon: "close-circle" as const,
      fg: T.danger,
      bg: T.dangerLight,
    },
  }[profile.approvalStatus];

  return (
    <Animated.View
      entering={FadeInDown.duration(380)}
      style={[s.card, s.heroCard]}
    >
      <Pressable onPress={choose} style={s.avatarWrap}>
        {profile.photo ? (
          <Image source={{ uri: profile.photo }} style={s.avatar} />
        ) : (
          <View style={[s.avatar, s.avatarFallback]}>
            <Text style={s.avatarLetter}>
              {profile.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={s.cameraBadge}>
          {uploading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="camera" size={14} color="#fff" />
          )}
        </View>
      </Pressable>

      <Text style={s.name}>{profile.name}</Text>
      <Text style={s.subtle}>
        {providerTypeLabel[profile.providerType]} · {profile.location}
      </Text>

      <View style={[s.statusPill, { backgroundColor: status.bg }]}>
        <Ionicons name={status.icon} size={14} color={status.fg} />
        <Text style={[s.statusText, { color: status.fg }]}>{status.label}</Text>
      </View>

      <View style={s.ratingRow}>
        <Ionicons name="star" size={16} color={T.warning} />
        <Text style={s.rating}>{profile.rating.toFixed(1)}</Text>
        <Text style={s.subtle}>({profile.reviewCount} reviews)</Text>
        <Text style={[s.subtle, { marginLeft: T.spacing.md }]}>
          Since {profile.memberSince}
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          s.primaryBtn,
          { width: "100%", opacity: pressed ? 0.85 : 1 },
        ]}
        onPress={onEdit}
      >
        <Ionicons name="create-outline" size={18} color="#fff" />
        <Text style={s.primaryBtnText}>Edit Profile</Text>
      </Pressable>
    </Animated.View>
  );
}

/* ---------------- stats ---------------- */

function StatsRow({ profile }: { profile: ProviderProfile }) {
  const items = [
    {
      icon: "restaurant-outline" as const,
      value: profile.dishCount,
      label: "Dishes",
    },
    {
      icon: "calendar-outline" as const,
      value: profile.activePlans,
      label: "Meal plans",
    },
    {
      icon: "people-outline" as const,
      value: profile.activeSubscribers,
      label: "Subscribers",
    },
  ];
  return (
    <View style={s.statsRow}>
      {items.map((it, i) => (
        <Animated.View
          key={it.label}
          entering={FadeInDown.delay(80 * i).duration(350)}
          style={[s.card, s.statCard]}
        >
          <Ionicons name={it.icon} size={20} color={T.primary} />
          <Text style={s.statValue}>{it.value}</Text>
          <Text style={s.statLabel}>{it.label}</Text>
        </Animated.View>
      ))}
    </View>
  );
}

function AboutCard({ profile }: { profile: ProviderProfile }) {
  return (
    <Animated.View entering={FadeInDown.delay(140)} style={s.card}>
      <Text style={s.cardTitle}>About</Text>
      {profile.bio ? (
        <Text style={s.body}>{profile.bio}</Text>
      ) : (
        <Text style={s.subtle}>
          Add a short bio so customers know your food.
        </Text>
      )}
      <View style={s.divider} />
      <Row icon="call-outline" label="Phone" value={profile.phone} />
      <Row icon="mail-outline" label="Email" value={profile.email} />
      <Row icon="location-outline" label="Location" value={profile.location} />
      <Row
        icon="fast-food-outline"
        label="Meal types"
        value={profile.mealTypes.join(", ") || "—"}
      />
    </Animated.View>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <View style={s.row}>
      <Ionicons name={icon} size={18} color={T.textSecondary} />
      <Text style={[s.subtle, { flex: 1, marginLeft: T.spacing.md }]}>
        {label}
      </Text>
      <Text style={s.rowValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function SpecialtiesCard({ profile }: { profile: ProviderProfile }) {
  return (
    <Animated.View entering={FadeInDown.delay(180)} style={s.card}>
      <Text style={s.cardTitle}>Food specialties</Text>
      <View style={s.chipWrap}>
        {profile.specialties.length ? (
          profile.specialties.map((sp) => (
            <View key={sp} style={[s.chip, s.chipOn]}>
              <Text style={s.chipTextOn}>{sp}</Text>
            </View>
          ))
        ) : (
          <Text style={s.subtle}>No specialties added yet.</Text>
        )}
      </View>
      <Text style={[s.cardTitle, { marginTop: T.spacing.lg }]}>Cuisines</Text>
      <View style={s.chipWrap}>
        {profile.cuisines.map((c) => (
          <View key={c} style={s.chip}>
            <Text style={s.chipText}>{c}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

/* ---------------- availability ---------------- */

function AvailabilityCard({
  profile,
  onChange,
}: {
  profile: ProviderProfile;
  onChange: (a: ProviderProfile["availability"]) => void;
}) {
  const a = profile.availability;
  const toggle = (key: "isAvailable" | "breakfast" | "lunch" | "dinner") =>
    onChange({ ...a, [key]: !a[key] });

  return (
    <Animated.View
      entering={FadeInDown.delay(220)}
      style={s.card}
      layout={Layout.springify()}
    >
      <View style={s.cardHeadRow}>
        <Text style={s.cardTitle}>Availability</Text>
        <View
          style={[
            s.statusPill,
            {
              backgroundColor: a.isAvailable ? T.successLight : T.dangerLight,
              marginTop: 0,
            },
          ]}
        >
          <Text
            style={[
              s.statusText,
              { color: a.isAvailable ? T.success : T.danger },
            ]}
          >
            {a.isAvailable ? "Accepting orders" : "Not accepting"}
          </Text>
        </View>
      </View>

      <ToggleRow
        label="Available for orders"
        value={a.isAvailable}
        onChange={() => toggle("isAvailable")}
      />
      <View style={s.divider} />
      <ToggleRow
        label="Breakfast"
        value={a.breakfast}
        onChange={() => toggle("breakfast")}
        disabled={!a.isAvailable}
      />
      <ToggleRow
        label="Lunch"
        value={a.lunch}
        onChange={() => toggle("lunch")}
        disabled={!a.isAvailable}
      />
      <ToggleRow
        label="Dinner"
        value={a.dinner}
        onChange={() => toggle("dinner")}
        disabled={!a.isAvailable}
      />

      <View style={s.divider} />
      <Text style={[s.cardTitle, { fontSize: T.typography.bodySmall }]}>
        Delivery time slots
      </Text>
      {a.slots.map((slot) => (
        <Animated.View
          key={slot.id}
          entering={FadeIn}
          exiting={FadeOut}
          style={s.slotRow}
        >
          <Ionicons name="time-outline" size={18} color={T.primary} />
          <View style={{ flex: 1, marginLeft: T.spacing.md }}>
            <Text style={s.rowValue}>{slot.label}</Text>
            <Text style={s.subtle}>
              {slot.from} – {slot.to}
            </Text>
          </View>
          <Pressable
            hitSlop={10}
            onPress={() =>
              onChange({ ...a, slots: a.slots.filter((x) => x.id !== slot.id) })
            }
          >
            <Ionicons name="trash-outline" size={18} color={T.danger} />
          </Pressable>
        </Animated.View>
      ))}
      <Pressable
        style={s.ghostBtn}
        onPress={() =>
          onChange({
            ...a,
            slots: [
              ...a.slots,
              {
                id: Math.random().toString(36).slice(2, 7),
                label: "New slot",
                from: "09:00",
                to: "11:00",
              },
            ],
          })
        }
      >
        <Ionicons name="add" size={18} color={T.primary} />
        <Text style={s.ghostBtnText}>Add time slot</Text>
      </Pressable>
    </Animated.View>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <View style={[s.row, disabled && { opacity: 0.45 }]}>
      <Text style={[s.rowValue, { flex: 1, textAlign: "left" }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ true: T.primary, false: T.border }}
        thumbColor="#fff"
      />
    </View>
  );
}

function NotificationsCard({
  profile,
  onChange,
}: {
  profile: ProviderProfile;
  onChange: (n: ProviderProfile["notifications"]) => void;
}) {
  const n = profile.notifications;
  return (
    <Animated.View entering={FadeInDown.delay(260)} style={s.card}>
      <Text style={s.cardTitle}>Notifications</Text>
      <ToggleRow
        label="Order notifications"
        value={n.orders}
        onChange={() => onChange({ ...n, orders: !n.orders })}
      />
      <ToggleRow
        label="Subscription notifications"
        value={n.subscriptions}
        onChange={() => onChange({ ...n, subscriptions: !n.subscriptions })}
      />
      <ToggleRow
        label="Offers & promotions"
        value={n.promotions}
        onChange={() => onChange({ ...n, promotions: !n.promotions })}
      />
    </Animated.View>
  );
}

function SettingsCard({ onLogout }: { onLogout: () => void }) {
  const items = [
    { icon: "settings-outline" as const, label: "Account settings" },
    { icon: "help-circle-outline" as const, label: "Help & support" },
    { icon: "shield-checkmark-outline" as const, label: "Privacy" },
  ];
  return (
    <Animated.View entering={FadeInDown.delay(300)} style={s.card}>
      {items.map((it, i) => (
        <Pressable
          key={it.label}
          style={({ pressed }) => [s.row, pressed && { opacity: 0.6 }]}
          onPress={() => Alert.alert(it.label, "Coming soon.")}
        >
          <Ionicons name={it.icon} size={20} color={T.textSecondary} />
          <Text
            style={[
              s.rowValue,
              { flex: 1, marginLeft: T.spacing.md, textAlign: "left" },
            ]}
          >
            {it.label}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={T.textMuted} />
          {i < items.length - 1 ? null : null}
        </Pressable>
      ))}
      <View style={s.divider} />
      <Pressable
        style={({ pressed }) => [s.row, pressed && { opacity: 0.6 }]}
        onPress={onLogout}
      >
        <Ionicons name="log-out-outline" size={20} color={T.danger} />
        <Text
          style={[
            s.rowValue,
            {
              flex: 1,
              marginLeft: T.spacing.md,
              textAlign: "left",
              color: T.danger,
            },
          ]}
        >
          Logout
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function confirmLogout(router: ReturnType<typeof useRouter>) {
  Alert.alert(
    "Log out?",
    "You'll need to sign in again to manage your kitchen.",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => {
          // TODO: clear auth session / token here
          router.replace("/");
        },
      },
    ],
  );
}

/* ---------------- edit sheet ---------------- */

function EditProfileSheet({
  visible,
  profile,
  onClose,
  onSaved,
}: {
  visible: boolean;
  profile: ProviderProfile;
  onClose: () => void;
  onSaved: (p: ProviderProfile) => void;
}) {
  const [draft, setDraft] = useState(profile);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (visible) {
      setDraft(profile);
      setErrors({});
      setSaved(false);
    }
  }, [visible, profile]);

  const set = <K extends keyof ProviderProfile>(k: K, v: ProviderProfile[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const toggleIn = (
    key: "specialties" | "cuisines" | "mealTypes",
    value: string,
  ) =>
    setDraft((d) => ({
      ...d,
      [key]: d[key].includes(value)
        ? d[key].filter((x) => x !== value)
        : [...d[key], value],
    }));

  const save = async () => {
    const e = validateProfile(draft);
    setErrors(e);
    if (Object.keys(e).length) return;
    setSaving(true);
    try {
      const updated = await updateProviderProfile(draft);
      setSaved(true);
      setTimeout(() => onSaved(updated), 700);
    } catch (err: any) {
      Alert.alert("Couldn't save", err?.message ?? "Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const bioLeft = 300 - (draft.bio?.length ?? 0);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={s.screen} edges={["top"]}>
        <View style={s.header}>
          <Pressable hitSlop={12} onPress={onClose}>
            <Ionicons name="close" size={24} color={T.text} />
          </Pressable>
          <Text style={s.headerTitle}>Edit Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        {saved ? (
          <Animated.View entering={FadeIn} style={s.center}>
            <View style={s.successCircle}>
              <Ionicons name="checkmark" size={44} color="#fff" />
            </View>
            <Text style={s.emptyTitle}>Profile updated</Text>
          </Animated.View>
        ) : (
          <>
            <ScrollView
              contentContainerStyle={{
                padding: T.spacing.lg,
                paddingBottom: 40,
              }}
              keyboardShouldPersistTaps="handled"
            >
              <Field label="Kitchen name" error={errors.name}>
                <TextInput
                  style={s.input}
                  value={draft.name}
                  onChangeText={(v) => set("name", v)}
                  placeholder="Sunita's Kitchen"
                  placeholderTextColor={T.textMuted}
                />
              </Field>

              <Field label={`Bio  ·  ${bioLeft} left`} error={errors.bio}>
                <TextInput
                  style={[s.input, { height: 110, textAlignVertical: "top" }]}
                  value={draft.bio}
                  onChangeText={(v) => set("bio", v)}
                  multiline
                  maxLength={300}
                  placeholder="What kind of food do you cook?"
                  placeholderTextColor={T.textMuted}
                />
              </Field>

              <Field label="Phone" error={errors.phone}>
                <TextInput
                  style={s.input}
                  value={draft.phone}
                  onChangeText={(v) => set("phone", v)}
                  keyboardType="number-pad"
                  maxLength={10}
                  placeholderTextColor={T.textMuted}
                />
              </Field>

              <Field label="Email" error={errors.email}>
                <TextInput
                  style={s.input}
                  value={draft.email}
                  onChangeText={(v) => set("email", v)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={T.textMuted}
                />
              </Field>

              <Field label="Location" error={errors.location}>
                <TextInput
                  style={s.input}
                  value={draft.location}
                  onChangeText={(v) => set("location", v)}
                  placeholder="Area, City"
                  placeholderTextColor={T.textMuted}
                />
              </Field>

              <Field label="Food specialties" error={errors.specialties}>
                <ChipPicker
                  options={SPECIALTY_OPTIONS}
                  selected={draft.specialties}
                  onToggle={(v) => toggleIn("specialties", v)}
                />
              </Field>

              <Field label="Cuisines">
                <ChipPicker
                  options={CUISINE_OPTIONS}
                  selected={draft.cuisines}
                  onToggle={(v) => toggleIn("cuisines", v)}
                />
              </Field>

              <Field label="Meal types you offer">
                <ChipPicker
                  options={MEAL_TYPE_OPTIONS}
                  selected={draft.mealTypes}
                  onToggle={(v) => toggleIn("mealTypes", v)}
                />
              </Field>
            </ScrollView>

            <View style={s.footer}>
              <Pressable
                style={({ pressed }) => [
                  s.primaryBtn,
                  { flex: 1, opacity: pressed || saving ? 0.85 : 1 },
                ]}
                onPress={save}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={s.primaryBtnText}>Save changes</Text>
                )}
              </Pressable>
            </View>
          </>
        )}
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

export function ChipPicker({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <View style={s.chipWrap}>
      {options.map((o) => {
        const on = selected.includes(o);
        return (
          <Pressable
            key={o}
            onPress={() => onToggle(o)}
            style={[s.chip, on && s.chipOn]}
          >
            {on ? (
              <Ionicons
                name="checkmark"
                size={13}
                color={T.primary}
                style={{ marginRight: 4 }}
              />
            ) : null}
            <Text style={on ? s.chipTextOn : s.chipText}>{o}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ---------------- skeleton ---------------- */

function ProfileSkeleton() {
  return (
    <SafeAreaView style={s.screen} edges={["top"]}>
      <Header />
      <View style={{ padding: T.spacing.lg }}>
        {[160, 80, 120, 120].map((h, i) => (
          <Animated.View
            key={i}
            entering={FadeIn.delay(i * 90)}
            style={[s.card, { height: h, backgroundColor: T.surfaceWarm }]}
          />
        ))}
      </View>
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
  heroCard: { alignItems: "center", gap: T.spacing.sm },
  cardTitle: {
    fontFamily: T.fonts.semibold,
    fontSize: T.typography.bodyLarge,
    color: T.text,
    marginBottom: T.spacing.sm,
  },
  cardHeadRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  avatarWrap: { marginBottom: T.spacing.sm },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: T.radius.pill,
    backgroundColor: T.surfaceWarm,
  },
  avatarFallback: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: T.primaryLight,
  },
  avatarLetter: { fontFamily: T.fonts.bold, fontSize: 38, color: T.primary },
  cameraBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 30,
    height: 30,
    borderRadius: T.radius.pill,
    backgroundColor: T.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: T.surface,
  },

  name: {
    fontFamily: T.fonts.bold,
    fontSize: T.typography.heading,
    color: T.text,
    textAlign: "center",
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
  rowValue: {
    fontFamily: T.fonts.medium,
    fontSize: T.typography.bodySmall,
    color: T.text,
    textAlign: "right",
    maxWidth: "60%",
  },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: T.spacing.md,
    paddingVertical: 5,
    borderRadius: T.radius.pill,
    marginTop: T.spacing.xs,
  },
  statusText: { fontFamily: T.fonts.semibold, fontSize: T.typography.caption },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: T.spacing.xs,
  },
  rating: {
    fontFamily: T.fonts.semibold,
    fontSize: T.typography.bodySmall,
    color: T.text,
  },

  statsRow: {
    flexDirection: "row",
    paddingHorizontal: T.spacing.lg - 6,
    marginBottom: 0,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 6,
    alignItems: "center",
    gap: 2,
    paddingVertical: T.spacing.lg,
  },
  statValue: {
    fontFamily: T.fonts.bold,
    fontSize: T.typography.subheading,
    color: T.text,
  },
  statLabel: {
    fontFamily: T.fonts.regular,
    fontSize: T.typography.caption,
    color: T.textSecondary,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: T.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: T.divider,
    marginVertical: T.spacing.sm,
  },
  slotRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: T.spacing.md,
  },

  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: T.spacing.sm },
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
  chipOn: { borderColor: T.primary, backgroundColor: T.primaryLight },
  chipText: {
    fontFamily: T.fonts.medium,
    fontSize: T.typography.caption,
    color: T.textSecondary,
  },
  chipTextOn: {
    fontFamily: T.fonts.semibold,
    fontSize: T.typography.caption,
    color: T.primary,
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
  footer: {
    flexDirection: "row",
    padding: T.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: T.divider,
    backgroundColor: T.surface,
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
