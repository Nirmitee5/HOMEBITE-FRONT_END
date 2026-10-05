import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const COLORS = {
  background: "#FFF8EF",
  primary: "#C84A25",
  text: "#2A2A2A",
  muted: "#8A8A8A",
  border: "#EDE4D8",
  surface: "#FFFFFF",
  success: "#6D9E4E",
  successLight: "#EDF6E8",
  selected: "#FBE9E2",
  warning: "#D88A22",
  warningLight: "#FFF3DD",
  danger: "#D94A45",
  dangerLight: "#FDECEA",
  info: "#5578C7",
  infoLight: "#EAF0FC",
};

type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "rejected"
  | "cancelled";

type OrderSection = "Active" | "History";

type CustomerOrder = {
  id: string;
  meal: string;
  provider: string;
  total: number;
  date: string;
  time: string;
  status: OrderStatus;
  image: string;
  itemCount: number;
};

const orders: CustomerOrder[] = [
  {
    id: "HB1048",
    meal: "Punjabi Tiffin",
    provider: "Simran's Rasoi",
    total: 189,
    date: "Today",
    time: "1:10 PM",
    status: "preparing",
    itemCount: 1,
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "HB1045",
    meal: "Dal Rice Comfort Bowl",
    provider: "Anita's Home Kitchen",
    total: 149,
    date: "Today",
    time: "7:45 PM",
    status: "accepted",
    itemCount: 1,
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "HB1039",
    meal: "Maharashtrian Thali",
    provider: "Aai's Kitchen",
    total: 169,
    date: "18 Sep 2026",
    time: "12:35 PM",
    status: "delivered",
    itemCount: 2,
    image:
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "HB1026",
    meal: "Healthy Lunch Bowl",
    provider: "Daily Bowl Kitchen",
    total: 179,
    date: "15 Sep 2026",
    time: "1:25 PM",
    status: "cancelled",
    itemCount: 1,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "HB1018",
    meal: "Chicken Curry Meal",
    provider: "Fatima's Home Food",
    total: 219,
    date: "10 Sep 2026",
    time: "8:10 PM",
    status: "rejected",
    itemCount: 1,
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80",
  },
];

const activeStatuses: OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "out_for_delivery",
];

const statusMeta: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    background: string;
    icon:
      | "time-outline"
      | "checkmark-circle-outline"
      | "restaurant-outline"
      | "bag-check-outline"
      | "bicycle-outline"
      | "home-outline"
      | "close-circle-outline";
  }
> = {
  pending: {
    label: "Pending",
    color: COLORS.warning,
    background: COLORS.warningLight,
    icon: "time-outline",
  },
  accepted: {
    label: "Accepted",
    color: COLORS.info,
    background: COLORS.infoLight,
    icon: "checkmark-circle-outline",
  },
  preparing: {
    label: "Preparing",
    color: COLORS.primary,
    background: COLORS.selected,
    icon: "restaurant-outline",
  },
  ready: {
    label: "Ready",
    color: COLORS.success,
    background: COLORS.successLight,
    icon: "bag-check-outline",
  },
  out_for_delivery: {
    label: "Out for delivery",
    color: COLORS.info,
    background: COLORS.infoLight,
    icon: "bicycle-outline",
  },
  delivered: {
    label: "Delivered",
    color: COLORS.success,
    background: COLORS.successLight,
    icon: "home-outline",
  },
  rejected: {
    label: "Rejected",
    color: COLORS.danger,
    background: COLORS.dangerLight,
    icon: "close-circle-outline",
  },
  cancelled: {
    label: "Cancelled",
    color: COLORS.muted,
    background: COLORS.background,
    icon: "close-circle-outline",
  },
};

function OrderCard({ order }: { order: CustomerOrder }) {
  const meta = statusMeta[order.status];
  const isActive = activeStatuses.includes(order.status);

  function openOrder() {
    Alert.alert(
      isActive ? "Order Tracking" : "Order Details",
      `${isActive ? "Order Tracking" : "Order Details"} will be connected in a later Customer group.`,
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.orderCard,
        pressed && styles.cardPressed,
      ]}
      onPress={openOrder}
    >
      <View style={styles.orderTopRow}>
        <Text style={styles.orderNumber}>Order #{order.id}</Text>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: meta.background },
          ]}
        >
          <Ionicons name={meta.icon} size={13} color={meta.color} />
          <Text style={[styles.statusText, { color: meta.color }]}>
            {meta.label}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.orderBody}>
        <Image source={{ uri: order.image }} style={styles.orderImage} />

        <View style={styles.orderContent}>
          <Text style={styles.mealName} numberOfLines={1}>
            {order.meal}
          </Text>
          <Text style={styles.providerName} numberOfLines={1}>
            {order.provider}
          </Text>

          <Text style={styles.itemCount}>
            {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
          </Text>

          <View style={styles.dateRow}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={COLORS.muted}
            />
            <Text style={styles.dateText}>
              {order.date} • {order.time}
            </Text>
          </View>
        </View>

        <View style={styles.totalWrap}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.total}>₹{order.total}</Text>
        </View>
      </View>

      {isActive ? (
        <Pressable
          style={styles.trackButton}
          onPress={(event) => {
            event.stopPropagation();
            openOrder();
          }}
        >
          <MaterialCommunityIcons
            name="map-marker-path"
            size={18}
            color={COLORS.primary}
          />
          <Text style={styles.trackButtonText}>Track order</Text>
          <Ionicons
            name="arrow-forward"
            size={17}
            color={COLORS.primary}
          />
        </Pressable>
      ) : (
        <View style={styles.historyActions}>
          <Pressable
            style={styles.secondaryButton}
            onPress={(event) => {
              event.stopPropagation();
              Alert.alert(
                "Order Details",
                "Order details will be connected later.",
              );
            }}
          >
            <Text style={styles.secondaryButtonText}>View details</Text>
          </Pressable>

          {order.status === "delivered" ? (
            <Pressable
              style={styles.reorderButton}
              onPress={(event) => {
                event.stopPropagation();
                Alert.alert(
                  "Reorder",
                  "This meal will be added to the future cart flow.",
                );
              }}
            >
              <Ionicons name="repeat" size={15} color={COLORS.surface} />
              <Text style={styles.reorderButtonText}>Reorder</Text>
            </Pressable>
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

export default function OrdersScreen() {
  const [section, setSection] = useState<OrderSection>("Active");

  const visibleOrders = useMemo(
    () =>
      orders.filter((order) =>
        section === "Active"
          ? activeStatuses.includes(order.status)
          : !activeStatuses.includes(order.status),
      ),
    [section],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>YOUR HOMEBITE JOURNEY</Text>
        <Text style={styles.title}>My Orders</Text>
        <Text style={styles.subtitle}>
          Follow active orders or revisit meals you enjoyed.
        </Text>
      </View>

      <View style={styles.segment}>
        {(["Active", "History"] as OrderSection[]).map((item) => {
          const selected = section === item;
          const count = orders.filter((order) =>
            item === "Active"
              ? activeStatuses.includes(order.status)
              : !activeStatuses.includes(order.status),
          ).length;

          return (
            <Pressable
              key={item}
              style={[
                styles.segmentButton,
                selected && styles.segmentButtonSelected,
              ]}
              onPress={() => setSection(item)}
            >
              <Text
                style={[
                  styles.segmentText,
                  selected && styles.segmentTextSelected,
                ]}
              >
                {item}
              </Text>

              <View
                style={[
                  styles.segmentCount,
                  selected && styles.segmentCountSelected,
                ]}
              >
                <Text
                  style={[
                    styles.segmentCountText,
                    selected && styles.segmentCountTextSelected,
                  ]}
                >
                  {count}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {visibleOrders.length > 0 ? (
          visibleOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="receipt-text-outline"
              size={48}
              color={COLORS.primary}
            />
            <Text style={styles.emptyTitle}>
              {section === "Active"
                ? "No active orders"
                : "No order history"}
            </Text>
            <Text style={styles.emptyText}>
              {section === "Active"
                ? "Your new homemade-food orders will appear here."
                : "Completed and cancelled orders will appear here."}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  eyebrow: {
    color: COLORS.primary,
    fontFamily: "Poppins_700Bold",
    fontSize: 10,
  },
  title: {
    marginTop: 3,
    color: COLORS.text,
    fontFamily: "Poppins_700Bold",
    fontSize: 28,
  },
  subtitle: {
    marginTop: 4,
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
  },
  segment: {
    height: 50,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 4,
    borderRadius: 15,
    flexDirection: "row",
    backgroundColor: COLORS.selected,
  },
  segmentButton: {
    flex: 1,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  segmentButtonSelected: {
    backgroundColor: COLORS.surface,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  segmentText: {
    color: COLORS.muted,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
  },
  segmentTextSelected: {
    color: COLORS.primary,
  },
  segmentCount: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
  },
  segmentCountSelected: {
    backgroundColor: COLORS.selected,
  },
  segmentCountText: {
    color: COLORS.muted,
    fontFamily: "Poppins_700Bold",
    fontSize: 9,
  },
  segmentCountTextSelected: {
    color: COLORS.primary,
  },
  list: {
    padding: 20,
    gap: 14,
    paddingBottom: 36,
  },
  orderCard: {
    padding: 15,
    borderRadius: 19,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 9,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  orderTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  orderNumber: {
    color: COLORS.text,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 11,
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statusText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 9,
  },
  divider: {
    height: 1,
    marginVertical: 13,
    backgroundColor: COLORS.border,
  },
  orderBody: {
    flexDirection: "row",
  },
  orderImage: {
    width: 78,
    height: 82,
    borderRadius: 13,
    backgroundColor: COLORS.selected,
  },
  orderContent: {
    flex: 1,
    paddingLeft: 12,
  },
  mealName: {
    color: COLORS.text,
    fontFamily: "Poppins_700Bold",
    fontSize: 14,
  },
  providerName: {
    marginTop: 2,
    color: COLORS.primary,
    fontFamily: "Poppins_500Medium",
    fontSize: 10,
  },
  itemCount: {
    marginTop: 7,
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    fontSize: 9,
  },
  dateRow: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dateText: {
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    fontSize: 9,
  },
  totalWrap: {
    alignItems: "flex-end",
  },
  totalLabel: {
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    fontSize: 9,
  },
  total: {
    marginTop: 2,
    color: COLORS.text,
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
  },
  trackButton: {
    height: 44,
    marginTop: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: COLORS.selected,
  },
  trackButtonText: {
    color: COLORS.primary,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 11,
  },
  historyActions: {
    marginTop: 14,
    flexDirection: "row",
    gap: 9,
  },
  secondaryButton: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 10,
  },
  reorderButton: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: COLORS.primary,
  },
  reorderButtonText: {
    color: COLORS.surface,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 10,
  },
  emptyState: {
    marginTop: 35,
    padding: 35,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyTitle: {
    marginTop: 12,
    color: COLORS.text,
    fontFamily: "Poppins_700Bold",
    fontSize: 17,
  },
  emptyText: {
    marginTop: 5,
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    lineHeight: 18,
    textAlign: "center",
  },
});
