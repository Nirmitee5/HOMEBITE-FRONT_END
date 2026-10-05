import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
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
  selected: "#FBE9E2",
  success: "#6D9E4E",
  successLight: "#EDF6E8",
  danger: "#D94A45",
  dangerLight: "#FDECEA",
};

type IoniconName =
  | "location-outline"
  | "receipt-outline"
  | "notifications-outline"
  | "card-outline"
  | "help-circle-outline"
  | "shield-checkmark-outline";

type MaterialIconName = "calendar-heart-outline";

type ProfileMenuItem =
  | {
      id: string;
      label: string;
      description: string;
      iconFamily: "ionicons";
      icon: IoniconName;
    }
  | {
      id: string;
      label: string;
      description: string;
      iconFamily: "material";
      icon: MaterialIconName;
    };

const menuItems: ProfileMenuItem[] = [
  {
    id: "addresses",
    label: "My Addresses",
    description: "Home, work and saved locations",
    iconFamily: "ionicons",
    icon: "location-outline",
  },
  {
    id: "orders",
    label: "My Orders",
    description: "Active and previous orders",
    iconFamily: "ionicons",
    icon: "receipt-outline",
  },
  {
    id: "subscriptions",
    label: "My Subscriptions",
    description: "Manage recurring meal plans",
    iconFamily: "material",
    icon: "calendar-heart-outline",
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Order and account preferences",
    iconFamily: "ionicons",
    icon: "notifications-outline",
  },
  {
    id: "payments",
    label: "Payment Methods",
    description: "Cards, UPI and payment settings",
    iconFamily: "ionicons",
    icon: "card-outline",
  },
  {
    id: "support",
    label: "Help & Support",
    description: "FAQs, support and issue reporting",
    iconFamily: "ionicons",
    icon: "help-circle-outline",
  },
  {
    id: "privacy",
    label: "Privacy",
    description: "Privacy and account security",
    iconFamily: "ionicons",
    icon: "shield-checkmark-outline",
  },
];

const profileImage =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80";

function openFutureScreen(label: string) {
  Alert.alert(label, `${label} will be connected in a later Customer group.`);
}

function ProfileMenuRow({ item }: { item: ProfileMenuItem }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuRow,
        pressed && styles.rowPressed,
      ]}
      onPress={() => openFutureScreen(item.label)}
    >
      <View style={styles.menuIcon}>
        {item.iconFamily === "ionicons" ? (
          <Ionicons name={item.icon} size={21} color={COLORS.primary} />
        ) : (
          <MaterialCommunityIcons
            name={item.icon}
            size={22}
            color={COLORS.primary}
          />
        )}
      </View>

      <View style={styles.menuCopy}>
        <Text style={styles.menuLabel}>{item.label}</Text>
        <Text style={styles.menuDescription}>{item.description}</Text>
      </View>

      <Ionicons name="chevron-forward" size={19} color={COLORS.muted} />
    </Pressable>
  );
}

export default function CustomerProfileScreen() {
  function confirmLogout() {
    Alert.alert(
      "Log out of HomeBite?",
      "You will need to sign in again to access your orders and meal plans.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log out",
          style: "destructive",
          onPress: () => {
            /*
             * Authentication is intentionally not changed in Group 1.
             * Connect this action to the existing logout implementation later.
             */
            Alert.alert(
              "Logout not connected",
              "Your existing authentication has not been modified.",
            );
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>YOUR HOMEBITE ACCOUNT</Text>
          <Text style={styles.title}>Profile</Text>

          <Pressable
            style={styles.settingsButton}
            onPress={() => openFutureScreen("Account Settings")}
          >
            <Ionicons name="settings-outline" size={22} color={COLORS.text} />
          </Pressable>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: profileImage }} style={styles.avatar} />
            <View style={styles.verifiedBadge}>
              <Ionicons
                name="checkmark"
                size={13}
                color={COLORS.surface}
              />
            </View>
          </View>

          <Text style={styles.customerName}>Priya Sharma</Text>
          <Text style={styles.contact}>priya.sharma@example.com</Text>
          <Text style={styles.contact}>+91 98765 43210</Text>

          <Pressable
            style={({ pressed }) => [
              styles.editButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => openFutureScreen("Edit Profile")}
          >
            <Ionicons name="create-outline" size={17} color={COLORS.primary} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>
        </View>

        <View style={styles.summaryRow}>
          <Pressable
            style={({ pressed }) => [
              styles.summaryItem,
              pressed && styles.rowPressed,
            ]}
            onPress={() => router.push("./orders")}
          >
            <View style={styles.summaryIcon}>
              <Ionicons
                name="receipt-outline"
                size={21}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.summaryValue}>24</Text>
            <Text style={styles.summaryLabel}>Orders</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.summaryItem,
              pressed && styles.rowPressed,
            ]}
            onPress={() => openFutureScreen("My Subscriptions")}
          >
            <View style={styles.summaryIcon}>
              <MaterialCommunityIcons
                name="calendar-heart-outline"
                size={22}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.summaryValue}>1</Text>
            <Text style={styles.summaryLabel}>Active plan</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.summaryItem,
              pressed && styles.rowPressed,
            ]}
            onPress={() => openFutureScreen("Saved Meals")}
          >
            <View style={styles.summaryIcon}>
              <Ionicons
                name="heart-outline"
                size={21}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.summaryValue}>12</Text>
            <Text style={styles.summaryLabel}>Saved</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>My account</Text>

        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <View key={item.id}>
              <ProfileMenuRow item={item} />
              {index < menuItems.length - 1 ? (
                <View style={styles.divider} />
              ) : null}
            </View>
          ))}
        </View>

        <View style={styles.supportCard}>
          <View style={styles.supportIcon}>
            <MaterialCommunityIcons
              name="heart-outline"
              size={27}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.supportCopy}>
            <Text style={styles.supportTitle}>Need help with an order?</Text>
            <Text style={styles.supportText}>
              Our support team is here to help.
            </Text>
          </View>

          <Pressable onPress={() => openFutureScreen("Help & Support")}>
            <Text style={styles.supportAction}>Get help</Text>
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={confirmLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        <Text style={styles.version}>HomeBite • Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 38,
  },
  header: {
    position: "relative",
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
  settingsButton: {
    position: "absolute",
    top: 4,
    right: 0,
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileCard: {
    marginTop: 18,
    padding: 22,
    borderRadius: 22,
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: COLORS.selected,
    borderWidth: 3,
    borderColor: COLORS.surface,
  },
  verifiedBadge: {
    position: "absolute",
    right: 2,
    bottom: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  customerName: {
    marginTop: 13,
    color: COLORS.text,
    fontFamily: "Poppins_700Bold",
    fontSize: 21,
  },
  contact: {
    marginTop: 2,
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
  },
  editButton: {
    minHeight: 42,
    marginTop: 15,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: COLORS.selected,
  },
  editButtonText: {
    color: COLORS.primary,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 11,
  },
  summaryRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 9,
  },
  summaryItem: {
    flex: 1,
    minHeight: 116,
    padding: 11,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.selected,
  },
  summaryValue: {
    marginTop: 7,
    color: COLORS.text,
    fontFamily: "Poppins_700Bold",
    fontSize: 17,
  },
  summaryLabel: {
    marginTop: 1,
    color: COLORS.muted,
    fontFamily: "Poppins_500Medium",
    fontSize: 9,
    textAlign: "center",
  },
  sectionTitle: {
    marginTop: 27,
    marginBottom: 11,
    color: COLORS.text,
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
  },
  menuCard: {
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuRow: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
  },
  rowPressed: {
    opacity: 0.65,
  },
  menuIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.selected,
  },
  menuCopy: {
    flex: 1,
    marginLeft: 12,
  },
  menuLabel: {
    color: COLORS.text,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
  },
  menuDescription: {
    marginTop: 2,
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    fontSize: 9,
  },
  divider: {
    height: 1,
    marginLeft: 55,
    backgroundColor: COLORS.border,
  },
  supportCard: {
    marginTop: 15,
    padding: 15,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.successLight,
    borderWidth: 1,
    borderColor: "#D8E8D0",
  },
  supportIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
  },
  supportCopy: {
    flex: 1,
    marginLeft: 11,
  },
  supportTitle: {
    color: COLORS.text,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 11,
  },
  supportText: {
    marginTop: 2,
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    fontSize: 9,
  },
  supportAction: {
    color: COLORS.primary,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 10,
  },
  logoutButton: {
    height: 50,
    marginTop: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.dangerLight,
    borderWidth: 1,
    borderColor: "#F5CFCC",
  },
  logoutText: {
    color: COLORS.danger,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
  },
  buttonPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.985 }],
  },
  version: {
    marginTop: 17,
    color: COLORS.muted,
    fontFamily: "Poppins_400Regular",
    fontSize: 9,
    textAlign: "center",
  },
});
