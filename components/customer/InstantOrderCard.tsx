// components/customer/InstantOrderCard.tsx
// Promo card that pushes the customer towards a one-time (instant) order.
// Never used for subscriptions.

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const C = {
  primary: "#C84A25",
  text: "#2A2A2A",
  muted: "#8A8A8A",
  white: "#FFFFFF",
  accent: "#F0B27A",
  selected: "#FBE9E2",
};

export interface InstantOrderCardProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onPress: () => void;
}

export default function InstantOrderCard({
  title = "Need food now?",
  subtitle = "Order a homemade meal instantly — one-time, no subscription.",
  ctaLabel = "Order Now",
  onPress,
}: InstantOrderCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name="lightning-bolt" size={24} color={C.white} />
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.9}
          onPress={onPress}
          style={styles.cta}
        >
          <Text style={styles.ctaText}>{ctaLabel}</Text>
          <Ionicons name="arrow-forward" size={15} color={C.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: C.selected,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: C.accent,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1 },
  title: { fontSize: 15, fontFamily: "Poppins-SemiBold", color: C.text },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: C.muted,
    lineHeight: 17,
  },
  cta: {
    alignSelf: "flex-start",
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  ctaText: { color: C.white, fontSize: 12.5, fontFamily: "Poppins-SemiBold" },
});
