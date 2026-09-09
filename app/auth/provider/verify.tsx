import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Easing,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

const COLORS = {
  primary: "#C84A25",
  text: "#2A2A2A",
  muted: "#8A8A8A",
  lightText: "#9B938A",
  border: "#EDE4D8",
  inputBg: "#FFFCF9",
  placeholder: "#B8B0A6",
  green: "#6D9E4E",
};

export default function Verify() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const inputs = useRef<Array<TextInput | null>>([]);

  const fadeHeader = useRef(new Animated.Value(0)).current;
  const slideHeader = useRef(new Animated.Value(15)).current;
  const fadeCard = useRef(new Animated.Value(0)).current;
  const slideCard = useRef(new Animated.Value(20)).current;
  const floatingLeaf = useRef(new Animated.Value(0)).current;

  /* --------------------------------
     Entrance animation
  -------------------------------- */

  useEffect(() => {
    const animation = Animated.stagger(100, [
      Animated.parallel([
        Animated.timing(fadeHeader, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideHeader, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(fadeCard, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideCard, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]);

    animation.start();

    const leafAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingLeaf, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatingLeaf, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    leafAnimation.start();

    return () => {
      animation.stop();
      leafAnimation.stop();
    };
  }, []);

  /* --------------------------------
     OTP timer
  -------------------------------- */

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* --------------------------------
     OTP input
  -------------------------------- */

  const handleOtpChange = (value: string, index: number) => {
    const digit = value.replace(/[^0-9]/g, "").slice(-1);

    const updatedOtp = [...otp];
    updatedOtp[index] = digit;

    setOtp(updatedOtp);

    if (digit && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  /* --------------------------------
     Resend OTP
  -------------------------------- */

  const handleResend = () => {
    if (timer > 0) return;

    setOtp(["", "", "", "", "", ""]);
    setTimer(30);

    inputs.current[0]?.focus();

    // TODO: Connect resend OTP API
  };

  /* --------------------------------
     Verify
  -------------------------------- */

  const handleVerify = () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      return;
    }

    /*
      Temporary flow:

      Provider → Provider Login

      Backend OTP verification can be connected here later.
    */

    router.replace("/provider/dashboard");
  };

  const leafTranslateY = floatingLeaf.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const isComplete = otp.every((digit) => digit !== "");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-[#FFF8EF]"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 15,
        }}
      >
        {/* Background decoration */}

        <View
          pointerEvents="none"
          className="absolute"
          style={{
            top: -65,
            right: -65,
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: "#F8D7C7",
            opacity: 0.35,
          }}
        />

        <View
          pointerEvents="none"
          className="absolute"
          style={{
            top: 150,
            left: -100,
            width: 170,
            height: 170,
            borderRadius: 85,
            backgroundColor: "#DCEBCF",
            opacity: 0.25,
          }}
        />

        {/* Floating leaf */}

        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            right: 32,
            top: 82,
            transform: [{ translateY: leafTranslateY }, { rotate: "20deg" }],
          }}
        >
          <Ionicons name="leaf" size={27} color="#8FBF6A" />
        </Animated.View>

        <View className="absolute right-20 top-32 w-2 h-2 rounded-full bg-[#C84A25] opacity-50" />

        <View className="absolute right-12 top-40 w-1.5 h-1.5 rounded-full bg-[#8FBF6A]" />

        <View className="flex-1 px-5 pt-5">
          {/* Back button */}

          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white border border-[#EDE4D8] items-center justify-center"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 6,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              elevation: 2,
            }}
          >
            <Ionicons name="chevron-back" size={23} color={COLORS.text} />
          </Pressable>

          {/* Header */}

          <Animated.View
            style={{
              opacity: fadeHeader,
              transform: [{ translateY: slideHeader }],
            }}
            className="mt-4"
          >
            <View className="flex-row items-center mb-2">
              <View className="w-12 h-12 items-center justify-center mr-2">
                <Image
                  source={require("../../assets/images/homebite-logo.png")}
                  style={{
                    width: 46,
                    height: 46,
                    resizeMode: "contain",
                  }}
                />
              </View>

              <Text
                style={{
                  fontFamily: "Poppins_700Bold",
                }}
                className="text-[#C84A25] text-[20px]"
              >
                HomeBite
              </Text>
            </View>

            <Text
              style={{
                fontFamily: "Poppins_800ExtraBold",
              }}
              className="text-[28px] leading-[34px] text-[#2A2A2A]"
            >
              Verify Your Account 🔐
            </Text>

            <Text
              style={{
                fontFamily: "Poppins_400Regular",
              }}
              className="text-[14px] text-[#8A8A8A] mt-1"
            >
              Enter the verification code sent to your email
            </Text>

            {/* Security badge */}

            <View className="self-start flex-row items-center bg-[#EDF6E8] px-2.5 py-1 rounded-full mt-2.5">
              <Ionicons
                name="shield-checkmark"
                size={12}
                color={COLORS.green}
              />

              <Text
                style={{
                  fontFamily: "Poppins_500Medium",
                }}
                className="text-[#6D9E4E] text-[10px] ml-1"
              >
                Secure verification
              </Text>
            </View>
          </Animated.View>

          {/* Verification card */}

          <Animated.View
            style={{
              opacity: fadeCard,
              transform: [{ translateY: slideCard }],
              shadowColor: "#8A5A43",
              shadowOpacity: 0.1,
              shadowRadius: 15,
              shadowOffset: {
                width: 0,
                height: 6,
              },
              elevation: 5,
            }}
            className="mt-4 bg-white rounded-[22px] p-4"
          >
            <Text
              style={{
                fontFamily: "Poppins_700Bold",
              }}
              className="text-[#2A2A2A] text-[17px]"
            >
              Enter OTP
            </Text>

            <Text
              style={{
                fontFamily: "Poppins_400Regular",
              }}
              className="text-[#9B938A] text-[11px] mt-0.5"
            >
              Enter the 6-digit code to continue
            </Text>

            {/* OTP boxes */}

            <View className="flex-row justify-between mt-5">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputs.current[index] = ref;
                  }}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(event) => handleKeyPress(event, index)}
                  onFocus={() => setFocusedIndex(index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  selectTextOnFocus
                  style={{
                    fontFamily: "Poppins_600SemiBold",
                    borderWidth: 1.2,
                    borderColor:
                      focusedIndex === index ? COLORS.primary : COLORS.border,
                    backgroundColor: COLORS.inputBg,
                    width: 42,
                    height: 48,
                    borderRadius: 12,
                    fontSize: 17,
                    color: COLORS.text,
                  }}
                />
              ))}
            </View>

            {/* Resend */}

            <View className="flex-row justify-center items-center mt-5">
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                }}
                className="text-[#8A8A8A] text-[11px]"
              >
                Didn't receive the code?
              </Text>

              <Pressable
                onPress={handleResend}
                disabled={timer > 0}
                className="ml-1"
              >
                <Text
                  style={{
                    fontFamily: "Poppins_700Bold",
                  }}
                  className={`text-[11px] ${
                    timer > 0 ? "text-[#B8B0A6]" : "text-[#C84A25]"
                  }`}
                >
                  {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                </Text>
              </Pressable>
            </View>

            {/* Verify button */}

            <Pressable
              onPress={handleVerify}
              disabled={!isComplete}
              className={`h-[50px] rounded-full items-center justify-center mt-5 ${
                isComplete ? "bg-[#C84A25]" : "bg-[#D9CFC8]"
              }`}
              style={
                isComplete
                  ? {
                      shadowColor: "#C84A25",
                      shadowOpacity: 0.22,
                      shadowRadius: 9,
                      shadowOffset: {
                        width: 0,
                        height: 4,
                      },
                      elevation: 4,
                    }
                  : undefined
              }
            >
              <View className="flex-row items-center">
                <Text
                  style={{
                    fontFamily: "Poppins_700Bold",
                  }}
                  className="text-white text-[15px]"
                >
                  Verify & Continue
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={17}
                  color="white"
                  style={{
                    marginLeft: 6,
                  }}
                />
              </View>
            </Pressable>
          </Animated.View>

          {/* Bottom information */}

          <View className="items-center mt-5 px-5">
            <View className="flex-row items-center">
              <Ionicons name="lock-closed-outline" size={13} color="#9B938A" />

              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                }}
                className="text-[#9B938A] text-[10px] ml-1.5"
              >
                Your verification is secure
              </Text>
            </View>

            <Text
              style={{
                fontFamily: "Poppins_400Regular",
              }}
              className="text-[#B8B0A6] text-[9px] text-center leading-4 mt-3"
            >
              Never share your verification code with anyone.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
