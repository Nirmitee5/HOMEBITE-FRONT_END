// components/customer/ProviderCard.tsx
// Home-kitchen / mess / housewife provider card.

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { ProviderSummary } from "../../types/customer";

const C = {
  primary: "#C84A25",
  text: "#2A2A2A",
  muted: "#8A8A8A",
  border: "#EDE4D8",
  white: "#FFFFFF",
  success: "#6D9E4E",
  lightSuccess: "#EDF6E8",
  selected: "#FBE9E2",
};

const TYPE_LABEL: Record<string, string> = {
  housewife: "Home cook",
  mess: "Mess",
  home_kitchen: "Home kitchen",
};

export interface ProviderCardProps {
  provider: ProviderSummary;
  distanceKm?: number;
  description?: string;
  deliveryInfo?: string;
  variant?: "horizontal" | "compact";
  onPress?: () => void;
}

export default function ProviderCard({
  provider,
  distanceKm,
  description,
  deliveryInfo,
  variant = "horizontal",
  onPress,
}: ProviderCardProps) {
  const compact = variant === "compact";
  const summary =
    description ?? provider.foodSpecialties?.slice(0, 3).join(" · ") ?? "";

  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.88}
      onPress={onPress}
      style={[styles.card, compact ? styles.compact : styles.row]}
    >
      <View style={compact ? styles.imageWrapCompact : styles.imageWrapRow}>
        <Image source={{ uri: provider.photoUrl }} style={styles.image} />
        {!provider.isAvailable ? (
          <View style={styles.closed}>
            <Text style={styles.closedText}>Closed</Text>
          </View>
        ) : null}
      </View>

      <View style={[styles.body, compact && styles.bodyCompact]}>
        <Text numberOfLines={1} style={styles.name}>
          {provider.name}
        </Text>

        <View style={styles.typeRow}>
          <MaterialCommunityIcons name="home-heart" size={13} color={C.primary} />
          <Text style={styles.type}>
            {TYPE_LABEL[provider.type] ?? provider.type}
          </Text>
        </View>

        {summary ? (
          <Text numberOfLines={compact ? 1 : 2} style={styles.summary}>
            {summary}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          <View style={styles.ratingPill}>
            <Ionicons name="star" size={11} color={C.success} />
            <Text style={styles.ratingText}>{provider.rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.meta}>({provider.ratingCount})</Text>
          {typeof distanceKm === "number" ? (
            <Text style={styles.meta}>· {distanceKm} km</Text>
          ) : null}
        </View>

        <Text numberOfLines={1} style={styles.delivery}>
          {deliveryInfo ??
            (provider.prepTimeMins
              ? `Ready in ~${provider.prepTimeMins} min`
              : "Delivery available")}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
    overflow: "hidden",
    shadowColor: "#00000012",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 1,
  },
  row: { flexDirection: "row", padding: 10, gap: 12 },
  compact: { width: 210, padding: 10 },
  imageWrapRow: { width: 86, height: 86, borderRadius: 14, overflow: "hidden" },
  imageWrapCompact: { width: "100%", height: 104, borderRadius: 14, overflow: "hidden" },
  image: { width: "100%", height: "100%", backgroundColor: C.selected },
  closed: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00000055",
    alignItems: "center",
    justifyContent: "center",
  },
  closedText: { color: C.white, fontSize: 11, fontFamily: "Poppins-SemiBold" },
  body: { flex: 1 },
  bodyCompact: { marginTop: 8 },
  name: { fontSize: 14.5, fontFamily: "Poppins-SemiBold", color: C.text },
  typeRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  type: { fontSize: 11.5, fontFamily: "Poppins-Medium", color: C.primary },
  summary: {
    marginTop: 3,
    fontSize: 11.5,
    fontFamily: "Poppins-Regular",
    color: C.muted,
    lineHeight: 16,
  },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 5 },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: C.lightSuccess,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: { fontSize: 11, fontFamily: "Poppins-Medium", color: C.success },
  meta: { fontSize: 11, fontFamily: "Poppins-Regular", color: C.muted },
  delivery: {
    marginTop: 4,
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: C.text,
  },
});
