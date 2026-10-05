// app/customer/cart.tsx
// HomeBite - Customer Cart Screen (One-time instant orders only)

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// HomeBite Design Tokens
const C = {
  bg: "#FFF8EF",
  surface: "#FFFFFF",
  primary: "#C84A25",
  primaryDark: "#A83B1D",
  accent: "#F0B27A",
  text: "#2A2A2A",
  muted: "#8A8A8A",
  border: "#EDE4D8",
  success: "#6D9E4E",
  lightSuccess: "#EDF6E8",
  danger: "#D94A45",
  selected: "#FBE9E2",
  white: "#FFFFFF",
};

interface CartItemData {
  id: string;
  mealId: string;
  name: string;
  providerName: string;
  providerType: "housewife" | "mess" | "home_kitchen";
  price: number;
  quantity: number;
  imageUrl: string;
  isVeg: boolean;
  selectedAddOns: { id: string; name: string; price: number }[];
}

// Realistic mock cart items
const INITIAL_CART_ITEMS: CartItemData[] = [
  {
    id: "cart-item-1",
    mealId: "meal-101",
    name: "Special Ghar Ki Thali",
    providerName: "Sunita's Ghar Ka Khana",
    providerType: "housewife",
    price: 180,
    quantity: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
    isVeg: true,
    selectedAddOns: [
      { id: "addon-1", name: "Extra Phulka (2 pcs)", price: 30 },
      { id: "addon-2", name: "Roasted Papad & Pickle", price: 15 },
    ],
  },
  {
    id: "cart-item-2",
    mealId: "meal-104",
    name: "Homestyle Dal Khichdi & Kadhi",
    providerName: "Aaji's Kitchen",
    providerType: "home_kitchen",
    price: 140,
    quantity: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80",
    isVeg: true,
    selectedAddOns: [],
  },
];

export default function CartScreen() {
  const router = useRouter();

  const [items, setItems] = useState<CartItemData[]>(INITIAL_CART_ITEMS);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>({
    code: "HOMEBITE50",
    discount: 50,
  });
  const [couponError, setCouponError] = useState<string | null>(null);

  // Bill calculations
  const subtotal = items.reduce((sum, item) => {
    const addOnsTotal = item.selectedAddOns.reduce((a, b) => a + b.price, 0);
    return sum + (item.price + addOnsTotal) * item.quantity;
  }, 0);

  const deliveryFee = subtotal > 350 ? 0 : 35;
  const platformFee = items.length > 0 ? 5 : 0;
  const packagingFee = items.length > 0 ? 20 : 0;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalTotal = Math.max(
    0,
    subtotal + deliveryFee + platformFee + packagingFee - discountAmount
  );

  const handleIncreaseQty = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQty = (id: string) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            if (item.quantity === 1) return null;
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter(Boolean) as CartItemData[]
    );
  };

  const handleRemoveItem = (id: string, name: string) => {
    Alert.alert("Remove Meal", `Remove "${name}" from your cart?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => setItems((prev) => prev.filter((i) => i.id !== id)),
      },
    ]);
  };

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    if (code === "HOMEBITE50") {
      setAppliedCoupon({ code, discount: 50 });
      setCouponError(null);
      setCouponCode("");
    } else if (code === "FIRSTBITE") {
      setAppliedCoupon({ code, discount: 80 });
      setCouponError(null);
      setCouponCode("");
    } else {
      setCouponError("Invalid coupon. Try HOMEBITE50 or FIRSTBITE");
    }
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    router.push("/customer/checkout");
  };

  // Empty State View
  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={C.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Cart</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="cart-outline" size={56} color={C.primary} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Looks like you haven't added any wholesome homemade meals yet.
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => router.push("/(tabs)/explore")}
            activeOpacity={0.8}
          >
            <Text style={styles.exploreBtnText}>Explore Homemade Meals</Text>
            <Ionicons name="arrow-forward" size={18} color={C.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={C.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Cart</Text>
          <Text style={styles.headerSubtitle}>
            {items.reduce((acc, i) => acc + i.quantity, 0)} items • Instant Order
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            Alert.alert("Clear Cart", "Are you sure you want to empty your cart?", [
              { text: "Cancel", style: "cancel" },
              { text: "Clear", style: "destructive", onPress: () => setItems([]) },
            ]);
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Instant Order Highlight Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="flash" size={18} color={C.primary} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.infoBannerTitle}>Instant One-Time Order</Text>
            <Text style={styles.infoBannerText}>
              Prepared fresh on-demand by home chefs. No recurring charges or subscriptions.
            </Text>
          </View>
        </View>

        {/* Order Items Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>

          {items.map((item) => {
            const addOnsTotal = item.selectedAddOns.reduce((a, b) => a + b.price, 0);
            const itemPriceWithAddOns = (item.price + addOnsTotal) * item.quantity;

            return (
              <View key={item.id} style={styles.itemCard}>
                <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />

                <View style={styles.itemInfo}>
                  <View style={styles.itemHeader}>
                    <View
                      style={[
                        styles.vegBadge,
                        { borderColor: item.isVeg ? C.success : C.danger },
                      ]}
                    >
                      <View
                        style={[
                          styles.vegDot,
                          { backgroundColor: item.isVeg ? C.success : C.danger },
                        ]}
                      />
                    </View>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>

                  <Text style={styles.providerName} numberOfLines={1}>
                    By {item.providerName}
                  </Text>

                  {/* Add-ons list */}
                  {item.selectedAddOns.length > 0 && (
                    <View style={styles.addOnsBox}>
                      {item.selectedAddOns.map((addon) => (
                        <Text key={addon.id} style={styles.addOnText}>
                          + {addon.name} (₹{addon.price})
                        </Text>
                      ))}
                    </View>
                  )}

                  <View style={styles.itemBottomRow}>
                    <Text style={styles.itemPrice}>₹{itemPriceWithAddOns}</Text>

                    {/* Stepper */}
                    <View style={styles.stepperContainer}>
                      <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() => handleDecreaseQty(item.id)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={item.quantity === 1 ? "trash-outline" : "remove"}
                          size={15}
                          color={item.quantity === 1 ? C.danger : C.primary}
                        />
                      </TouchableOpacity>
                      <Text style={styles.stepperValue}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.stepperBtn}
                        onPress={() => handleIncreaseQty(item.id)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="add" size={15} color={C.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Coupons Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offers & Coupons</Text>

          {appliedCoupon ? (
            <View style={styles.appliedCouponCard}>
              <View style={styles.appliedLeft}>
                <Ionicons name="pricetag" size={20} color={C.success} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.appliedCode}>{appliedCoupon.code}</Text>
                  <Text style={styles.appliedSub}>
                    ₹{appliedCoupon.discount} discount applied to your order
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setAppliedCoupon(null)} activeOpacity={0.7}>
                <Text style={styles.removeCouponText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View style={styles.couponInputRow}>
                <Ionicons
                  name="pricetag-outline"
                  size={20}
                  color={C.muted}
                  style={{ marginLeft: 12 }}
                />
                <TextInput
                  style={styles.couponInput}
                  placeholder="Enter coupon code (e.g. HOMEBITE50)"
                  placeholderTextColor={C.muted}
                  value={couponCode}
                  onChangeText={(t) => {
                    setCouponCode(t);
                    setCouponError(null);
                  }}
                  autoCapitalize="characters"
                />
                <TouchableOpacity
                  style={[
                    styles.applyBtn,
                    !couponCode.trim() && { opacity: 0.5 },
                  ]}
                  onPress={handleApplyCoupon}
                  disabled={!couponCode.trim()}
                  activeOpacity={0.8}
                >
                  <Text style={styles.applyBtnText}>Apply</Text>
                </TouchableOpacity>
              </View>
              {couponError ? (
                <Text style={styles.couponErrorText}>{couponError}</Text>
              ) : (
                <Text style={styles.couponHintText}>
                  Use code <Text style={{ fontWeight: "700" }}>HOMEBITE50</Text> for ₹50 off!
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Bill Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Summary</Text>
          <View style={styles.billCard}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Item Total</Text>
              <Text style={styles.billValue}>₹{subtotal}</Text>
            </View>

            <View style={styles.billRow}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.billLabel}>Delivery Fee</Text>
                {deliveryFee === 0 && (
                  <View style={styles.freeBadge}>
                    <Text style={styles.freeBadgeText}>FREE</Text>
                  </View>
                )}
              </View>
              <Text style={styles.billValue}>
                {deliveryFee === 0 ? "₹0" : `₹${deliveryFee}`}
              </Text>
            </View>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Kitchen Packaging</Text>
              <Text style={styles.billValue}>₹{packagingFee}</Text>
            </View>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Platform Fee</Text>
              <Text style={styles.billValue}>₹{platformFee}</Text>
            </View>

            {appliedCoupon && (
              <View style={styles.billRow}>
                <Text style={[styles.billLabel, { color: C.success }]}>
                  Coupon Discount ({appliedCoupon.code})
                </Text>
                <Text style={[styles.billValue, { color: C.success }]}>
                  -₹{appliedCoupon.discount}
                </Text>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>To Pay</Text>
              <Text style={styles.totalValue}>₹{finalTotal}</Text>
            </View>
          </View>
        </View>

        {/* Quality Guarantee Box */}
        <View style={styles.guaranteeBox}>
          <Ionicons name="shield-checkmark" size={20} color={C.success} />
          <Text style={styles.guaranteeText}>
            Cooked fresh in verified home kitchens. Packed with food-grade containers.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Sticky Checkout Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceCol}>
          <Text style={styles.bottomPriceLabel}>Total Amount</Text>
          <Text style={styles.bottomPriceValue}>₹{finalTotal}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={handleProceedToCheckout}
          activeOpacity={0.85}
        >
          <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
          <Ionicons name="arrow-forward" size={18} color={C.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: C.muted,
    marginTop: 2,
  },
  clearText: {
    fontSize: 14,
    color: C.danger,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.selected,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  infoBannerTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: C.primary,
  },
  infoBannerText: {
    fontSize: 11,
    color: C.text,
    marginTop: 2,
    lineHeight: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: C.text,
    marginBottom: 10,
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: C.border,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  vegBadge: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  vegDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: C.text,
  },
  providerName: {
    fontSize: 12,
    color: C.muted,
    marginTop: 2,
  },
  addOnsBox: {
    marginTop: 4,
  },
  addOnText: {
    fontSize: 11,
    color: C.muted,
    lineHeight: 15,
  },
  itemBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: C.primary,
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.selected,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  stepperBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.surface,
  },
  stepperValue: {
    fontSize: 13,
    fontWeight: "700",
    color: C.primary,
    paddingHorizontal: 8,
  },
  couponInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
  },
  couponInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 13,
    color: C.text,
  },
  applyBtn: {
    backgroundColor: C.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  applyBtnText: {
    color: C.white,
    fontSize: 13,
    fontWeight: "700",
  },
  couponErrorText: {
    fontSize: 11,
    color: C.danger,
    marginTop: 6,
    marginLeft: 4,
  },
  couponHintText: {
    fontSize: 11,
    color: C.muted,
    marginTop: 6,
    marginLeft: 4,
  },
  appliedCouponCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.lightSuccess,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: C.success,
  },
  appliedLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  appliedCode: {
    fontSize: 13,
    fontWeight: "700",
    color: C.success,
  },
  appliedSub: {
    fontSize: 11,
    color: C.text,
    marginTop: 2,
  },
  removeCouponText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.danger,
  },
  billCard: {
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  billLabel: {
    fontSize: 13,
    color: C.muted,
  },
  billValue: {
    fontSize: 13,
    fontWeight: "600",
    color: C.text,
  },
  freeBadge: {
    backgroundColor: C.lightSuccess,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  freeBadgeText: {
    fontSize: 10,
    color: C.success,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: C.text,
  },
  totalValue: {
    fontSize: 17,
    fontWeight: "800",
    color: C.primary,
  },
  guaranteeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.lightSuccess,
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    gap: 8,
  },
  guaranteeText: {
    flex: 1,
    fontSize: 11,
    color: C.text,
    lineHeight: 16,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.surface,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: C.border,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -3 },
  },
  bottomPriceCol: {
    justifyContent: "center",
  },
  bottomPriceLabel: {
    fontSize: 11,
    color: C.muted,
  },
  bottomPriceValue: {
    fontSize: 18,
    fontWeight: "800",
    color: C.primary,
  },
  checkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  checkoutBtnText: {
    color: C.white,
    fontSize: 14,
    fontWeight: "700",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: C.selected,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: C.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: C.muted,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 24,
  },
  exploreBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
    gap: 8,
  },
  exploreBtnText: {
    color: C.white,
    fontSize: 14,
    fontWeight: "700",
  },
});
