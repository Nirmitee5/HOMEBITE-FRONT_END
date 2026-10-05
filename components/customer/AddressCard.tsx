// components/customer/AddressCard.tsx
// Delivery address card for Profile and Checkout screens with label badges and actions.

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { CustomerAddress } from "../../types/customer";

const C = {
  primary: "#C84A25",
  surface: "#FFFFFF",
  text: "#2A2A2A",
  muted: "#8A8A8A",
  border: "#EDE4D8",
  danger: "#D94A45",
  selected: "#FBE9E2",
  success: "#6D9E4E",
};

export interface AddressCardProps {
  address: CustomerAddress;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function AddressCard({
  address,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
}: AddressCardProps) {
  const getIcon = () => {
    switch (address.type) {
      case "home":
        return "home-outline";
      case "work":
        return "business-outline";
      default:
        return "location-outline";
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onSelect}
      style={[styles.card, isSelected && styles.selectedCard]}
    >
      <View style={styles.topRow}>
        <View style={styles.labelGroup}>
          <Ionicons
            name={getIcon()}
            size={16}
            color={isSelected ? C.primary : C.muted}
          />
          <Text style={styles.label}>{address.label || "Address"}</Text>
          {address.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>DEFAULT</Text>
            </View>
          )}
        </View>

        {isSelected && (
          <Ionicons name="checkmark-circle" size={18} color={C.primary} />
        )}
      </View>

      <Text style={styles.fullAddress}>
        {[address.line1, address.line2, address.city, address.pincode]
          .filter(Boolean)
          .join(", ")}
      </Text>

      {address.deliveryInstructions ? (
        <Text style={styles.instructions} numberOfLines={1}>
          Note: {address.deliveryInstructions}
        </Text>
      ) : null}

      {/* Edit and Delete row */}
      {(onEdit || onDelete) && (
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
              <Ionicons name="create-outline" size={14} color={C.muted} />
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
          )}

          {onDelete && (
            <TouchableOpacity style={styles.actionBtn} onPress={onDelete}>
              <Ionicons name="trash-outline" size={14} color={C.danger} />
              <Text style={[styles.actionText, { color: C.danger }]}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
    marginBottom: 12,
  },
  selectedCard: {
    borderColor: C.primary,
    backgroundColor: "#FFFAF6",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: C.text,
  },
  defaultBadge: {
    backgroundColor: C.selected,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  defaultBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: C.primary,
  },
  fullAddress: {
    fontSize: 13,
    color: "#555",
    marginTop: 6,
    lineHeight: 18,
  },
  instructions: {
    fontSize: 12,
    color: C.muted,
    fontStyle: "italic",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    color: C.muted,
  },
});
