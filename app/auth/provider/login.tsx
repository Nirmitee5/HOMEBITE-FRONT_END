import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  TextInput,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { router } from "expo-router";
import { Ionicons, AntDesign } from "@expo/vector-icons";

const COLORS = {
  bg: "#FFF8EF",
  primary: "#C84A25",
  text: "#2A2A2A",
  muted: "#8A8A8A",
  border: "#EDE4D8",
  inputBg: "#FFFCF9",
  placeholder: "#B8B0A6",
  green: "#8FBF6A",
};

type InputProps = {
  label: string;
  value: string;
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  secureTextEntry?: boolean;
  rightElement?: React.ReactNode;
  keyboardType?: "default" | "email-address";
};

function FormInput({
  label,
  value,
  placeholder,
  icon,
  focused,
  onChangeText,
  onFocus,
  onBlur,
  secureTextEntry = false,
  rightElement,
  keyboardType = "default",
}: InputProps) {
  return (
    <View className="mt-3">
      {label ? (
        <Text
          style={{ fontFamily: "Poppins_600SemiBold" }}
          className="text-[#3A342F] text-[14px] mb-2"
        >
          {label}
        </Text>
      ) : null}

      <View
        className="flex-row items-center rounded-2xl px-4 h-[50px]"
        style={{
          borderWidth: 1.5,
          borderColor: focused ? COLORS.primary : COLORS.border,
          backgroundColor: COLORS.inputBg,
        }}
      >
        <Ionicons
          name={icon}
          size={20}
          color={focused ? COLORS.primary : "#9B938A"}
          style={{ marginRight: 11 }}
        />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={onFocus}
          onBlur={onBlur}
          style={{
            fontFamily: "Poppins_400Regular",
            flex: 1,
          }}
          className="text-[15px] text-[#2A2A2A]"
        />

        {rightElement}
      </View>
    </View>
  );
}

function SocialButton({
  icon,
  onPress,
}: {
  icon: "google" | "apple";
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="w-[58px] h-[52px] rounded-2xl bg-white border border-[#EDE4D8] items-center justify-center active:opacity-70"
    >
      <AntDesign
        name={icon}
        size={icon === "apple" ? 25 : 23}
        color={COLORS.text}
      />
    </Pressable>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fadeHeader = useRef(new Animated.Value(0)).current;
  const slideHeader = useRef(new Animated.Value(20)).current;
  const fadeCard = useRef(new Animated.Value(0)).current;
  const slideCard = useRef(new Animated.Value(25)).current;
  const fadeFooter = useRef(new Animated.Value(0)).current;
  const floatingLeaf = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
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

      Animated.timing(fadeFooter, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();

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
      ])
    );

    leafAnimation.start();

    return () => {
      leafAnimation.stop();
    };
  }, []);

  const handleContinue = () => {
    if (!email.trim() || !password.trim()) return;

    router.push("./verify");
  };

  const handleSignup = () => {
    router.push("./signup");
  };

  const handleGoogleSignIn = () => {
    // TODO: Google authentication
  };

  const handleAppleSignIn = () => {
    // TODO: Apple authentication
  };

  const leafTranslateY = floatingLeaf.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

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
          paddingBottom: 12,
        }}
      >
        {/* Decorative background */}
        <View
          pointerEvents="none"
          className="absolute"
          style={{
            top: -70,
            right: -70,
            width: 210,
            height: 210,
            borderRadius: 105,
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
            opacity: 0.3,
          }}
        />

        {/* Floating leaf */}
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            right: 30,
            top: 80,
            transform: [
              { translateY: leafTranslateY },
              { rotate: "20deg" },
            ],
          }}
        >
          <Ionicons name="leaf" size={29} color={COLORS.green} />
        </Animated.View>

        <View className="absolute right-20 top-32 w-2 h-2 rounded-full bg-[#C84A25] opacity-50" />
        <View className="absolute right-12 top-40 w-1.5 h-1.5 rounded-full bg-[#8FBF6A]" />

        <View className="flex-1 px-5 pt-5">

          {/* Back Button */}
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white border border-[#EDE4D8] items-center justify-center"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 7,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              elevation: 2,
            }}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={COLORS.text}
            />
          </Pressable>

          {/* Header */}
          <Animated.View
            style={{
              opacity: fadeHeader,
              transform: [{ translateY: slideHeader }],
            }}
            className="mt-4"
          >
            <View className="flex-row items-center mb-3">
              <View className="w-14 h-14 items-center justify-center mr-2 overflow-hidden">
                <Image
                  source={require("../../assets/images/homebite-logo.png")}
                  style={{
                    width: 52,
                    height: 52,
                    resizeMode: "contain",
                  }}
                />
              </View>

              <Text
                style={{ fontFamily: "Poppins_700Bold" }}
                className="text-[#C84A25] text-[23px]"
              >
                HomeBite
              </Text>
            </View>

            <Text
              style={{ fontFamily: "Poppins_800ExtraBold" }}
              className="text-[29px] leading-[36px] text-[#2A2A2A]"
            >
              Welcome Back! 👋
            </Text>

            <Text
              style={{ fontFamily: "Poppins_400Regular" }}
              className="text-[15px] text-[#8A8A8A] mt-1"
            >
              Login to continue to HomeBite
            </Text>

            {/* Security Badge */}
            <View className="self-start flex-row items-center bg-[#EDF6E8] px-3 py-1.5 rounded-full mt-3">
              <Ionicons
                name="shield-checkmark"
                size={14}
                color="#6D9E4E"
              />

              <Text
                style={{ fontFamily: "Poppins_500Medium" }}
                className="text-[#6D9E4E] text-[11px] ml-1.5"
              >
                Safe & secure login
              </Text>
            </View>
          </Animated.View>

          {/* Login Card */}
          <Animated.View
            style={{
              opacity: fadeCard,
              transform: [{ translateY: slideCard }],
              shadowColor: "#8A5A43",
              shadowOpacity: 0.1,
              shadowRadius: 18,
              shadowOffset: {
                width: 0,
                height: 7,
              },
              elevation: 5,
            }}
            className="mt-4 bg-white rounded-[25px] p-5"
          >
            <Text
              style={{ fontFamily: "Poppins_700Bold" }}
              className="text-[#2A2A2A] text-[19px]"
            >
              Login
            </Text>

            <Text
              style={{ fontFamily: "Poppins_400Regular" }}
              className="text-[#9B938A] text-[12px] mt-1"
            >
              Enter your account details
            </Text>

            {/* Email */}
            <FormInput
              label="Email Address"
              value={email}
              placeholder="Enter your email"
              icon="mail-outline"
              focused={emailFocused}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              keyboardType="email-address"
            />

            {/* Password */}
            <View className="mt-3">
              <View className="flex-row justify-between items-center mb-2">
                <Text
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                  className="text-[#3A342F] text-[14px]"
                >
                  Password
                </Text>

                <Pressable>
                  <Text
                    style={{ fontFamily: "Poppins_600SemiBold" }}
                    className="text-[#C84A25] text-[12px]"
                  >
                    Forgot Password?
                  </Text>
                </Pressable>
              </View>

              <View
                className="flex-row items-center rounded-2xl px-4 h-[50px]"
                style={{
                  borderWidth: 1.5,
                  borderColor: passwordFocused
                    ? COLORS.primary
                    : COLORS.border,
                  backgroundColor: COLORS.inputBg,
                }}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={
                    passwordFocused
                      ? COLORS.primary
                      : "#9B938A"
                  }
                  style={{ marginRight: 11 }}
                />

                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.placeholder}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  style={{
                    fontFamily: "Poppins_400Regular",
                    flex: 1,
                  }}
                  className="text-[15px] text-[#2A2A2A]"
                />

                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={
                      showPassword
                        ? "eye-off-outline"
                        : "eye-outline"
                    }
                    size={20}
                    color="#9B938A"
                  />
                </Pressable>
              </View>
            </View>

            {/* Continue Button */}
            <Pressable
              onPress={handleContinue}
              className="bg-[#C84A25] h-[54px] rounded-full items-center justify-center mt-5 active:opacity-80"
              style={{
                shadowColor: "#C84A25",
                shadowOpacity: 0.23,
                shadowRadius: 11,
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                elevation: 5,
              }}
            >
              <View className="flex-row items-center">
                <Text
                  style={{ fontFamily: "Poppins_700Bold" }}
                  className="text-white text-[17px]"
                >
                  Continue
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={19}
                  color="white"
                  style={{ marginLeft: 7 }}
                />
              </View>
            </Pressable>
          </Animated.View>

          {/* Footer */}
          <Animated.View
            style={{ opacity: fadeFooter }}
            className="mt-4"
          >
            {/* Divider */}
            <View className="flex-row items-center">
              <View className="flex-1 h-[1px] bg-[#E5DCD1]" />

              <View className="bg-[#FFF8EF] px-3">
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-[#9B938A] text-[13px]"
                >
                  or continue with
                </Text>
              </View>

              <View className="flex-1 h-[1px] bg-[#E5DCD1]" />
            </View>

            {/* Google + Apple */}
            <View className="flex-row justify-center gap-4 mt-4">
              <SocialButton
                icon="google"
                onPress={handleGoogleSignIn}
              />

              <SocialButton
                icon="apple"
                onPress={handleAppleSignIn}
              />
            </View>

            {/* Signup */}
            <View className="flex-row items-center justify-center mt-5">
              <Text
                style={{ fontFamily: "Poppins_400Regular" }}
                className="text-[#8A8A8A] text-[13px]"
              >
                Don't have an account?
              </Text>

              <Pressable
                onPress={handleSignup}
                className="ml-1"
              >
                <Text
                  style={{ fontFamily: "Poppins_700Bold" }}
                  className="text-[#C84A25] text-[13px]"
                >
                  Sign up now
                </Text>
              </Pressable>
            </View>

            {/* Terms */}
            <Text
              style={{ fontFamily: "Poppins_400Regular" }}
              className="text-[#9B938A] text-[11px] text-center leading-5 mt-4 px-4"
            >
              By continuing, you agree to our{" "}
              <Text
                style={{ fontFamily: "Poppins_600SemiBold" }}
                className="text-[#2A2A2A]"
              >
                Terms & Conditions
              </Text>
              {" "}and{" "}
              <Text
                style={{ fontFamily: "Poppins_600SemiBold" }}
                className="text-[#2A2A2A]"
              >
                Privacy Policy
              </Text>
            </Text>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}