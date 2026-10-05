// app/customer/checkout.tsx
// HomeBite - Customer Checkout Screen (Instant Orders)

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
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

type PaymentOption = "upi" | "card" | "cod";

export default function CheckoutScreen() {
  const router = useRouter();

  // Mock initial state
  const [recipientName, setRecipientName] = useState("Priya Sharma");
  const [recipientPhone, setRecipientPhone] = useState("+91 98765 43210");
  const [instructions, setInstructions] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<PaymentOption>("upi");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Selected delivery address (mock default)
  const selectedAddress = {
    id: "addr-1",
    label: "Home",
    street: "Flat 402, Shanti Heights, Baner-Pashan Link Rd",
    landmark: "Near Orchid School",
    city: "Pune",
    pincode: "411045",
  };

  // Order summary values
  const orderSummary = {
    itemsCount: 3,
    subtotal: 395,
    deliveryFee: 0, // Free delivery
    packagingFee: 20,
    platformFee: 5,
    discount: 50,
    total: 370,
  };

  const QUICK_INSTRUCTIONS = [
    "Ring bell twice",
    "Leave at door",
    "Call on arrival",
    "Do not ring bell",
  ];

  const handlePlaceOrder = () => {
    if (!recipientName.trim() || !recipientPhone.trim()) {
      Alert.alert("Missing Details", "Please provide recipient name and phone.");
      return;
    }

    setIsPlacingOrder(true);

    // Simulate order placement
    setTimeout(() => {
      setIsPlacingOrder(false);
      const generatedOrderId = `HB-${Math.floor(100000 + Math.random() * 900000)}`;
      
      // Navigate to order tracking screen
      router.replace({
        pathname: "/customer/order-tracking",
        params: { id: generatedOrderId },
      });
    }, 1200);
  };

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
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.instantChip}>
          <Ionicons name="flash" size={12} color={C.primary} />
          <Text style={styles.instantChipText}>Instant</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Delivery Address Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="location" size={20} color={C.primary} />
              <Text style={styles.cardTitle}>Delivery Address</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/customer/addresses")}
              activeOpacity={0.7}
            >
              <Text style={styles.actionLink}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.addressBox}>
            <View style={styles.addressTag}>
              <Text style={styles.addressTagText}>{selectedAddress.label}</Text>
            </View>
            <Text style={styles.addressStreet}>{selectedAddress.street}</Text>
            <Text style={styles.addressLandmark}>
              {selectedAddress.landmark}, {selectedAddress.city} - {selectedAddress.pincode}
            </Text>
          </View>
        </View>

        {/* Recipient Details */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="person" size={20} color={C.primary} />
              <Text style={styles.cardTitle}>Recipient Details</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Recipient Name</Text>
            <TextInput
              style={styles.textInput}
              value={recipientName}
              onChangeText={setRecipientName}
              placeholder="Full name"
              placeholderTextColor={C.muted}
            />
          </View>

          <View style={[styles.inputGroup, { marginTop: 12 }]}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.textInput}
              value={recipientPhone}
              onChangeText={setRecipientPhone}
              placeholder="10-digit mobile number"
              placeholderTextColor={C.muted}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Delivery Instructions */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="chatbox-ellipses-outline" size={20} color={C.primary} />
              <Text style={styles.cardTitle}>Delivery Instructions</Text>
            </View>
          </View>

          {/* Quick chips */}
          <View style={styles.quickChipsRow}>
            {QUICK_INSTRUCTIONS.map((chip, idx) => {
              const isSelected = instructions === chip;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.instructionChip,
                    isSelected && styles.instructionChipSelected,
                  ]}
                  onPress={() =>
                    setInstructions((prev) => (prev === chip ? "" : chip))
                  }
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.instructionChipText,
                      isSelected && styles.instructionChipTextSelected,
                    ]}
                  >
                    {chip}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TextInput
            style={styles.instructionInput}
            value={instructions}
            onChangeText={setInstructions}
            placeholder="Add any specific instructions for delivery partner..."
            placeholderTextColor={C.muted}
            multiline
            numberOfLines={2}
          />
        </View>

        {/* Payment Method Section (Mock) */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="card" size={20} color={C.primary} />
              <Text style={styles.cardTitle}>Payment Method</Text>
            </View>
          </View>

          {/* Mock banner */}
          <View style={styles.mockNotice}>
            <Ionicons name="information-circle" size={16} color={C.primary} />
            <Text style={styles.mockNoticeText}>
              Simulation Mode: No real transaction will be made.
            </Text>
          </View>

          {/* UPI */}
          <TouchableOpacity
            style={[
              styles.paymentRow,
              selectedPayment === "upi" && styles.paymentRowSelected,
            ]}
            onPress={() => setSelectedPayment("upi")}
            activeOpacity={0.8}
          >
            <View style={styles.paymentLeft}>
              <View style={styles.paymentRadio}>
                {selectedPayment === "upi" && <View style={styles.radioDot} />}
              </View>
              <View style={styles.paymentIconWrap}>
                <Ionicons name="phone-portrait-outline" size={20} color={C.primary} />
              </View>
              <View>
                <Text style={styles.paymentTitle}>UPI / QR</Text>
                <Text style={styles.paymentSub}>Google Pay, PhonePe, Paytm</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Credit / Debit Card */}
          <TouchableOpacity
            style={[
              styles.paymentRow,
              selectedPayment === "card" && styles.paymentRowSelected,
            ]}
            onPress={() => setSelectedPayment("card")}
            activeOpacity={0.8}
          >
            <View style={styles.paymentLeft}>
              <View style={styles.paymentRadio}>
                {selectedPayment === "card" && <View style={styles.radioDot} />}
              </View>
              <View style={styles.paymentIconWrap}>
                <Ionicons name="card-outline" size={20} color={C.primary} />
              </View>
              <View>
                <Text style={styles.paymentTitle}>Credit / Debit Card</Text>
                <Text style={styles.paymentSub}>Visa, MasterCard, RuPay</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Cash on Delivery */}
          <TouchableOpacity
            style={[
              styles.paymentRow,
              selectedPayment === "cod" && styles.paymentRowSelected,
            ]}
            onPress={() => setSelectedPayment("cod")}
            activeOpacity={0.8}
          >
            <View style={styles.paymentLeft}>
              <View style={styles.paymentRadio}>
                {selectedPayment === "cod" && <View style={styles.radioDot} />}
              </View>
              <View style={styles.paymentIconWrap}>
                <Ionicons name="cash-outline" size={20} color={C.primary} />
              </View>
              <View>
                <Text style={styles.paymentTitle}>Cash on Delivery</Text>
                <Text style={styles.paymentSub}>Pay with cash or UPI at your doorstep</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Order Summary & Final Bill */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Price Details</Text>
          <View style={{ marginTop: 12 }}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Item Total ({orderSummary.itemsCount} items)</Text>
              <Text style={styles.billValue}>₹{orderSummary.subtotal}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery Fee</Text>
              <Text style={[styles.billValue, { color: C.success }]}>FREE</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Kitchen Packaging</Text>
              <Text style={styles.billValue}>₹{orderSummary.packagingFee}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Platform Fee</Text>
              <Text style={styles.billValue}>₹{orderSummary.platformFee}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: C.success }]}>Coupon Discount</Text>
              <Text style={[styles.billValue, { color: C.success }]}>
                -₹{orderSummary.discount}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Payable</Text>
              <Text style={styles.totalValue}>₹{orderSummary.total}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPriceLabel}>Total Amount</Text>
          <Text style={styles.bottomPriceValue}>₹{orderSummary.total}</Text>
        </View>

        <TouchableOpacity
          style={[styles.placeOrderBtn, isPlacingOrder && { opacity: 0.8 }]}
          onPress={handlePlaceOrder}
          disabled={isPlacingOrder}
          activeOpacity={0.85}
        >
          {isPlacingOrder ? (
            <ActivityIndicator size="small" color={C.white} />
          ) : (
            <>
              <Text style={styles.placeOrderText}>Place Order</Text>
              <Ionicons name="arrow-forward" size={18} color={C.white} />
            </>
          )}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.text,
  },
  instantChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.selected,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    gap: 4,
  },
  instantChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: C.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: C.text,
  },
  actionLink: {
    fontSize: 13,
    fontWeight: "700",
    color: C.primary,
  },
  addressBox: {
    backgroundColor: C.bg,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  addressTag: {
    alignSelf: "flex-start",
    backgroundColor: C.selected,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  addressTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: C.primary,
  },
  addressStreet: {
    fontSize: 13,
    fontWeight: "600",
    color: C.text,
    lineHeight: 18,
  },
  addressLandmark: {
    fontSize: 12,
    color: C.muted,
    marginTop: 4,
  },
  inputGroup: {
    width: "100%",
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: C.muted,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: C.text,
  },
  quickChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  instructionChip: {
    backgroundColor: C.bg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  instructionChipSelected: {
    backgroundColor: C.selected,
    borderColor: C.primary,
  },
  instructionChipText: {
    fontSize: 11,
    color: C.text,
  },
  instructionChipTextSelected: {
    color: C.primary,
    fontWeight: "700",
  },
  instructionInput: {
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    color: C.text,
    minHeight: 56,
    textAlignVertical: "top",
  },
  mockNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.selected,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    gap: 6,
  },
  mockNoticeText: {
    fontSize: 11,
    color: C.primary,
    fontWeight: "600",
    flex: 1,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 10,
  },
  paymentRowSelected: {
    borderColor: C.primary,
    backgroundColor: C.selected,
  },
  paymentLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.primary,
  },
  paymentIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  paymentTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: C.text,
  },
  paymentSub: {
    fontSize: 11,
    color: C.muted,
    marginTop: 2,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
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
    fontSize: 18,
    fontWeight: "800",
    color: C.primary,
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
  bottomPriceLabel: {
    fontSize: 11,
    color: C.muted,
  },
  bottomPriceValue: {
    fontSize: 18,
    fontWeight: "800",
    color: C.primary,
  },
  placeOrderBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  placeOrderText: {
    color: C.white,
    fontSize: 14,
    fontWeight: "700",
  },
});
