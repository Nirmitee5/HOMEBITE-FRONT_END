import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Subscription, SubscriptionStatus } from '../../types/customer';

// Mock subscription details
const INITIAL_SUB: Subscription = {
  id: 'sub-01',
  customerId: 'cust-1',
  providerId: 'prov-1',
  providerName: "Aunty Sunita's Kitchen",
  providerType: 'housewife',
  planId: 'plan-daily-lunch',
  planName: 'Homely Daily Lunch Dabba',
  billingPeriod: 'daily',
  mealTypes: ['lunch'],
  servings: 1,
  price: 3200,
  status: 'active',
  startDate: '2026-09-15',
  endDate: '2026-10-15',
  nextDeliveryDate: '2026-09-27',
  paymentMethod: 'upi',
  paymentStatus: 'paid',
  createdAt: '2026-09-15T10:00:00Z',
};

// Mock upcoming scheduled daily menus
const UPCOMING_MEAL_SCHEDULE = [
  { day: 'Today', date: '26 Sep', menu: 'Dal Tadka, Bhindi Masala, 4 Phulkas, Steamed Rice, Salad', status: 'In Prep' },
  { day: 'Tomorrow', date: '27 Sep', menu: 'Paneer Butter Masala, Jeera Aloo, 4 Phulkas, Pulao, Curd', status: 'Scheduled' },
  { day: 'Monday', date: '28 Sep', menu: 'Rajma Masala, Aloo Gobi, 4 Phulkas, Jeera Rice, Gulab Jamun', status: 'Scheduled' },
  { day: 'Tuesday', date: '29 Sep', menu: 'Sev Tamatar, Kadhi Pakoda, 4 Bajra/Wheat Rotis, Khichdi', status: 'Scheduled' },
];

export default function SubscriptionDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ subscriptionId?: string }>();
  const [sub, setSub] = useState<Subscription>(INITIAL_SUB);

  const isPaused = sub.status === 'paused';
  const progressPercent = 30;

  const handleTogglePause = () => {
    Alert.alert(
      isPaused ? 'Resume Subscription' : 'Pause Subscription',
      isPaused
        ? 'Resume your meal deliveries starting from tomorrow?'
        : 'Deliveries will be temporarily halted. You will not lose any remaining meals.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: isPaused ? 'Resume' : 'Pause',
          style: isPaused ? 'default' : 'destructive',
          onPress: () => {
            setSub((prev) => ({
  ...prev,
  status: isPaused ? 'active' : 'paused',
}));
          },
        },
      ]
    );
  };

  const handleSkipDay = (dateStr: string) => {
    Alert.alert(
      'Skip Meal',
      `Skip your tiffin delivery for ${dateStr}? Your subscription validity will automatically be extended by 1 day.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Skip',
          onPress: () => {
            Alert.alert('Meal Skipped', `Meal for ${dateStr} has been skipped. Your wallet credit has been adjusted.`);
          },
        },
      ]
    );
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel this plan? Unused meals (₹' +
        Math.round(sub.price) +
        ') will be refunded to your HomeBite Wallet.',
      [
        { text: 'Keep Plan', style: 'cancel' },
        {
          text: 'Cancel Plan',
          style: 'destructive',
          onPress: () => {
            setSub((prev) => ({ ...prev, status: 'cancelled' }));
            Alert.alert('Plan Cancelled', 'Your remaining balance has been credited to your HomeBite Wallet.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription Details</Text>
        <TouchableOpacity
          onPress={() => router.push('/customer/support')}
          style={styles.supportButton}
        >
          <Ionicons name="chatbubbles-outline" size={22} color="#636366" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Status Callout Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroProvider}>{sub.providerName}</Text>
              <Text style={styles.heroPlanTitle}>{sub.planName}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                sub.status === 'active'
                  ? styles.statusBadgeActive
                  : styles.statusBadgePaused,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  sub.status === 'active'
                    ? styles.statusBadgeTextActive
                    : styles.statusBadgeTextPaused,
                ]}
              >
                {sub.status.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Progress Section */}
          <View style={styles.progressContainer}>
            <View style={styles.progressTextRow}>
              <Text style={styles.progressMainText}>
                Subscription is currently active
              </Text>
              <Text style={styles.progressPercentText}>{progressPercent}% served</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progressPercent}%` },
                ]}
              />
            </View>
          </View>

          {/* Quick Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Feather name="calendar" size={16} color="#FF5A5F" />
              <Text style={styles.statLabel}>Cycle</Text>
              <Text style={styles.statValue}>30 Days</Text>
            </View>
            <View style={styles.statBox}>
              <Feather name="clock" size={16} color="#FF5A5F" />
              <Text style={styles.statLabel}>Slot</Text>
              <Text style={styles.statValue}>12:30 PM</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="food-variant" size={16} color="#FF5A5F" />
              <Text style={styles.statLabel}>Meal</Text>
              <Text style={styles.statValue}>Lunch (Veg)</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="refresh" size={16} color="#FF5A5F" />
              <Text style={styles.statLabel}>Renews On</Text>
              <Text style={styles.statValue}>15 Oct</Text>
            </View>
          </View>
        </View>

        {/* Quick Controls: Pause / Resume */}
        <View style={styles.actionCard}>
          <View style={styles.actionCardHeader}>
            <View>
              <Text style={styles.actionCardTitle}>Plan Flexibility</Text>
              <Text style={styles.actionCardSubtitle}>
                Control your deliveries without losing paid meals
              </Text>
            </View>
          </View>
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[
                styles.controlBtn,
                isPaused ? styles.controlBtnResume : styles.controlBtnPause,
              ]}
              onPress={handleTogglePause}
              activeOpacity={0.8}
            >
              <Feather
                name={isPaused ? 'play-circle' : 'pause-circle'}
                size={18}
                color={isPaused ? '#00875A' : '#D97706'}
              />
              <Text
                style={[
                  styles.controlBtnText,
                  isPaused ? styles.controlBtnTextResume : styles.controlBtnTextPause,
                ]}
              >
                {isPaused ? 'Resume Deliveries' : 'Pause Plan'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.changeAddressBtn}
              onPress={() => router.push('/customer/addresses')}
              activeOpacity={0.8}
            >
              <Feather name="map-pin" size={16} color="#4A4A4A" />
              <Text style={styles.changeAddressText}>Change Address</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Menu & Skip Day Option */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming 4 Days Menu</Text>
          <Text style={styles.sectionSubtitle}>
            Custom prepared daily by Aunty Sunita. You can skip any upcoming day.
          </Text>

          {UPCOMING_MEAL_SCHEDULE.map((item, index) => (
            <View key={index} style={styles.scheduleCard}>
              <View style={styles.scheduleLeft}>
                <View style={styles.dayBadge}>
                  <Text style={styles.dayBadgeText}>{item.day}</Text>
                  <Text style={styles.dateBadgeText}>{item.date}</Text>
                </View>
                <View style={styles.scheduleInfo}>
                  <Text style={styles.menuItemsText} numberOfLines={2}>
                    {item.menu}
                  </Text>
                  <View style={styles.statusPill}>
                    <Text style={styles.statusPillLabel}>{item.status}</Text>
                  </View>
                </View>
              </View>

              {item.day !== 'Today' && (
                <TouchableOpacity
                  style={styles.skipSmallBtn}
                  onPress={() => handleSkipDay(`${item.day} (${item.date})`)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.skipSmallBtnText}>Skip</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Delivery Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery & Payment</Text>
          <View style={styles.detailsCard}>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={18} color="#FF5A5F" />
              <View style={styles.infoCol}>
                <Text style={styles.infoTitle}>Drop-off Location</Text>
                <Text style={styles.infoValue}>Delivery address not available</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="card-outline" size={18} color="#FF5A5F" />
              <View style={styles.infoCol}>
                <Text style={styles.infoTitle}>Billing & Plan Rate</Text>
                <Text style={styles.infoValue}>
                  ₹{sub.price} / {sub.billingPeriod}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Danger Zone: Cancel Subscription */}
        <View style={styles.dangerZone}>
          <TouchableOpacity
            style={styles.cancelPlanBtn}
            onPress={handleCancelSubscription}
            activeOpacity={0.7}
          >
            <Feather name="slash" size={16} color="#DC2626" />
            <Text style={styles.cancelPlanText}>Cancel Meal Subscription</Text>
          </TouchableOpacity>
          <Text style={styles.cancelHint}>
            Prorated refund for unserved meals will be instantly credited to your wallet.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  supportButton: {
    padding: 6,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  heroProvider: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '600',
    marginBottom: 2,
  },
  heroPlanTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeActive: {
    backgroundColor: '#E8F5E9',
  },
  statusBadgePaused: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusBadgeTextActive: {
    color: '#00875A',
  },
  statusBadgeTextPaused: {
    color: '#D97706',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressMainText: {
    fontSize: 13,
    color: '#4A4A4A',
  },
  progressBold: {
    fontWeight: '800',
    color: '#FF5A5F',
  },
  progressPercentText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EAEAEA',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF5A5F',
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: 12,
    gap: 8,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingVertical: 10,
    borderRadius: 10,
  },
  statLabel: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 4,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 2,
    textAlign: 'center',
  },
  actionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  actionCardHeader: {
    marginBottom: 12,
  },
  actionCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  actionCardSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  controlBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  controlBtnPause: {
    backgroundColor: '#FEF3C7',
  },
  controlBtnResume: {
    backgroundColor: '#E8F5E9',
  },
  controlBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  controlBtnTextPause: {
    color: '#D97706',
  },
  controlBtnTextResume: {
    color: '#00875A',
  },
  changeAddressBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  changeAddressText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3A3A3C',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 12,
    lineHeight: 16,
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  scheduleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  dayBadge: {
    backgroundColor: '#FFF2F2',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    width: 60,
    marginRight: 12,
  },
  dayBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF5A5F',
  },
  dateBadgeText: {
    fontSize: 10,
    color: '#8E8E93',
  },
  scheduleInfo: {
    flex: 1,
  },
  menuItemsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1C1E',
    lineHeight: 16,
  },
  statusPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  statusPillLabel: {
    fontSize: 10,
    color: '#636366',
    fontWeight: '500',
  },
  skipSmallBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF5A5F',
  },
  skipSmallBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF5A5F',
  },
  detailsCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  infoCol: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: '#1C1C1E',
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginVertical: 12,
  },
  dangerZone: {
    marginTop: 8,
    alignItems: 'center',
  },
  cancelPlanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cancelPlanText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  cancelHint: {
    fontSize: 11,
    color: '#8E8E93',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 2,
  },
});
