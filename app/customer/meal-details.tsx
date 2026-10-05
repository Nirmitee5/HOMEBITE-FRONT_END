// app/customer/meal-details.tsx
// HomeBite - Meal Details Screen (Instant Order vs Recurring Subscription)

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type { Meal, MealAddOn, ProviderSummary } from "../../types/customer";
import { getMealById } from "../../services/customer/meals";
import { getProviderById } from "../../services/customer/providers";

const C = {
  bg: "#FFF8EF",
  primary: "#C84A25",
  text: "#2A2A2A",
  muted: "#8A8A8A",
  white: "#FFFFFF",
  border: "#EDE4D8",
  success: "#6D9E4E",
  lightSuccess: "#EDF6E8",
  selected: "#FBE9E2",
  accent: "#F0B27A",
  warning: "#E59A2F",
  danger: "#D94A45",
};

export default function MealDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; mealId?: string }>();
  const mealId = params.id || params.mealId || "meal_1";

  const [meal, setMeal] = useState<Meal | null>(null);
  const [provider, setProvider] = useState<ProviderSummary | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<MealAddOn[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const mealData = await getMealById(mealId);
        if (mealData && mounted) {
          setMeal(mealData);
          const pData = await getProviderById(mealData.providerId);
          if (mounted) setProvider(pData);
        }
      } catch (err) {
        console.error("Failed to load meal details:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, [mealId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={styles.loadingText}>Preparing meal info...</Text>
      </SafeAreaView>
    );
  }

  if (!meal) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Ionicons name="fast-food-outline" size={48} color={C.muted} />
        <Text style={styles.notFoundTitle}>Meal Not Found</Text>
        <Text style={styles.notFoundSubtitle}>
          This dish might not be on today's menu.
        </Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isAvailable = meal.availability?.isAvailable !== false;
  const vegColor =
    meal.veg === "veg" ? C.success : meal.veg === "egg" ? C.warning : C.danger;

  const addOnsTotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
  const singleUnitPrice = meal.price + addOnsTotal;
  const totalPrice = singleUnitPrice * quantity;

  function toggleAddOn(addon: MealAddOn) {
    setSelectedAddOns((prev) => {
      const exists = prev.find((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      }
      return [...prev, addon];
    });
  }

  function handleAddToCart() {
    if (!isAvailable) {
      Alert.alert("Unavailable", "This dish is currently sold out for today.");
      return;
    }
    // Navigate to Cart screen with instant order parameters
    router.push({
      pathname: "/customer/cart",
      params: {
        addedMealId: meal?.id,
        qty: quantity.toString(),
        addOns: JSON.stringify(selectedAddOns.map((a) => a.id)),
      },
    });
  }

  function handleSubscribe() {
    // Subscriptions are recurring scheduled meal plans (no daily checkout)
    router.push({
      pathname: "/customer/subscriptions",
      params: {
        providerId: meal?.providerId,
        mealId: meal?.id,
      },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Hero Image & Sticky Top Floating Buttons */}
      <View style={styles.heroContainer}>
        <Image
          source={{
            uri:
              meal.imageUrl ||
              "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80",
          }}
          style={styles.heroImage}
        />
        <View style={styles.floatingHeader}>
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color={C.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => setIsFavorite((prev) => !prev)}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={22}
              color={isFavorite ? C.primary : C.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Dish Details Card */}
        <View style={styles.contentCard}>
          <View style={styles.titleRow}>
            <View style={styles.nameContainer}>
              <View style={[styles.vegMark, { borderColor: vegColor }]}>
                <View style={[styles.vegDot, { backgroundColor: vegColor }]} />
              </View>
              <Text style={styles.mealName}>{meal.name}</Text>
            </View>
            <Text style={styles.priceTag}>₹{meal.price}</Text>
          </View>

          {/* Provider Link */}
          {provider && (
            <TouchableOpacity
              style={styles.providerRow}
              activeOpacity={0.7}
              onPress={() =>
                router.push({
                  pathname: "/customer/provider-details",
                  params: { id: provider.id },
                })
              }
            >
              <Ionicons name="home" size={14} color={C.primary} />
              <Text style={styles.providerNameText}>
                By {provider.name} ({provider.type.replace("_", " ")})
              </Text>
              <Ionicons name="chevron-forward" size={14} color={C.muted} />
            </TouchableOpacity>
          )}

          {/* Ratings & Prep Time Banner */}
          <View style={styles.metaRow}>
            <View style={styles.metaBadge}>
              <Ionicons name="star" size={13} color={C.white} />
              <Text style={styles.metaBadgeText}>{meal.rating.toFixed(1)}</Text>
              <Text style={styles.metaReviewCount}>({meal.ratingCount})</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color={C.muted} />
              <Text style={styles.metaItemText}>
                {meal.prepTimeMins} mins prep
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="restaurant-outline" size={14} color={C.muted} />
              <Text style={styles.metaItemText}>{meal.servings}</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.descriptionText}>{meal.description}</Text>

          {/* Freshness & Quality Assurance */}
          <View style={styles.assuranceBox}>
            <Ionicons name="shield-checkmark" size={16} color={C.success} />
            <Text style={styles.assuranceText}>
              Cooked fresh upon ordering with 100% homestyle hygiene.
            </Text>
          </View>
        </View>

        {/* Add-ons Section */}
        {meal.addOns && meal.addOns.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Add Extra Homestyle Sides</Text>
            <Text style={styles.sectionSubtitle}>
              Customize your meal portion
            </Text>

            <View style={styles.addOnsList}>
              {meal.addOns.map((addon) => {
                const isSelected = selectedAddOns.some(
                  (a) => a.id === addon.id
                );
                return (
                  <TouchableOpacity
                    key={addon.id}
                    style={[
                      styles.addOnRow,
                      isSelected && styles.addOnRowSelected,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => toggleAddOn(addon)}
                  >
                    <View style={styles.addOnInfo}>
                      <Ionicons
                        name={
                          isSelected
                            ? "checkbox"
                            : "square-outline"
                        }
                        size={20}
                        color={isSelected ? C.primary : C.muted}
                      />
                      <Text
                        style={[
                          styles.addOnName,
                          isSelected && styles.addOnNameSelected,
                        ]}
                      >
                        {addon.name}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.addOnPrice,
                        isSelected && styles.addOnPriceSelected,
                      ]}
                    >
                      +₹{addon.price}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Clear Ordering Choice: Instant vs Subscription Explanation */}
        <View style={styles.choiceCard}>
          <Text style={styles.sectionTitle}>How would you like this meal?</Text>

          {/* Instant Option */}
          <View style={styles.choiceOption}>
            <View style={styles.choiceBadgeInstant}>
              <Ionicons name="flash" size={14} color={C.white} />
              <Text style={styles.choiceBadgeText}>ONE-TIME INSTANT ORDER</Text>
            </View>
            <Text style={styles.choiceDesc}>
              Cooked & delivered today. Perfect for when you need a hot meal right
              now.
            </Text>
          </View>

          {/* Subscription Option */}
          {meal.isSubscriptionEligible && (
            <View style={[styles.choiceOption, styles.choiceOptionSub]}>
              <View style={styles.choiceBadgeSub}>
                <Ionicons name="repeat" size={14} color={C.primary} />
                <Text style={styles.choiceBadgeSubText}>
                  RECURRING MEAL SUBSCRIPTION
                </Text>
              </View>
              <Text style={styles.choiceDesc}>
                Set it once! Receive lunch or dinner daily or weekly with no
                repeated checkout or daily payment.
              </Text>
              <TouchableOpacity
                style={styles.subButton}
                activeOpacity={0.85}
                onPress={handleSubscribe}
              >
                <Text style={styles.subButtonText}>
                  View Weekly / Monthly Plans
                </Text>
                <Ionicons name="arrow-forward" size={14} color={C.primary} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar (For Instant Order & Cart) */}
      <View style={styles.bottomBar}>
        {/* Quantity Controls */}
        <View style={styles.quantityPicker}>
          <TouchableOpacity
            style={styles.qtyBtn}
            disabled={quantity <= 1}
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Ionicons
              name="remove"
              size={16}
              color={quantity <= 1 ? C.muted : C.text}
            />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity((q) => q + 1)}
          >
            <Ionicons name="add" size={16} color={C.text} />
          </TouchableOpacity>
        </View>

        {/* Add to Cart CTA */}
        <TouchableOpacity
          style={[styles.addCartBtn, !isAvailable && styles.disabledBtn]}
          activeOpacity={0.88}
          disabled={!isAvailable}
          onPress={handleAddToCart}
        >
          <View>
            <Text style={styles.addCartTotal}>₹{totalPrice}</Text>
            <Text style={styles.addCartSubtext}>Total Price</Text>
          </View>
          <View style={styles.addCartLabelGroup}>
            <Text style={styles.addCartLabel}>
              {isAvailable ? "Add to Cart" : "Sold Out"}
            </Text>
            {isAvailable && (
              <Ionicons name="cart-outline" size={18} color={C.white} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: C.muted,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.text,
    marginTop: 12,
  },
  notFoundSubtitle: {
    fontSize: 13,
    color: C.muted,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: C.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnText: {
    color: C.white,
    fontWeight: "600",
    fontSize: 14,
  },
  heroContainer: {
    width: "100%",
    height: 250,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    backgroundColor: C.border,
  },
  floatingHeader: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  contentCard: {
    backgroundColor: C.white,
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    paddingRight: 8,
  },
  vegMark: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  vegDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  mealName: {
    fontSize: 18,
    fontWeight: "700",
    color: C.text,
    flex: 1,
  },
  priceTag: {
    fontSize: 20,
    fontWeight: "800",
    color: C.primary,
  },
  providerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingVertical: 4,
  },
  providerNameText: {
    fontSize: 13,
    fontWeight: "600",
    color: C.primary,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: C.success,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  metaBadgeText: {
    color: C.white,
    fontSize: 12,
    fontWeight: "700",
  },
  metaReviewCount: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 11,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaItemText: {
    fontSize: 12,
    color: C.muted,
  },
  descriptionText: {
    fontSize: 13,
    color: "#4A4A4A",
    lineHeight: 19,
    marginTop: 12,
  },
  assuranceBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.lightSuccess,
    padding: 10,
    borderRadius: 8,
    marginTop: 14,
  },
  assuranceText: {
    fontSize: 12,
    color: C.success,
    fontWeight: "600",
    flex: 1,
  },
  sectionCard: {
    backgroundColor: C.white,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: C.text,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: C.muted,
    marginTop: 2,
    marginBottom: 10,
  },
  addOnsList: {
    gap: 8,
  },
  addOnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.bg,
  },
  addOnRowSelected: {
    borderColor: C.primary,
    backgroundColor: C.selected,
  },
  addOnInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addOnName: {
    fontSize: 13,
    color: C.text,
    fontWeight: "500",
  },
  addOnNameSelected: {
    fontWeight: "700",
    color: C.primary,
  },
  addOnPrice: {
    fontSize: 13,
    fontWeight: "600",
    color: C.muted,
  },
  addOnPriceSelected: {
    color: C.primary,
  },
  choiceCard: {
    backgroundColor: C.white,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  choiceOption: {
    backgroundColor: C.bg,
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  choiceOptionSub: {
    borderWidth: 1,
    borderColor: C.accent,
    backgroundColor: "#FFFAF4",
  },
  choiceBadgeInstant: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: C.primary,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 6,
  },
  choiceBadgeText: {
    color: C.white,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  choiceBadgeSub: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: C.selected,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 6,
  },
  choiceBadgeSubText: {
    color: C.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  choiceDesc: {
    fontSize: 12,
    color: "#555",
    lineHeight: 16,
  },
  subButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  subButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.primary,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 8,
  },
  quantityPicker: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    backgroundColor: C.bg,
  },
  qtyBtn: {
    width: 36,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    fontSize: 15,
    fontWeight: "700",
    color: C.text,
    paddingHorizontal: 8,
  },
  addCartBtn: {
    flex: 1,
    height: 44,
    backgroundColor: C.primary,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  disabledBtn: {
    backgroundColor: C.muted,
  },
  addCartTotal: {
    color: C.white,
    fontSize: 15,
    fontWeight: "800",
  },
  addCartSubtext: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 9,
  },
  addCartLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  addCartLabel: {
    color: C.white,
    fontSize: 14,
    fontWeight: "700",
  },
});
