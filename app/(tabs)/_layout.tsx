import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

const COLORS = {
  primary: "#C84A25",
  muted: "#8A8A8A",
  border: "#EDE4D8",
  surface: "#FFFFFF",
};

type TabIconName =
  | "home"
  | "home-outline"
  | "compass"
  | "compass-outline"
  | "flash"
  | "flash-outline"
  | "receipt"
  | "receipt-outline"
  | "person"
  | "person-outline";

function TabIcon({
  focused,
  active,
  inactive,
  color,
  size,
}: {
  focused: boolean;
  active: TabIconName;
  inactive: TabIconName;
  color: string;
  size: number;
}) {
  return (
    <Ionicons
      name={focused ? active : inactive}
      color={color}
      size={size}
    />
  );
}

export default function CustomerTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        // Colors
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,

        // Tab label
        tabBarLabelStyle: {
          fontFamily: "Poppins_500Medium",
          fontSize: 11,
          marginTop: 2,
        },

        // Tab bar
        tabBarStyle: {
          height: Platform.OS === "ios" ? 88 : 68,
          paddingTop: 7,
          paddingBottom: Platform.OS === "ios" ? 24 : 8,

          backgroundColor: COLORS.surface,

          borderTopWidth: 1,
          borderTopColor: COLORS.border,

          elevation: 10,

          shadowColor: "#2A2A2A",
          shadowOffset: {
            width: 0,
            height: -3,
          },
          shadowOpacity: 0.06,
          shadowRadius: 10,
        },

        // Screen background
        sceneStyle: {
          backgroundColor: "#FFF8EF",
        },
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              focused={focused}
              active="home"
              inactive="home-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      {/* EXPLORE */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              focused={focused}
              active="compass"
              inactive="compass-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      {/* INSTANT */}
      <Tabs.Screen
        name="instant"
        options={{
          title: "Instant",
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              focused={focused}
              active="flash"
              inactive="flash-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      {/* ORDERS */}
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              focused={focused}
              active="receipt"
              inactive="receipt-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      {/* PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              focused={focused}
              active="person"
              inactive="person-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}