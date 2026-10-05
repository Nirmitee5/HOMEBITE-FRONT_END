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
  TextInput,
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
};

type FoodPreference = "All" | "Veg" | "Non-veg" | "Egg";
type DiscoveryMode = "Meals" | "Providers";

type Meal = {
  id: string;
  name: string;
  provider: string;
  preference: Exclude<FoodPreference, "All">;
  category: string;
  price: number;
  rating: number;
  distance: number;
  time: string;
  instant: boolean;
  image: string;
};

type Provider = {
  id: string;
  name: string;
  type: string;
  cuisine: string;
  rating: number;
  distance: number;
  available: boolean;
  image: string;
};

const categories = [
  "All",
  "Tiffin",
  "Breakfast",
  "Thali",
  "Healthy",
  "Snacks",
  "Desserts",
];

const meals: Meal[] = [
  {
    id: "m1",
    name: "Homestyle Veg Thali",
    provider: "Aai's Kitchen",
    preference: "Veg",
    category: "Thali",
    price: 149,
    rating: 4.9,
    distance: 1.4,
    time: "30 min",
    instant: true,
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "m2",
    name: "Chicken Curry Meal",
    provider: "Fatima's Home Food",
    preference: "Non-veg",
    category: "Tiffin",
    price: 199,
    rating: 4.8,
    distance: 2.2,
    time: "40 min",
    instant: true,
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "m3",
    name: "Egg Curry Tiffin",
    provider: "Daily Dabba",
    preference: "Egg",
    category: "Tiffin",
    price: 139,
    rating: 4.6,
    distance: 3.1,
    time: "35 min",
    instant: false,
    image:
      "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "m4",
    name: "Dal Khichdi Bowl",
    provider: "Simple Ghar Ka Khana",
    preference: "Veg",
    category: "Healthy",
    price: 119,
    rating: 4.7,
    distance: 1.8,
    time: "25 min",
    instant: true,
    image:
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=900&q=80",
  },
];

const providers: Provider[] = [
  {
    id: "p1",
    name: "Aai's Kitchen",
    type: "Housewife Kitchen",
    cuisine: "Maharashtrian • Tiffin",
    rating: 4.9,
    distance: 1.4,
    available: true,
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p2",
    name: "Shree Sai Mess",
    type: "Mess",
    cuisine: "North Indian • Gujarati",
    rating: 4.6,
    distance: 2.1,
    available: true,
    image:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p3",
    name: "Daily Bowl Kitchen",
    type: "Home Kitchen",
    cuisine: "Healthy • Low oil",
    rating: 4.7,
    distance: 2.8,
    available: false,
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80",
  },
];

const filterOptions = [
  {
    id: "price",
    label: "Under ₹150",
    icon: "cash-outline" as const,
  },
  {
    id: "rating",
    label: "4.5+ rating",
    icon: "star-outline" as const,
  },
  {
    id: "distance",
    label: "Under 3 km",
    icon: "location-outline" as const,
  },
  {
    id: "instant",
    label: "Available now",
    icon: "flash-outline" as const,
  },
];

function openFutureScreen(label: string) {
  Alert.alert(
    label,
    `${label} will be connected in a later Customer group.`,
  );
}

export default function ExploreScreen() {
  const [mode, setMode] = useState<DiscoveryMode>("Meals");
  const [preference, setPreference] = useState<FoodPreference>("All");
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const visibleMeals = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return meals.filter((meal) => {
      const matchesPreference =
        preference === "All" || meal.preference === preference;

      const matchesCategory =
        category === "All" || meal.category === category;

      const matchesQuery =
        !normalizedQuery ||
        meal.name.toLowerCase().includes(normalizedQuery) ||
        meal.provider.toLowerCase().includes(normalizedQuery);

      const matchesPrice =
        !activeFilters.includes("price") || meal.price < 150;

      const matchesRating =
        !activeFilters.includes("rating") || meal.rating >= 4.5;

      const matchesDistance =
        !activeFilters.includes("distance") || meal.distance <= 3;

      const matchesInstant =
        !activeFilters.includes("instant") || meal.instant;

      return (
        matchesPreference &&
        matchesCategory &&
        matchesQuery &&
        matchesPrice &&
        matchesRating &&
        matchesDistance &&
        matchesInstant
      );
    });
  }, [activeFilters, category, preference, query]);

  const visibleProviders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return providers.filter((provider) => {
      const matchesQuery =
        !normalizedQuery ||
        provider.name.toLowerCase().includes(normalizedQuery) ||
        provider.cuisine.toLowerCase().includes(normalizedQuery);

      const matchesRating =
        !activeFilters.includes("rating") || provider.rating >= 4.5;

      const matchesDistance =
        !activeFilters.includes("distance") || provider.distance <= 3;

      const matchesAvailability =
        !activeFilters.includes("instant") || provider.available;

      return (
        matchesQuery &&
        matchesRating &&
        matchesDistance &&
        matchesAvailability
      );
    });
  }, [activeFilters, query]);

  function toggleFilter(filterId: string) {
    setActiveFilters((current) =>
      current.includes(filterId)
        ? current.filter((item) => item !== filterId)
        : [...current, filterId],
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>DISCOVER HOMEMADE FOOD</Text>

          <Text style={styles.title}>Explore near you</Text>

          <Text style={styles.subtitle}>
            Find daily tiffins and meals from local home kitchens.
          </Text>
        </View>

        {/* SEARCH */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={21} color={COLORS.muted} />

            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search meals or providers"
              placeholderTextColor={COLORS.muted}
              style={styles.searchInput}
            />

            {query.length > 0 ? (
              <Pressable onPress={() => setQuery("")}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={COLORS.muted}
                />
              </Pressable>
            ) : null}
          </View>

          <Pressable
            style={styles.mainFilterButton}
            onPress={() =>
              Alert.alert(
                "Filters",
                "Use the quick filters below to refine your results.",
              )
            }
          >
            <Ionicons name="options" size={22} color={COLORS.surface} />
          </Pressable>
        </View>

        {/* MEALS / PROVIDERS */}
        <View style={styles.segment}>
          {(["Meals", "Providers"] as DiscoveryMode[]).map((item) => {
            const selected = mode === item;

            return (
              <Pressable
                key={item}
                style={[
                  styles.segmentButton,
                  selected && styles.segmentButtonSelected,
                ]}
                onPress={() => setMode(item)}
              >
                <Text
                  style={[
                    styles.segmentLabel,
                    selected && styles.segmentLabelSelected,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* FOOD PREFERENCE */}
        <Text style={styles.filterHeading}>Food preference</Text>

        <View style={styles.preferenceRow}>
          {(["All", "Veg", "Non-veg", "Egg"] as FoodPreference[]).map(
            (item) => {
              const selected = preference === item;

              return (
                <Pressable
                  key={item}
                  style={[
                    styles.preferenceChip,
                    selected && styles.preferenceChipSelected,
                  ]}
                  onPress={() => setPreference(item)}
                >
                  {item !== "All" ? (
                    <View
                      style={[
                        styles.foodMark,
                        item === "Veg" && styles.vegMark,
                        item === "Non-veg" && styles.nonVegMark,
                        item === "Egg" && styles.eggMark,
                      ]}
                    />
                  ) : null}

                  <Text
                    style={[
                      styles.preferenceText,
                      selected && styles.preferenceTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            },
          )}
        </View>

        {/* QUICK FILTERS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalFilters}
        >
          {filterOptions.map((filter) => {
            const selected = activeFilters.includes(filter.id);

            return (
              <Pressable
                key={filter.id}
                style={[
                  styles.filterChip,
                  selected && styles.filterChipSelected,
                ]}
                onPress={() => toggleFilter(filter.id)}
              >
                <Ionicons
                  name={filter.icon}
                  size={15}
                  color={selected ? COLORS.primary : COLORS.muted}
                />

                <Text
                  style={[
                    styles.filterChipText,
                    selected && styles.filterChipTextSelected,
                  ]}
                >
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* CATEGORIES */}
        <Text style={styles.filterHeading}>Categories</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {categories.map((item) => {
            const selected = category === item;

            return (
              <Pressable
                key={item}
                style={[
                  styles.categoryChip,
                  selected && styles.categoryChipSelected,
                ]}
                onPress={() => setCategory(item)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selected && styles.categoryTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* RESULTS HEADER */}
        <View style={styles.resultsHeader}>
          <View>
            <Text style={styles.resultsTitle}>
              {mode === "Meals" ? "Homemade meals" : "Local providers"}
            </Text>

            <Text style={styles.resultsCount}>
              {mode === "Meals"
                ? `${visibleMeals.length} meals found`
                : `${visibleProviders.length} providers found`}
            </Text>
          </View>

          <Pressable onPress={() => openFutureScreen("Sort Results")}>
            <Text style={styles.sortText}>Sort by</Text>
          </Pressable>
        </View>

        {/* MEALS */}
        {mode === "Meals" ? (
          <View style={styles.resultList}>
            {visibleMeals.map((meal) => (
              <Pressable
                key={meal.id}
                style={({ pressed }) => [
                  styles.mealCard,
                  pressed && styles.pressed,
                ]}
                onPress={() => openFutureScreen("Meal Details")}
              >
                <Image
                  source={{ uri: meal.image }}
                  style={styles.mealImage}
                />

                <View style={styles.mealContent}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {meal.name}
                    </Text>

                    <View
                      style={[
                        styles.foodTypeIndicator,
                        meal.preference === "Veg" && styles.vegBorder,
                        meal.preference === "Non-veg" && styles.nonVegBorder,
                        meal.preference === "Egg" && styles.eggBorder,
                      ]}
                    >
                      <View
                        style={[
                          styles.foodTypeDot,
                          meal.preference === "Veg" &&
                            styles.vegBackground,
                          meal.preference === "Non-veg" &&
                            styles.nonVegBackground,
                          meal.preference === "Egg" &&
                            styles.eggBackground,
                        ]}
                      />
                    </View>
                  </View>

                  <Text style={styles.cardProvider} numberOfLines={1}>
                    {meal.provider}
                  </Text>

                  <View style={styles.metaRow}>
                    <View style={styles.ratingBadge}>
                      <Ionicons
                        name="star"
                        size={12}
                        color={COLORS.surface}
                      />

                      <Text style={styles.ratingText}>{meal.rating}</Text>
                    </View>

                    <Text style={styles.metaText}>
                      {meal.distance} km
                    </Text>

                    <Text style={styles.metaText}>{meal.time}</Text>
                  </View>

                  <View style={styles.priceRow}>
                    <Text style={styles.price}>₹{meal.price}</Text>

                    {meal.instant ? (
                      <View style={styles.availableBadge}>
                        <Ionicons
                          name="flash"
                          size={12}
                          color={COLORS.success}
                        />

                        <Text style={styles.availableText}>
                          Available now
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.preorderText}>Pre-order</Text>
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          /* PROVIDERS */
          <View style={styles.resultList}>
            {visibleProviders.map((provider) => (
              <Pressable
                key={provider.id}
                style={({ pressed }) => [
                  styles.providerCard,
                  pressed && styles.pressed,
                ]}
                onPress={() => openFutureScreen("Provider Details")}
              >
                <Image
                  source={{ uri: provider.image }}
                  style={styles.providerImage}
                />

                <View style={styles.providerContent}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {provider.name}
                    </Text>

                    <View
                      style={[
                        styles.availabilityDot,
                        !provider.available && styles.offlineDot,
                      ]}
                    />
                  </View>

                  <Text style={styles.providerType}>
                    {provider.type}
                  </Text>

                  <Text style={styles.providerCuisine} numberOfLines={1}>
                    {provider.cuisine}
                  </Text>

                  <View style={styles.providerMetaRow}>
                    <View style={styles.inlineMeta}>
                      <Ionicons
                        name="star"
                        size={14}
                        color={COLORS.success}
                      />

                      <Text style={styles.inlineMetaText}>
                        {provider.rating}
                      </Text>
                    </View>

                    <View style={styles.inlineMeta}>
                      <Ionicons
                        name="location-outline"
                        size={14}
                        color={COLORS.muted}
                      />

                      <Text style={styles.inlineMetaText}>
                        {provider.distance} km
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.providerAvailability,
                      !provider.available && styles.providerUnavailable,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={
                        provider.available
                          ? "store-check-outline"
                          : "store-off-outline"
                      }
                      size={15}
                      color={
                        provider.available
                          ? COLORS.success
                          : COLORS.muted
                      }
                    />

                    <Text
                      style={[
                        styles.providerAvailabilityText,
                        !provider.available &&
                          styles.providerUnavailableText,
                      ]}
                    >
                      {provider.available
                        ? "Accepting orders"
                        : "Currently unavailable"}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* EMPTY MEALS */}
        {mode === "Meals" && visibleMeals.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="food-off-outline"
              size={44}
              color={COLORS.primary}
            />

            <Text style={styles.emptyTitle}>No meals found</Text>

            <Text style={styles.emptyText}>
              Try removing a filter or searching for another meal.
            </Text>
          </View>
        ) : null}

        {/* EMPTY PROVIDERS */}
        {mode === "Providers" && visibleProviders.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="store-search-outline"
              size={44}
              color={COLORS.primary}
            />

            <Text style={styles.emptyTitle}>No providers found</Text>

            <Text style={styles.emptyText}>
              Try increasing the distance or changing your search.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingBottom: 34,
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
    marginTop: 4,
    color: COLORS.text,
    fontFamily: "Poppins_700Bold",
    fontSize: 28,
  },

  subtitle: {
    marginTop: 4,
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    lineHeight: 19,
  },

  searchRow: {
    marginTop: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    gap: 10,
  },

  searchBar: {
    flex: 1,
    height: 52,
    paddingHorizontal: 15,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    color: COLORS.text,
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
  },

  mainFilterButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },

  segment: {
    height: 46,
    marginHorizontal: 20,
    marginTop: 17,
    padding: 4,
    borderRadius: 14,
    flexDirection: "row",
    backgroundColor: COLORS.selected,
  },

  segmentButton: {
    flex: 1,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  segmentButtonSelected: {
    backgroundColor: COLORS.surface,
  },

  segmentLabel: {
    color: COLORS.muted,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
  },

  segmentLabelSelected: {
    color: COLORS.primary,
  },

  filterHeading: {
    marginHorizontal: 20,
    marginTop: 22,
    marginBottom: 10,
    color: COLORS.text,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
  },

  preferenceRow: {
    paddingHorizontal: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  preferenceChip: {
    minHeight: 38,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  preferenceChipSelected: {
    backgroundColor: COLORS.selected,
    borderColor: COLORS.primary,
  },

  preferenceText: {
    color: COLORS.text,
    fontFamily: "Poppins_500Medium",
    fontSize: 11,
  },

  preferenceTextSelected: {
    color: COLORS.primary,
  },

  foodMark: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  vegMark: {
    backgroundColor: COLORS.success,
  },

  nonVegMark: {
    backgroundColor: "#A73A32",
  },

  eggMark: {
    backgroundColor: "#D89A24",
  },

  horizontalFilters: {
    paddingHorizontal: 20,
    paddingTop: 13,
    gap: 8,
  },

  filterChip: {
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  filterChipSelected: {
    backgroundColor: COLORS.selected,
    borderColor: COLORS.primary,
  },

  filterChipText: {
    color: COLORS.muted,
    fontFamily: "Poppins_500Medium",
    fontSize: 11,
  },

  filterChipTextSelected: {
    color: COLORS.primary,
  },

  categories: {
    paddingHorizontal: 20,
    gap: 8,
  },

  categoryChip: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  categoryChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  categoryText: {
    color: COLORS.text,
    fontFamily: "Poppins_500Medium",
    fontSize: 11,
  },

  categoryTextSelected: {
    color: COLORS.surface,
  },

  resultsHeader: {
    marginTop: 27,
    marginBottom: 13,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  resultsTitle: {
    color: COLORS.text,
    fontFamily: "Poppins_700Bold",
    fontSize: 19,
  },

  resultsCount: {
    marginTop: 2,
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
  },

  sortText: {
    color: COLORS.primary,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 11,
  },

  resultList: {
    paddingHorizontal: 20,
    gap: 13,
  },

  mealCard: {
    padding: 10,
    borderRadius: 18,
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  mealImage: {
    width: 112,
    height: 126,
    borderRadius: 14,
    backgroundColor: COLORS.selected,
  },

  mealContent: {
    flex: 1,
    paddingLeft: 13,
  },

  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  cardTitle: {
    flex: 1,
    color: COLORS.text,
    fontFamily: "Poppins_700Bold",
    fontSize: 14,
  },

  cardProvider: {
    marginTop: 3,
    color: COLORS.primary,
    fontFamily: "Poppins_500Medium",
    fontSize: 10,
  },

  foodTypeIndicator: {
    width: 16,
    height: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  foodTypeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  vegBorder: {
    borderColor: COLORS.success,
  },

  nonVegBorder: {
    borderColor: "#A73A32",
  },

  eggBorder: {
    borderColor: "#D89A24",
  },

  vegBackground: {
    backgroundColor: COLORS.success,
  },

  nonVegBackground: {
    backgroundColor: "#A73A32",
  },

  eggBackground: {
    backgroundColor: "#D89A24",
  },

  metaRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  ratingBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: COLORS.success,
  },

  ratingText: {
    color: COLORS.surface,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 9,
  },

  metaText: {
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    fontSize: 9,
  },

  priceRow: {
    flex: 1,
    marginTop: 13,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  price: {
    color: COLORS.text,
    fontFamily: "Poppins_700Bold",
    fontSize: 17,
  },

  availableBadge: {
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: COLORS.successLight,
  },

  availableText: {
    color: COLORS.success,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 8,
  },

  preorderText: {
    color: COLORS.muted,
    fontFamily: "Poppins_500Medium",
    fontSize: 9,
  },

  providerCard: {
    padding: 11,
    borderRadius: 18,
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  providerImage: {
    width: 105,
    height: 128,
    borderRadius: 14,
    backgroundColor: COLORS.selected,
  },

  providerContent: {
    flex: 1,
    paddingLeft: 13,
  },

  providerType: {
    marginTop: 4,
    color: COLORS.primary,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 10,
  },

  providerCuisine: {
    marginTop: 4,
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
  },

  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },

  offlineDot: {
    backgroundColor: COLORS.muted,
  },

  providerMetaRow: {
    marginTop: 11,
    flexDirection: "row",
    gap: 13,
  },

  inlineMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  inlineMetaText: {
    color: COLORS.text,
    fontFamily: "Poppins_500Medium",
    fontSize: 10,
  },

  providerAvailability: {
    alignSelf: "flex-start",
    marginTop: 11,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.successLight,
  },

  providerUnavailable: {
    backgroundColor: COLORS.background,
  },

  providerAvailabilityText: {
    color: COLORS.success,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 8,
  },

  providerUnavailableText: {
    color: COLORS.muted,
  },

  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },

  emptyState: {
    marginHorizontal: 20,
    marginTop: 8,
    padding: 34,
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  emptyTitle: {
    marginTop: 12,
    color: COLORS.text,
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
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