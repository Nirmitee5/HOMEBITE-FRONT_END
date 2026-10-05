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
  primaryDark: "#A83B1D",
  text: "#2A2A2A",
  muted: "#8A8A8A",
  border: "#EDE4D8",
  surface: "#FFFFFF",
  success: "#6D9E4E",
  successLight: "#EDF6E8",
  selected: "#FBE9E2",
};

type InstantMeal = {
  id: string;
  name: string;
  provider: string;
  providerType: string;
  price: number;
  preparationTime: number;
  portionsLeft: number;
  rating: number;
  image: string;
};

const instantMeals: InstantMeal[] = [
  {
    id: "instant-1",
    name: "Dal Rice Comfort Bowl",
    provider: "Anita's Home Kitchen",
    providerType: "Housewife Kitchen",
    price: 129,
    preparationTime: 25,
    portionsLeft: 6,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "instant-2",
    name: "Paneer Roti Meal",
    provider: "Simran's Rasoi",
    providerType: "Home Kitchen",
    price: 169,
    preparationTime: 30,
    portionsLeft: 4,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "instant-3",
    name: "Chicken Curry Tiffin",
    provider: "Fatima's Home Food",
    providerType: "Home Kitchen",
    price: 199,
    preparationTime: 40,
    portionsLeft: 3,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "instant-4",
    name: "Maharashtrian Mini Thali",
    provider: "Sai Mess",
    providerType: "Mess",
    price: 139,
    preparationTime: 20,
    portionsLeft: 9,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=900&q=80",
  },
];

export default function InstantOrdersScreen() {
  const [cart, setCart] = useState<Record<string, number>>({});

  const cartCount = useMemo(
    () => Object.values(cart).reduce((total, quantity) => total + quantity, 0),
    [cart],
  );

  function addToCart(meal: InstantMeal) {
    setCart((current) => ({
      ...current,
      [meal.id]: (current[meal.id] ?? 0) + 1,
    }));
  }

  function removeFromCart(mealId: string) {
    setCart((current) => {
      const quantity = current[mealId] ?? 0;

      if (quantity <= 1) {
        const next = { ...current };
        delete next[mealId];
        return next;
      }

      return {
        ...current,
        [mealId]: quantity - 1,
      };
    });
  }

  function orderNow(meal: InstantMeal) {
    Alert.alert(
      "One-time order",
      `${meal.name} will continue to Meal Details, Cart, and Checkout when those screens are added.`,
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>ONE-TIME ORDERS</Text>
          <Text style={styles.title}>Available Now</Text>
          <Text style={styles.subtitle}>
            Fresh homemade meals ready to prepare near you.
          </Text>
        </View>

        <Pressable
          style={styles.cartButton}
          onPress={() =>
            Alert.alert(
              "Cart",
              "The Cart screen will be connected in a later Customer group.",
            )
          }
        >
          <Ionicons name="bag-outline" size={23} color={COLORS.primary} />

          {cartCount > 0 ? (
            <View style={styles.cartCount}>
              <Text style={styles.cartCountText}>{cartCount}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      <View style={styles.notice}>
        <View style={styles.noticeIcon}>
          <Ionicons name="flash" size={20} color={COLORS.primary} />
        </View>

        <View style={styles.noticeCopy}>
          <Text style={styles.noticeTitle}>No subscription required</Text>
          <Text style={styles.noticeText}>
            Pick a meal, order once, and get it delivered today.
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {instantMeals.map((meal) => {
          const quantity = cart[meal.id] ?? 0;

          return (
            <Pressable
              key={meal.id}
              style={({ pressed }) => [
                styles.mealCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() => orderNow(meal)}
            >
              <View>
                <Image source={{ uri: meal.image }} style={styles.mealImage} />

                <View style={styles.oneTimeBadge}>
                  <Ionicons name="flash" size={11} color={COLORS.surface} />
                  <Text style={styles.oneTimeBadgeText}>ONE-TIME ORDER</Text>
                </View>
              </View>

              <View style={styles.cardContent}>
                <View style={styles.titleRow}>
                  <Text style={styles.mealName} numberOfLines={1}>
                    {meal.name}
                  </Text>

                  <View style={styles.vegIndicator}>
                    <View style={styles.vegDot} />
                  </View>
                </View>

                <Text style={styles.providerName} numberOfLines={1}>
                  {meal.provider}
                </Text>
                <Text style={styles.providerType}>{meal.providerType}</Text>

                <View style={styles.detailsRow}>
                  <View style={styles.detail}>
                    <Ionicons
                      name="time-outline"
                      size={14}
                      color={COLORS.muted}
                    />
                    <Text style={styles.detailText}>
                      {meal.preparationTime} min
                    </Text>
                  </View>

                  <View style={styles.detail}>
                    <Ionicons
                      name="star"
                      size={14}
                      color={COLORS.success}
                    />
                    <Text style={styles.detailText}>{meal.rating}</Text>
                  </View>
                </View>

                <View style={styles.availability}>
                  <View style={styles.availabilityDot} />
                  <Text style={styles.availabilityText}>
                    {meal.portionsLeft} portions available
                  </Text>
                </View>

                <View style={styles.bottomRow}>
                  <View>
                    <Text style={styles.price}>₹{meal.price}</Text>
                    <Text style={styles.taxText}>plus delivery charges</Text>
                  </View>

                  {quantity === 0 ? (
                    <Pressable
                      style={({ pressed }) => [
                        styles.addButton,
                        pressed && styles.buttonPressed,
                      ]}
                      onPress={(event) => {
                        event.stopPropagation();
                        addToCart(meal);
                      }}
                    >
                      <Ionicons
                        name="add"
                        size={18}
                        color={COLORS.surface}
                      />
                      <Text style={styles.addButtonText}>Add to Cart</Text>
                    </Pressable>
                  ) : (
                    <View style={styles.quantityControl}>
                      <Pressable
                        style={styles.quantityButton}
                        onPress={(event) => {
                          event.stopPropagation();
                          removeFromCart(meal.id);
                        }}
                      >
                        <Ionicons
                          name="remove"
                          size={18}
                          color={COLORS.primary}
                        />
                      </Pressable>

                      <Text style={styles.quantityText}>{quantity}</Text>

                      <Pressable
                        style={styles.quantityButton}
                        onPress={(event) => {
                          event.stopPropagation();
                          addToCart(meal);
                        }}
                      >
                        <Ionicons
                          name="add"
                          size={18}
                          color={COLORS.primary}
                        />
                      </Pressable>
                    </View>
                  )}
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.orderButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={(event) => {
                    event.stopPropagation();
                    orderNow(meal);
                  }}
                >
                  <Text style={styles.orderButtonText}>Order Now</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={17}
                    color={COLORS.primary}
                  />
                </Pressable>
              </View>
            </Pressable>
          );
        })}

        <View style={styles.flowNote}>
          <MaterialCommunityIcons
            name="moped-outline"
            size={32}
            color={COLORS.primary}
          />
          <Text style={styles.flowTitle}>How instant ordering works</Text>
          <Text style={styles.flowText}>
            Choose an available meal, add it to your cart, checkout, and track
            your order.
          </Text>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
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
    maxWidth: 280,
    marginTop: 4,
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    lineHeight: 18,
  },
  cartButton: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cartCount: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 19,
    height: 19,
    paddingHorizontal: 4,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },
  cartCountText: {
    color: COLORS.surface,
    fontFamily: "Poppins_700Bold",
    fontSize: 9,
  },
  notice: {
    marginHorizontal: 20,
    marginTop: 18,
    padding: 14,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.selected,
    borderWidth: 1,
    borderColor: "#F4CCBA",
  },
  noticeIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
  },
  noticeCopy: {
    flex: 1,
    marginLeft: 11,
  },
  noticeTitle: {
    color: COLORS.text,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
  },
  noticeText: {
    marginTop: 2,
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
  },
  list: {
    padding: 20,
    gap: 15,
    paddingBottom: 36,
  },
  mealCard: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  mealImage: {
    width: "100%",
    height: 188,
    backgroundColor: COLORS.selected,
  },
  oneTimeBadge: {
    position: "absolute",
    top: 13,
    left: 13,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.primary,
  },
  oneTimeBadgeText: {
    color: COLORS.surface,
    fontFamily: "Poppins_700Bold",
    fontSize: 8,
  },
  cardContent: {
    padding: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  mealName: {
    flex: 1,
    color: COLORS.text,
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
  },
  vegIndicator: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: COLORS.success,
    alignItems: "center",
    justifyContent: "center",
  },
  vegDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  providerName: {
    marginTop: 4,
    color: COLORS.primary,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
  },
  providerType: {
    marginTop: 1,
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
  },
  detailsRow: {
    marginTop: 13,
    flexDirection: "row",
    gap: 16,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  detailText: {
    color: COLORS.muted,
    fontFamily: "Poppins_500Medium",
    fontSize: 10,
  },
  availability: {
    alignSelf: "flex-start",
    marginTop: 12,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.successLight,
  },
  availabilityDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  availabilityText: {
    color: COLORS.success,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 9,
  },
  bottomRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    color: COLORS.text,
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
  },
  taxText: {
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    fontSize: 8,
  },
  addButton: {
    minHeight: 42,
    paddingHorizontal: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.primary,
  },
  addButtonText: {
    color: COLORS.surface,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 11,
  },
  quantityControl: {
    height: 42,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: COLORS.selected,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  quantityButton: {
    width: 40,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    minWidth: 26,
    color: COLORS.primary,
    fontFamily: "Poppins_700Bold",
    fontSize: 13,
    textAlign: "center",
  },
  orderButton: {
    minHeight: 46,
    marginTop: 13,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: COLORS.selected,
  },
  orderButtonText: {
    color: COLORS.primary,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
  },
  buttonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
  flowNote: {
    padding: 22,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  flowTitle: {
    marginTop: 9,
    color: COLORS.text,
    fontFamily: "Poppins_700Bold",
    fontSize: 15,
  },
  flowText: {
    marginTop: 5,
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    lineHeight: 18,
    textAlign: "center",
  },
});
