// components/customer/SubscriptionCard.tsx
// Supports both Active Subscriptions (with delivery schedule & status)
// and Available Subscription Plans (with pricing & explore CTA).

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type {
  Subscription,
  SubscriptionBillingPeriod,
  SubscriptionPlan,
  SubscriptionStatus,
} from "../../types/customer";

const C = {
  primary: "#C84A25",
  primaryDark: "#A83B1D",
  background: "#FFF8EF",
  surface: "#FFFFFF",
  text: "#2A2A2A",
  muted: "#8A8A8A",
  border: "#EDE4D8",
  success: "#6D9E4E",
  lightSuccess: "#EDF6E8",
  warning: "#E59A2F",
  lightWarning: "#FEF7EC",
  accent: "#F0B27A",
  selected: "#FBE9E2",
};

export interface SubscriptionCardProps {
  /** Provide either an active customer subscription or an available plan */
  subscription?: Subscription;
  plan?: SubscriptionPlan;
  onPress?: () => void;
  onActionPress?: () => void;
  actionLabel?: string;
  isCompact?: boolean;
}

const statusMeta: Record<SubscriptionStatus, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: C.success, bg: C.lightSuccess },
  paused: { label: "Paused", color: C.warning, bg: C.lightWarning },
  cancelled: { label: "Cancelled", color: "#D94A45", bg: "#FDF0ED" },
  completed: { label: "Completed", color: C.muted, bg: "#F1EBE4" },
};

export default function SubscriptionCard({
  subscription,
  plan,
  onPress,
  onActionPress,
  actionLabel,
  isCompact = false,
}: SubscriptionCardProps) {
  const item = subscription || plan;
  if (!item) return null;

  const isActiveSub = Boolean(subscription);
  const title = subscription?.planName || plan?.name || "Meal Subscription";
  const providerName = subscription?.providerName || plan?.providerName || "Home Chef";
  const billingPeriod: SubscriptionBillingPeriod =
    subscription?.billingPeriod || plan?.billingPeriod || "monthly";
  const price = subscription?.price ?? plan?.price ?? 0;
  const imageUrl =
    plan?.coverImageUrl ||
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80";

  const status = subscription?.status || "active";
  const meta = statusMeta[status] || statusMeta.active;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[styles.container, isCompact && styles.containerCompact]}
    >
      {/* Header banner indicating recurring scheduled plan */}
      <View style={styles.planHeaderBadge}>
        <Ionicons name="calendar-outline" size={13} color={C.primary} />
        <Text style={styles.planBadgeText}>
          {billingPeriod.toUpperCase()} RECURRING PLAN · NO DAILY RE-ORDER
        </Text>
      </View>

      <View style={styles.contentRow}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />

        <View style={styles.infoCol}>
          <View style={styles.topRow}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {isActiveSub && (
              <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
                <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
              </View>
            )}
          </View>

          <Text style={styles.providerText} numberOfLines={1}>
            By {providerName}
          </Text>

          {/* Schedule / delivery details */}
          {isActiveSub && subscription?.nextDeliveryDate ? (
            <View style={styles.scheduleRow}>
              <Ionicons name="time-outline" size={13} color={C.muted} />
              <Text style={styles.scheduleText} numberOfLines={1}>
                Next: {new Date(subscription.nextDeliveryDate).toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </Text>
            </View>
          ) : (
            <View style={styles.scheduleRow}>
              <Ionicons name="sparkles-outline" size={13} color={C.primary} />
              <Text style={styles.scheduleText}>Daily fresh home cooking</Text>
            </View>
          )}

          {/* Price & CTA */}
          <View style={styles.bottomRow}>
            <View>
              <Text style={styles.priceText}>₹{price}</Text>
              <Text style={styles.perPeriodText}>/{billingPeriod}</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onActionPress || onPress}
              style={styles.actionBtn}
            >
              <Text style={styles.actionBtnText}>
                {actionLabel || (isActiveSub ? "Manage Plan" : "View Plan")}
              </Text>
              <Ionicons name="chevron-forward" size={14} color={C.surface} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: C.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  containerCompact: {
    width: 280,
    marginRight: 14,
    marginBottom: 4,
  },
  planHeaderBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.selected,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F5D7C9",
  },
  planBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: C.primary,
    letterSpacing: 0.5,
  },
  contentRow: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: "#F2EBE3",
  },
  infoCol: {
    flex: 1,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 6,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: C.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  providerText: {
    fontSize: 12,
    color: C.muted,
    marginTop: 2,
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 4,
  },
  scheduleText: {
    fontSize: 11,
    color: C.muted,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "800",
    color: C.primary,
  },
  perPeriodText: {
    fontSize: 11,
    color: C.muted,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: C.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  actionBtnText: {
    color: C.surface,
    fontSize: 12,
    fontWeight: "700",
  },
});
