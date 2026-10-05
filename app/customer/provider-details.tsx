// app/customer/provider-details.tsx
// HomeBite - Provider Details Screen (Housewife / Mess / Home Kitchen)

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { providerTypeLabel } from "../../types/customer";
import type { Meal, ProviderSummary } from "../../types/customer";
import { getMealsByProvider } from "../../services/customer/meals";
import {
  getProviderById,
  getProviderStory,
  type ProviderStory,
} from "../../services/customer/providers";
import { getSubscriptionPlans } from "../../services/customer/subscriptions";

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

export default function ProviderDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; providerId?: string }>();
  const providerId = params.id || params.providerId || "prov_1";

  const [provider, setProvider] = useState<ProviderSummary | null>(null);
  const [story, setStory] = useState<ProviderStory | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [hasPlans, setHasPlans] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [pData, sData, mData, plans] = await Promise.all([
          getProviderById(providerId),
          getProviderStory(providerId),
          getMealsByProvider(providerId),
          getSubscriptionPlans({providerId}),
        ]);
        if (mounted) {
          setProvider(pData);
          setStory(sData);
          setMeals(mData);
          setHasPlans(plans.length > 0);
        }
      } catch (err) {
        console.error("Failed to load provider details:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, [providerId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={styles.loadingText}>Loading kitchen details...</Text>
      </SafeAreaView>
    );
  }

  if (!provider) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={C.muted} />
        <Text style={styles.notFoundTitle}>Kitchen Not Found</Text>
        <Text style={styles.notFoundSubtitle}>
          This kitchen might have closed or is no longer listed.
        </Text>
        <TouchableOpacity
          style={styles.backHomeBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.backHomeText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const categories = ["All", ...Array.from(new Set(meals.map((m) => m.category.name)))];
  const filteredMeals =
    selectedCategory === "All"
      ? meals
      : meals.filter((m) => m.category.name === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {provider.name}
        </Text>
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cover / Profile Banner */}
        <View style={styles.heroWrapper}>
          <Image
            source={{
              uri:
                provider.photoUrl ||
                "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
            }}
            style={styles.heroImage}
          />
          <View style={styles.typeBadge}>
            <Ionicons
              name={
                provider.type === "housewife"
                  ? "home"
                  : provider.type === "mess"
                  ? "restaurant"
                  : "flame"
              }
              size={13}
              color={C.white}
            />
            <Text style={styles.typeBadgeText}>
              {providerTypeLabel[provider.type]}
            </Text>
          </View>
        </View>

        {/* Primary Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.titleRow}>
            <Text style={styles.providerName}>{provider.name}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={13} color={C.white} />
              <Text style={styles.ratingText}>
                {provider.rating.toFixed(1)}
              </Text>
            </View>
          </View>

          <Text style={styles.cuisines}>
            {provider.cuisineTypes.join(" • ")}
          </Text>

          {/* Key Metrics Row */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Ionicons name="location-outline" size={16} color={C.primary} />
              <Text style={styles.metricText}>
                {story?.distanceKm ?? 2.4} km away
              </Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Ionicons name="time-outline" size={16} color={C.primary} />
              <Text style={styles.metricText}>
                {provider.prepTimeMins}-{provider.prepTimeMins + 10} mins
              </Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Ionicons name="bicycle-outline" size={16} color={C.primary} />
              <Text style={styles.metricText}>₹20 delivery</Text>
            </View>
          </View>

          {/* Food Specialties Chips */}
          {provider.foodSpecialties?.length > 0 && (
            <View style={styles.specialtiesWrapper}>
              <Text style={styles.specialtiesLabel}>Specialties:</Text>
              <View style={styles.specialtiesList}>
                {provider.foodSpecialties.map((item, idx) => (
                  <View key={idx} style={styles.specialtyChip}>
                    <Text style={styles.specialtyText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Subscription Promotion Callout */}
        {hasPlans && (
          <TouchableOpacity
            style={styles.subBanner}
            activeOpacity={0.88}
            onPress={() =>
              router.push({
                pathname: "/customer/subscriptions",
                params: { providerId: provider.id },
              })
            }
          >
            <View style={styles.subBannerContent}>
              <View style={styles.subTagRow}>
                <Ionicons name="calendar-outline" size={14} color={C.primary} />
                <Text style={styles.subTag}>MEAL SUBSCRIPTIONS AVAILABLE</Text>
              </View>
              <Text style={styles.subBannerTitle}>
                Eat Daily Homestyle Meals & Save
              </Text>
              <Text style={styles.subBannerDesc}>
                Automated daily lunch or dinner thalis delivered right to your
                door. No ordering every day.
              </Text>
            </View>
            <View style={styles.subBannerAction}>
              <Text style={styles.subBannerActionText}>View Plans</Text>
              <Ionicons name="chevron-forward" size={16} color={C.primary} />
            </View>
          </TouchableOpacity>
        )}

        {/* Kitchen Story Section */}
        {story && (
          <View style={styles.storySection}>
            <View style={styles.sectionHeadingRow}>
              <Ionicons name="heart-circle" size={20} color={C.primary} />
              <Text style={styles.sectionHeading}>About the Kitchen</Text>
            </View>
            <Text style={styles.storyBody}>{story.about}</Text>
            <View style={styles.storyFooter}>
              <Ionicons name="sparkles" size={14} color={C.accent} />
              <Text style={styles.storyStyleText}>
                Prep Style: {story.preparationStyle}
              </Text>
            </View>
          </View>
        )}

        {/* Menu Section */}
        <View style={styles.menuSectionHeader}>
          <Text style={styles.sectionHeading}>Today's Fresh Menu</Text>
          <Text style={styles.menuCount}>{meals.length} items</Text>
        </View>

        {/* Categories Tab Bar */}
        {categories.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryBtn, active && styles.categoryBtnActive]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryBtnText,
                      active && styles.categoryBtnTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Meals List */}
        <View style={styles.mealsList}>
          {filteredMeals.length === 0 ? (
            <View style={styles.emptyMeals}>
              <Ionicons name="fast-food-outline" size={36} color={C.muted} />
              <Text style={styles.emptyMealsText}>
                No meals found in this category.
              </Text>
            </View>
          ) : (
            filteredMeals.map((meal) => {
              const isAvailable = meal.availability?.isAvailable !== false;
              const vegColor =
                meal.veg === "veg"
                  ? C.success
                  : meal.veg === "egg"
                  ? C.warning
                  : C.danger;

              return (
                <TouchableOpacity
                  key={meal.id}
                  style={styles.mealCard}
                  activeOpacity={0.88}
                  onPress={() =>
                    router.push({
                      pathname: "/customer/meal-details",
                      params: { id: meal.id },
                    })
                  }
                >
                  <Image
                    source={{
                      uri:
                        meal.imageUrl ||
                        "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80",
                    }}
                    style={styles.mealThumb}
                  />

                  <View style={styles.mealInfo}>
                    <View style={styles.mealRow}>
                      <View
                        style={[styles.vegMark, { borderColor: vegColor }]}
                      >
                        <View
                          style={[styles.vegDot, { backgroundColor: vegColor }]}
                        />
                      </View>
                      <Text style={styles.mealName} numberOfLines={1}>
                        {meal.name}
                      </Text>
                    </View>

                    <Text style={styles.mealDesc} numberOfLines={2}>
                      {meal.description}
                    </Text>

                    <View style={styles.mealBottomRow}>
                      <Text style={styles.mealPrice}>₹{meal.price}</Text>

                      {isAvailable ? (
                        <View style={styles.viewMealBtn}>
                          <Text style={styles.viewMealText}>View & Order</Text>
                          <Ionicons
                            name="arrow-forward"
                            size={12}
                            color={C.primary}
                          />
                        </View>
                      ) : (
                        <View style={styles.soldOutBadge}>
                          <Text style={styles.soldOutText}>Sold Out</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
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
  backHomeBtn: {
    backgroundColor: C.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backHomeText: {
    color: C.white,
    fontWeight: "600",
    fontSize: 14,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: C.bg,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: C.text,
    marginHorizontal: 12,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroWrapper: {
    position: "relative",
    width: "100%",
    height: 190,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    backgroundColor: C.border,
  },
  typeBadge: {
    position: "absolute",
    bottom: 12,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(42, 42, 42, 0.88)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  typeBadgeText: {
    color: C.white,
    fontSize: 12,
    fontWeight: "600",
  },
  infoCard: {
    backgroundColor: C.white,
    marginHorizontal: 16,
    marginTop: -16,
    borderRadius: 14,
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  providerName: {
    fontSize: 20,
    fontWeight: "700",
    color: C.text,
    flex: 1,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: C.success,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingText: {
    color: C.white,
    fontSize: 13,
    fontWeight: "700",
  },
  cuisines: {
    fontSize: 13,
    color: C.muted,
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.bg,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 14,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metricDivider: {
    width: 1,
    height: 16,
    backgroundColor: C.border,
  },
  metricText: {
    fontSize: 12,
    fontWeight: "600",
    color: C.text,
  },
  specialtiesWrapper: {
    marginTop: 12,
  },
  specialtiesLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: C.muted,
    marginBottom: 6,
  },
  specialtiesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  specialtyChip: {
    backgroundColor: C.selected,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  specialtyText: {
    fontSize: 11,
    color: C.primary,
    fontWeight: "600",
  },
  subBanner: {
    backgroundColor: C.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: C.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subBannerContent: {
    flex: 1,
    paddingRight: 8,
  },
  subTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 3,
  },
  subTag: {
    fontSize: 10,
    fontWeight: "800",
    color: C.primary,
    letterSpacing: 0.6,
  },
  subBannerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: C.text,
    marginBottom: 2,
  },
  subBannerDesc: {
    fontSize: 11,
    color: C.muted,
    lineHeight: 15,
  },
  subBannerAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: C.selected,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  subBannerActionText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.primary,
  },
  storySection: {
    backgroundColor: C.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  sectionHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: C.text,
  },
  storyBody: {
    fontSize: 13,
    color: "#4A4A4A",
    lineHeight: 19,
  },
  storyFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  storyStyleText: {
    fontSize: 12,
    fontWeight: "600",
    color: C.muted,
  },
  menuSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 22,
    marginBottom: 10,
  },
  menuCount: {
    fontSize: 12,
    color: C.muted,
    fontWeight: "600",
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 14,
  },
  categoryBtn: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryBtnActive: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  categoryBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: C.text,
  },
  categoryBtnTextActive: {
    color: C.white,
  },
  mealsList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  mealCard: {
    backgroundColor: C.white,
    borderRadius: 12,
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.border,
  },
  mealThumb: {
    width: 105,
    height: 105,
    backgroundColor: C.border,
  },
  mealInfo: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  mealRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  vegMark: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  vegDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  mealName: {
    fontSize: 14,
    fontWeight: "700",
    color: C.text,
    flex: 1,
  },
  mealDesc: {
    fontSize: 11,
    color: C.muted,
    marginVertical: 4,
    lineHeight: 15,
  },
  mealBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mealPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: C.text,
  },
  viewMealBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: C.selected,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  viewMealText: {
    fontSize: 11,
    fontWeight: "700",
    color: C.primary,
  },
  soldOutBadge: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  soldOutText: {
    fontSize: 11,
    fontWeight: "600",
    color: C.muted,
  },
  emptyMeals: {
    paddingVertical: 30,
    alignItems: "center",
    gap: 6,
  },
  emptyMealsText: {
    fontSize: 13,
    color: C.muted,
  },
});
