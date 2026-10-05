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
import { useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Subscription, SubscriptionStatus } from '../../types/customer';

// Mock active and past subscriptions
const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
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
  },
  {
    id: 'sub-02',
    customerId: 'cust-1',
    providerId: 'prov-2',
    providerName: 'Shree Sai Student & Working Mess',
    providerType: 'mess',
    planId: 'plan-monthly-dinner',
    planName: 'Executive Dinner Thali Plan',
    billingPeriod: 'monthly',
    mealTypes: ['dinner'],
    servings: 1,
    price: 3600,
    status: 'paused',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    nextDeliveryDate: '2026-09-27',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    createdAt: '2026-08-01T10:00:00Z',
  },
];

export default function SubscriptionsListScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'active' | 'paused' | 'explore'>('active');
  const [subscriptions, setSubscriptions] = useState(MOCK_SUBSCRIPTIONS);

  const filteredSubs = subscriptions.filter((sub) => {
    if (activeTab === 'active') return sub.status === 'active';
    if (activeTab === 'paused') return sub.status === 'paused' || sub.status === 'completed';
    return true;
  });

  const handleTogglePause = (id: string, currentStatus: SubscriptionStatus) => {
    const isNowPausing = currentStatus === 'active';
    Alert.alert(
      isNowPausing ? 'Pause Subscription' : 'Resume Subscription',
      isNowPausing
        ? 'No meals will be delivered while paused, and your remaining days will be saved.'
        : 'Resume meal deliveries starting tomorrow?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: isNowPausing ? 'Pause' : 'Resume',
          style: isNowPausing ? 'destructive' : 'default',
          onPress: () => {
            setSubscriptions((prev) =>
              prev.map((s) =>
                s.id === id
                  ? {
                      ...s,
                      status: isNowPausing ? 'paused' : 'active',
                      isPaused: isNowPausing,
                    }
                  : s
              )
            );
          },
        },
      ]
    );
  };

  const handleSkipNextMeal = (sub: Subscription) => {
    Alert.alert(
      'Skip Tomorrow’s Meal?',
      `We will notify ${sub.providerName} not to prepare your ${sub.mealTypes} tomorrow. Your subscription expiry will be extended by 1 day.`,
      [
        { text: 'Keep It', style: 'cancel' },
        {
          text: 'Skip Meal',
          onPress: () => {
            Alert.alert('Meal Skipped', 'Tomorrow’s delivery is cancelled and your credit saved.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meal Subscriptions</Text>
        <TouchableOpacity
          onPress={() => router.push('/customer/support')}
          style={styles.helpButton}
        >
          <Ionicons name="help-circle-outline" size={22} color="#636366" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'active' && styles.tabItemActive]}
          onPress={() => setActiveTab('active')}
        >
          <Text
            style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}
          >
            Active (
            {subscriptions.filter((s) => s.status === 'active').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'paused' && styles.tabItemActive]}
          onPress={() => setActiveTab('paused')}
        >
          <Text
            style={[styles.tabText, activeTab === 'paused' && styles.tabTextActive]}
          >
            Paused / Past
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'explore' && styles.tabItemActive]}
          onPress={() => setActiveTab('explore')}
        >
          <Text
            style={[styles.tabText, activeTab === 'explore' && styles.tabTextActive]}
          >
            Explore Plans
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'explore' ? (
          /* Explore Plans Banner & Direct Links */
          <View>
            <View style={styles.exploreHero}>
              <MaterialCommunityIcons name="calendar-clock" size={40} color="#FF5A5F" />
              <Text style={styles.exploreHeroTitle}>Daily Homely Food on Auto-Pilot</Text>
              <Text style={styles.exploreHeroSubtitle}>
                Subscribe to monthly tiffin services from verified local home-kitchens & messes. Never worry about daily cooking again.
              </Text>
              <TouchableOpacity
                style={styles.exploreHeroBtn}
                activeOpacity={0.8}                onPress={() => router.push('/(tabs)/explore')}
              >
                <Text style={styles.exploreHeroBtnText}>Browse Kitchens & Tiffins</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.benefitCard}>
              <View style={styles.benefitRow}>
                <View style={styles.benefitIconWrap}>
                  <Ionicons name="pause-circle-outline" size={24} color="#FF5A5F" />
                </View>
                <View style={styles.benefitTextWrap}>
                  <Text style={styles.benefitHeading}>Pause & Resume Anytime</Text>
                  <Text style={styles.benefitDescription}>
                    Going on vacation or eating out? Pause deliveries with 1-tap, zero penalty.
                  </Text>
                </View>
              </View>

              <View style={styles.benefitRow}>
                <View style={styles.benefitIconWrap}>
                  <Ionicons name="shield-checkmark-outline" size={24} color="#FF5A5F" />
                </View>
                <View style={styles.benefitTextWrap}>
                  <Text style={styles.benefitHeading}>Hygiene Inspected</Text>
                  <Text style={styles.benefitDescription}>
                    Every home chef and mess is verified for clean kitchens and fresh ingredients.
                  </Text>
                </View>
              </View>

              <View style={styles.benefitRow}>
                <View style={styles.benefitIconWrap}>
                  <MaterialCommunityIcons name="currency-inr" size={24} color="#FF5A5F" />
                </View>
                <View style={styles.benefitTextWrap}>
                  <Text style={styles.benefitHeading}>Save up to 35%</Text>
                  <Text style={styles.benefitDescription}>
                    Enjoy pocket-friendly pricing compared to regular one-time food orders.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : filteredSubs.length === 0 ? (
          /* Empty State */
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="food-off-outline" size={56} color="#C7C7CC" />
            <Text style={styles.emptyTitle}>No Subscriptions Found</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'active'
                ? "You don't have any active meal plans right now."
                : 'No paused or expired subscriptions found.'}
            </Text>
            <TouchableOpacity
              style={styles.emptyActionBtn}
              activeOpacity={0.8}
              onPress={() => setActiveTab('explore')}
            >
              <Text style={styles.emptyActionText}>Find a Meal Plan</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Subscription Cards */
          filteredSubs.map((sub) => {
            const progress = 50;

            return (
              <View key={sub.id} style={styles.subCard}>
                {/* Provider Header */}
                <View style={styles.subHeader}>
                  <View style={styles.subHeaderLeft}>
                    <Text style={styles.subProviderName}>{sub.providerName}</Text>
                    <Text style={styles.subPlanTitle}>{sub.planName}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusPill,
                      sub.status === 'active'
                        ? styles.statusPillActive
                        : styles.statusPillPaused,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        sub.status === 'active'
                          ? styles.statusPillTextActive
                          : styles.statusPillTextPaused,
                      ]}
                    >
                      {sub.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Badges / Specs Row */}
                <View style={styles.metaRow}>
                  <View style={styles.metaBadge}>
                    <MaterialCommunityIcons name="silverware-fork-knife" size={13} color="#636366" />
                    <Text style={styles.metaBadgeText}>
                      {sub.mealTypes.join(' / ').toUpperCase()}
                    </Text>
                  </View>
                 <View style={styles.metaBadge}>
                  <Feather name="clock" size={13} color="#636366" />
                  <Text style={styles.metaBadgeText}>
                    {sub.billingPeriod.toUpperCase()}
                  </Text>
                </View>
                </View>

                {/* Progress of Meals */}
                <View style={styles.progressSection}>
                  <View style={styles.progressLabels}>
                    <Text style={styles.progressLabelLeft}>
                     Plan Status:{' '}
                      <Text style={styles.progressHighlight}>
                        {sub.status.toUpperCase()}
                      </Text>
                    </Text>
                    <Text style={styles.progressLabelRight}>
                      Next delivery {sub.nextDeliveryDate ?? 'Not scheduled'}
                    </Text>
                  </View>
                  <View style={styles.progressBarTrack}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${Math.min(100, Math.max(0, progress))}%` },
                      ]}
                    />
                  </View>
                </View>

                

                {/* Actions Footer */}
                <View style={styles.actionsFooter}>
                  {sub.status === 'active' && (
                    <TouchableOpacity
                      style={styles.skipBtn}
                      activeOpacity={0.7}
                      onPress={() => handleSkipNextMeal(sub)}
                    >
                      <Feather name="skip-forward" size={14} color="#636366" />
                      <Text style={styles.skipBtnText}>Skip Tomorrow</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.pauseBtn,
                      sub.status === 'paused' && styles.resumeBtn,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => handleTogglePause(sub.id, sub.status)}
                  >
                    <Feather
                      name={sub.status === 'active' ? 'pause' : 'play'}
                      size={14}
                      color={sub.status === 'active' ? '#FF9500' : '#00875A'}
                    />
                    <Text
                      style={[
                        styles.pauseBtnText,
                        sub.status === 'paused' && styles.resumeBtnText,
                      ]}
                    >
                      {sub.status === 'active' ? 'Pause Plan' : 'Resume Plan'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.detailsBtn}
                    activeOpacity={0.7}
                    onPress={() =>
                      router.push({
                        pathname: '/customer/subscription-details',
                        params: { subscriptionId: sub.id },
                      })
                    }
                  >
                    <Text style={styles.detailsBtnText}>Manage</Text>
                    <Feather name="chevron-right" size={14} color="#FF5A5F" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
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
  helpButton: {
    padding: 6,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tabItem: {
    paddingVertical: 12,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: '#FF5A5F',
  },
  tabText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FF5A5F',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  subCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  subHeaderLeft: {
    flex: 1,
    marginRight: 8,
  },
  subProviderName: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
    marginBottom: 2,
  },
  subPlanTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusPillActive: {
    backgroundColor: '#E8F5E9',
  },
  statusPillPaused: {
    backgroundColor: '#FFF8E1',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusPillTextActive: {
    color: '#00875A',
  },
  statusPillTextPaused: {
    color: '#FF9500',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  metaBadgeText: {
    fontSize: 11,
    color: '#3A3A3C',
    fontWeight: '600',
  },
  progressSection: {
    marginBottom: 12,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabelLeft: {
    fontSize: 12,
    color: '#636366',
  },
  progressHighlight: {
    fontWeight: '700',
    color: '#1C1C1E',
  },
  progressLabelRight: {
    fontSize: 11,
    color: '#8E8E93',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EAEAEA',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF5A5F',
    borderRadius: 3,
  },
  addressLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 14,
  },
  addressLineText: {
    fontSize: 12,
    color: '#8E8E93',
    flex: 1,
  },
  actionsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: 12,
    gap: 8,
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 4,
  },
  skipBtnText: {
    fontSize: 12,
    color: '#3A3A3C',
    fontWeight: '600',
  },
  pauseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 4,
  },
  resumeBtn: {
    backgroundColor: '#E8F5E9',
  },
  pauseBtnText: {
    fontSize: 12,
    color: '#B26A00',
    fontWeight: '600',
  },
  resumeBtnText: {
    color: '#00875A',
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    paddingVertical: 7,
    paddingHorizontal: 4,
    gap: 2,
  },
  detailsBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF5A5F',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  emptyActionBtn: {
    backgroundColor: '#FF5A5F',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emptyActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  exploreHero: {
    backgroundColor: '#FFF2F2',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFE0E1',
  },
  exploreHeroTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 10,
    marginBottom: 6,
    textAlign: 'center',
  },
  exploreHeroSubtitle: {
    fontSize: 13,
    color: '#636366',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  exploreHeroBtn: {
    backgroundColor: '#FF5A5F',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 10,
  },
  exploreHeroBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  benefitCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  benefitRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  benefitIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  benefitTextWrap: {
    flex: 1,
  },
  benefitHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  benefitDescription: {
    fontSize: 12,
    color: '#636366',
    lineHeight: 17,
  },
});
