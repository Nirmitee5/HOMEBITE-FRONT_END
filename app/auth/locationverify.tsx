import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";

export default function LocationVerify() {
  const [loading, setLoading] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);

  // =========================================
  // ANIMATIONS
  // =========================================

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const slideAnim = useRef(new Animated.Value(35)).current;

  const pinScale = useRef(new Animated.Value(0.7)).current;

  const pinFloat = useRef(new Animated.Value(0)).current;

  const buttonScale = useRef(new Animated.Value(1)).current;

  const pulseAnim = useRef(new Animated.Value(1)).current;

  // =========================================
  // PAGE ANIMATION
  // =========================================

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.spring(pinScale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    // =========================================
    // FLOATING LOCATION PIN
    // =========================================

    Animated.loop(
      Animated.sequence([
        Animated.timing(pinFloat, {
          toValue: -10,
          duration: 1300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),

        Animated.timing(pinFloat, {
          toValue: 0,
          duration: 1300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // =========================================
    // PULSE ANIMATION
    // =========================================

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),

        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  // =========================================
  // REQUEST LOCATION
  // =========================================

  const requestLocation = async () => {
    if (loading) return;

    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 80,
        useNativeDriver: true,
      }),

      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      setLoading(true);

      // Request foreground location permission
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLoading(false);

        return;
      }

      setLocationGranted(true);

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      console.log("Latitude:", location.coords.latitude);
      console.log("Longitude:", location.coords.longitude);

      // =========================================
      // SMALL SUCCESS DELAY
      // =========================================

      setTimeout(() => {
        router.replace("/auth/role");
      }, 1000);
    } catch (error) {
      console.log("Location error:", error);
      setLoading(false);
    }
  };

  // =========================================
  // UI
  // =========================================

  return (
    <View className="flex-1 bg-[#FFF8EF]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <View className="flex-1 px-6 pt-12">
          {/* ================================= */}
          {/* DECORATIVE BACKGROUND */}
          {/* ================================= */}

          <View
            pointerEvents="none"
            className="absolute"
            style={{
              top: -90,
              right: -80,
              width: 230,
              height: 230,
              borderRadius: 115,
              backgroundColor: "#F7D7C6",
              opacity: 0.55,
            }}
          />

          <View
            pointerEvents="none"
            className="absolute"
            style={{
              top: 300,
              left: -110,
              width: 190,
              height: 190,
              borderRadius: 95,
              backgroundColor: "#DCEBCF",
              opacity: 0.35,
            }}
          />

          <View
            pointerEvents="none"
            className="absolute"
            style={{
              bottom: 100,
              right: -50,
              width: 130,
              height: 130,
              borderRadius: 65,
              backgroundColor: "#F4C7B3",
              opacity: 0.25,
            }}
          />

          {/* ================================= */}
          {/* DECORATIVE DOTS */}
          {/* ================================= */}

          <View
            pointerEvents="none"
            className="absolute right-16 top-36 w-2.5 h-2.5 rounded-full bg-[#C84A25]"
            style={{
              opacity: 0.55,
            }}
          />

          <View
            pointerEvents="none"
            className="absolute right-9 top-44 w-2 h-2 rounded-full bg-[#8FBF6A]"
          />

          <View
            pointerEvents="none"
            className="absolute left-10 top-72 w-1.5 h-1.5 rounded-full bg-[#C84A25]"
            style={{
              opacity: 0.4,
            }}
          />

          {/* ================================= */}
          {/* BACK BUTTON */}
          {/* ================================= */}

          <Pressable
            onPress={() => router.back()}
            className="
              w-12
              h-12
              rounded-full
              bg-white
              border
              border-[#EDE4D8]
              items-center
              justify-center
            "
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 10,
              shadowOffset: {
                width: 0,
                height: 4,
              },
              elevation: 3,
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#2A2A2A" />
          </Pressable>

          {/* ================================= */}
          {/* MAIN CONTENT */}
          {/* ================================= */}

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim,
                },
              ],
            }}
            className="items-center"
          >
            {/* ================================= */}
            {/* LOCATION ICON */}
            {/* ================================= */}

            <View
              style={{
                height: 190,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 15,
              }}
            >
              {/* Outer pulse circle */}

              <Animated.View
                style={{
                  position: "absolute",
                  width: 160,
                  height: 160,
                  borderRadius: 80,
                  backgroundColor: "#F7D7C6",
                  opacity: 0.45,
                  transform: [
                    {
                      scale: pulseAnim,
                    },
                  ],
                }}
              />

              <Animated.View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: "#FFF",
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#C84A25",
                  shadowOpacity: 0.18,
                  shadowRadius: 18,
                  shadowOffset: {
                    width: 0,
                    height: 8,
                  },
                  elevation: 6,
                  transform: [
                    {
                      scale: pinScale,
                    },
                    {
                      translateY: pinFloat,
                    },
                  ],
                }}
              >
                <View
                  style={{
                    width: 82,
                    height: 82,
                    borderRadius: 41,
                    backgroundColor: "#FFF1EA",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="location" size={48} color="#C84A25" />
                </View>
              </Animated.View>
            </View>

            {/* ================================= */}
            {/* TITLE */}
            {/* ================================= */}

            <Text
              style={{
                fontFamily: "Poppins_800ExtraBold",
              }}
              className="
                text-[#222222]
                text-[32px]
                mt-2
                text-center
              "
            >
              Find food near you
            </Text>

            {/* ================================= */}
            {/* DESCRIPTION */}
            {/* ================================= */}

            <Text
              style={{
                fontFamily: "Poppins_400Regular",
              }}
              className="
                text-[#6F6861]
                text-[15px]
                text-center
                mt-3
                leading-[24px]
                px-4
              "
            >
              Allow HomeBite to access your location
              {"\n"}
              so we can find delicious homemade food
              {"\n"}
              available near you.
            </Text>

            {/* ================================= */}
            {/* LOCATION BENEFITS */}
            {/* ================================= */}

            <View
              className="
                w-full
                bg-white
                rounded-[24px]
                mt-7
                px-5
                py-5
                border
                border-[#EDE4D8]
              "
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 12,
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                elevation: 2,
              }}
            >
              {/* BENEFIT 1 */}

              <View className="flex-row items-center">
                <View
                  className="
                    w-11
                    h-11
                    rounded-full
                    bg-[#EDF6E8]
                    items-center
                    justify-center
                  "
                >
                  <Ionicons name="restaurant" size={21} color="#6D9E4E" />
                </View>

                <View className="ml-3 flex-1">
                  <Text
                    style={{
                      fontFamily: "Poppins_700Bold",
                    }}
                    className="
                      text-[#3A342F]
                      text-[14px]
                    "
                  >
                    Nearby homemade meals
                  </Text>

                  <Text
                    style={{
                      fontFamily: "Poppins_400Regular",
                    }}
                    className="
                      text-[#8A8178]
                      text-[12px]
                      mt-0.5
                    "
                  >
                    Discover home cooks around you
                  </Text>
                </View>
              </View>

              {/* DIVIDER */}

              <View className="h-[1px] bg-[#F0E8DE] my-4" />

              {/* BENEFIT 2 */}

              <View className="flex-row items-center">
                <View
                  className="
                    w-11
                    h-11
                    rounded-full
                    bg-[#FFF1EA]
                    items-center
                    justify-center
                  "
                >
                  <Ionicons name="navigate" size={21} color="#C84A25" />
                </View>

                <View className="ml-3 flex-1">
                  <Text
                    style={{
                      fontFamily: "Poppins_700Bold",
                    }}
                    className="
                      text-[#3A342F]
                      text-[14px]
                    "
                  >
                    Accurate delivery
                  </Text>

                  <Text
                    style={{
                      fontFamily: "Poppins_400Regular",
                    }}
                    className="
                      text-[#8A8178]
                      text-[12px]
                      mt-0.5
                    "
                  >
                    Get your order delivered to you
                  </Text>
                </View>
              </View>
            </View>

            {/* ================================= */}
            {/* LOCATION STATUS */}
            {/* ================================= */}

            {locationGranted && (
              <View
                className="
                  flex-row
                  items-center
                  bg-[#EDF6E8]
                  px-5
                  py-3
                  rounded-full
                  mt-5
                  border
                  border-[#D7E8CC]
                "
              >
                <Ionicons name="checkmark-circle" size={19} color="#6D9E4E" />

                <Text
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                  }}
                  className="
                    text-[#5E8D43]
                    text-[13px]
                    ml-2
                  "
                >
                  Location enabled
                </Text>
              </View>
            )}

            {/* ================================= */}
            {/* ALLOW LOCATION BUTTON */}
            {/* ================================= */}

            <Animated.View
              className="w-full"
              style={{
                transform: [
                  {
                    scale: buttonScale,
                  },
                ],
              }}
            >
              <Pressable
                disabled={loading || locationGranted}
                onPress={requestLocation}
                className={`
                  w-full
                  h-[62px]
                  rounded-full
                  items-center
                  justify-center
                  mt-7
                  ${locationGranted ? "bg-[#6D9E4E]" : "bg-[#C84A25]"}
                `}
                style={{
                  shadowColor: locationGranted ? "#6D9E4E" : "#C84A25",
                  shadowOpacity: 0.3,
                  shadowRadius: 15,
                  shadowOffset: {
                    width: 0,
                    height: 7,
                  },
                  elevation: 7,
                }}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name={
                      locationGranted
                        ? "checkmark-circle"
                        : loading
                          ? "locate"
                          : "location"
                    }
                    size={22}
                    color="#FFFFFF"
                  />

                  <Text
                    style={{
                      fontFamily: "Poppins_700Bold",
                    }}
                    className="
                      text-white
                      text-[18px]
                      ml-2
                    "
                  >
                    {locationGranted
                      ? "Location Enabled"
                      : loading
                        ? "Finding Location..."
                        : "Allow Location"}
                  </Text>
                </View>
              </Pressable>
            </Animated.View>

            {/* ================================= */}
            {/* PRIVACY TEXT */}
            {/* ================================= */}

            <View className="flex-row items-center mt-5 mb-6">
              <Ionicons
                name="shield-checkmark-outline"
                size={16}
                color="#8A8178"
              />

              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                }}
                className="
                  text-[#8A8178]
                  text-[11px]
                  ml-1.5
                "
              >
                Your location is only used to improve delivery
              </Text>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}
