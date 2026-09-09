import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { providerTheme } from "../../constants/providerTheme";

const REASONS = [
  "Out of ingredients",
  "Kitchen closed right now",
  "Too many orders",
  "Delivery area too far",
  "Other",
];

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

export default function RejectReasonSheet({
  visible,
  onClose,
  onConfirm,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [custom, setCustom] = useState("");

  const slideAnim = useRef(new Animated.Value(400)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(400);
      backdropAnim.setValue(0);
    }
  }, [visible]);

  const finalReason = selected === "Other" ? custom.trim() : (selected ?? "");

  const canConfirm = finalReason.length > 2;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <Animated.View
          className="absolute inset-0"
          style={{
            backgroundColor: "#000",
            opacity: backdropAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.42],
            }),
          }}
        />

        <Pressable className="absolute inset-0" onPress={onClose} />

        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="rounded-t-[32px] px-5 pb-9 pt-4"
            style={{
              backgroundColor: providerTheme.bg,
            }}
          >
            {/* Handle */}
            <View
              className="mb-5 h-1.5 w-12 self-center rounded-full"
              style={{
                backgroundColor: providerTheme.border,
              }}
            />

            {/* Header */}
            <View className="flex-row items-center justify-between">
              <View>
                <Text
                  style={{
                    color: providerTheme.text,
                    fontFamily: providerTheme.fonts.bold,
                    fontSize: 22,
                  }}
                >
                  Reject order?
                </Text>

                <Text
                  className="mt-1"
                  style={{
                    color: providerTheme.textMuted,
                    fontFamily: providerTheme.fonts.regular,
                    fontSize: 13,
                  }}
                >
                  Choose a reason for the customer.
                </Text>
              </View>

              <View
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{
                  backgroundColor: providerTheme.dangerLight,
                }}
              >
                <Ionicons name="close" size={20} color={providerTheme.danger} />
              </View>
            </View>

            {/* Reasons */}
            <View className="mt-5">
              {REASONS.map((reason) => {
                const active = selected === reason;

                return (
                  <Pressable
                    key={reason}
                    onPress={() => setSelected(reason)}
                    className="mb-2.5 flex-row items-center rounded-2xl px-4 py-3.5"
                    style={{
                      borderWidth: 1,
                      borderColor: active
                        ? providerTheme.primary
                        : providerTheme.border,
                      backgroundColor: active
                        ? providerTheme.primaryLight
                        : providerTheme.bg,
                    }}
                  >
                    <View
                      className="mr-3 h-5 w-5 items-center justify-center rounded-full"
                      style={{
                        borderWidth: 2,
                        borderColor: active
                          ? providerTheme.primary
                          : providerTheme.border,
                      }}
                    >
                      {active && (
                        <View
                          className="h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor: providerTheme.primary,
                          }}
                        />
                      )}
                    </View>

                    <Text
                      className="flex-1"
                      style={{
                        color: active
                          ? providerTheme.primary
                          : providerTheme.text,
                        fontFamily: providerTheme.fonts.medium,
                        fontSize: 14,
                      }}
                    >
                      {reason}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Custom reason */}
            {selected === "Other" && (
              <TextInput
                value={custom}
                onChangeText={setCustom}
                placeholder="Tell the customer why..."
                placeholderTextColor={providerTheme.textMuted}
                multiline
                textAlignVertical="top"
                className="mt-1 rounded-2xl px-4 py-3.5"
                style={{
                  minHeight: 90,
                  borderWidth: 1,
                  borderColor: providerTheme.border,
                  color: providerTheme.text,
                  backgroundColor: providerTheme.surfaceWarm,
                  fontFamily: providerTheme.fonts.regular,
                  fontSize: 14,
                }}
              />
            )}

            {/* Confirm */}
            <Pressable
              disabled={!canConfirm}
              onPress={() => onConfirm(finalReason)}
              className="mt-5 flex-row items-center justify-center rounded-2xl py-4"
              style={{
                backgroundColor: canConfirm
                  ? providerTheme.danger
                  : providerTheme.border,
              }}
            >
              <Ionicons name="close-circle-outline" size={19} color="#FFFFFF" />

              <Text
                className="ml-2"
                style={{
                  color: "#FFFFFF",
                  fontFamily: providerTheme.fonts.bold,
                  fontSize: 14,
                }}
              >
                Reject order
              </Text>
            </Pressable>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}
