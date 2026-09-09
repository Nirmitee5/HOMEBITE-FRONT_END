import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EmptyState from "../../components/provider/EmptyState";
import OrderCard from "../../components/provider/OrderCard";
import RejectReasonSheet from "../../components/provider/RejectReasonSheet";

import { providerTheme } from "../../constants/providerTheme";

import {
  acceptOrder,
  fetchOrders,
  rejectOrder,
} from "../../services/provider/orders";

import type { Order } from "../../types/provider";

type Filter =
  | "all"
  | "pending"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "rejected";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "New" },
  { key: "preparing", label: "Preparing" },
  { key: "out_for_delivery", label: "On the way" },
  { key: "delivered", label: "Delivered" },
  { key: "rejected", label: "Rejected" },
];

export default function OrdersScreen() {
  const [filter, setFilter] = useState<Filter>("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  /*
   * Screen entrance animation
   */
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  /*
   * Filter animation
   */
  const filterScale = useRef(
    FILTERS.reduce(
      (acc, item) => {
        acc[item.key] = new Animated.Value(1);
        return acc;
      },
      {} as Record<Filter, Animated.Value>,
    ),
  ).current;

  const load = useCallback(async () => {
    try {
      const data = await fetchOrders(filter);
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    }
  }, [filter]);

  useEffect(() => {
    setLoading(true);

    load().finally(() => {
      setLoading(false);

      fadeAnim.setValue(0);
      slideAnim.setValue(20);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 55,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  };

  const handleFilterPress = (key: Filter) => {
    Animated.sequence([
      Animated.spring(filterScale[key], {
        toValue: 0.94,
        useNativeDriver: true,
      }),
      Animated.spring(filterScale[key], {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    setFilter(key);
  };

  const handleAccept = async (id: string) => {
    try {
      await acceptOrder(id);
      await load();
    } catch (error) {
      console.error("Failed to accept order:", error);
    }
  };

  const handleReject = async (reason: string) => {
    if (!rejectingId) return;

    try {
      await rejectOrder(rejectingId, reason);
      setRejectingId(null);
      await load();
    } catch (error) {
      console.error("Failed to reject order:", error);
    }
  };

  /*
   * Loading state
   */
  if (loading) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: providerTheme.surface }}
        edges={["top"]}
      >
        <View className="px-5 pt-5">
          <View className="flex-row items-center justify-between">
            <View>
              <View
                className="h-3 w-28 rounded-full"
                style={{ backgroundColor: providerTheme.border }}
              />

              <View
                className="mt-3 h-9 w-36 rounded-xl"
                style={{ backgroundColor: providerTheme.border }}
              />
            </View>

            <View
              className="h-12 w-12 rounded-2xl"
              style={{ backgroundColor: providerTheme.border }}
            />
          </View>
        </View>

        <View className="flex-1 items-center justify-center">
          <View
            className="h-16 w-16 items-center justify-center rounded-3xl"
            style={{ backgroundColor: providerTheme.primaryLight }}
          >
            <ActivityIndicator size="small" color={providerTheme.primary} />
          </View>

          <Text
            className="mt-4"
            style={{
              color: providerTheme.textSecondary,
              fontFamily: providerTheme.fonts.medium,
              fontSize: 14,
            }}
          >
            Loading orders...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: providerTheme.surface }}
      edges={["top"]}
    >
      <Animated.View
        className="flex-1"
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 18,
            paddingBottom: 40,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={providerTheme.primary}
            />
          }
          ListHeaderComponent={
            <View>
              {/* HEADER */}
              <View className="mb-5 flex-row items-center justify-between">
                <View>
                  <Text
                    style={{
                      color: providerTheme.textMuted,
                      fontFamily: providerTheme.fonts.medium,
                      fontSize: 13,
                    }}
                  >
                    Manage your kitchen
                  </Text>

                  <Text
                    className="mt-1"
                    style={{
                      color: providerTheme.text,
                      fontFamily: providerTheme.fonts.extraBold,
                      fontSize: 30,
                      lineHeight: 38,
                    }}
                  >
                    Orders
                  </Text>
                </View>

                <View
                  className="h-14 w-14 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: providerTheme.primaryLight,
                  }}
                >
                  <Ionicons
                    name="receipt-outline"
                    size={26}
                    color={providerTheme.primary}
                  />
                </View>
              </View>

              <Text
                className="mb-5"
                style={{
                  color: providerTheme.textSecondary,
                  fontFamily: providerTheme.fonts.regular,
                  fontSize: 14,
                  lineHeight: 21,
                }}
              >
                View, manage and respond to your customer orders.
              </Text>

              {/* FILTER TITLE */}
              <View className="mb-3 flex-row items-center justify-between">
                <Text
                  style={{
                    color: providerTheme.text,
                    fontFamily: providerTheme.fonts.bold,
                    fontSize: 16,
                  }}
                >
                  Order status
                </Text>

                <View className="flex-row items-center">
                  <View
                    className="mr-2 h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: providerTheme.primary,
                    }}
                  />

                  <Text
                    style={{
                      color: providerTheme.textMuted,
                      fontFamily: providerTheme.fonts.medium,
                      fontSize: 12,
                    }}
                  >
                    {orders.length} {orders.length === 1 ? "order" : "orders"}
                  </Text>
                </View>
              </View>

              {/* FILTERS */}
              <FlatList
                horizontal
                data={FILTERS}
                keyExtractor={(item) => item.key}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: 20,
                  paddingRight: 10,
                }}
                renderItem={({ item }) => {
                  const selected = filter === item.key;

                  return (
                    <Animated.View
                      style={{
                        transform: [
                          {
                            scale: filterScale[item.key],
                          },
                        ],
                      }}
                    >
                      <Pressable
                        onPress={() => handleFilterPress(item.key)}
                        style={{
                          marginRight: 9,
                        }}
                      >
                        <View
                          className="rounded-full px-4 py-3"
                          style={{
                            backgroundColor: selected
                              ? providerTheme.primary
                              : providerTheme.bg,

                            borderWidth: 1,
                            borderColor: selected
                              ? providerTheme.primary
                              : providerTheme.border,
                          }}
                        >
                          <Text
                            style={{
                              color: selected
                                ? "#FFFFFF"
                                : providerTheme.textSecondary,

                              fontFamily: selected
                                ? providerTheme.fonts.semibold
                                : providerTheme.fonts.medium,

                              fontSize: 13,
                            }}
                          >
                            {item.label}
                          </Text>
                        </View>
                      </Pressable>
                    </Animated.View>
                  );
                }}
              />
            </View>
          }
          ListEmptyComponent={
            <View
              className="mt-2 overflow-hidden rounded-[24px]"
              style={{
                backgroundColor: providerTheme.bg,
                borderWidth: 1,
                borderColor: providerTheme.border,
              }}
            >
              <EmptyState
                icon="receipt-outline"
                title={filter === "all" ? "No orders yet" : "No orders here"}
                subtitle={
                  filter === "all"
                    ? "Your incoming customer orders will appear here."
                    : "There are no orders matching this status."
                }
              />
            </View>
          }
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() =>
                router.push({
                  pathname: "/provider/order-details",
                  params: { id: item.id },
                })
              }
              onAccept={
                item.status === "pending"
                  ? () => handleAccept(item.id)
                  : undefined
              }
              onReject={
                item.status === "pending"
                  ? () => setRejectingId(item.id)
                  : undefined
              }
            />
          )}
        />
      </Animated.View>

      <RejectReasonSheet
        visible={!!rejectingId}
        onClose={() => setRejectingId(null)}
        onConfirm={handleReject}
      />
    </SafeAreaView>
  );
}
