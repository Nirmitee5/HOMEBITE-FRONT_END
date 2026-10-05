// components/customer/OrderCard.tsx
// Displays Instant Order summary with lifecycle status badges and smart actions (Track/Reorder).

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { Order, OrderStatus } from "../../types/customer";

const C = {
  primary: "#C84A25",
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

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  pending: { label: "Placed", color: C.warning, bg: C.lightWarning, icon: "hourglass-outline" },
  accepted: { label: "Accepted", color: "#2E86DE", bg: "#EBF3FB", icon: "checkmark-circle-outline" },
  preparing: { label: "Cooking", color: C.primary, bg: C.selected, icon: "flame-outline" },
  ready: { label: "Ready", color: "#10AC84", bg: "#E8F8F5", icon: "cube-outline" },
  out_for_delivery: { label: "On the way", color: "#5F27CD", bg: "#F1EBFC", icon: "bicycle-outline" },
  delivered: { label: "Delivered", color: C.success, bg: C.lightSuccess, icon: "checkmark-done-circle" },
  rejected: { label: "Declined", color: "#EE5253", bg: "#FDEDEC", icon: "close-circle-outline" },
  cancelled: { label: "Cancelled", color: C.muted, bg: "#F1ECE6", icon: "ban-outline" },
};

export interface OrderCardProps {
  order: Order;
  onPress?: () => void;
  onTrackPress?: () => void;
  onReorderPress?: () => void;
}

export default function OrderCard({
  order,
  onPress,
  onTrackPress,
  onReorderPress,
}: OrderCardProps) {
  const meta = statusConfig[order.status] || statusConfig.pending;
  const isLive = ["pending", "accepted", "preparing", "ready", "out_for_delivery"].includes(order.status);

  const formattedDate = new Date(order.placedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const itemsSummary = order.items
    .map((item) => `${item.quantity}× ${item.mealName}`)
    .join(", ");

  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress} style={styles.card}>
      {/* Top row: Order ID, Type badge & Status */}
      <View style={styles.header}>
        <View style={styles.idContainer}>
          <Text style={styles.orderId}>#{order.id}</Text>
          <View style={styles.instantTag}>
            <Text style={styles.instantTagText}>ONE-TIME</Text>
          </View>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
          <Ionicons name={meta.icon} size={13} color={meta.color} />
          <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
        </View>
      </View>

      {/* Provider & Date */}
      <View style={styles.middleRow}>
        <Text style={styles.providerName} numberOfLines={1}>
          {order.providerName}
        </Text>
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>

      {/* Items list */}
      <Text style={styles.itemsSummary} numberOfLines={2}>
        {itemsSummary}
      </Text>

      {/* Footer: Price & Actions */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>₹{order.total}</Text>
        </View>

        <View style={styles.actionsGroup}>
          {isLive ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onTrackPress || onPress}
              style={styles.trackBtn}
            >
              <Ionicons name="location-outline" size={14} color={C.surface} />
              <Text style={styles.trackBtnText}>Track Order</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onReorderPress}
              style={styles.reorderBtn}
            >
              <Ionicons name="repeat-outline" size={14} color={C.primary} />
              <Text style={styles.reorderBtnText}>Reorder</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  idContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  orderId: {
    fontSize: 14,
    fontWeight: "700",
    color: C.text,
  },
  instantTag: {
    backgroundColor: C.selected,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  instantTagText: {
    fontSize: 9,
    fontWeight: "800",
    color: C.primary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  middleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginTop: 8,
  },
  providerName: {
    fontSize: 15,
    fontWeight: "700",
    color: C.text,
    flex: 1,
  },
  dateText: {
    fontSize: 11,
    color: C.muted,
  },
  itemsSummary: {
    fontSize: 13,
    color: "#555",
    marginTop: 6,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  amountLabel: {
    fontSize: 10,
    color: C.muted,
    textTransform: "uppercase",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "800",
    color: C.text,
  },
  actionsGroup: {
    flexDirection: "row",
    gap: 8,
  },
  trackBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: C.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  trackBtnText: {
    color: C.surface,
    fontSize: 12,
    fontWeight: "700",
  },
  reorderBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: C.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  reorderBtnText: {
    color: C.primary,
    fontSize: 12,
    fontWeight: "700",
  },
});
