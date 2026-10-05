// components/customer/CartItem.tsx
// Item row inside customer cart with image, provider, add-ons, price & quantity steppers.

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { CartItem as CartItemType } from "../../types/customer";

const C = {
  primary: "#C84A25",
  surface: "#FFFFFF",
  text: "#2A2A2A",
  muted: "#8A8A8A",
  border: "#EDE4D8",
  danger: "#D94A45",
  selected: "#FBE9E2",
};

export interface CartItemProps {
  item: CartItemType;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export default function CartItem({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemProps) {
  const addOnsTotal =
    item.addOns?.reduce((sum, addOn) => sum + addOn.price, 0) || 0;
  const unitTotal = item.unitPrice + addOnsTotal;
  const lineTotal = unitTotal * item.quantity;

  return (
    <View style={styles.card}>
      <Image
        source={{
          uri:
            item.mealImageUrl ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
        }}
        style={styles.image}
      />

      <View style={styles.details}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {item.mealName}
          </Text>
          <TouchableOpacity
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={onRemove}
          >
            <Ionicons name="trash-outline" size={17} color={C.danger} />
          </TouchableOpacity>
        </View>

        {/* Add-ons list if any */}
        {item.addOns && item.addOns.length > 0 && (
          <View style={styles.addOnsBox}>
            {item.addOns.map((addOn) => (
              <Text key={addOn.id} style={styles.addOnText}>
                + {addOn.name} (₹{addOn.price})
              </Text>
            ))}
          </View>
        )}

        {/* Stepper + Subtotal */}
        <View style={styles.bottomRow}>
          <Text style={styles.price}>₹{lineTotal}</Text>

          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={onDecrement}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.quantity === 1 ? "trash-outline" : "remove"}
                size={14}
                color={item.quantity === 1 ? C.danger : C.primary}
              />
            </TouchableOpacity>

            <Text style={styles.qtyText}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.stepBtn}
              onPress={onIncrement}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={14} color={C.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: C.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 12,
    marginBottom: 10,
    gap: 12,
    alignItems: "center",
  },
  image: {
    width: 68,
    height: 68,
    borderRadius: 10,
    backgroundColor: "#F2EBE3",
  },
  details: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: C.text,
    flex: 1,
    marginRight: 6,
  },
  addOnsBox: {
    marginTop: 3,
  },
  addOnText: {
    fontSize: 11,
    color: C.muted,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: "800",
    color: C.primary,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.selected,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F4D2C3",
  },
  stepBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  qtyText: {
    fontSize: 13,
    fontWeight: "700",
    color: C.primary,
    minWidth: 20,
    textAlign: "center",
  },
});
