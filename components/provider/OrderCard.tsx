import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { providerTheme } from "../../constants/providerTheme";
import type { Order } from "../../types/provider";
import StatusBadge from "./StatusBadge";

type Props = {
  order: Order;
  onPress: () => void;
  onAccept?: () => void;
  onReject?: () => void;
};

export default function OrderCard({
  order,
  onPress,
  onAccept,
  onReject,
}: Props) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const isPending = order.status === "pending";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        marginBottom: 16,
        transform: [{ scale: pressed ? 0.985 : 1 }],
      })}
    >
      <View
        style={{
          backgroundColor: providerTheme.bg,
          borderWidth: 1,
          borderColor: providerTheme.border,
          borderRadius: 24,
          overflow: "hidden",
          ...providerTheme.shadows.card,
        }}
      >
        {/* Pending order indicator */}
        {isPending && (
          <View
            style={{
              height: 4,
              backgroundColor: providerTheme.primary,
            }}
          />
        )}

        <View style={{ padding: 20 }}>
          {/* TOP ROW */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  backgroundColor: providerTheme.primaryLight,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="receipt-outline"
                  size={18}
                  color={providerTheme.primary}
                />
              </View>

              <View style={{ marginLeft: 10 }}>
                <Text
                  style={{
                    color: providerTheme.text,
                    fontFamily: providerTheme.fonts.bold,
                    fontSize: 14,
                  }}
                >
                  #{order.code}
                </Text>

                <Text
                  style={{
                    color: providerTheme.textMuted,
                    fontFamily: providerTheme.fonts.regular,
                    fontSize: 11,
                    marginTop: 2,
                  }}
                >
                  New order
                </Text>
              </View>
            </View>

            <StatusBadge status={order.status} />
          </View>

          {/* CUSTOMER */}
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                color: providerTheme.text,
                fontFamily: providerTheme.fonts.bold,
                fontSize: 19,
              }}
            >
              {order.customerName}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 7,
              }}
            >
              <Ionicons
                name="time-outline"
                size={16}
                color={providerTheme.textMuted}
              />

              <Text
                style={{
                  marginLeft: 6,
                  color: providerTheme.textSecondary,
                  fontFamily: providerTheme.fonts.medium,
                  fontSize: 13,
                }}
              >
                {order.deliverySlot}
              </Text>

              {order.type === "subscription" && (
                <View
                  style={{
                    marginLeft: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: providerTheme.primaryLight,
                    borderRadius: 999,
                    paddingHorizontal: 9,
                    paddingVertical: 5,
                  }}
                >
                  <Ionicons
                    name="repeat-outline"
                    size={12}
                    color={providerTheme.primary}
                  />

                  <Text
                    style={{
                      marginLeft: 4,
                      color: providerTheme.primary,
                      fontFamily: providerTheme.fonts.semibold,
                      fontSize: 10,
                    }}
                  >
                    Subscription
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* ORDER SUMMARY */}
          <View
            style={{
              marginTop: 18,
              paddingHorizontal: 15,
              paddingVertical: 13,
              borderRadius: 16,
              backgroundColor: providerTheme.surfaceWarm,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="fast-food-outline"
                size={18}
                color={providerTheme.primary}
              />

              <Text
                style={{
                  marginLeft: 8,
                  color: providerTheme.textSecondary,
                  fontFamily: providerTheme.fonts.medium,
                  fontSize: 13,
                }}
              >
                {itemCount} item{itemCount !== 1 ? "s" : ""}
              </Text>
            </View>

            <Text
              style={{
                color: providerTheme.text,
                fontFamily: providerTheme.fonts.extraBold,
                fontSize: 19,
              }}
            >
              ₹{order.total}
            </Text>
          </View>

          {/* ACTION BUTTONS */}
          {isPending && (onAccept || onReject) && (
            <View
              style={{
                flexDirection: "row",
                marginTop: 16,
              }}
            >
              {/* REJECT */}
              {onReject && (
                <Pressable
                  onPress={(event) => {
                    event.stopPropagation();
                    onReject();
                  }}
                  style={({ pressed }) => ({
                    flex: 1,
                    height: 50,
                    borderRadius: 16,
                    borderWidth: 1.5,
                    borderColor: providerTheme.danger,
                    backgroundColor: pressed
                      ? providerTheme.dangerLight
                      : providerTheme.bg,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: onAccept ? 6 : 0,
                  })}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={18}
                      color={providerTheme.danger}
                    />

                    <Text
                      style={{
                        marginLeft: 6,
                        color: providerTheme.danger,
                        fontFamily: providerTheme.fonts.bold,
                        fontSize: 14,
                      }}
                    >
                      Reject
                    </Text>
                  </View>
                </Pressable>
              )}

              {/* ACCEPT */}
              {onAccept && (
                <Pressable
                  onPress={(event) => {
                    event.stopPropagation();
                    onAccept();
                  }}
                  style={({ pressed }) => ({
                    flex: 1,
                    height: 50,
                    borderRadius: 16,
                    backgroundColor: pressed
                      ? providerTheme.primaryDark
                      : providerTheme.primary,
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: onReject ? 6 : 0,

                    shadowColor: providerTheme.primary,
                    shadowOpacity: 0.22,
                    shadowRadius: 8,
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    elevation: 4,
                  })}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontFamily: providerTheme.fonts.bold,
                        fontSize: 14,
                      }}
                    >
                      Accept order
                    </Text>

                    <Ionicons
                      name="arrow-forward"
                      size={17}
                      color="#FFFFFF"
                      style={{ marginLeft: 7 }}
                    />
                  </View>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
