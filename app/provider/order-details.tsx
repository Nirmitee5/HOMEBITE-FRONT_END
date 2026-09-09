import { useCallback, useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Animated,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import StatusBadge from "../../components/provider/StatusBadge";
import RejectReasonSheet from "../../components/provider/RejectReasonSheet";

import { providerTheme } from "../../constants/providerTheme";

import {
  acceptOrder,
  fetchOrderById,
  rejectOrder,
  updateOrderStatus,
} from "../../services/provider/orders";

import type { Order, OrderStatus } from "../../types/provider";

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  accepted: "preparing",
  preparing: "ready",
  ready: "out_for_delivery",
  out_for_delivery: "delivered",
};

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  accepted: "Start preparing",
  preparing: "Mark as ready",
  ready: "Start delivery",
  out_for_delivery: "Mark delivered",
};

const NEXT_ICON: Partial<
  Record<OrderStatus, keyof typeof Ionicons.glyphMap>
> = {
  accepted: "flame-outline",
  preparing: "checkmark-done-outline",
  ready: "bicycle-outline",
  out_for_delivery: "checkmark-circle-outline",
};

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectSheet, setShowRejectSheet] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(25)).current;

  const loadOrder = useCallback(async () => {
    if (!id) return;

    try {
      const data = await fetchOrderById(id);
      setOrder(data);
    } catch (error) {
      console.error("Failed to fetch order:", error);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);

    loadOrder().finally(() => {
      setLoading(false);

      fadeAnim.setValue(0);
      slideAnim.setValue(25);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [loadOrder]);

  const handleAccept = async () => {
    if (!order) return;

    try {
      setActionLoading(true);

      await acceptOrder(order.id);

      await loadOrder();
    } catch (error) {
      console.error("Failed to accept order:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (reason: string) => {
    if (!order) return;

    try {
      setActionLoading(true);

      await rejectOrder(order.id, reason);

      setShowRejectSheet(false);

      router.back();
    } catch (error) {
      console.error("Failed to reject order:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleNextStatus = async () => {
    if (!order) return;

    const nextStatus = NEXT_STATUS[order.status];

    if (!nextStatus) return;

    try {
      setActionLoading(true);

      await updateOrderStatus(order.id, nextStatus);

      await loadOrder();
    } catch (error) {
      console.error("Failed to update order:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCall = async () => {
    if (!order?.customerPhone) return;

    try {
      await Linking.openURL(`tel:${order.customerPhone}`);
    } catch (error) {
      console.error("Unable to call customer:", error);
    }
  };

  /*
   * LOADING
   */
  if (loading) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center"
        style={{
          backgroundColor: providerTheme.surface,
        }}
      >
        <View
          className="h-16 w-16 items-center justify-center rounded-3xl"
          style={{
            backgroundColor: providerTheme.primaryLight,
          }}
        >
          <ActivityIndicator
            size="small"
            color={providerTheme.primary}
          />
        </View>

        <Text
          className="mt-4"
          style={{
            color: providerTheme.textSecondary,
            fontFamily: providerTheme.fonts.medium,
            fontSize: 14,
          }}
        >
          Loading order...
        </Text>
      </SafeAreaView>
    );
  }

  /*
   * NOT FOUND
   */
  if (!order) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{
          backgroundColor: providerTheme.surface,
        }}
      >
        <View className="px-5 pt-4">
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: providerTheme.bg,
              borderWidth: 1,
              borderColor: providerTheme.border,
            }}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color={providerTheme.text}
            />
          </Pressable>
        </View>

        <View className="flex-1 items-center justify-center px-8">
          <View
            className="h-24 w-24 items-center justify-center rounded-[30px]"
            style={{
              backgroundColor: providerTheme.dangerLight,
            }}
          >
            <Ionicons
              name="alert-circle-outline"
              size={38}
              color={providerTheme.danger}
            />
          </View>

          <Text
            className="mt-6 text-center"
            style={{
              color: providerTheme.text,
              fontFamily: providerTheme.fonts.bold,
              fontSize: 21,
            }}
          >
            Order not found
          </Text>

          <Text
            className="mt-2 text-center"
            style={{
              color: providerTheme.textMuted,
              fontFamily: providerTheme.fonts.regular,
              fontSize: 14,
              lineHeight: 21,
            }}
          >
            We couldn't load this order. Please go back and try again.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isPending = order.status === "pending";
  const nextStatus = NEXT_STATUS[order.status];

  const itemCount = order.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{
        backgroundColor: providerTheme.surface,
      }}
      edges={["top"]}
    >
      {/* HEADER */}

      <View
        className="flex-row items-center justify-between px-5 py-3"
        style={{
          backgroundColor: providerTheme.bg,
          borderBottomWidth: 1,
          borderBottomColor: providerTheme.border,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-2xl"
          style={({ pressed }) => ({
            backgroundColor: pressed
              ? providerTheme.surfaceWarm
              : providerTheme.bg,

            borderWidth: 1,
            borderColor: providerTheme.border,

            transform: [
              {
                scale: pressed ? 0.95 : 1,
              },
            ],
          })}
        >
          <Ionicons
            name="arrow-back"
            size={21}
            color={providerTheme.text}
          />
        </Pressable>

        <View className="items-center">
          <Text
            style={{
              color: providerTheme.textMuted,
              fontFamily: providerTheme.fonts.medium,
              fontSize: 10,
              letterSpacing: 1,
            }}
          >
            ORDER
          </Text>

          <Text
            style={{
              color: providerTheme.text,
              fontFamily: providerTheme.fonts.bold,
              fontSize: 16,
            }}
          >
            #{order.code}
          </Text>
        </View>

        <StatusBadge status={order.status} />
      </View>

      <Animated.View
        className="flex-1"
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: slideAnim,
            },
          ],
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 140,
          }}
        >
          {/* ORDER SUMMARY HERO */}

          <View
            className="overflow-hidden rounded-[26px]"
            style={{
              backgroundColor: providerTheme.primary,
              ...providerTheme.shadows.floating,
            }}
          >
            <View className="p-5">
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <Text
                    style={{
                      color: "#FFFFFF",
                      opacity: 0.72,
                      fontFamily: providerTheme.fonts.medium,
                      fontSize: 11,
                      letterSpacing: 1,
                    }}
                  >
                    {isPending
                      ? "NEW CUSTOMER ORDER"
                      : "ORDER SUMMARY"}
                  </Text>

                  <Text
                    className="mt-2"
                    style={{
                      color: "#FFFFFF",
                      fontFamily: providerTheme.fonts.extraBold,
                      fontSize: 30,
                      lineHeight: 36,
                    }}
                  >
                    ₹{order.total}
                  </Text>

                  <Text
                    className="mt-1"
                    style={{
                      color: "#FFFFFF",
                      opacity: 0.78,
                      fontFamily: providerTheme.fonts.regular,
                      fontSize: 13,
                    }}
                  >
                    {itemCount}{" "}
                    {itemCount === 1 ? "item" : "items"} in this order
                  </Text>
                </View>

                <View
                  className="h-14 w-14 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.16)",
                  }}
                >
                  <Ionicons
                    name="receipt-outline"
                    size={28}
                    color="#FFFFFF"
                  />
                </View>
              </View>
            </View>

            <View
              className="flex-row items-center px-5 py-3"
              style={{
                backgroundColor: "rgba(0,0,0,0.08)",
              }}
            >
              <Ionicons
                name="time-outline"
                size={16}
                color="#FFFFFF"
              />

              <Text
                className="ml-2"
                style={{
                  color: "#FFFFFF",
                  fontFamily: providerTheme.fonts.semibold,
                  fontSize: 13,
                }}
              >
                {order.deliverySlot}
              </Text>

              {order.type === "subscription" && (
                <View
                  className="ml-3 flex-row items-center rounded-full px-3 py-1.5"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.16)",
                  }}
                >
                  <Ionicons
                    name="repeat-outline"
                    size={12}
                    color="#FFFFFF"
                  />

                  <Text
                    className="ml-1"
                    style={{
                      color: "#FFFFFF",
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

          {/* CUSTOMER */}

          <SectionHeader
            icon="person-outline"
            title="Customer"
          />

          <View
            className="mt-3 rounded-[22px] p-4"
            style={{
              backgroundColor: providerTheme.bg,
              borderWidth: 1,
              borderColor: providerTheme.border,
              ...providerTheme.shadows.card,
            }}
          >
            <View className="flex-row items-center">
              <View
                className="h-12 w-12 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: providerTheme.primaryLight,
                }}
              >
                <Text
                  style={{
                    color: providerTheme.primary,
                    fontFamily: providerTheme.fonts.bold,
                    fontSize: 18,
                  }}
                >
                  {order.customerName
                    ? order.customerName.charAt(0).toUpperCase()
                    : "C"}
                </Text>
              </View>

              <View className="ml-3 flex-1">
                <Text
                  style={{
                    color: providerTheme.text,
                    fontFamily: providerTheme.fonts.bold,
                    fontSize: 17,
                  }}
                >
                  {order.customerName}
                </Text>

                <View className="mt-1 flex-row">
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color={providerTheme.textMuted}
                  />

                  <Text
                    className="ml-1 flex-1"
                    numberOfLines={2}
                    style={{
                      color: providerTheme.textSecondary,
                      fontFamily: providerTheme.fonts.regular,
                      fontSize: 12,
                      lineHeight: 18,
                    }}
                  >
                    {order.address}
                  </Text>
                </View>
              </View>

              {order.customerPhone && (
                <Pressable
                  onPress={handleCall}
                  className="h-11 w-11 items-center justify-center rounded-2xl"
                  style={({ pressed }) => ({
                    backgroundColor: providerTheme.successLight,

                    transform: [
                      {
                        scale: pressed ? 0.92 : 1,
                      },
                    ],
                  })}
                >
                  <Ionicons
                    name="call-outline"
                    size={19}
                    color={providerTheme.success}
                  />
                </Pressable>
              )}
            </View>
          </View>

          {/* DELIVERY */}

          <SectionHeader
            icon="bicycle-outline"
            title="Delivery"
          />

          <View
            className="mt-3 rounded-[22px] p-4"
            style={{
              backgroundColor: providerTheme.bg,
              borderWidth: 1,
              borderColor: providerTheme.border,
              ...providerTheme.shadows.card,
            }}
          >
            <InfoRow
              icon="time-outline"
              label="Delivery slot"
              value={order.deliverySlot}
            />

            <View
              className="my-4 h-px"
              style={{
                backgroundColor: providerTheme.divider,
              }}
            />

            <InfoRow
              icon="location-outline"
              label="Delivery address"
              value={order.address}
            />
          </View>

          {/* ITEMS */}

          <SectionHeader
            icon="fast-food-outline"
            title="Order items"
          />

          <View
            className="mt-3 overflow-hidden rounded-[22px]"
            style={{
              backgroundColor: providerTheme.bg,
              borderWidth: 1,
              borderColor: providerTheme.border,
              ...providerTheme.shadows.card,
            }}
          >
            {order.items.map((item, index) => (
              <View key={item.id ?? index}>
                <View className="flex-row items-center p-4">
                  <View
                    className="h-11 w-11 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: providerTheme.surfaceWarm,
                    }}
                  >
                    <Text
                      style={{
                        color: providerTheme.primary,
                        fontFamily: providerTheme.fonts.bold,
                        fontSize: 14,
                      }}
                    >
                      {item.quantity}×
                    </Text>
                  </View>

                  <View className="ml-3 flex-1">
                    <Text
                      style={{
                        color: providerTheme.text,
                        fontFamily: providerTheme.fonts.semibold,
                        fontSize: 14,
                      }}
                    >
                      {item.name}
                    </Text>

                    <Text
                      className="mt-1"
                      style={{
                        color: providerTheme.textMuted,
                        fontFamily: providerTheme.fonts.regular,
                        fontSize: 12,
                      }}
                    >
                      ₹{item.price} each
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: providerTheme.text,
                      fontFamily: providerTheme.fonts.bold,
                      fontSize: 15,
                    }}
                  >
                    ₹{item.price * item.quantity}
                  </Text>
                </View>

                {index < order.items.length - 1 && (
                  <View
                    className="mx-4 h-px"
                    style={{
                      backgroundColor: providerTheme.divider,
                    }}
                  />
                )}
              </View>
            ))}

            <View
              className="flex-row items-center justify-between px-4 py-4"
              style={{
                backgroundColor: providerTheme.surfaceWarm,
              }}
            >
              <Text
                style={{
                  color: providerTheme.textSecondary,
                  fontFamily: providerTheme.fonts.medium,
                  fontSize: 14,
                }}
              >
                Total
              </Text>

              <Text
                style={{
                  color: providerTheme.primary,
                  fontFamily: providerTheme.fonts.extraBold,
                  fontSize: 22,
                }}
              >
                ₹{order.total}
              </Text>
            </View>
          </View>

          {/* CUSTOMER NOTE */}

          {order.note && (
            <>
              <SectionHeader
                icon="chatbubble-ellipses-outline"
                title="Customer note"
              />

              <View
                className="mt-3 rounded-[22px] p-4"
                style={{
                  backgroundColor: providerTheme.warningLight,
                  borderWidth: 1,
                  borderColor: providerTheme.warning + "30",
                }}
              >
                <View className="flex-row">
                  <Ionicons
                    name="information-circle-outline"
                    size={20}
                    color={providerTheme.warning}
                  />

                  <Text
                    className="ml-3 flex-1"
                    style={{
                      color: providerTheme.textSecondary,
                      fontFamily: providerTheme.fonts.medium,
                      fontSize: 13,
                      lineHeight: 20,
                    }}
                  >
                    {order.note}
                  </Text>
                </View>
              </View>
            </>
          )}

          {/* REJECTION */}

          {order.rejectionReason && (
            <>
              <SectionHeader
                icon="alert-circle-outline"
                title="Rejection reason"
              />

              <View
                className="mt-3 rounded-[22px] p-4"
                style={{
                  backgroundColor: providerTheme.dangerLight,
                  borderWidth: 1,
                  borderColor: providerTheme.danger + "30",
                }}
              >
                <Text
                  style={{
                    color: providerTheme.danger,
                    fontFamily: providerTheme.fonts.medium,
                    fontSize: 13,
                    lineHeight: 20,
                  }}
                >
                  {order.rejectionReason}
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      </Animated.View>

      {/* BOTTOM ACTIONS */}

      {(isPending || nextStatus) && (
        <View
          className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-3"
          style={{
            backgroundColor: providerTheme.bg,
            borderTopWidth: 1,
            borderTopColor: providerTheme.border,
          }}
        >
          {isPending ? (
            <View className="flex-row">
              {/* REJECT */}

              <Pressable
                disabled={actionLoading}
                onPress={() => setShowRejectSheet(true)}
                className="mr-2 flex-1"
                style={({ pressed }) => ({
                  height: 54,
                  borderRadius: 17,
                  borderWidth: 1.5,
                  borderColor: providerTheme.danger,
                  backgroundColor: pressed
                    ? providerTheme.dangerLight
                    : providerTheme.bg,
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: actionLoading ? 0.5 : 1,
                  transform: [
                    {
                      scale: pressed ? 0.97 : 1,
                    },
                  ],
                })}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name="close-circle-outline"
                    size={19}
                    color={providerTheme.danger}
                  />

                  <Text
                    className="ml-2"
                    style={{
                      color: providerTheme.danger,
                      fontFamily: providerTheme.fonts.bold,
                      fontSize: 14,
                    }}
                  >
                    Reject
                  </Text>
                </View>
              </Pressable>

              {/* ACCEPT */}

              <Pressable
                disabled={actionLoading}
                onPress={handleAccept}
                className="ml-2 flex-1"
                style={({ pressed }) => ({
                  height: 54,
                  borderRadius: 17,
                  backgroundColor: pressed
                    ? providerTheme.primaryDark
                    : providerTheme.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: actionLoading ? 0.65 : 1,
                  transform: [
                    {
                      scale: pressed ? 0.97 : 1,
                    },
                  ],
                  ...providerTheme.shadows.floating,
                })}
              >
                {actionLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <View className="flex-row items-center">
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={20}
                      color="#FFFFFF"
                    />

                    <Text
                      className="ml-2"
                      style={{
                        color: "#FFFFFF",
                        fontFamily: providerTheme.fonts.bold,
                        fontSize: 14,
                      }}
                    >
                      Accept order
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>
          ) : (
            <Pressable
              disabled={actionLoading}
              onPress={handleNextStatus}
              style={({ pressed }) => ({
                height: 56,
                borderRadius: 18,
                backgroundColor: pressed
                  ? providerTheme.primaryDark
                  : providerTheme.primary,
                alignItems: "center",
                justifyContent: "center",
                opacity: actionLoading ? 0.65 : 1,
                transform: [
                  {
                    scale: pressed ? 0.98 : 1,
                  },
                ],
                ...providerTheme.shadows.floating,
              })}
            >
              {actionLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <View className="flex-row items-center">
                  <Ionicons
                    name={
                      NEXT_ICON[order.status] ??
                      "arrow-forward-outline"
                    }
                    size={21}
                    color="#FFFFFF"
                  />

                  <Text
                    className="ml-2"
                    style={{
                      color: "#FFFFFF",
                      fontFamily: providerTheme.fonts.bold,
                      fontSize: 15,
                    }}
                  >
                    {NEXT_LABEL[order.status]}
                  </Text>
                </View>
              )}
            </Pressable>
          )}
        </View>
      )}

      <RejectReasonSheet
        visible={showRejectSheet}
        onClose={() => setShowRejectSheet(false)}
        onConfirm={handleReject}
      />
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/* SMALL REUSABLE UI COMPONENTS                                              */
/* -------------------------------------------------------------------------- */

function SectionHeader({
  icon,
  title,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}) {
  return (
    <View className="mb-0 mt-6 flex-row items-center">
      <View
        className="h-9 w-9 items-center justify-center rounded-xl"
        style={{
          backgroundColor: providerTheme.primaryLight,
        }}
      >
        <Ionicons
          name={icon}
          size={18}
          color={providerTheme.primary}
        />
      </View>

      <Text
        className="ml-3"
        style={{
          color: providerTheme.text,
          fontFamily: providerTheme.fonts.bold,
          fontSize: 17,
        }}
      >
        {title}
      </Text>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center">
      <View
        className="h-10 w-10 items-center justify-center rounded-xl"
        style={{
          backgroundColor: providerTheme.surfaceWarm,
        }}
      >
        <Ionicons
          name={icon}
          size={18}
          color={providerTheme.primary}
        />
      </View>

      <View className="ml-3 flex-1">
        <Text
          style={{
            color: providerTheme.textMuted,
            fontFamily: providerTheme.fonts.medium,
            fontSize: 11,
          }}
        >
          {label}
        </Text>

        <Text
          className="mt-1"
          style={{
            color: providerTheme.text,
            fontFamily: providerTheme.fonts.semibold,
            fontSize: 14,
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}