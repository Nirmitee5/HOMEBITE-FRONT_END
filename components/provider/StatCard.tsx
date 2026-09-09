import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { providerTheme } from "../../constants/providerTheme";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  tint?: string;
  tintBg?: string;
};

export default function StatCard({
  icon,
  label,
  value,
  tint,
  tintBg,
}: Props) {
  return (
    <Pressable
      className="flex-1"
      style={({ pressed }) => ({
        opacity: pressed ? 0.94 : 1,
        transform: [{ scale: pressed ? 0.985 : 1 }],
      })}
    >
      <View
        className="rounded-[22px] p-4"
        style={{
          backgroundColor: providerTheme.bg,
          borderWidth: 1,
          borderColor: providerTheme.border,
          ...providerTheme.shadows.card,
        }}
      >
        <View className="flex-row items-start justify-between">
          <View
            className="h-11 w-11 items-center justify-center rounded-2xl"
            style={{
              backgroundColor:
                tintBg ?? providerTheme.primaryLight,
            }}
          >
            <Ionicons
              name={icon}
              size={22}
              color={tint ?? providerTheme.primary}
            />
          </View>

          <View
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: tint ?? providerTheme.primary,
              opacity: 0.7,
            }}
          />
        </View>

        <Text
          className="mt-4"
          style={{
            color: providerTheme.text,
            fontFamily: providerTheme.fonts.extraBold,
            fontSize: 27,
            lineHeight: 32,
          }}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {value}
        </Text>

        <Text
          className="mt-1"
          style={{
            color: providerTheme.textMuted,
            fontFamily: providerTheme.fonts.medium,
            fontSize: 13,
          }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}