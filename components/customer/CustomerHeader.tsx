// components/customer/CustomerHeader.tsx
// Shared screen header for the Customer side. Every element is opt-in.

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const C = {
  bg: "#FFF8EF",
  primary: "#C84A25",
  text: "#2A2A2A",
  muted: "#8A8A8A",
  border: "#EDE4D8",
  white: "#FFFFFF",
  selected: "#FBE9E2",
};

export interface CustomerHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  showNotifications?: boolean;
  onNotificationsPress?: () => void;
  unreadCount?: number;
  /** Optional right-hand action (favorite, cart, edit, ...). */
  actionIcon?: keyof typeof Ionicons.glyphMap;
  onActionPress?: () => void;
  actionActive?: boolean;
  actionBadge?: number;
  transparent?: boolean;
}

export default function CustomerHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  showNotifications = false,
  onNotificationsPress,
  unreadCount = 0,
  actionIcon,
  onActionPress,
  actionActive = false,
  actionBadge,
  transparent = false,
}: CustomerHeaderProps) {
  return (
    <View
      style={[
        styles.wrap,
        transparent ? styles.transparent : styles.solid,
      ]}
    >
      <View style={styles.side}>
        {showBack ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={onBack}
            style={styles.iconBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="chevron-back" size={22} color={C.text} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.center}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={[styles.side, styles.sideRight]}>
        {showNotifications ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            onPress={onNotificationsPress}
            style={styles.iconBtn}
          >
            <Ionicons name="notifications-outline" size={21} color={C.text} />
            {unreadCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        ) : null}

        {actionIcon ? (
          <TouchableOpacity
            accessibilityRole="button"
            onPress={onActionPress}
            style={[styles.iconBtn, actionActive && styles.iconBtnActive]}
          >
            <Ionicons
              name={actionIcon}
              size={21}
              color={actionActive ? C.primary : C.text}
            />
            {typeof actionBadge === "number" && actionBadge > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {actionBadge > 9 ? "9+" : actionBadge}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 56,
  },
  solid: {
    backgroundColor: C.bg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  transparent: { backgroundColor: "transparent" },
  side: { width: 84, flexDirection: "row", alignItems: "center", gap: 6 },
  sideRight: { justifyContent: "flex-end" },
  center: { flex: 1, alignItems: "center" },
  title: {
    fontFamily: Platform.select({ ios: "Poppins-SemiBold", default: "Poppins-SemiBold" }),
    fontSize: 17,
    color: C.text,
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: C.muted,
    marginTop: 1,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
  },
  iconBtnActive: { backgroundColor: C.selected, borderColor: C.primary },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: C.bg,
  },
  badgeText: {
    color: C.white,
    fontSize: 10,
    fontFamily: "Poppins-SemiBold",
  },
});
