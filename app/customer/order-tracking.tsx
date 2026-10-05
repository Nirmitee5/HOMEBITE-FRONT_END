import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { OrderStatus } from '../../types/customer';

interface TrackingStep {
  key: OrderStatus;
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  timestamp?: string;
}

const TRACKING_STEPS: TrackingStep[] = [
  {
    key: 'pending',
    title: 'Order Placed',
    subtitle: 'We received your homemade food order',
    icon: 'receipt',
    timestamp: '12:45 PM',
  },
  {
    key: 'accepted',
    title: 'Accepted by Kitchen',
    subtitle: 'The kitchen has confirmed your order',
    icon: 'check-circle-outline',
    timestamp: '12:47 PM',
  },
  {
    key: 'preparing',
    title: 'Cooking in Progress',
    subtitle: 'Fresh homemade ingredients being prepared',
    icon: 'pot-steam',
    timestamp: '12:52 PM',
  },
  {
    key: 'ready',
    title: 'Packed & Ready',
    subtitle: 'Warm and packed with care in hygienic containers',
    icon: 'package-variant',
    timestamp: '01:10 PM',
  },
  {
    key: 'out_for_delivery',
    title: 'Out for Delivery',
    subtitle: 'Delivery partner is on the way to your door',
    icon: 'moped',
    timestamp: '01:15 PM',
  },
  {
    key: 'delivered',
    title: 'Delivered with Love',
    subtitle: 'Enjoy your warm and healthy meal!',
    icon: 'home-heart',
    timestamp: 'Est. 01:25 PM',
  },
];

export default function OrderTrackingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ orderId?: string }>();
  const orderId = params.orderId || 'HB-92841';

  // Current active status simulation (e.g. preparing / out for delivery)
  const [currentStepIndex, setCurrentStepIndex] = useState(2); // 'preparing'
  const currentStep = TRACKING_STEPS[currentStepIndex];

  // Dummy order details
  const mockOrder = {
    id: orderId,
    placedAt: 'Today, 12:45 PM',
    estimatedDelivery: '30-40 mins (around 01:25 PM)',
    provider: {
      name: "Aunty Sunita's Kitchen",
      type: 'Housewife Kitchen',
      phone: '+91 98765 43210',
      rating: 4.9,
    },
    deliveryPartner: {
      name: 'Ramesh Kumar',
      phone: '+91 91234 56789',
      vehicle: 'Hero Splendor • MH-12-AB-3049',
    },
    deliveryAddress: 'Flat 402, Greenfield Heights, Baner, Pune - 411045',
    items: [
      { name: 'Special Gujarati Dal Tadka', quantity: 2, price: 160 },
      { name: 'Warm Phulkas (4 pcs)', quantity: 2, price: 40 },
      { name: 'Fresh Mint Buttermilk (Chaach)', quantity: 1, price: 30 },
    ],
    totalAmount: 230,
    paymentMethod: 'UPI (Google Pay)',
  };

  const handleCall = (phoneNumber: string, name: string) => {
    Alert.alert('Contact', `Call ${name} at ${phoneNumber}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Call',
        onPress: () => {
          Linking.openURL(`tel:${phoneNumber}`).catch(() => {
            Alert.alert('Error', 'Unable to initiate call on this device.');
          });
        },
      },
    ]);
  };

  const handleNeedHelp = () => {
    router.push('/customer/support');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Top App Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>Order #{mockOrder.id}</Text>
          <Text style={styles.headerSubtitle}>{mockOrder.placedAt}</Text>
        </View>
        <TouchableOpacity
          onPress={handleNeedHelp}
          style={styles.helpButton}
          activeOpacity={0.7}
        >
          <Text style={styles.helpText}>Help</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Estimated Status Banner */}
        <View style={styles.statusBanner}>
          <View style={styles.statusBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.statusBadgeText}>LIVE STATUS</Text>
          </View>
          <Text style={styles.statusTitle}>{currentStep.title}</Text>
          <Text style={styles.statusSubtitle}>{currentStep.subtitle}</Text>
          <View style={styles.etaContainer}>
            <Ionicons name="time-outline" size={18} color="#FF5A5F" />
            <Text style={styles.etaText}>
              Estimated Arrival: <Text style={styles.etaBold}>{mockOrder.estimatedDelivery}</Text>
            </Text>
          </View>
        </View>

        {/* Live Stepper Timeline */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Order Journey</Text>
          <View style={styles.timelineContainer}>
            {TRACKING_STEPS.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isUpcoming = index > currentStepIndex;

              return (
                <View key={step.key} style={styles.timelineRow}>
                  {/* Left Column: Icon + Vertical Line */}
                  <View style={styles.indicatorCol}>
                    <View
                      style={[
                        styles.stepDot,
                        isCompleted && styles.stepDotCompleted,
                        isCurrent && styles.stepDotCurrent,
                        isUpcoming && styles.stepDotUpcoming,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={step.icon}
                        size={16}
                        color={isUpcoming ? '#9E9E9E' : '#FFF'}
                      />
                    </View>
                    {index < TRACKING_STEPS.length - 1 && (
                      <View
                        style={[
                          styles.timelineLine,
                          index < currentStepIndex
                            ? styles.timelineLineCompleted
                            : styles.timelineLineUpcoming,
                        ]}
                      />
                    )}
                  </View>

                  {/* Right Column: Step Content */}
                  <View style={styles.stepContent}>
                    <View style={styles.stepHeaderRow}>
                      <Text
                        style={[
                          styles.stepTitle,
                          isCurrent && styles.stepTitleCurrent,
                          isUpcoming && styles.stepTitleUpcoming,
                        ]}
                      >
                        {step.title}
                      </Text>
                      {step.timestamp && (
                        <Text style={styles.stepTime}>{step.timestamp}</Text>
                      )}
                    </View>
                    <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Kitchen / Provider Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Kitchen Partner</Text>
          <View style={styles.personRow}>
            <View style={styles.avatarKitchen}>
              <MaterialCommunityIcons name="chef-hat" size={24} color="#FF5A5F" />
            </View>
            <View style={styles.personInfo}>
              <Text style={styles.personName}>{mockOrder.provider.name}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>{mockOrder.provider.type}</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color="#FFA41C" />
                  <Text style={styles.ratingText}>{mockOrder.provider.rating}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.callButton}
              activeOpacity={0.8}
              onPress={() =>
                handleCall(mockOrder.provider.phone, mockOrder.provider.name)
              }
            >
              <Ionicons name="call" size={18} color="#FF5A5F" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Partner Card */}
        {currentStepIndex >= 3 && (
          <View style={styles.card}>
            <Text style={styles.sectionHeading}>Delivery Executive</Text>
            <View style={styles.personRow}>
              <View style={styles.avatarDelivery}>
                <Ionicons name="bicycle" size={22} color="#00875A" />
              </View>
              <View style={styles.personInfo}>
                <Text style={styles.personName}>
                  {mockOrder.deliveryPartner.name}
                </Text>
                <Text style={styles.vehicleText}>
                  {mockOrder.deliveryPartner.vehicle}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.callButton, { backgroundColor: '#E8F5E9' }]}
                activeOpacity={0.8}
                onPress={() =>
                  handleCall(
                    mockOrder.deliveryPartner.phone,
                    mockOrder.deliveryPartner.name
                  )
                }
              >
                <Ionicons name="call" size={18} color="#00875A" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Delivery Address */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Delivery Address</Text>
          <View style={styles.addressRow}>
            <Ionicons name="location-sharp" size={20} color="#FF5A5F" />
            <Text style={styles.addressText}>{mockOrder.deliveryAddress}</Text>
          </View>
        </View>

        {/* Order Summary & Pricing */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Order Summary</Text>
          {mockOrder.items.map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <View style={styles.vegDotContainer}>
                <View style={styles.vegDotBorder}>
                  <View style={styles.vegDotFill} />
                </View>
              </View>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.itemQty}>x{item.quantity}</Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>Total Paid</Text>
              <Text style={styles.paymentMethodText}>
                via {mockOrder.paymentMethod}
              </Text>
            </View>
            <Text style={styles.totalAmount}>₹{mockOrder.totalAmount}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={styles.exploreMoreBtn}
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.exploreMoreText}>Order Another Meal</Text>
          </TouchableOpacity>
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
  headerTitles: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
  },
  helpButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFF2F2',
  },
  helpText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF5A5F',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statusBanner: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFE0E1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF5A5F',
    marginRight: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF5A5F',
    letterSpacing: 0.5,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 13,
    color: '#636366',
    marginBottom: 12,
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    padding: 10,
    borderRadius: 10,
  },
  etaText: {
    fontSize: 13,
    color: '#1C1C1E',
    marginLeft: 8,
  },
  etaBold: {
    fontWeight: '700',
    color: '#FF5A5F',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 14,
  },
  timelineContainer: {
    paddingLeft: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: 56,
  },
  indicatorCol: {
    alignItems: 'center',
    width: 32,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  stepDotCompleted: {
    backgroundColor: '#00875A',
  },
  stepDotCurrent: {
    backgroundColor: '#FF5A5F',
  },
  stepDotUpcoming: {
    backgroundColor: '#E0E0E0',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 2,
  },
  timelineLineCompleted: {
    backgroundColor: '#00875A',
  },
  timelineLineUpcoming: {
    backgroundColor: '#EAEAEA',
  },
  stepContent: {
    flex: 1,
    marginLeft: 12,
    paddingBottom: 16,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  stepTitleCurrent: {
    color: '#FF5A5F',
    fontWeight: '700',
  },
  stepTitleUpcoming: {
    color: '#8E8E93',
  },
  stepTime: {
    fontSize: 11,
    color: '#8E8E93',
  },
  stepSubtitle: {
    fontSize: 12,
    color: '#636366',
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarKitchen: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarDelivery: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  personInfo: {
    flex: 1,
    marginLeft: 12,
  },
  personName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeBadge: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 6,
  },
  typeBadgeText: {
    fontSize: 11,
    color: '#636366',
    fontWeight: '500',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9E6900',
    marginLeft: 2,
  },
  vehicleText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressText: {
    fontSize: 13,
    color: '#3A3A3C',
    lineHeight: 18,
    marginLeft: 10,
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  vegDotContainer: {
    marginRight: 8,
  },
  vegDotBorder: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderColor: '#00875A',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  vegDotFill: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00875A',
  },
  itemName: {
    flex: 1,
    fontSize: 13,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  itemQty: {
    fontSize: 13,
    color: '#8E8E93',
    marginRight: 16,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  paymentMethodText: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
  },
  totalAmount: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FF5A5F',
  },
  bottomButtons: {
    marginTop: 8,
  },
  exploreMoreBtn: {
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#FF5A5F',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  exploreMoreText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF5A5F',
  },
});
