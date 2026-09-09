import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

const { width: SCREEN_W } = Dimensions.get("window");

// ---------- Wind / speed line ----------
type WindLineConfig = {
  top: number;
  width: number;
  delay: number;
  duration: number;
};

function WindLine({ top, width, delay, duration }: WindLineConfig) {
  const translateX = useRef(new Animated.Value(40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.6,
            duration: duration * 0.2,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: -60,
            duration,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(opacity, {
          toValue: 0,
          duration: duration * 0.2,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 40,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top,
        right: "50%",
        width,
        height: 3,
        borderRadius: 2,
        backgroundColor: "#C84A25",
        opacity,
        transform: [{ translateX }],
      }}
    />
  );
}

// ---------- Dust puff near wheels ----------
function DustPuff({ left, delay }: { left: number; delay: number }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.5,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 8,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: -18,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.4,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left,
        bottom: 6,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: "#D9C4AE",
        opacity,
        transform: [{ translateY }, { translateX }, { scale }],
      }}
    />
  );
}

export default function OnboardingThree() {
  const fadeHeading = useRef(new Animated.Value(0)).current;
  const slideHeading = useRef(new Animated.Value(24)).current;

  const fadeSubtitle = useRef(new Animated.Value(0)).current;
  const slideSubtitle = useRef(new Animated.Value(24)).current;

  // Driver rides in from the left
  const driveIn = useRef(new Animated.Value(-SCREEN_W)).current;
  const fadeDriver = useRef(new Animated.Value(0)).current;
  const bounce = useRef(new Animated.Value(0)).current;
  const tilt = useRef(new Animated.Value(0)).current;

  const fadeFooter = useRef(new Animated.Value(0)).current;
  const slideFooter = useRef(new Animated.Value(20)).current;

  const fadeBg = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeBg, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();

    Animated.sequence([
      Animated.stagger(140, [
        Animated.parallel([
          Animated.timing(fadeHeading, {
            toValue: 1,
            duration: 550,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(slideHeading, {
            toValue: 0,
            duration: 550,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(fadeSubtitle, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(slideSubtitle, {
            toValue: 0,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),
      // Scooter zooms in from off-screen left, with a little forward-lean tilt that settles
      Animated.parallel([
        Animated.timing(fadeDriver, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(driveIn, {
          toValue: 0,
          duration: 750,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(tilt, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(tilt, {
            toValue: 0,
            friction: 5,
            tension: 60,
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.parallel([
        Animated.timing(fadeFooter, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(slideFooter, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // idle bounce loop, like riding over a bumpy road
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounce, {
            toValue: 1,
            duration: 420,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(bounce, {
            toValue: 0,
            duration: 420,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });
  }, []);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const handleSkip = () => {
    router.push("./home");
  };

  const handleNext = () => {
    router.replace("../auth/locationverify");
  };

  const windLines = useMemo(
    () => [
      { top: 130, width: 46, delay: 0, duration: 650 },
      { top: 150, width: 30, delay: 150, duration: 700 },
      { top: 168, width: 38, delay: 320, duration: 620 },
      { top: 186, width: 24, delay: 480, duration: 680 },
    ],
    [],
  );

  const bounceY = bounce.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });
  const tiltDeg = tilt.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-4deg"],
  });

  return (
    <View className="flex-1 bg-[#FFF8EF]">
      {/* Background depth */}
      <Animated.View style={{ opacity: fadeBg }} className="absolute inset-0">
        <View
          className="absolute -top-16 -left-20 w-56 h-56 rounded-full"
          style={{ backgroundColor: "#F6D9B8", opacity: 0.45 }}
        />
        <View
          className="absolute top-1/4 -right-24 w-64 h-64 rounded-full"
          style={{ backgroundColor: "#F0B27A", opacity: 0.22 }}
        />
        {/* faint road line near the bottom for grounding */}
        <View
          className="absolute left-6 right-6"
          style={{
            bottom: 118,
            height: 2,
            backgroundColor: "#E8C9A8",
            opacity: 0.6,
          }}
        />
      </Animated.View>

      <View className="flex-1 px-6 pt-12 pb-8">
        {/* Back button */}
        <Pressable
          onPress={handleBack}
          className="w-10 h-10 rounded-full bg-white items-center justify-center"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        >
          <Ionicons name="chevron-back" size={22} color="#2A2A2A" />
        </Pressable>

        {/* Heading */}
        <Animated.View
          style={{
            opacity: fadeHeading,
            transform: [{ translateY: slideHeading }],
          }}
          className="items-center mt-16"
        >
          <Text
            style={{ fontFamily: "Poppins_800ExtraBold" }}
            className="text-[42px] text-[#2A2A2A] text-center leading-[48px]"
          >
            Fast Delivery,{"\n"}
            <Text
              style={{ fontFamily: "Poppins_800ExtraBold" }}
              className="text-[#C84A25]"
            >
              Right to You
            </Text>
          </Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View
          style={{
            opacity: fadeSubtitle,
            transform: [{ translateY: slideSubtitle }],
          }}
          className="items-center mt-4"
        >
          <Text
            style={{ fontFamily: "Poppins_400Regular" }}
            className="text-[16px] text-[#8A8A8A] text-center leading-relaxed px-4"
          >
            Quick, reliable and safe delivery by our trusted delivery partners
          </Text>
        </Animated.View>

        {/* Driver illustration with motion effects */}
        <View className="flex-1 items-center justify-center overflow-hidden">
          {windLines.map((w, i) => (
            <WindLine key={i} {...w} />
          ))}

          <Animated.View
            style={{
              opacity: fadeDriver,
              transform: [
                { translateX: driveIn },
                { translateY: bounceY },
                { rotate: tiltDeg },
              ],
            }}
          >
            <Image
              source={require("../assets/images/onboarding-two.png")}
              style={{ width: SCREEN_W * 0.85, height: SCREEN_W * 0.85 }}
              resizeMode="contain"
            />

            <DustPuff left={SCREEN_W * 0.18} delay={0} />
            <DustPuff left={SCREEN_W * 0.5} delay={200} />
          </Animated.View>
        </View>

        {/* Footer: dots + skip */}
        <Animated.View
          style={{
            opacity: fadeFooter,
            transform: [{ translateY: slideFooter }],
          }}
          className="flex-row items-center justify-between pb-2"
        >
          <View className="flex-row items-center gap-1.5">
            <View className="h-1.5 w-1.5 rounded-full bg-[#E5DFD8]" />
            <View className="h-1.5 w-4.5 rounded-full bg-[#C84A25]" />
            <View className="h-1.5 w-1.5 rounded-full bg-[#E5DFD8]" />
          </View>

          <Pressable
            onPress={handleNext}
            className="flex-row items-center gap-1.5 active:opacity-70"
          >
            <Text
              style={{ fontFamily: "Poppins_600SemiBold" }}
              className="text-[#2A2A2A] text-[15px]"
            >
              Skip
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#2A2A2A" />
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}
