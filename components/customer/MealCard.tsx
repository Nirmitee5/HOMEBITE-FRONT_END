// components/customer/MealCard.tsx
// Meal card used on Home (horizontal), Explore, Instant and Provider Details.

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { Meal } from "../../types/customer";

const C = {
  primary: "#C84A25",
  text: "#2A2A2A",
  muted: "#8A8A8A",
  border: "#EDE4D8",
  white: "#FFFFFF",
  success: "#6D9E4E",
  lightSuccess: "#EDF6E8",
  selected: "#FBE9E2",
  accent: "#F0B27A",
};

export interface MealCardProps {
  meal: Meal;
  providerName?: string;
  providerType?: string;
  /** "horizontal" = wide list row, "compact" = fixed-width carousel card. */
  variant?: "horizontal" | "compact";
  onPress?: () => void;
  onAdd?: () => void;
  addLabel?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  showAvailability?: boolean;
}

function VegMark({ veg }: { veg: Meal["veg"] }) {
  const color =
    veg === "veg" ? C.success : veg === "egg" ? "#E59A2F" : "#D94A45";
  return (
    <View style={[styles.vegBox, { borderColor: color }]}>
      <View style={[styles.vegDot, { backgroundColor: color }]} />
    </View>
  );
}

export default function MealCard({
  meal,
  providerName,
  providerType,
  variant = "horizontal",
  onPress,
  onAdd,
  addLabel = "Add",
  isFavorite,
  onToggleFavorite,
  showAvailability = true,
}: MealCardProps) {
  const available = meal.availability?.isAvailable !== false;
  const compact = variant === "compact";
  const subtitle = [providerName, providerType].filter(Boolean).join(" · ");

  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.88}
      onPress={onPress}
      style={[styles.card, compact ? styles.compact : styles.row]}
    >
      <View style={compact ? styles.imageWrapCompact : styles.imageWrapRow}>
        <Image source={{ uri: meal.imageUrl }} style={styles.image} />
        {!available && showAvailability ? (
          <View style={styles.soldOut}>
            <Text style={styles.soldOutText}>Sold out</Text>
          </View>
        ) : null}
        {onToggleFavorite ? (
          <TouchableOpacity
            accessibilityLabel="Toggle favourite"
            onPress={onToggleFavorite}
            style={styles.favBtn}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={16}
              color={isFavorite ? C.primary : C.text}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={[styles.body, compact && styles.bodyCompact]}>
        <View style={styles.titleRow}>
          <VegMark veg={meal.veg} />
          <Text numberOfLines={1} style={styles.name}>
            {meal.name}
          </Text>
        </View>

        {subtitle ? (
          <Text numberOfLines={1} style={styles.provider}>
            {subtitle}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          <View style={styles.ratingPill}>
            <Ionicons name="star" size={11} color={C.success} />
            <Text style={styles.ratingText}>{meal.rating.toFixed(1)}</Text>
          </View>
          {meal.prepTimeMins ? (
            <Text style={styles.meta}>{meal.prepTimeMins} min</Text>
          ) : null}
        </View>

        <View style={styles.footer}>
          <Text style={styles.price}>₹{meal.price}</Text>
          {onAdd ? (
            <TouchableOpacity
              accessibilityRole="button"
              disabled={!available}
              onPress={onAdd}
              style={[styles.addBtn, !available && styles.addBtnDisabled]}
            >
              <Text style={styles.addText}>{available ? addLabel : "Unavailable"}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
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
  compact: { width: 190, padding: 10 },
  imageWrapRow: { width: 92, height: 92, borderRadius: 14, overflow: "hidden" },
  imageWrapCompact: {
    width: "100%",
    height: 110,
    borderRadius: 14,
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%", backgroundColor: C.selected },
  soldOut: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00000055",
    alignItems: "center",
    justifyContent: "center",
  },
  soldOutText: {
    color: C.white,
    fontSize: 11,
    fontFamily: "Poppins-SemiBold",
  },
  favBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1, justifyContent: "space-between" },
  bodyCompact: { marginTop: 8 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  vegBox: {
    width: 13,
    height: 13,
    borderWidth: 1.4,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  vegDot: { width: 6, height: 6, borderRadius: 3 },
  name: { flex: 1, fontSize: 14, fontFamily: "Poppins-SemiBold", color: C.text },
  provider: {
    marginTop: 2,
    fontSize: 11.5,
    fontFamily: "Poppins-Regular",
    color: C.muted,
  },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
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
  footer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: { fontSize: 15, fontFamily: "Poppins-SemiBold", color: C.text },
  addBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: C.primary,
  },
  addBtnDisabled: { backgroundColor: C.accent },
  addText: { color: C.white, fontSize: 12, fontFamily: "Poppins-SemiBold" },
});
