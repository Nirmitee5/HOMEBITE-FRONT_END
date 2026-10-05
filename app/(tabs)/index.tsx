import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Alert,
  Image,
  ImageSourcePropType,
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
  primaryDark: "#A83B1D",
  text: "#2A2A2A",
  muted: "#8A8A8A",
  border: "#EDE4D8",
  surface: "#FFFFFF",
  accent: "#F7D8C8",
  selected: "#FBE9E2",
  success: "#6D9E4E",
  successLight: "#EDF6E8",
};

const LOGO: ImageSourcePropType = require("../assets/images/homebite-logo.png");

type CategoryIcon =
  | "food-variant"
  | "rice"
  | "food-drumstick"
  | "food-apple"
  | "cupcake"
  | "food-takeout-box";

type Category = {
  id: string;
  label: string;
  icon: CategoryIcon;
};

type Meal = {
  id: string;
  name: string;
  provider: string;
  description: string;
  price: number;
  rating: number;
  time: string;
  image: string;
  tag: string;
};

type Provider = {
  id: string;
  name: string;
  type: string;
  cuisine: string;
  rating: number;
  distance: string;
  image: string;
  available: boolean;
};

const categories: Category[] = [
  { id: "1", label: "Tiffin", icon: "food-takeout-box" },
  { id: "2", label: "Breakfast", icon: "food-variant" },
  { id: "3", label: "Lunch", icon: "rice" },
  { id: "4", label: "Non-veg", icon: "food-drumstick" },
  { id: "5", label: "Healthy", icon: "food-apple" },
  { id: "6", label: "Desserts", icon: "cupcake" },
];

const recommendedMeals: Meal[] = [
  {
    id: "meal-1",
    name: "Ghar Ka Dal Chawal",
    provider: "Anita's Home Kitchen",
    description: "Dal tadka, jeera rice, sabzi and salad",
    price: 129,
    rating: 4.8,
    time: "25–30 min",
    tag: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "meal-2",
    name: "Punjabi Tiffin",
    provider: "Simran's Rasoi",
    description: "Paneer, dal, 4 rotis, rice and pickle",
    price: 169,
    rating: 4.7,
    time: "30–35 min",
    tag: "Homestyle",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "meal-3",
    name: "Maharashtrian Thali",
    provider: "Aai's Kitchen",
    description: "Bhaji, amti, rice, chapati and koshimbir",
    price: 149,
    rating: 4.9,
    time: "35–40 min",
    tag: "Local favorite",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",
  },
];

const providers: Provider[] = [
  {
    id: "provider-1",
    name: "Anita's Home Kitchen",
    type: "Housewife Kitchen",
    cuisine: "North Indian • Tiffin",
    rating: 4.8,
    distance: "1.2 km",
    available: true,
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "provider-2",
    name: "Sai Mess",
    type: "Mess",
    cuisine: "Maharashtrian • Veg",
    rating: 4.6,
    distance: "2.1 km",
    available: true,
    image:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "provider-3",
    name: "Daily Bowl Kitchen",
    type: "Home Kitchen",
    cuisine: "Healthy • Home-style",
    rating: 4.7,
    distance: "2.8 km",
    available: false,
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=700&q=80",
  },
];

const popularMeals = recommendedMeals.slice().reverse();

function openFutureScreen(label: string) {
  Alert.alert(
    label,
    `${label} will be connected in the next Customer group.`,
  );
}

function SectionHeader({
  title,
  action = "See all",
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <Pressable onPress={onPress} hitSlop={10}>
        <Text style={styles.sectionAction}>{action}</Text>
      </Pressable>
    </View>
  );
}

function MealCard({ meal }: { meal: Meal }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.mealCard,
        pressed && styles.cardPressed,
      ]}
      onPress={() => openFutureScreen("Meal Details")}
    >
      <Image source={{ uri: meal.image }} style={styles.mealImage} />

      <View style={styles.mealTag}>
        <Text style={styles.mealTagText}>{meal.tag}</Text>
      </View>

      <View style={styles.mealContent}>
        <Text style={styles.mealName} numberOfLines={1}>
          {meal.name}
        </Text>

        <Text style={styles.providerName} numberOfLines={1}>
          {meal.provider}
        </Text>

        <Text style={styles.mealDescription} numberOfLines={2}>
          {meal.description}
        </Text>

        <View style={styles.mealMetaRow}>
          <Text style={styles.price}>₹{meal.price}</Text>

          <View style={styles.metaGroup}>
            <Ionicons name="star" size={14} color={COLORS.success} />

            <Text style={styles.metaText}>{meal.rating}</Text>

            <View style={styles.dot} />

            <Text style={styles.metaText}>{meal.time}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.providerCard,
        pressed && styles.cardPressed,
      ]}
      onPress={() => openFutureScreen("Provider Details")}
    >
      <Image
        source={{ uri: provider.image }}
        style={styles.providerImage}
      />

      <View style={styles.providerCardContent}>
        <View style={styles.providerTitleRow}>
          <Text style={styles.providerCardName} numberOfLines={1}>
            {provider.name}
          </Text>

          <View
            style={[
              styles.availabilityDot,
              !provider.available && styles.unavailableDot,
            ]}
          />
        </View>

        <Text style={styles.providerType}>{provider.type}</Text>

        <Text style={styles.providerCuisine} numberOfLines={1}>
          {provider.cuisine}
        </Text>

        <View style={styles.providerMeta}>
          <Ionicons name="star" size={14} color={COLORS.success} />

          <Text style={styles.providerMetaText}>
            {provider.rating}
          </Text>

          <Ionicons
            name="location-outline"
            size={14}
            color={COLORS.muted}
          />

          <Text style={styles.providerMetaText}>
            {provider.distance}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function CustomerHomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Image
              source={LOGO}
              style={styles.logo}
              resizeMode="contain"
            />

            <Pressable
              style={styles.avatarButton}
              onPress={() => router.push("./profile")}
            >
              <Ionicons
                name="person"
                size={22}
                color={COLORS.primary}
              />
            </Pressable>
          </View>

          <Text style={styles.greeting}>Good morning,</Text>

          <Text style={styles.customerName}>Priya 👋</Text>

          <Pressable
            style={styles.locationRow}
            onPress={() => openFutureScreen("Choose Location")}
          >
            <View style={styles.locationIcon}>
              <Ionicons
                name="location"
                size={17}
                color={COLORS.primary}
              />
            </View>

            <View style={styles.locationTextWrap}>
              <Text style={styles.deliveringLabel}>
                DELIVERING TO
              </Text>

              <Text style={styles.locationText} numberOfLines={1}>
                Baner, Pune
              </Text>
            </View>

            <Ionicons
              name="chevron-down"
              size={18}
              color={COLORS.text}
            />
          </Pressable>
        </View>

        {/* SEARCH */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={21}
            color={COLORS.muted}
          />

          <TextInput
            placeholder="Search homemade meals or kitchens"
            placeholderTextColor={COLORS.muted}
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={() => router.push("/explore")}
          />

          <Pressable
            style={styles.filterButton}
            onPress={() => router.push("/explore")}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={COLORS.primary}
            />
          </Pressable>
        </View>

        {/* HERO */}
        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>
              TODAY'S HOME-COOKED PICK
            </Text>

            <Text style={styles.heroTitle}>
              Comfort food, made close to home
            </Text>

            <Text style={styles.heroText}>
              Fresh tiffins from trusted local kitchens.
            </Text>

            <Pressable
              style={styles.heroButton}
              onPress={() => router.push("/explore")}
            >
              <Text style={styles.heroButtonText}>
                Explore meals
              </Text>

              <Ionicons
                name="arrow-forward"
                size={17}
                color={COLORS.surface}
              />
            </Pressable>
          </View>

          <View style={styles.heroIcon}>
            <MaterialCommunityIcons
              name="food"
              size={64}
              color={COLORS.primary}
            />
          </View>
        </View>

        {/* CATEGORIES */}
        <SectionHeader
          title="What are you craving?"
          action="Explore"
          onPress={() => router.push("/explore")}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContent}
        >
          {categories.map((category) => (
            <Pressable
              key={category.id}
              style={({ pressed }) => [
                styles.category,
                pressed && styles.categoryPressed,
              ]}
              onPress={() => router.push("/explore")}
            >
              <View style={styles.categoryIcon}>
                <MaterialCommunityIcons
                  name={category.icon}
                  size={25}
                  color={COLORS.primary}
                />
              </View>

              <Text style={styles.categoryLabel}>
                {category.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* RECOMMENDED */}
        <SectionHeader
          title="Recommended for you"
          onPress={() => router.push("/explore")}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContent}
        >
          {recommendedMeals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </ScrollView>

        {/* INSTANT ORDER */}
        <View style={styles.instantBanner}>
          <View style={styles.instantIcon}>
            <Ionicons
              name="flash"
              size={26}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.instantCopy}>
            <Text style={styles.instantEyebrow}>
              ONE-TIME ORDER
            </Text>

            <Text style={styles.instantTitle}>
              Homemade meals available now
            </Text>

            <Text style={styles.instantText}>
              Order without starting a meal plan.
            </Text>
          </View>

          <Pressable
            style={styles.roundArrow}
            onPress={() => router.push("./instant")}
          >
            <Ionicons
              name="arrow-forward"
              size={19}
              color={COLORS.surface}
            />
          </Pressable>
        </View>

        {/* PROVIDERS */}
        <SectionHeader
          title="Nearby home kitchens"
          onPress={() => router.push("/explore")}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContent}
        >
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
            />
          ))}
        </ScrollView>

        {/* POPULAR */}
        <SectionHeader
          title="Popular around you"
          onPress={() => router.push("/explore")}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContent}
        >
          {popularMeals.map((meal) => (
            <MealCard
              key={`popular-${meal.id}`}
              meal={meal}
            />
          ))}
        </ScrollView>

        {/* SUBSCRIPTION PROMO */}
        <View style={styles.subscriptionPromo}>
          <View style={styles.subscriptionIcon}>
            <MaterialCommunityIcons
              name="calendar-heart"
              size={30}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.subscriptionEyebrow}>
            MEAL PLANS
          </Text>

          <Text style={styles.subscriptionTitle}>
            Your daily meals, already planned
          </Text>

          <Text style={styles.subscriptionDescription}>
            Subscribe to breakfast, lunch, or dinner plans from
            trusted local providers.
          </Text>

          <Pressable
            style={styles.outlineButton}
            onPress={() => openFutureScreen("Meal Plans")}
          >
            <Text style={styles.outlineButtonText}>
              Browse meal plans
            </Text>

            <Ionicons
              name="arrow-forward"
              size={17}
              color={COLORS.primary}
            />
          </Pressable>
        </View>

        {/* ACTIVE SUBSCRIPTION */}
        <View style={styles.activePlan}>
          <View style={styles.activePlanHeader}>
            <View>
              <Text style={styles.activePlanEyebrow}>
                ACTIVE SUBSCRIPTION
              </Text>

              <Text style={styles.activePlanTitle}>
                Weekday Lunch Plan
              </Text>
            </View>

            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>
                Active
              </Text>
            </View>
          </View>

          <Text style={styles.activeProvider}>
            Anita's Home Kitchen
          </Text>

          <View style={styles.nextMealRow}>
            <View style={styles.nextMealIcon}>
              <MaterialCommunityIcons
                name="food-variant"
                size={22}
                color={COLORS.primary}
              />
            </View>

            <View style={styles.nextMealCopy}>
              <Text style={styles.nextMealLabel}>
                Next meal • Tomorrow
              </Text>

              <Text style={styles.nextMealName}>
                Dal Tadka, Rice, Roti & Sabzi
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => openFutureScreen("My Subscriptions")}
          >
            <Text style={styles.managePlan}>
              Manage subscription
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    paddingBottom: 36,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  logo: {
    width: 126,
    height: 42,
  },

  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.selected,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },

  greeting: {
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    fontSize: 15,
  },

  customerName: {
    color: COLORS.text,
    fontFamily: "Poppins_700Bold",
    fontSize: 27,
    marginTop: -2,
  },

  locationRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  locationIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.selected,
  },

  locationTextWrap: {
    flex: 1,
    marginHorizontal: 10,
  },

  deliveringLabel: {
    color: COLORS.muted,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 9,
  },

  locationText: {
    color: COLORS.text,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
  },

  searchBar: {
    height: 54,
    marginHorizontal: 20,
    marginTop: 20,
    paddingLeft: 16,
    paddingRight: 8,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  searchInput: {
    flex: 1,
    paddingHorizontal: 11,
    color: COLORS.text,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
  },

  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.selected,
  },

  hero: {
    minHeight: 188,
    marginHorizontal: 20,
    marginTop: 18,
    padding: 20,
    borderRadius: 22,
    overflow: "hidden",
    flexDirection: "row",
    backgroundColor: COLORS.primary,
  },

  heroCopy: {
    flex: 1,
    zIndex: 1,
  },

  heroEyebrow: {
    color: COLORS.accent,
    fontFamily: "Poppins_700Bold",
    fontSize: 10,
  },

  heroTitle: {
    marginTop: 6,
    color: COLORS.surface,
    fontFamily: "Poppins_700Bold",
    fontSize: 23,
    lineHeight: 30,
  },

  heroText: {
    marginTop: 5,
    color: COLORS.surface,
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.9,
  },

  heroButton: {
    alignSelf: "flex-start",
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: COLORS.primaryDark,
  },

  heroButtonText: {
    color: COLORS.surface,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
  },

  heroIcon: {
    width: 94,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.92,
  },

  sectionHeader: {
    marginTop: 27,
    marginBottom: 13,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    color: COLORS.text,
    fontFamily: "Poppins_700Bold",
    fontSize: 19,
  },

  sectionAction: {
    color: COLORS.primary,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
  },

  horizontalContent: {
    paddingHorizontal: 20,
    gap: 13,
  },

  category: {
    width: 78,
    alignItems: "center",
  },

  categoryPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.97 }],
  },

  categoryIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  categoryLabel: {
    marginTop: 8,
    color: COLORS.text,
    fontFamily: "Poppins_500Medium",
    fontSize: 11,
    textAlign: "center",
  },

  mealCard: {
    width: 246,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },

  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  mealImage: {
    width: "100%",
    height: 142,
    backgroundColor: COLORS.selected,
  },

  mealTag: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
  },

  mealTagText: {
    color: COLORS.primary,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 9,
  },

  mealContent: {
    padding: 14,
  },

  mealName: {
    color: COLORS.text,
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
  },

  providerName: {
    marginTop: 2,
    color: COLORS.primary,
    fontFamily: "Poppins_500Medium",
    fontSize: 11,
  },

  mealDescription: {
    minHeight: 36,
    marginTop: 6,
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    lineHeight: 17,
  },

  mealMetaRow: {
    marginTop: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  price: {
    color: COLORS.text,
    fontFamily: "Poppins_700Bold",
    fontSize: 17,
  },

  metaGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  metaText: {
    color: COLORS.muted,
    fontFamily: "Poppins_500Medium",
    fontSize: 10,
  },

  dot: {
    width: 3,
    height: 3,
    marginHorizontal: 2,
    borderRadius: 2,
    backgroundColor: COLORS.border,
  },

  instantBanner: {
    marginHorizontal: 20,
    marginTop: 28,
    padding: 16,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.selected,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },

  instantIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
  },

  instantCopy: {
    flex: 1,
    marginHorizontal: 13,
  },

  instantEyebrow: {
    color: COLORS.primary,
    fontFamily: "Poppins_700Bold",
    fontSize: 9,
  },

  instantTitle: {
    marginTop: 2,
    color: COLORS.text,
    fontFamily: "Poppins_700Bold",
    fontSize: 14,
  },

  instantText: {
    marginTop: 2,
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
  },

  roundArrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },

  providerCard: {
    width: 260,
    padding: 11,
    borderRadius: 18,
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  providerImage: {
    width: 82,
    height: 102,
    borderRadius: 14,
    backgroundColor: COLORS.selected,
  },

  providerCardContent: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: "center",
  },

  providerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  providerCardName: {
    flex: 1,
    color: COLORS.text,
    fontFamily: "Poppins_700Bold",
    fontSize: 13,
  },

  availabilityDot: {
    width: 8,
    height: 8,
    marginLeft: 5,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },

  unavailableDot: {
    backgroundColor: COLORS.muted,
  },

  providerType: {
    marginTop: 3,
    color: COLORS.primary,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 9,
  },

  providerCuisine: {
    marginTop: 4,
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
  },

  providerMeta: {
    marginTop: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  providerMetaText: {
    marginRight: 5,
    color: COLORS.text,
    fontFamily: "Poppins_500Medium",
    fontSize: 10,
  },

  subscriptionPromo: {
    marginHorizontal: 20,
    marginTop: 30,
    padding: 20,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  subscriptionIcon: {
    width: 52,
    height: 52,
    marginBottom: 13,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.selected,
  },

  subscriptionEyebrow: {
    color: COLORS.primary,
    fontFamily: "Poppins_700Bold",
    fontSize: 10,
  },

  subscriptionTitle: {
    marginTop: 4,
    color: COLORS.text,
    fontFamily: "Poppins_700Bold",
    fontSize: 21,
    lineHeight: 28,
  },

  subscriptionDescription: {
    marginTop: 7,
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    lineHeight: 19,
  },

  outlineButton: {
    alignSelf: "flex-start",
    marginTop: 15,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  outlineButtonText: {
    color: COLORS.primary,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
  },

  activePlan: {
    marginHorizontal: 20,
    marginTop: 15,
    padding: 18,
    borderRadius: 20,
    backgroundColor: COLORS.successLight,
    borderWidth: 1,
    borderColor: "#D8E8D0",
  },

  activePlanHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  activePlanEyebrow: {
    color: COLORS.success,
    fontFamily: "Poppins_700Bold",
    fontSize: 9,
  },

  activePlanTitle: {
    marginTop: 3,
    color: COLORS.text,
    fontFamily: "Poppins_700Bold",
    fontSize: 17,
  },

  activeBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: COLORS.success,
  },

  activeBadgeText: {
    color: COLORS.surface,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 9,
  },

  activeProvider: {
    marginTop: 3,
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
  },

  nextMealRow: {
    marginTop: 15,
    padding: 12,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
  },

  nextMealIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.selected,
  },

  nextMealCopy: {
    flex: 1,
    marginLeft: 11,
  },

  nextMealLabel: {
    color: COLORS.muted,
    fontFamily: "Poppins_500Medium",
    fontSize: 10,
  },

  nextMealName: {
    marginTop: 2,
    color: COLORS.text,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
  },

  managePlan: {
    marginTop: 13,
    color: COLORS.primary,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
  },
});