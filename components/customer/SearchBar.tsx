// components/customer/SearchBar.tsx
// Controlled search input used on Home, Explore and Instant.

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const C = {
  primary: "#C84A25",
  text: "#2A2A2A",
  muted: "#8A8A8A",
  border: "#EDE4D8",
  white: "#FFFFFF",
};

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: (value: string) => void;
  autoFocus?: boolean;
  /** Optional filter button on the right. */
  onFilterPress?: () => void;
  filterActive?: boolean;
  editable?: boolean;
  /** Renders as a tappable box instead of an input (e.g. Home → Explore). */
  onPress?: () => void;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search homemade meals or kitchens",
  onSubmit,
  autoFocus = false,
  onFilterPress,
  filterActive = false,
  editable = true,
  onPress,
}: SearchBarProps) {
  const body = (
    <View style={styles.box}>
      <Ionicons name="search" size={18} color={C.muted} />
      {onPress ? (
        <Text style={[styles.input, styles.fakeInput]} numberOfLines={1}>
          {value || placeholder}
        </Text>
      ) : (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={C.muted}
          autoFocus={autoFocus}
          editable={editable}
          returnKeyType="search"
          onSubmitEditing={() => onSubmit?.(value)}
        />
      )}
      {value.length > 0 && !onPress ? (
        <TouchableOpacity
          accessibilityLabel="Clear search"
          onPress={() => onChangeText("")}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close-circle" size={18} color={C.muted} />
        </TouchableOpacity>
      ) : null}
    </View>
  );

  return (
    <View style={styles.row}>
      {onPress ? (
        <TouchableOpacity style={styles.flex} activeOpacity={0.8} onPress={onPress}>
          {body}
        </TouchableOpacity>
      ) : (
        <View style={styles.flex}>{body}</View>
      )}

      {onFilterPress ? (
        <TouchableOpacity
          accessibilityLabel="Filters"
          onPress={onFilterPress}
          style={[styles.filterBtn, filterActive && styles.filterBtnActive]}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={filterActive ? C.white : C.primary}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  flex: { flex: 1 },
  box: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
    paddingHorizontal: 12,
    height: 46,
  },
  input: {
    flex: 1,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: C.text,
    paddingVertical: 0,
  },
  fakeInput: { color: C.muted, lineHeight: 20 },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
  },
  filterBtnActive: { backgroundColor: C.primary, borderColor: C.primary },
});
