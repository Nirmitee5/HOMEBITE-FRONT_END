import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { providerTheme } from "../../constants/providerTheme";

type Props = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
};

export default function EmptyState({
  icon = "fast-food-outline",
  title,
  subtitle,
}: Props) {
  return (
    <View className="items-center px-8 py-16">
      <View
        className="h-24 w-24 items-center justify-center rounded-[30px]"
        style={{
          backgroundColor: providerTheme.primaryLight,
          transform: [{ rotate: "-5deg" }],
        }}
      >
        <View
          className="h-16 w-16 items-center justify-center rounded-full"
          style={{
            backgroundColor: providerTheme.bg,
            ...providerTheme.shadows.card,
          }}
        >
          <Ionicons
            name={icon}
            size={30}
            color={providerTheme.primary}
          />
        </View>
      </View>

      <Text
        className="mt-6 text-center"
        style={{
          color: providerTheme.text,
          fontFamily: providerTheme.fonts.bold,
          fontSize: 19,
        }}
      >
        {title}
      </Text>

      {subtitle ? (
        <Text
          className="mt-2 max-w-[290px] text-center"
          style={{
            color: providerTheme.textMuted,
            fontFamily: providerTheme.fonts.regular,
            fontSize: 14,
            lineHeight: 21,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}