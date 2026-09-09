import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function Role() {
  return (
    <View className="flex-1 bg-[#FFF8EF]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: 60,
          paddingBottom: 30,
        }}
      >
        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          className="w-12 h-12 rounded-full bg-white border border-[#EDE4D8] items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="#2A2A2A" />
        </Pressable>

        {/* Header */}
        <View className="items-center mt-10">
          <View className="w-24 h-24 rounded-full bg-[#FFF1EA] items-center justify-center">
            <Ionicons name="people-outline" size={48} color="#C84A25" />
          </View>

          <Text
            style={{ fontFamily: "Poppins_800ExtraBold" }}
            className="text-[#222222] text-[30px] text-center mt-6"
          >
            Select Your Role
          </Text>

          <Text
            style={{ fontFamily: "Poppins_400Regular" }}
            className="text-[#6F6861] text-[15px] text-center mt-3 leading-[23px]"
          >
            How would you like to use HomeBite?
          </Text>
        </View>

        {/* Role Cards */}
        <View className="mt-10">
          {/* Customer */}
          <Pressable
            onPress={() => router.push("/auth/customer/login")}
            className="bg-white rounded-[24px] p-5 border border-[#EDE4D8] flex-row items-center"
          >
            <View className="w-14 h-14 rounded-full bg-[#FFF1EA] items-center justify-center">
              <Ionicons name="person-outline" size={28} color="#C84A25" />
            </View>

            <View className="ml-4 flex-1">
              <Text
                style={{ fontFamily: "Poppins_700Bold" }}
                className="text-[#3A342F] text-[17px]"
              >
                Customer
              </Text>

              <Text
                style={{ fontFamily: "Poppins_400Regular" }}
                className="text-[#8A8178] text-[12px] mt-1"
              >
                Discover and order homemade meals
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={22} color="#C84A25" />
          </Pressable>

          {/* Provider */}
          <Pressable
            onPress={() => router.push("/auth/provider/login")} ///// ihave made the changes here

            className="bg-white rounded-[24px] p-5 border border-[#EDE4D8] flex-row items-center mt-4"
          >
            <View className="w-14 h-14 rounded-full bg-[#FFF1EA] items-center justify-center">
              <Ionicons name="restaurant-outline" size={28} color="#C84A25" />
            </View>

            <View className="ml-4 flex-1">
              <Text
                style={{ fontFamily: "Poppins_700Bold" }}
                className="text-[#3A342F] text-[17px]"
              >
                Provider
              </Text>

              <Text
                style={{ fontFamily: "Poppins_400Regular" }}
                className="text-[#8A8178] text-[12px] mt-1"
              >
                Sell your homemade meals
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={22} color="#C84A25" />
          </Pressable>

          {/* Driver */}
          <Pressable
            onPress={() => router.push("/auth/driver/login")}
            className="bg-white rounded-[24px] p-5 border border-[#EDE4D8] flex-row items-center mt-4"
          >
            <View className="w-14 h-14 rounded-full bg-[#FFF1EA] items-center justify-center">
              <Ionicons name="bicycle-outline" size={28} color="#C84A25" />
            </View>

            <View className="ml-4 flex-1">
              <Text
                style={{ fontFamily: "Poppins_700Bold" }}
                className="text-[#3A342F] text-[17px]"
              >
                Driver
              </Text>

              <Text
                style={{ fontFamily: "Poppins_400Regular" }}
                className="text-[#8A8178] text-[12px] mt-1"
              >
                Deliver homemade meals
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={22} color="#C84A25" />
          </Pressable>
        </View>

        {/* Bottom text */}
        <View className="items-center mt-auto pt-10">
          <Text
            style={{ fontFamily: "Poppins_400Regular" }}
            className="text-[#8A8178] text-[11px] text-center"
          >
            Choose your role to continue with HomeBite
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
