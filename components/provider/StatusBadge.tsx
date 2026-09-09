import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { statusMeta } from "../../constants/providerTheme";
import type { OrderStatus } from "../../types/provider";

const statusIcons: Record<OrderStatus, keyof typeof Ionicons.glyphMap> = {
  pending: "time-outline",
  accepted: "checkmark-circle-outline",
  preparing: "flame-outline",
  ready: "checkmark-done-outline",
  out_for_delivery: "bicycle-outline",
  delivered: "checkmark-circle",
  rejected: "close-circle-outline",
  cancelled: "ban-outline",
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = statusMeta[status] ?? statusMeta.pending;
  const icon = statusIcons[status] ?? "ellipse-outline";

  return (
    <View
      className="flex-row items-center rounded-full px-3 py-1.5"
      style={{
        backgroundColor: meta.bg,
      }}
    >
      <Ionicons name={icon} size={13} color={meta.fg} />

      <Text
        className="ml-1.5"
        style={{
          color: meta.fg,
          fontFamily: "Poppins_600SemiBold",
          fontSize: 12,
        }}
      >
        {meta.label}
      </Text>
    </View>
  );
}