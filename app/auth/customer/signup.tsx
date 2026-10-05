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
import Animated, {
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

const COLORS = {
  background: "#FFF8EF",
  primary: "#C84A25",
  lightPrimary: "#FFF1EA",
  text: "#222222",
  darkText: "#3A342F",
  secondary: "#6F6861",
  lightSecondary: "#8A8178",
  border: "#EDE4D8",
  white: "#FFFFFF",
  error: "#C0392B",
};

type FieldName =
  "fullName" | "email" | "phone" | "password" | "confirmPassword" | "address";

export default function CustomerSignup() {
  const scrollViewRef = useRef<ScrollView>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");

  const [focusedField, setFocusedField] = useState<FieldName | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});

  const buttonScale = useSharedValue(1);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleFocus = (field: FieldName) => {
    setFocusedField(field);

    // Helps keep lower fields visible when keyboard opens
    if (
      field === "confirmPassword" ||
      field === "address" ||
      field === "phone"
    ) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({
          animated: true,
        });
      }, 300);
    }
  };

  const clearError = (field: FieldName) => {
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validate = () => {
    const newErrors: Partial<Record<FieldName, string>> = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Please enter your full name.";
    }

    if (!email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!phone.trim()) {
      newErrors.phone = "Please enter your phone number.";
    } else if (!/^[0-9]{10}$/.test(phone.trim())) {
      newErrors.phone = "Please enter a valid 10-digit phone number.";
    }

    if (!password) {
      newErrors.password = "Please create a password.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!address.trim()) {
      newErrors.address = "Please enter your delivery address.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleCreateAccount = () => {
    if (!validate()) {
      return;
    }

    /*
      BACKEND WILL BE CONNECTED LATER.

      The data we will eventually send to the backend can look like:

      {
        fullName,
        email,
        phone,
        password,
        address
      }

      Do NOT console.log the password.
    */

    console.log("Customer signup validation successful");
      router.replace("/(tabs)");

    // Backend/API connection will be added here later.
  };

  const renderInput = ({
    field,
    label,
    icon,
    placeholder,
    value,
    onChangeText,
    keyboardType = "default",
    secureTextEntry = false,
    multiline = false,
    numberOfLines = 1,
    autoCapitalize = "sentences",
    showPasswordButton = false,
    onTogglePassword,
  }: {
    field: FieldName;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: "default" | "email-address" | "phone-pad";
    secureTextEntry?: boolean;
    multiline?: boolean;
    numberOfLines?: number;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    showPasswordButton?: boolean;
    onTogglePassword?: () => void;
  }) => {
    const isFocused = focusedField === field;
    const hasError = !!errors[field];

    return (
      <Animated.View entering={FadeInUp.duration(450)} className="mb-5">
        <Text
          className="mb-2"
          style={{
            fontFamily: "Poppins_600SemiBold",
            color: COLORS.darkText,
            fontSize: 14,
          }}
        >
          {label} <Text style={{ color: COLORS.primary }}>*</Text>
        </Text>

        <View
          className="flex-row items-start rounded-2xl px-4"
          style={{
            backgroundColor: COLORS.white,
            borderWidth: 1.2,
            borderColor: hasError
              ? COLORS.error
              : isFocused
                ? COLORS.primary
                : COLORS.border,
            minHeight: multiline ? 120 : 58,
            paddingTop: multiline ? 15 : 0,
            alignItems: multiline ? "flex-start" : "center",
          }}
        >
          <Ionicons
            name={icon}
            size={21}
            color={
              hasError
                ? COLORS.error
                : isFocused
                  ? COLORS.primary
                  : COLORS.lightSecondary
            }
            style={{
              marginRight: 12,
              marginTop: multiline ? 2 : 0,
            }}
          />

          <TextInput
            value={value}
            onChangeText={(text) => {
              onChangeText(text);
              clearError(field);
            }}
            placeholder={placeholder}
            placeholderTextColor={COLORS.lightSecondary}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            multiline={multiline}
            numberOfLines={numberOfLines}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
            onFocus={() => handleFocus(field)}
            onBlur={() => setFocusedField(null)}
            textAlignVertical={multiline ? "top" : "center"}
            className="flex-1"
            style={{
              color: COLORS.text,
              fontFamily: "Poppins_400Regular",
              fontSize: 14,
              minHeight: multiline ? 90 : 56,
              paddingVertical: multiline ? 0 : 0,
            }}
          />

          {showPasswordButton && (
            <Pressable
              onPress={onTogglePassword}
              hitSlop={10}
              style={{
                marginLeft: 8,
              }}
            >
              <Ionicons
                name={secureTextEntry ? "eye-outline" : "eye-off-outline"}
                size={21}
                color={COLORS.lightSecondary}
              />
            </Pressable>
          )}
        </View>

        {hasError && (
          <Text
            className="mt-1 ml-1"
            style={{
              color: COLORS.error,
              fontFamily: "Poppins_400Regular",
              fontSize: 11,
            }}
          >
            {errors[field]}
          </Text>
        )}
      </Animated.View>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 55,
            paddingBottom: 220,
          }}
        >
          {/* Back Button */}
          <Animated.View entering={FadeInDown.duration(400)}>
            <Pressable
              onPress={() => router.back()}
              className="h-12 w-12 items-center justify-center rounded-full"
              style={{
                backgroundColor: COLORS.white,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <Ionicons name="arrow-back" size={22} color={COLORS.darkText} />
            </Pressable>
          </Animated.View>

          {/* Header */}
          <Animated.View
            entering={FadeInUp.delay(100).duration(500)}
            className="items-center mt-7 mb-8"
          >
            <View
              className="items-center justify-center rounded-full"
              style={{
                width: 88,
                height: 88,
                backgroundColor: COLORS.lightPrimary,
              }}
            >
              <Ionicons
                name="person-outline"
                size={42}
                color={COLORS.primary}
              />
            </View>

            <Text
              className="text-center mt-5"
              style={{
                color: COLORS.text,
                fontFamily: "Poppins_800ExtraBold",
                fontSize: 25,
              }}
            >
              Create Your Account
            </Text>

            <Text
              className="text-center mt-2"
              style={{
                color: COLORS.secondary,
                fontFamily: "Poppins_400Regular",
                fontSize: 13,
                lineHeight: 21,
              }}
            >
              Join HomeBite and discover delicious
              {"\n"}
              homemade food around you.
            </Text>
          </Animated.View>

          {/* Required Fields Note */}
          <Animated.View
            entering={FadeInUp.delay(150).duration(450)}
            className="mb-5"
          >
            <Text
              style={{
                color: COLORS.lightSecondary,
                fontFamily: "Poppins_400Regular",
                fontSize: 11,
              }}
            >
              * All fields are required
            </Text>
          </Animated.View>

          {/* Full Name */}
          {renderInput({
            field: "fullName",
            label: "Full Name",
            icon: "person-outline",
            placeholder: "Enter your full name",
            value: fullName,
            onChangeText: setFullName,
            autoCapitalize: "words",
          })}

          {/* Email */}
          {renderInput({
            field: "email",
            label: "Email Address",
            icon: "mail-outline",
            placeholder: "Enter your email address",
            value: email,
            onChangeText: setEmail,
            keyboardType: "email-address",
            autoCapitalize: "none",
          })}

          {/* Phone */}
          {renderInput({
            field: "phone",
            label: "Phone Number",
            icon: "call-outline",
            placeholder: "Enter your 10-digit phone number",
            value: phone,
            onChangeText: setPhone,
            keyboardType: "phone-pad",
            autoCapitalize: "none",
          })}

          {/* Password */}
          {renderInput({
            field: "password",
            label: "Password",
            icon: "lock-closed-outline",
            placeholder: "Create a password",
            value: password,
            onChangeText: setPassword,
            secureTextEntry: !showPassword,
            autoCapitalize: "none",
            showPasswordButton: true,
            onTogglePassword: () => setShowPassword((prev) => !prev),
          })}

          {/* Confirm Password */}
          {renderInput({
            field: "confirmPassword",
            label: "Confirm Password",
            icon: "shield-checkmark-outline",
            placeholder: "Confirm your password",
            value: confirmPassword,
            onChangeText: setConfirmPassword,
            secureTextEntry: !showConfirmPassword,
            autoCapitalize: "none",
            showPasswordButton: true,
            onTogglePassword: () => setShowConfirmPassword((prev) => !prev),
          })}

          {/* Delivery Address */}
          {renderInput({
            field: "address",
            label: "Delivery Address",
            icon: "location-outline",
            placeholder: "Enter your delivery address",
            value: address,
            onChangeText: setAddress,
            multiline: true,
            numberOfLines: 4,
            autoCapitalize: "sentences",
          })}

          {/* Create Account Button */}
          <Animated.View
            entering={FadeInUp.delay(500).duration(500)}
            style={buttonAnimatedStyle}
            className="mt-2"
          >
            <Pressable
              onPressIn={() => {
                buttonScale.value = withSpring(0.97);
              }}
              onPressOut={() => {
                buttonScale.value = withSpring(1);
              }}
              onPress={handleCreateAccount}
              className="h-14 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: COLORS.primary,
              }}
            >
              <View className="flex-row items-center">
                <Text
                  style={{
                    color: COLORS.white,
                    fontFamily: "Poppins_700Bold",
                    fontSize: 15,
                  }}
                >
                  Create Account
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={19}
                  color={COLORS.white}
                  style={{ marginLeft: 8 }}
                />
              </View>
            </Pressable>
          </Animated.View>

          {/* Login */}
          <Animated.View
            entering={FadeInUp.delay(550).duration(450)}
            className="flex-row justify-center mt-6"
          >
            <Text
              style={{
                color: COLORS.secondary,
                fontFamily: "Poppins_400Regular",
                fontSize: 13,
              }}
            >
              Already have an account?{" "}
            </Text>

            <Pressable onPress={() => router.push("/auth/customer/login")}>
              <Text
                style={{
                  color: COLORS.primary,
                  fontFamily: "Poppins_700Bold",
                  fontSize: 13,
                }}
              >
                Login
              </Text>
            </Pressable>
          </Animated.View>

          {/* Bottom spacing */}
          <View style={{ height: 20 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
