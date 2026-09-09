import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { providerTheme } from "../../constants/providerTheme";
import type { ApprovalStatus } from "../../types/provider";

const map = {
  pending: {
    icon: "hourglass-outline" as const,
    title: "Approval pending",
    body: "Your kitchen is waiting for verification. You can set up your menu meanwhile.",
    fg: providerTheme.warning,
    bg: providerTheme.warningLight,
  },
  under_review: {
    icon: "search-outline" as const,
    title: "Under review",
    body: "Our team is reviewing your documents. This usually takes 24–48 hours.",
    fg: providerTheme.info,
    bg: providerTheme.infoLight,
  },
  rejected: {
    icon: "alert-circle-outline" as const,
    title: "Application rejected",
    body: "Please review the reason and re-submit your details.",
    fg: providerTheme.danger,
    bg: providerTheme.dangerLight,
  },
};

export default function ApprovalBanner({
  status,
  reason,
}: {
  status: ApprovalStatus;
  reason?: string;
}) {
  if (status === "approved") return null;

  const m = map[status];

  return (
    <View
      className="mb-5 overflow-hidden rounded-[22px]"
      style={{
        backgroundColor: m.bg,
        borderWidth: 1,
        borderColor: m.fg + "22",
      }}
    >
      <View className="flex-row p-4">
        <View
          className="h-11 w-11 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: providerTheme.bg,
          }}
        >
          <Ionicons name={m.icon} size={22} color={m.fg} />
        </View>

        <View className="ml-3 flex-1">
          <Text
            style={{
              color: providerTheme.text,
              fontFamily: providerTheme.fonts.bold,
              fontSize: 15,
            }}
          >
            {m.title}
          </Text>

          <Text
            className="mt-1"
            style={{
              color: providerTheme.textSecondary,
              fontFamily: providerTheme.fonts.regular,
              fontSize: 13,
              lineHeight: 19,
            }}
          >
            {reason ?? m.body}
          </Text>
        </View>
      </View>

      <View
        className="h-1"
        style={{
          backgroundColor: m.fg,
          opacity: 0.55,
        }}
      />
    </View>
  );
}