// components/customer/CategoryCard.tsx
// Food category card/chip. Works with MealCategory from types/customer.

import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { MealCategory } from "../../types/customer";

const C = {
  primary: "#C84A25",
  text: "#2A2A2A",
  muted: "#8A8A8A",
  border: "#EDE4D8",
  white: "#FFFFFF",
  selected: "#FBE9E2",
};

export interface CategoryCardProps {
  category?: MealCategory;
  /** Overrides category.name — useful for an "All" pseudo-category. */
  title?: string;
  icon?: string;
  imageUrl?: string;
  selected?: boolean;
  onPress?: () => void;
}

export default function CategoryCard({
  category,
  title,
  icon,
  imageUrl,
  selected = false,
  onPress,
}: CategoryCardProps) {
  const label = title ?? category?.name ?? "";
  const iconName = (icon ??
    category?.icon ??
    "silverware-fork-knife") as keyof typeof MaterialCommunityIcons.glyphMap;
  const image = imageUrl;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.wrap}
    >
      <View style={[styles.circle, selected && styles.circleSelected]}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <MaterialCommunityIcons
            name={iconName}
            size={26}
            color={selected ? C.white : C.primary}
          />
        )}
      </View>
      <Text numberOfLines={1} style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 74, alignItems: "center" },
  circle: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: C.selected,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.border,
  },
  circleSelected: { backgroundColor: C.primary, borderColor: C.primary },
  image: { width: "100%", height: "100%" },
  label: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: "Poppins-Medium",
    color: C.muted,
    textAlign: "center",
  },
  labelSelected: { color: C.primary },
});
