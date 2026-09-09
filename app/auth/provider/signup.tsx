//c here i have written the signup for th provider and made chnages in the role.tsx win on press okayy
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type FormErrors = {
  restaurantName?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
  address?: string;
};

export default function ProviderSignup() {
  // ========================================
  // SCROLL VIEW REFERENCE
  // ========================================

  const scrollViewRef = useRef<ScrollView>(null);

  // ========================================
  // FORM STATES
  // ========================================

  const [restaurantName, setRestaurantName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");

  // ========================================
  // PASSWORD VISIBILITY
  // ========================================

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ========================================
  // ERROR STATES
  // ========================================

  const [errors, setErrors] = useState<FormErrors>({});

  // ========================================
  // INPUT FOCUS
  // ========================================

  const [focusedField, setFocusedField] = useState("");

  // ========================================
  // BUTTON ANIMATION
  // ========================================

  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // ========================================
  // FORM VALIDATION
  // ========================================

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Restaurant Name
    if (!restaurantName.trim()) {
      newErrors.restaurantName = "Restaurant name is required";
    }

    // Full Name
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    // Email
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone Number
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }

    // Password
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm Password
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Address
    if (!address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ========================================
  // SIGNUP HANDLER
  // ========================================

  const handleSignup = () => {
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    // ========================================
    // BACKEND INTEGRATION WILL GO HERE LATER
    // ========================================

    /*
      Example future API request:

      const providerData = {
        restaurantName,
        fullName,
        email,
        phoneNumber,
        password,
        address,
      };

      await providerService.signup(providerData);

     
    */

    // Temporary frontend testing
    console.log("Provider Signup Data:", {
      restaurantName,
      fullName,
      email,
      phoneNumber,
      address,
    });
    router.replace("/provider/dashboard");
  };

  // ========================================
  // INPUT COMPONENT
  // ========================================

  const renderInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    icon,
    fieldName,
    keyboardType = "default",
    secureTextEntry = false,
    multiline = false,
    rightIcon,
    onRightIconPress,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    icon: keyof typeof Ionicons.glyphMap;
    fieldName: keyof FormErrors;
    keyboardType?: "default" | "email-address" | "phone-pad";
    secureTextEntry?: boolean;
    multiline?: boolean;
    rightIcon?: keyof typeof Ionicons.glyphMap;
    onRightIconPress?: () => void;
  }) => {
    const isFocused = focusedField === fieldName;
    const error = errors[fieldName];

    return (
      <View className="mb-5">
        {/* LABEL */}

        <Text
          style={{ fontFamily: "Poppins_600SemiBold" }}
          className="text-[#3A342F] text-[14px] mb-2"
        >
          {label}
          <Text className="text-[#C84A25]"> *</Text>
        </Text>

        {/* INPUT */}

        <View
          className={`bg-white border rounded-2xl flex-row items-center px-4 ${
            multiline ? "min-h-[100px]" : "h-[58px]"
          } ${
            error
              ? "border-red-400"
              : isFocused
                ? "border-[#C84A25]"
                : "border-[#EDE4D8]"
          }`}
        >
          {/* LEFT ICON */}

          <Ionicons
            name={icon}
            size={21}
            color={isFocused ? "#C84A25" : "#8A8178"}
          />

          {/* TEXT INPUT */}

          <TextInput
            value={value}
            onChangeText={(text) => {
              onChangeText(text);

              // Remove error while user edits
              if (errors[fieldName]) {
                setErrors((previousErrors) => ({
                  ...previousErrors,
                  [fieldName]: undefined,
                }));
              }
            }}
            placeholder={placeholder}
            placeholderTextColor="#AAA29B"
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            multiline={multiline}
            textAlignVertical={multiline ? "top" : "center"}
            onFocus={() => {
              setFocusedField(fieldName);

              // Auto-scroll for lower fields
              if (fieldName === "confirmPassword" || fieldName === "address") {
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({
                    animated: true,
                  });
                }, 350);
              }
            }}
            onBlur={() => setFocusedField("")}
            style={{
              fontFamily: "Poppins_400Regular",
              flex: 1,
              marginLeft: 12,
              fontSize: 14,
              color: "#3A342F",
              paddingVertical: multiline ? 15 : 0,
            }}
          />

          {/* RIGHT ICON */}

          {rightIcon && (
            <Pressable onPress={onRightIconPress} className="ml-2 p-1">
              <Ionicons name={rightIcon} size={21} color="#8A8178" />
            </Pressable>
          )}
        </View>

        {/* ERROR MESSAGE */}

        {error && (
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
            }}
            className="text-red-500 text-[11px] mt-1 ml-1"
          >
            {error}
          </Text>
        )}
      </View>
    );
  };

  // ========================================
  // UI
  // ========================================

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#FFF8EF]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: 24,

            // Extra space so the bottom fields
            // can scroll above the keyboard
            paddingBottom: 220,
          }}
        >
          {/* ================================= */}
          {/* BACK BUTTON */}
          {/* ================================= */}

          <Animated.View entering={FadeIn.duration(500)}>
            <Pressable
              onPress={() => router.back()}
              className="w-12 h-12 rounded-full bg-white border border-[#EDE4D8] items-center justify-center mt-3"
            >
              <Ionicons name="arrow-back" size={24} color="#2A2A2A" />
            </Pressable>
          </Animated.View>

          {/* ================================= */}
          {/* HEADER */}
          {/* ================================= */}

          <Animated.View
            entering={FadeInDown.duration(600).springify()}
            className="items-center mt-6"
          >
            {/* PROVIDER ICON */}

            <Animated.View
              entering={FadeInUp.delay(150).duration(600).springify()}
              className="w-24 h-24 rounded-full bg-[#FFF1EA] items-center justify-center"
            >
              <Ionicons name="restaurant-outline" size={46} color="#C84A25" />
            </Animated.View>

            {/* TITLE */}

            <Text
              style={{
                fontFamily: "Poppins_800ExtraBold",
              }}
              className="text-[#222222] text-[27px] text-center mt-5"
            >
              Create Your Provider Account
            </Text>

            {/* SUBTITLE */}

            <Text
              style={{
                fontFamily: "Poppins_400Regular",
              }}
              className="text-[#6F6861] text-[14px] text-center mt-3 leading-[22px] px-3"
            >
              Share your homemade food and bring delicious meals to your
              community.
            </Text>
          </Animated.View>

          {/* ================================= */}
          {/* FORM */}
          {/* ================================= */}

          <View className="mt-9">
            {/* RESTAURANT NAME */}

            <Animated.View entering={FadeInUp.delay(100).duration(500)}>
              {renderInput({
                label: "Restaurant Name",
                value: restaurantName,
                onChangeText: setRestaurantName,
                placeholder: "Enter your restaurant or kitchen name",
                icon: "restaurant-outline",
                fieldName: "restaurantName",
              })}
            </Animated.View>

            {/* FULL NAME */}

            <Animated.View entering={FadeInUp.delay(180).duration(500)}>
              {renderInput({
                label: "Full Name",
                value: fullName,
                onChangeText: setFullName,
                placeholder: "Enter your full name",
                icon: "person-outline",
                fieldName: "fullName",
              })}
            </Animated.View>

            {/* EMAIL */}

            <Animated.View entering={FadeInUp.delay(260).duration(500)}>
              {renderInput({
                label: "Email Address",
                value: email,
                onChangeText: setEmail,
                placeholder: "Enter your email address",
                icon: "mail-outline",
                fieldName: "email",
                keyboardType: "email-address",
              })}
            </Animated.View>

            {/* PHONE NUMBER */}

            <Animated.View entering={FadeInUp.delay(340).duration(500)}>
              {renderInput({
                label: "Phone Number",
                value: phoneNumber,
                onChangeText: setPhoneNumber,
                placeholder: "Enter your phone number",
                icon: "call-outline",
                fieldName: "phoneNumber",
                keyboardType: "phone-pad",
              })}
            </Animated.View>

            {/* PASSWORD */}

            <Animated.View entering={FadeInUp.delay(420).duration(500)}>
              {renderInput({
                label: "Password",
                value: password,
                onChangeText: setPassword,
                placeholder: "Create a password",
                icon: "lock-closed-outline",
                fieldName: "password",
                secureTextEntry: !showPassword,
                rightIcon: showPassword ? "eye-off-outline" : "eye-outline",
                onRightIconPress: () => setShowPassword(!showPassword),
              })}
            </Animated.View>

            {/* CONFIRM PASSWORD */}

            <Animated.View entering={FadeInUp.delay(500).duration(500)}>
              {renderInput({
                label: "Confirm Password",
                value: confirmPassword,
                onChangeText: setConfirmPassword,
                placeholder: "Confirm your password",
                icon: "lock-closed-outline",
                fieldName: "confirmPassword",
                secureTextEntry: !showConfirmPassword,
                rightIcon: showConfirmPassword
                  ? "eye-off-outline"
                  : "eye-outline",
                onRightIconPress: () =>
                  setShowConfirmPassword(!showConfirmPassword),
              })}
            </Animated.View>

            {/* ADDRESS */}

            <Animated.View entering={FadeInUp.delay(580).duration(500)}>
              {renderInput({
                label: "Restaurant Address",
                value: address,
                onChangeText: setAddress,
                placeholder: "Enter your restaurant address",
                icon: "location-outline",
                fieldName: "address",
                multiline: true,
              })}
            </Animated.View>
          </View>

          {/* ================================= */}
          {/* CREATE ACCOUNT BUTTON */}
          {/* ================================= */}

          <Animated.View
            entering={FadeInUp.delay(650).duration(500)}
            style={animatedButtonStyle}
          >
            <Pressable
              onPress={handleSignup}
              onPressIn={() => {
                buttonScale.value = withSpring(0.97);
              }}
              onPressOut={() => {
                buttonScale.value = withSpring(1);
              }}
              className="bg-[#C84A25] h-[58px] rounded-2xl items-center justify-center mt-2"
            >
              <Text
                style={{
                  fontFamily: "Poppins_700Bold",
                }}
                className="text-white text-[16px]"
              >
                Create Account
              </Text>
            </Pressable>
          </Animated.View>

          {/* ================================= */}
          {/* LOGIN LINK */}
          {/* ================================= */}

          <Animated.View
            entering={FadeIn.delay(750).duration(500)}
            className="flex-row justify-center items-center mt-6"
          >
            <Text
              style={{
                fontFamily: "Poppins_400Regular",
              }}
              className="text-[#6F6861] text-[13px]"
            >
              Already have an account?
            </Text>

            <Pressable
              onPress={() => router.push("/auth/provider/login")}
              className="ml-2"
            >
              <Text
                style={{
                  fontFamily: "Poppins_700Bold",
                }}
                className="text-[#C84A25] text-[13px]"
              >
                Login
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
