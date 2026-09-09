import { useCallback, useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import ApprovalBanner from "../../components/provider/ApprovalBanner";
import EmptyState from "../../components/provider/EmptyState";
import OrderCard from "../../components/provider/OrderCard";
import StatCard from "../../components/provider/StatCard";

import { HOMEBITE_LOGO, providerTheme } from "../../constants/providerTheme";

import {
  fetchDashboardStats,
  fetchOrders,
} from "../../services/provider/orders";

import type { DashboardStats, Order } from "../../types/provider";

export default function DashboardScreen() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pending, setPending] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  /*
   * ---------------------------------------------------------
   * Animations
   * ---------------------------------------------------------
   */

  const headerAnim = useRef(new Animated.Value(0)).current;
  const heroAnim = useRef(new Animated.Value(0)).current;
  const statusAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const actionsAnim = useRef(new Animated.Value(0)).current;
  const ordersAnim = useRef(new Animated.Value(0)).current;

  const runEntranceAnimation = useCallback(() => {
    headerAnim.setValue(0);
    heroAnim.setValue(0);
    statusAnim.setValue(0);
    statsAnim.setValue(0);
    actionsAnim.setValue(0);
    ordersAnim.setValue(0);

    Animated.stagger(80, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(heroAnim, {
        toValue: 1,
        duration: 550,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(statusAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(statsAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(actionsAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(ordersAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [headerAnim, heroAnim, statusAnim, statsAnim, actionsAnim, ordersAnim]);

  /*
   * ---------------------------------------------------------
   * Data
   * ---------------------------------------------------------
   */

  const load = useCallback(async () => {
    const [s, o] = await Promise.all([
      fetchDashboardStats(),
      fetchOrders("pending"),
    ]);

    setStats(s);
    setPending(o);
  }, []);

  useEffect(() => {
    load()
      .catch((error) => {
        console.error("Dashboard loading error:", error);
      })
      .finally(() => {
        setLoading(false);

        requestAnimationFrame(() => {
          runEntranceAnimation();
        });
      });
  }, [load, runEntranceAnimation]);

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await load();
      runEntranceAnimation();
    } finally {
      setRefreshing(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * Loading
   * ---------------------------------------------------------
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
          className="h-16 w-16 items-center justify-center rounded-[22px]"
          style={{
            backgroundColor: providerTheme.primaryLight,
          }}
        >
          <ActivityIndicator size="small" color={providerTheme.primary} />
        </View>

        <Text
          className="mt-4"
          style={{
            color: providerTheme.textMuted,
            fontFamily: providerTheme.fonts.medium,
            fontSize: 13,
          }}
        >
          Preparing your kitchen...
        </Text>
      </SafeAreaView>
    );
  }

  /*
   * ---------------------------------------------------------
   * Animated section helper
   * ---------------------------------------------------------
   */

  const animatedStyle = (animation: Animated.Value, distance = 18) => ({
    opacity: animation,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [distance, 0],
        }),
      },
    ],
  });

  /*
   * ---------------------------------------------------------
   * Quick actions
   * ---------------------------------------------------------
   */

  const quickActions = [
    {
      icon: "add-circle-outline" as const,
      label: "Add menu",
      description: "Create dish",
      to: "/provider/profile",
    },
    {
      icon: "videocam-outline" as const,
      label: "Food video",
      description: "Show your food",
      to: "/provider/profile",
    },
    {
      icon: "wallet-outline" as const,
      label: "Withdraw",
      description: "View earnings",
      to: "/provider/earnings",
    },
  ];

  return (
    <SafeAreaView
      className="flex-1"
      style={{
        backgroundColor: providerTheme.surface,
      }}
      edges={["top"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 50,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={providerTheme.primary}
          />
        }
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <Animated.View
          style={animatedStyle(headerAnim, 12)}
          className="mb-6 flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <View
              className="h-12 w-12 items-center justify-center rounded-[17px]"
              style={{
                backgroundColor: providerTheme.bg,
                borderWidth: 1,
                borderColor: providerTheme.border,
                ...providerTheme.shadows.card,
              }}
            >
              <Image
                source={HOMEBITE_LOGO}
                style={{
                  width: 34,
                  height: 34,
                }}
                resizeMode="contain"
              />
            </View>

            <View className="ml-3">
              <Text
                style={{
                  color: providerTheme.textMuted,
                  fontFamily: providerTheme.fonts.medium,
                  fontSize: 12,
                }}
              >
                Good morning 👋
              </Text>

              <Text
                className="mt-0.5"
                style={{
                  color: providerTheme.text,
                  fontFamily: providerTheme.fonts.bold,
                  fontSize: 19,
                }}
              >
                Meera's Kitchen
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.push("/provider/profile")}
            className="h-11 w-11 items-center justify-center rounded-full"
            style={({ pressed }) => ({
              backgroundColor: providerTheme.bg,
              borderWidth: 1,
              borderColor: providerTheme.border,
              opacity: pressed ? 0.75 : 1,
              transform: [
                {
                  scale: pressed ? 0.94 : 1,
                },
              ],
            })}
          >
            <Ionicons
              name="notifications-outline"
              size={21}
              color={providerTheme.text}
            />

            {/* Notification dot */}
            {pending.length > 0 && (
              <View
                className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: providerTheme.primary,
                  borderWidth: 1.5,
                  borderColor: providerTheme.bg,
                }}
              />
            )}
          </Pressable>
        </Animated.View>

        {/* =====================================================
            APPROVAL
        ====================================================== */}

        <ApprovalBanner status="under_review" />

        {/* =====================================================
            HERO EARNINGS CARD
        ====================================================== */}

        <Animated.View style={animatedStyle(heroAnim, 22)} className="mb-5">
          <View
            className="overflow-hidden rounded-[28px]"
            style={{
              backgroundColor: providerTheme.primary,
              ...providerTheme.shadows.floating,
            }}
          >
            {/* Decorative circles */}

            <View
              className="absolute -right-12 -top-14 h-40 w-40 rounded-full"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
              }}
            />

            <View
              className="absolute -bottom-20 right-12 h-32 w-32 rounded-full"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
              }}
            />

            <View className="p-6">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View
                    className="h-10 w-10 items-center justify-center rounded-2xl"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.16)",
                    }}
                  >
                    <Ionicons name="wallet-outline" size={20} color="#FFFFFF" />
                  </View>

                  <Text
                    className="ml-3"
                    style={{
                      color: "rgba(255,255,255,0.82)",
                      fontFamily: providerTheme.fonts.medium,
                      fontSize: 13,
                    }}
                  >
                    Today's earnings
                  </Text>
                </View>

                <View
                  className="flex-row items-center rounded-full px-3 py-1.5"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.13)",
                  }}
                >
                  <View
                    className="mr-1.5 h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor: "#FFFFFF",
                    }}
                  />

                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontFamily: providerTheme.fonts.semibold,
                      fontSize: 11,
                    }}
                  >
                    Today
                  </Text>
                </View>
              </View>

              <Text
                className="mt-5"
                style={{
                  color: "#FFFFFF",
                  fontFamily: providerTheme.fonts.extraBold,
                  fontSize: 38,
                  lineHeight: 45,
                }}
              >
                ₹{stats?.todayEarnings ?? 0}
              </Text>

              <Text
                className="mt-1"
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontFamily: providerTheme.fonts.regular,
                  fontSize: 13,
                }}
              >
                From {stats?.todayOrders ?? 0} orders today
              </Text>

              <View className="mt-6 flex-row items-center">
                <View
                  className="flex-row items-center rounded-full px-3 py-2"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.13)",
                  }}
                >
                  <Ionicons
                    name="restaurant-outline"
                    size={14}
                    color="#FFFFFF"
                  />

                  <Text
                    className="ml-2"
                    style={{
                      color: "#FFFFFF",
                      fontFamily: providerTheme.fonts.medium,
                      fontSize: 11,
                    }}
                  >
                    Keep serving with love
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* =====================================================
            KITCHEN STATUS
        ====================================================== */}

        <Animated.View style={animatedStyle(statusAnim, 18)} className="mb-7">
          <View
            className="overflow-hidden rounded-[24px]"
            style={{
              backgroundColor: providerTheme.bg,
              borderWidth: 1,
              borderColor: providerTheme.border,
              ...providerTheme.shadows.card,
            }}
          >
            <View className="flex-row items-center p-4">
              <View
                className="h-12 w-12 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: isOpen
                    ? providerTheme.successLight
                    : providerTheme.surfaceWarm,
                }}
              >
                <Ionicons
                  name={isOpen ? "restaurant-outline" : "moon-outline"}
                  size={22}
                  color={
                    isOpen ? providerTheme.success : providerTheme.textMuted
                  }
                />
              </View>

              <View className="ml-3 flex-1">
                <View className="flex-row items-center">
                  <Text
                    style={{
                      color: providerTheme.text,
                      fontFamily: providerTheme.fonts.bold,
                      fontSize: 15,
                    }}
                  >
                    {isOpen ? "Your kitchen is open" : "Your kitchen is closed"}
                  </Text>

                  <View
                    className="ml-2 h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: isOpen
                        ? providerTheme.success
                        : providerTheme.textMuted,
                    }}
                  />
                </View>

                <Text
                  className="mt-1"
                  style={{
                    color: providerTheme.textMuted,
                    fontFamily: providerTheme.fonts.regular,
                    fontSize: 12,
                  }}
                >
                  {isOpen
                    ? "Customers can order from you now"
                    : "You won't receive new orders"}
                </Text>
              </View>

              <Switch
                value={isOpen}
                onValueChange={setIsOpen}
                trackColor={{
                  true: providerTheme.primary,
                  false: providerTheme.border,
                }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View className="px-4 pb-4">
              <View
                className="rounded-xl px-3 py-2.5"
                style={{
                  backgroundColor: isOpen
                    ? providerTheme.successLight
                    : providerTheme.surfaceWarm,
                }}
              >
                <Text
                  style={{
                    color: isOpen
                      ? providerTheme.success
                      : providerTheme.textMuted,
                    fontFamily: providerTheme.fonts.medium,
                    fontSize: 11,
                  }}
                >
                  {isOpen ? "●  Live on HomeBite" : "●  Currently unavailable"}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* =====================================================
            TODAY
        ====================================================== */}

        <Animated.View style={animatedStyle(statsAnim, 18)}>
          <View className="mb-3 flex-row items-end justify-between">
            <View>
              <Text
                style={{
                  color: providerTheme.text,
                  fontFamily: providerTheme.fonts.bold,
                  fontSize: 23,
                }}
              >
                Today's kitchen
              </Text>

              <Text
                className="mt-1"
                style={{
                  color: providerTheme.textMuted,
                  fontFamily: providerTheme.fonts.regular,
                  fontSize: 12,
                }}
              >
                A quick look at your performance
              </Text>
            </View>

            <Ionicons
              name="analytics-outline"
              size={22}
              color={providerTheme.primary}
            />
          </View>

          <View className="flex-row gap-3">
            <StatCard
              icon="receipt-outline"
              label="Orders today"
              value={String(stats?.todayOrders ?? 0)}
            />

            <StatCard
              icon="cash-outline"
              label="Earnings today"
              value={`₹${stats?.todayEarnings ?? 0}`}
              tint={providerTheme.success}
              tintBg={providerTheme.successLight}
            />
          </View>

          <View className="mt-3 flex-row gap-3">
            <StatCard
              icon="hourglass-outline"
              label="Pending orders"
              value={String(stats?.pendingOrders ?? 0)}
              tint={providerTheme.warning}
              tintBg={providerTheme.warningLight}
            />

            <StatCard
              icon="repeat-outline"
              label="Subscriptions"
              value={String(stats?.activeSubscriptions ?? 0)}
              tint={providerTheme.info}
              tintBg={providerTheme.infoLight}
            />
          </View>

          {/* Rating */}

          <View
            className="mt-3 overflow-hidden rounded-[22px]"
            style={{
              backgroundColor: providerTheme.bg,
              borderWidth: 1,
              borderColor: providerTheme.border,
              ...providerTheme.shadows.card,
            }}
          >
            <View className="flex-row items-center p-4">
              <View
                className="h-11 w-11 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: providerTheme.warningLight,
                }}
              >
                <Ionicons name="star" size={21} color={providerTheme.warning} />
              </View>

              <View className="ml-3 flex-1">
                <Text
                  style={{
                    color: providerTheme.text,
                    fontFamily: providerTheme.fonts.bold,
                    fontSize: 15,
                  }}
                >
                  Customer rating
                </Text>

                <Text
                  className="mt-0.5"
                  style={{
                    color: providerTheme.textMuted,
                    fontFamily: providerTheme.fonts.regular,
                    fontSize: 11,
                  }}
                >
                  Based on {stats?.totalReviews ?? 0} reviews
                </Text>
              </View>

              <View className="items-end">
                <View className="flex-row items-center">
                  <Text
                    style={{
                      color: providerTheme.text,
                      fontFamily: providerTheme.fonts.extraBold,
                      fontSize: 24,
                    }}
                  >
                    {stats?.rating ?? 0}
                  </Text>

                  <Text
                    className="ml-1"
                    style={{
                      color: providerTheme.warning,
                      fontFamily: providerTheme.fonts.bold,
                      fontSize: 13,
                    }}
                  >
                    / 5
                  </Text>
                </View>

                <View className="mt-1 flex-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name="star"
                      size={11}
                      color={providerTheme.warning}
                      style={{
                        marginLeft: star === 1 ? 0 : 2,
                        opacity:
                          star <= Math.round(Number(stats?.rating ?? 0))
                            ? 1
                            : 0.2,
                      }}
                    />
                  ))}
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* =====================================================
            QUICK ACTIONS
        ====================================================== */}

        <Animated.View style={animatedStyle(actionsAnim, 18)} className="mt-7">
          <View className="mb-3">
            <Text
              style={{
                color: providerTheme.text,
                fontFamily: providerTheme.fonts.bold,
                fontSize: 20,
              }}
            >
              Quick actions
            </Text>

            <Text
              className="mt-1"
              style={{
                color: providerTheme.textMuted,
                fontFamily: providerTheme.fonts.regular,
                fontSize: 12,
              }}
            >
              Manage your kitchen faster
            </Text>
          </View>

          <View className="flex-row gap-3">
            {quickActions.map((action) => (
              <Pressable
                key={action.label}
                onPress={() => router.push(action.to as never)}
                className="flex-1"
                style={({ pressed }) => ({
                  transform: [
                    {
                      scale: pressed ? 0.96 : 1,
                    },
                  ],
                })}
              >
                <View
                  className="min-h-[116px] rounded-[22px] p-4"
                  style={{
                    backgroundColor: providerTheme.bg,
                    borderWidth: 1,
                    borderColor: providerTheme.border,
                    ...providerTheme.shadows.card,
                  }}
                >
                  <View
                    className="h-10 w-10 items-center justify-center rounded-2xl"
                    style={{
                      backgroundColor: providerTheme.primaryLight,
                    }}
                  >
                    <Ionicons
                      name={action.icon}
                      size={20}
                      color={providerTheme.primary}
                    />
                  </View>

                  <Text
                    className="mt-3"
                    style={{
                      color: providerTheme.text,
                      fontFamily: providerTheme.fonts.bold,
                      fontSize: 13,
                    }}
                  >
                    {action.label}
                  </Text>

                  <Text
                    className="mt-0.5"
                    numberOfLines={1}
                    style={{
                      color: providerTheme.textMuted,
                      fontFamily: providerTheme.fonts.regular,
                      fontSize: 10,
                    }}
                  >
                    {action.description}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* =====================================================
            NEW ORDERS
        ====================================================== */}

        <Animated.View style={animatedStyle(ordersAnim, 18)} className="mt-8">
          <View className="mb-4 flex-row items-end justify-between">
            <View>
              <View className="flex-row items-center">
                <Text
                  style={{
                    color: providerTheme.text,
                    fontFamily: providerTheme.fonts.bold,
                    fontSize: 20,
                  }}
                >
                  New orders
                </Text>

                {pending.length > 0 && (
                  <View
                    className="ml-2 min-w-[22px] items-center rounded-full px-1.5 py-1"
                    style={{
                      backgroundColor: providerTheme.primaryLight,
                    }}
                  >
                    <Text
                      style={{
                        color: providerTheme.primary,
                        fontFamily: providerTheme.fonts.bold,
                        fontSize: 10,
                      }}
                    >
                      {pending.length}
                    </Text>
                  </View>
                )}
              </View>

              <Text
                className="mt-1"
                style={{
                  color: providerTheme.textMuted,
                  fontFamily: providerTheme.fonts.regular,
                  fontSize: 12,
                }}
              >
                Orders waiting for your response
              </Text>
            </View>

            <Pressable
              onPress={() => router.push("/provider/orders")}
              className="flex-row items-center rounded-full px-3 py-2"
              style={{
                backgroundColor: providerTheme.primaryLight,
              }}
            >
              <Text
                style={{
                  color: providerTheme.primary,
                  fontFamily: providerTheme.fonts.semibold,
                  fontSize: 11,
                }}
              >
                See all
              </Text>

              <Ionicons
                name="arrow-forward"
                size={13}
                color={providerTheme.primary}
                style={{
                  marginLeft: 4,
                }}
              />
            </Pressable>
          </View>

          {pending.length === 0 ? (
            <View
              className="overflow-hidden rounded-[24px]"
              style={{
                backgroundColor: providerTheme.bg,
                borderWidth: 1,
                borderColor: providerTheme.border,
              }}
            >
              <EmptyState
                icon="checkmark-circle-outline"
                title="You're all caught up"
                subtitle="There are no new orders waiting for you right now."
              />
            </View>
          ) : (
            pending.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onPress={() =>
                  router.push({
                    pathname: "/provider/order-details",
                    params: {
                      id: order.id,
                    },
                  })
                }
                onAccept={() =>
                  router.push({
                    pathname: "/provider/order-details",
                    params: {
                      id: order.id,
                    },
                  })
                }
                onReject={() =>
                  router.push({
                    pathname: "/provider/order-details",
                    params: {
                      id: order.id,
                    },
                  })
                }
              />
            ))
          )}
        </Animated.View>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <View className="mt-8 items-center">
          <View className="flex-row items-center">
            <Ionicons name="heart" size={12} color={providerTheme.primary} />

            <Text
              className="ml-1.5"
              style={{
                color: providerTheme.textMuted,
                fontFamily: providerTheme.fonts.medium,
                fontSize: 10,
              }}
            >
              Made with love for HomeBite providers
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
